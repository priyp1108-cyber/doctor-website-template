/**
 * Behaviour for the header's Treatments menu and the phone menu.
 * Plain DOM code, shared by the React site (TreatmentsMenuEnhancer) and the
 * static export (src/static/enhance.ts), so both behave the same.
 *
 * Without JS the menus still work: the desktop panel opens on hover/focus and
 * each treatment's details show on hover/focus (CSS in globals.css), and the
 * phone menu is a native <details>.
 */
export function initTreatmentsMenu(): () => void {
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Document,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) => {
    el.addEventListener(type, fn as EventListener);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener));
  };

  /* ── Desktop mega panel ── */
  const root = document.querySelector<HTMLElement>("[data-tm]");
  const toggle = root?.querySelector<HTMLButtonElement>("[data-tm-toggle]");
  if (root && toggle) {
    const items = [...root.querySelectorAll<HTMLElement>("[data-tm-item]")];
    const triggers = items.map((i) => i.querySelector<HTMLElement>("[data-tm-trigger]")!);
    let openTimer = 0;
    let closeTimer = 0;
    let activeTimer = 0;
    let openedByHover = false;

    const isOpen = () => root.hasAttribute("data-open");
    const setOpen = (open: boolean) => {
      // An explicit open/close wins over any hover timer still pending.
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      root.toggleAttribute("data-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (!open) openedByHover = false;
    };
    const setActive = (item: HTMLElement) => {
      for (const i of items) i.toggleAttribute("data-active", i === item);
    };
    const isMouse = (e: PointerEvent) => e.pointerType === "mouse";

    on(toggle, "click", () => {
      // The first click after a hover-open keeps the panel open instead of closing it.
      if (isOpen() && openedByHover) {
        openedByHover = false;
        return;
      }
      setOpen(!isOpen());
    });
    on(root, "pointerenter", (e) => {
      if (!isMouse(e)) return;
      window.clearTimeout(closeTimer);
      if (isOpen()) return;
      openTimer = window.setTimeout(() => {
        setOpen(true);
        openedByHover = true;
      }, 120);
    });
    on(root, "pointerleave", (e) => {
      if (!isMouse(e)) return;
      window.clearTimeout(openTimer);
      if (isOpen()) closeTimer = window.setTimeout(() => setOpen(false), 260);
    });
    items.forEach((item, n) => {
      on(item, "pointerenter", (e) => {
        if (!isMouse(e)) return;
        window.clearTimeout(activeTimer);
        // A short pause, so sweeping the pointer across the list doesn't flicker the details.
        activeTimer = window.setTimeout(() => setActive(item), 70);
      });
      on(triggers[n]!, "focus", () => setActive(item));
          });
    on(root, "keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      } else if (e.key === "ArrowDown" && e.target === toggle) {
        e.preventDefault();
        setOpen(true);
        triggers[0]?.focus();
      } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && triggers.includes(e.target as HTMLElement)) {
        e.preventDefault();
        const i = triggers.indexOf(e.target as HTMLElement);
        const next = (i + (e.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
        triggers[next]?.focus();
      }
    });
    on(root, "focusout", (e) => {
      if (!root.contains(e.relatedTarget as Node | null)) setOpen(false);
    });
    on(document, "pointerdown", (e) => {
      if (isOpen() && !root.contains(e.target as Node)) setOpen(false);
    });
    cleanups.push(() => {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(activeTimer);
    });
  }

  /* ── Phone menu (<details>) ── */
  const sheet = document.querySelector<HTMLDetailsElement>("[data-mobile-menu]");
  if (sheet) {
    const summary = sheet.querySelector("summary")!;
    const sync = () => {
      summary.setAttribute("aria-expanded", String(sheet.open));
      document.documentElement.classList.toggle("menu-open", sheet.open);
    };
    on(sheet, "toggle", sync);
    on(sheet, "click", (e) => {
      // Following a link inside the sheet closes it.
      if ((e.target as HTMLElement).closest("a")) sheet.open = false;
    });
    on(document, "keydown", (e) => {
      if (e.key === "Escape" && sheet.open) {
        sheet.open = false;
        summary.focus();
      }
    });
    sync();
    cleanups.push(() => document.documentElement.classList.remove("menu-open"));
  }

  return () => cleanups.forEach((c) => c());
}
