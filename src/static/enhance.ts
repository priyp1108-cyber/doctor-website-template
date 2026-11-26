/**
 * Plain-JS behaviour for the single-file static export (scripts/export-static.mjs).
 * It stands in for the React client components, which the export strips out:
 * decorative loops, the open-now pill, the booking bar,
 * the tap-to-load map, the request form, the header menus and the hero slider. It reuses the same content and
 * helpers as the real site so the two never drift apart.
 */
import { site } from "@/content/site";
import { getOpenStatus } from "@/lib/hours";
import { buildWaLink, concernSubject, messages } from "@/lib/whatsapp";
import { normaliseIndianMobile } from "@/lib/phone";
import { mapsEmbedUrl } from "@/lib/links";
import { initTreatmentsMenu } from "@/lib/treatmentsMenu";
import { initHeroSlider } from "@/lib/heroSlider";

declare global {
  interface Window {
    __STATIC_IMAGES?: Record<string, string>;
  }
}

/* Decorative loops (mirrors RevealObserver). */
function loops() {
  const root = document.documentElement;
  const start = () => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    ric(() => root.classList.add("loops"), { timeout: 3000 });
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

/* Open-now pill (mirrors OpenStatus). */
function openStatus() {
  const slot = document.querySelector<HTMLElement>("#hero-title")?.previousElementSibling as HTMLElement | null;
  if (!slot) return;
  const render = () => {
    const s = getOpenStatus(site.clinic.hours, new Date());
    const dot =
      s.state === "open"
        ? '<span class="pulse-dot" aria-hidden="true"></span>'
        : '<span class="inline-block size-[9px] rounded-full border-[1.5px] border-muted" aria-hidden="true"></span>';
    slot.innerHTML = `<p class="hero-fade-in inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-[15px] font-semibold text-ink shadow-card">${dot}${s.label}</p>`;
  };
  render();
  window.setInterval(render, 60_000);
}

/* Booking bar hides while the form's own WhatsApp button is on screen. */
function bookingBar() {
  const bar = document.querySelector<HTMLElement>("[data-booking-bar]");
  const target = document.getElementById("visit-whatsapp");
  if (!bar || !target) return;
  const parts = [...bar.children] as HTMLElement[];
  new IntersectionObserver(([entry]) => {
    const hidden = !!entry?.isIntersecting;
    bar.inert = hidden;
    for (const el of parts) {
      el.classList.toggle("pointer-events-none", hidden);
      el.classList.toggle("opacity-0", hidden);
      el.classList.toggle("translate-y-4", hidden);
      el.classList.toggle("opacity-100", !hidden);
      el.classList.toggle("translate-y-0", !hidden);
    }
  }).observe(target);
}

/* Tap-to-load map (mirrors MapEmbed). */
function mapEmbed() {
  const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Load the interactive map"]');
  btn?.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.title = `Map to ${site.doctor.name}'s clinic`;
    frame.src = mapsEmbedUrl();
    frame.className = "absolute inset-0 size-full border-0";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    btn.replaceWith(frame);
  });
}

/* Request form (mirrors RequestForm). */
function requestForm() {
  const form = document.getElementById("visit-whatsapp")?.closest("form");
  if (!form) return;
  const field = (name: string) => form.querySelector<HTMLInputElement>(`[name=${name}]`)!;

  const setError = (input: HTMLInputElement, message: string | null) => {
    const id = `${input.id}-error`;
    document.getElementById(id)?.remove();
    input.setAttribute("aria-invalid", String(!!message));
    input.classList.toggle("border-ink", !!message);
    input.classList.toggle("border-ink/15", !message);
    if (!message) return input.removeAttribute("aria-describedby");
    const p = document.createElement("p");
    p.id = id;
    p.className = "mt-2 text-[15px] font-semibold text-ink";
    p.textContent = `⚠ ${message}`;
    input.after(p);
    input.setAttribute("aria-describedby", id);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = field("name");
    const phoneEl = field("phone");
    const name = nameEl.value.trim();
    const phone = normaliseIndianMobile(phoneEl.value);
    setError(nameEl, name ? null : "Please enter your name.");
    setError(phoneEl, phone ? null : "Please enter a 10-digit mobile number, e.g. 98765 43210.");
    if (!name) return nameEl.focus();
    if (!phone) return phoneEl.focus();
    const slug = form.querySelector<HTMLSelectElement>("[name=concern]")!.value;
    const concern = site.concerns.find((c) => c.slug === slug) ?? site.concerns[site.concerns.length - 1]!;
    window.open(buildWaLink(messages.request(name, phone, concernSubject(concern))), "_blank", "noopener");
  });
}

loops();
openStatus();
bookingBar();
mapEmbed();
requestForm();
initTreatmentsMenu();
initHeroSlider();
