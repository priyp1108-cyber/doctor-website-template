import { expect, test } from "@playwright/test";
import { site } from "../../src/content/site";

const number = site.clinic.whatsapp.replace(/\D/g, "");
const textOf = (href: string | null) => new URL(href!).searchParams.get("text");

test("page loads with one H1 and every section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(site.hero.headline);
  for (const heading of ["What’s bothering you?", "Your visit, in three steps.", "Good to know", "Come and see us."]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeAttached();
  }
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});

test("switching concern changes the panel and its WhatsApp text", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#concern-panel");
  await expect(panel.getByRole("heading", { level: 3 })).toHaveText("Acne & acne scars");

  const pill = page.getByRole("button", { name: "Hair fall", exact: true });
  await pill.click();
  await expect(pill).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByRole("heading", { level: 3 })).toHaveText("Hair fall & scalp");

  const cta = panel.getByRole("link", { name: /Book for hair fall/ });
  const href = await cta.getAttribute("href");
  expect(href).toContain(`https://wa.me/${number}?text=`);
  expect(textOf(href)).toBe("Hello, I would like to see Dr. Panda about hair fall.");

  await page.getByRole("button", { name: "Something else", exact: true }).click();
  const other = await panel.getByRole("link", { name: /Ask the clinic/ }).getAttribute("href");
  expect(textOf(other)).toBe("Hello, I would like to see Dr. Panda about a skin concern.");
});

test("every WhatsApp link uses the clinic number", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThanOrEqual(4);
  for (const h of hrefs) {
    expect(h).toMatch(new RegExp(`^https://wa\\.me/${number}\\?text=`));
    expect(textOf(h)).toMatch(/^Hello, /);
  }
});

test("request form validates and opens WhatsApp with the right message", async ({ page, context }) => {
  await page.goto("/");
  const form = page.locator("#visit form");
  await form.getByRole("button", { name: "Send on WhatsApp" }).click();
  await expect(form.getByText("Please enter your name.")).toBeVisible();
  await expect(form.getByLabel("Your name")).toHaveAttribute("aria-describedby", /name-error/);

  await form.getByLabel("Your name").fill("Asha");
  await form.getByLabel("Phone number").fill("+91 98765 43210");
  await form.getByLabel("What is it about?").selectOption("pigmentation");

  await context.route("https://wa.me/**", (route) => route.fulfill({ body: "ok" }));
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    form.getByRole("button", { name: "Send on WhatsApp" }).click(),
  ]);
  expect(popup.url()).toContain(`https://wa.me/${number}?text=`);
  expect(textOf(popup.url())).toBe(
    "Hello, I am Asha (+919876543210). I would like an appointment with Dr. Panda about pigmentation.",
  );
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("bottom booking bar shows at 390px with WhatsApp, Call and Map", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("[data-mobile-bar]");
    // Hidden while the hero's own WhatsApp button is on screen; shows once it scrolls away.
    await expect(bar).toHaveCSS("opacity", "0");
    await page.locator("#concerns").scrollIntoViewIfNeeded();
    await expect(bar).toHaveCSS("opacity", "1");
    await expect(bar.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", new RegExp(`wa\\.me/${number}`));
    await expect(bar.getByRole("link", { name: /Call/ })).toHaveAttribute("href", /^tel:/);
    await expect(bar.getByRole("link", { name: /Map/ })).toHaveAttribute("href", /maps\.google\.com|google\.com\/maps/);
    // No horizontal scroll at phone width.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("menu button opens the treatments list, and a link closes it", async ({ page }) => {
    await page.goto("/");
    const menu = page.locator("[data-mobile-menu]");
    await menu.getByLabel("Menu").click();
    await expect(menu.getByText("Fungal infections")).toBeVisible();
    await menu.getByText("Fungal infections").click();
    await expect(menu.getByText("A clear diagnosis and a full course of treatment")).toBeVisible();
    await menu.getByRole("link", { name: "The doctor" }).click();
    await expect(menu).not.toHaveAttribute("open", "");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content is readable and links work", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Good to know" })).toBeVisible();
    const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
    await expect(page.getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", new RegExp(`wa\.me/${number}`));
    await expect(page.getByRole("link", { name: "Book a visit" })).toBeVisible();
  });

  test("the Treatments panel still opens on hover", async ({ page }) => {
    await page.goto("/");
    const panel = page.locator("#tm-panel");
    await expect(panel).toBeHidden();
    await page.getByRole("button", { name: "Treatments" }).hover();
    await expect(panel).toBeVisible();
    await panel.getByRole("link", { name: "Chemical peels", exact: true }).hover();
    await expect(panel.getByText("A controlled peel applied in the clinic")).toBeVisible();
  });
});

test.describe("hero slider", () => {
  test("shows one photo at a time, with working dots and pause", async ({ page }) => {
    await page.goto("/");
    const slides = page.locator("[data-hero-slide]");
    await expect(slides).toHaveCount(site.hero.slides.length);
    await expect(page.locator("[data-hero-slide][data-active]")).toHaveCount(1);
    // The portrait is no longer in the hero.
    await expect(page.locator(`#top img[src*="portrait"]`)).toHaveCount(0);

    await page.getByRole("button", { name: `Show photo 3: ${site.hero.slides[2]!.label}` }).click();
    await expect(slides.nth(2)).toHaveAttribute("data-active", "");
    await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "true");

    const toggle = page.locator("[data-hero-toggle]");
    await expect(toggle).toHaveAttribute("aria-label", "Pause slideshow");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-label", "Play slideshow");
  });
});

test.describe("treatments menu", () => {
  test("opens on click, shows each treatment's details, closes on Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Treatments" });
    const panel = page.locator("#tm-panel");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    // Every treatment in site.ts is listed.
    const names = site.treatments.flatMap((g) => g.treatments.map((t) => t.name));
    await expect(panel.locator("[data-tm-trigger]")).toHaveCount(names.length);

    // Focusing a treatment swaps the details card and its WhatsApp message.
    const trigger = panel.locator("[data-tm-trigger]", { hasText: "Laser hair reduction" });
    await expect(trigger).toHaveAttribute("href", "/treatments/laser-hair-reduction");
    await trigger.focus();
    const card = panel.locator("[data-tm-item][data-active] .tm-detail");
    await expect(card).toContainText("Laser sessions that reduce unwanted hair growth");
    const href = await card.getByRole("link", { name: "Ask about this" }).getAttribute("href");
    expect(textOf(href!)).toBe("Hello, I would like to see Dr. Panda about laser hair reduction.");

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reveals are visible immediately and the hero slider does not rotate", async ({ page }) => {
    await page.goto("/");
    await page.locator("#visit").scrollIntoViewIfNeeded();
    const states = await page.locator("[data-reveal]").evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    );
    expect(states.every((o) => o === "1")).toBe(true);
    const toggle = page.locator("[data-hero-toggle]");
    await expect(toggle).toHaveAttribute("aria-label", "Play slideshow");
    await expect(page.locator("[data-hero-slide]").first()).toHaveAttribute("data-active", "");
  });
});

test.describe("inner pages", () => {
  test("every treatment has its own page, linked from the menu and the overview", async ({ page }) => {
    const all = site.treatments.flatMap((g) => g.treatments.map((t) => ({ group: g.label, ...t })));
    for (const t of all) {
      const res = await page.goto(`/treatments/${t.slug}`);
      expect(res?.status(), t.slug).toBe(200);
      await expect(page.locator("h1")).toHaveText(t.name);
      await expect(page.locator("h1")).toHaveCount(1);
      const wa = await page.getByRole("link", { name: "Ask about this on WhatsApp" }).first().getAttribute("href");
      expect(wa).toContain(`https://wa.me/${number}?text=`);
    }
    await page.goto("/");
    await page.locator("#treatments").getByRole("link", { name: "PRP for hair" }).click();
    await expect(page).toHaveURL(/\/treatments\/prp$/);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Treatments");
  });

  test("journal filter has its own URL per audience, and articles open", async ({ page }) => {
    await page.goto("/journal");
    await expect(page.locator("h1")).toHaveCount(1);
    const all = await page.locator("section[aria-label='Articles'] a").count();
    await page.getByRole("navigation", { name: "Filter articles" }).getByRole("link", { name: "For clinicians" }).click();
    await expect(page).toHaveURL(/\/journal\/for\/clinicians$/);
    await expect(page.getByRole("link", { name: "For clinicians", exact: true })).toHaveAttribute("aria-current", "page");
    const clinicians = await page.locator("section[aria-label='Articles'] a").count();
    expect(clinicians).toBeGreaterThan(0);
    expect(clinicians).toBeLessThan(all);
    await page.locator("section[aria-label='Articles'] a").first().click();
    await expect(page.locator("article")).toBeVisible();
    await expect(page.getByText("By Dr. Anil Kumar Panda")).toBeVisible();
  });

  test("RSS feed lists the articles", async ({ request }) => {
    const res = await request.get("/journal/rss.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("rss+xml");
    const xml = await res.text();
    expect(xml).toContain("<rss version=\"2.0\"");
    expect((xml.match(/<item>/g) ?? []).length).toBeGreaterThan(0);
  });

  test("home page shows the From the Journal strip", async ({ page }) => {
    await page.goto("/");
    const strip = page.locator("#journal");
    await expect(strip.getByRole("heading", { level: 2 })).toBeAttached();
    expect(await strip.locator("a[href^='/journal/']").count()).toBeGreaterThan(0);
  });

  test("For doctors has profile, publications, talks, CV and peer contact", async ({ page }) => {
    await page.goto("/for-doctors");
    await expect(page.locator("h1")).toHaveText(site.doctor.name);
    for (const h of ["Profile", "Publications", "Talks and conferences", "CV"]) {
      await expect(page.getByRole("heading", { level: 2, name: h, exact: true })).toBeAttached();
    }
    const contact = page.locator("#contact");
    for (const c of site.forDoctors.contacts) {
      const href = await contact.getByRole("link", { name: c.button }).getAttribute("href");
      expect(textOf(href)).toBe(c.message);
    }
  });

  test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test("inner pages have no horizontal scroll and show the booking bar", async ({ page }) => {
      for (const path of ["/treatments/acne", "/journal", "/for-doctors"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, path).toBeLessThanOrEqual(0);
        await expect(page.locator("[data-mobile-bar]")).toHaveCSS("opacity", "1");
      }
    });
  });
});
