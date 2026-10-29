import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("status", { name: "Loading the FoodBridge experience" }),
  ).toHaveCount(0);
});

test("renders the complete FoodBridge page and metadata", async ({
  page,
  request,
}) => {
  await expect(page).toHaveTitle(
    "FoodBridge — Rescue Food. Feed People. Zero Waste.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Rescue Food.",
  );
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  for (const id of [
    "home",
    "how-it-works",
    "live-rescues",
    "impact",
    "stories",
    "contact",
  ]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("footer")).toContainText("© 2026 FoodBridge");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /12,400\+ meals rescued/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /og-image\.png/,
  );
  expect((await request.get("/og-image.png")).ok()).toBe(true);
  expect((await request.get("/icon.svg")).ok()).toBe(true);
  await expect(page.locator("canvas")).toHaveAttribute("aria-hidden", "true");
});

test("filters rescues and keeps a demo claim across filters", async ({
  page,
}) => {
  const cards = page.locator("#live-rescues article");
  await expect(cards).toHaveCount(6);
  await page.getByRole("button", { name: /^Bakery/ }).click();
  await expect(cards).toHaveCount(2);
  await cards.first().getByRole("button", { name: "Claim This" }).click();
  const dialog = page.getByRole("dialog", { name: "Claim this rescue" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Sunrise Bakery");
  await dialog.getByRole("button", { name: "Confirm demo claim" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("status")).toContainText("Demo claim saved");
  await expect(cards.first().getByRole("button")).toBeDisabled();
  await page.getByRole("button", { name: /^All rescues/ }).click();
  await expect(cards).toHaveCount(6);
  await expect(
    page
      .locator("#live-rescues article")
      .filter({ hasText: "Sunrise Bakery" })
      .getByRole("button"),
  ).toContainText("Claimed in this demo");
  await page.getByRole("button", { name: /^Produce/ }).click();
  await expect(cards).toHaveCount(2);
});

test("validates the contact form and shows an honest demo toast", async ({
  page,
}) => {
  await page.getByRole("link", { name: /I’m a Restaurant/ }).click();
  await expect(page.getByLabel("I am a…")).toHaveValue("restaurant");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Name", { exact: true }).fill("Test Kitchen");
  await page.getByLabel("Email", { exact: true }).fill("kitchen@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("We would like to share surplus meals with our neighborhood.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(
    "didn’t send or store your message",
  );
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("I am a…")).toHaveValue("");
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 5000 });
});

test("mobile navigation, anchor scrolling, and back-to-top work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const menu = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: /Live rescues/ }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#live-rescues$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(500);
  const top = page.getByRole("button", { name: "Back to top" });
  await expect(top).toBeVisible();
  await top.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test("has no horizontal overflow at common viewport widths", async ({
  page,
}) => {
  for (const width of [375, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      )
      .toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("footer information dialogs are keyboard dismissible", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Privacy in this demo" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("not transmitted or saved");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("passes automated WCAG A/AA checks on desktop and mobile", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `Accessibility violations at ${width}px`,
    ).toEqual([]);
  }
});
