import { expect, test } from "@playwright/test";
import { site } from "../../src/content/site";

const number = site.clinic.whatsapp.replace(/\D/g, "");
const textOf = (href: string | null) => new URL(href!).searchParams.get("text");

test("page loads with one H1 and every section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Dermatology for skin, hair, and nails");
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
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", new RegExp(`wa\\.me/${number}`));
    await expect(bar.getByRole("link", { name: /Call/ })).toHaveAttribute("href", /^tel:/);
    await expect(bar.getByRole("link", { name: /Map/ })).toHaveAttribute("href", /maps\.google\.com|google\.com\/maps/);
    // No horizontal scroll at phone width.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
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
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reveals are visible immediately and the marquee is still", async ({ page }) => {
    await page.goto("/");
    await page.locator("#visit").scrollIntoViewIfNeeded();
    const states = await page.locator("[data-reveal]").evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    );
    expect(states.every((o) => o === "1")).toBe(true);
    const anim = await page.locator(".marquee-track").evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("none");
  });
});
