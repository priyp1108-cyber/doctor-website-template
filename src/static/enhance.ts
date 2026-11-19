/**
 * Plain-JS behaviour for the single-file static export (scripts/export-static.mjs).
 * It stands in for the React client components, which the export strips out:
 * reveals and loops, the open-now pill, the concern switcher, the booking bar,
 * the tap-to-load map and the request form. It reuses the same content and
 * helpers as the real site so the two never drift apart.
 */
import { site } from "@/content/site";
import { getOpenStatus } from "@/lib/hours";
import { buildWaLink, concernSubject, messages } from "@/lib/whatsapp";
import { normaliseIndianMobile } from "@/lib/phone";
import { mapsEmbedUrl } from "@/lib/links";

declare global {
  interface Window {
    __revealReady?: boolean;
    __STATIC_IMAGES?: Record<string, string>;
  }
}

const images = window.__STATIC_IMAGES ?? {};
const img = (path: string) => images[path] ?? path;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Reveals + decorative loops (mirrors RevealObserver). */
function reveals() {
  window.__revealReady = true;
  const root = document.documentElement;
  root.classList.remove("reveal-fallback");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
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

/* Concern switcher (mirrors Concerns). */
const ON = ["border-brand", "bg-brand", "text-paper"];
const OFF = ["border-ink/15", "bg-white", "text-ink", "hover:border-ink/35"];

function concerns() {
  const group = document.querySelector('[aria-label="Choose a concern"]');
  const panel = document.querySelector<HTMLElement>("#concern-panel article");
  if (!group || !panel) return;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>("button")];
  const media = panel.firstElementChild as HTMLElement;
  // The first concern may have no photo, so the <img> is created on demand.
  let picture = media.querySelector("img");
  const TWO_COL = "md:grid-cols-[0.95fr_1.05fr]";
  const title = panel.querySelector("h3")!;
  const [blurb, approachP] = panel.querySelectorAll("p");
  const link = panel.querySelector<HTMLAnchorElement>("a")!;
  panel.style.transition = "opacity 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";

  let active = 0;
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (i === active) return;
      active = i;
      buttons.forEach((b, j) => {
        b.setAttribute("aria-pressed", String(j === i));
        b.classList.remove(...(j === i ? OFF : ON));
        b.classList.add(...(j === i ? ON : OFF));
      });
      const c = site.concerns[i]!;
      const swap = () => {
        media.style.backgroundColor = `var(--color-tint-${c.tint})`;
        media.hidden = !c.image;
        panel.classList.toggle(TWO_COL, !!c.image);
        if (c.image) {
          if (!picture) {
            picture = document.createElement("img");
            picture.className = "object-cover";
            picture.style.cssText = "position:absolute;height:100%;width:100%;inset:0";
            media.append(picture);
          }
          picture.src = img(c.image);
          picture.alt = c.imageAlt ?? "";
        }
        title.textContent = c.title;
        if (blurb) blurb.textContent = c.blurb;
        if (approachP) {
          const label = approachP.querySelector("span");
          approachP.textContent = c.approach;
          if (label) approachP.prepend(label);
        }
        link.href = buildWaLink(messages.concern(c));
        link.dataset.source = `concern:${c.slug}`;
        const icon = link.querySelector("svg");
        link.textContent = ` ${c.button}`;
        if (icon) link.prepend(icon);
        panel.style.opacity = "1";
      };
      if (reduceMotion) return swap();
      panel.style.opacity = "0";
      window.setTimeout(swap, 200);
    });
  });
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

reveals();
openStatus();
concerns();
bookingBar();
mapEmbed();
requestForm();
