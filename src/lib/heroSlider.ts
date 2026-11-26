/**
 * Hero photo slider. Plain DOM code shared by the React site
 * (HeroSliderEnhancer) and the static export (src/static/enhance.ts).
 *
 * Markup contract (src/components/Hero.tsx):
 *   [data-hero-slider]            the carousel region
 *     [data-hero-slide]           one per photo; the active one has [data-active]
 *     [data-hero-dot]             one button per photo
 *     [data-hero-toggle]          pause / play button
 *     [data-hero-label]           live text of the current photo's label
 *
 * Rules (WAI carousel guidance): rotates every 6 s; stops while hovered or
 * focused and while the tab is hidden; never auto-rotates for reduced motion;
 * the pause button and dots always work.
 */
const INTERVAL = 6000;

export function initHeroSlider(): () => void {
  const root = document.querySelector<HTMLElement>("[data-hero-slider]");
  if (!root) return () => {};
  const slides = [...root.querySelectorAll<HTMLElement>("[data-hero-slide]")];
  const dots = [...root.querySelectorAll<HTMLButtonElement>("[data-hero-dot]")];
  const toggle = root.querySelector<HTMLButtonElement>("[data-hero-toggle]");
  const label = root.querySelector<HTMLElement>("[data-hero-label]");
  if (slides.length < 2) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let paused = reduce; // user-controlled
  let held = false; // hover or focus inside
  let timer = 0;

  const show = (n: number) => {
    index = (n + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === index;
      s.toggleAttribute("data-active", on);
      s.setAttribute("aria-hidden", String(!on));
    });
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
    if (label) label.textContent = slides[index]?.dataset.label ?? "";
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (paused || held || document.hidden) return;
    timer = window.setTimeout(() => {
      show(index + 1);
      schedule();
    }, INTERVAL);
  };

  const syncToggle = () => {
    if (!toggle) return;
    toggle.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    toggle.toggleAttribute("data-paused", paused);
  };

  const cleanups: (() => void)[] = [];
  const on = <E extends Event>(el: EventTarget, type: string, fn: (e: E) => void) => {
    el.addEventListener(type, fn as EventListener);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener));
  };

  dots.forEach((d, i) =>
    on(d, "click", () => {
      show(i);
      schedule();
    }),
  );
  if (toggle) {
    on(toggle, "click", () => {
      paused = !paused;
      syncToggle();
      schedule();
    });
  }
  on(root, "pointerenter", () => {
    held = true;
    schedule();
  });
  on(root, "pointerleave", () => {
    held = false;
    schedule();
  });
  on(root, "focusin", () => {
    held = true;
    schedule();
  });
  on<FocusEvent>(root, "focusout", (e) => {
    if (!root.contains(e.relatedTarget as Node | null)) {
      held = false;
      schedule();
    }
  });
  on(document, "visibilitychange", schedule);

  show(0);
  syncToggle();
  schedule();

  return () => {
    window.clearTimeout(timer);
    cleanups.forEach((c) => c());
  };
}
