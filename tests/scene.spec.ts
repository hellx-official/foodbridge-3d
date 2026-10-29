import { expect, type Page, test } from "@playwright/test";

type SceneStats = {
  pointCounts: number[];
  cameraPositions: [number, number, number][];
  hasDepthOfField: boolean;
  drawCalls: number;
};

declare global {
  interface Window {
    __sceneStats: SceneStats;
  }
}

async function observeScene(page: Page) {
  await page.addInitScript(() => {
    window.__sceneStats = {
      pointCounts: [],
      cameraPositions: [],
      hasDepthOfField: false,
      drawCalls: 0,
    };
    const viewMatrices = new WeakSet<WebGLUniformLocation>();
    for (const context of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const prototype = context.prototype;
      const drawArrays = prototype.drawArrays;
      const drawElements = prototype.drawElements;
      const getUniformLocation = prototype.getUniformLocation;
      const uniformMatrix4fv = prototype.uniformMatrix4fv;
      const shaderSource = prototype.shaderSource;
      prototype.drawArrays = function (mode, first, count) {
        if (
          mode === this.POINTS &&
          !window.__sceneStats.pointCounts.includes(count)
        )
          window.__sceneStats.pointCounts.push(count);
        return drawArrays.call(this, mode, first, count);
      };
      prototype.drawElements = function (
        this: WebGLRenderingContext | WebGL2RenderingContext,
        mode: number,
        count: number,
        type: number,
        offset: number,
      ) {
        window.__sceneStats.drawCalls += 1;
        return Reflect.apply(drawElements, this, [mode, count, type, offset]);
      } as typeof prototype.drawElements;
      prototype.getUniformLocation = function (program, name) {
        const location = getUniformLocation.call(this, program, name);
        if (location && name === "viewMatrix") viewMatrices.add(location);
        return location;
      };
      prototype.uniformMatrix4fv = function (
        this: WebGLRenderingContext | WebGL2RenderingContext,
        location: WebGLUniformLocation | null,
        transpose: boolean,
        value: Float32Array | number[],
        ...rest: unknown[]
      ) {
        if (location && viewMatrices.has(location)) {
          // Recover world-space camera position from the column-major view matrix.
          const m = value as Float32Array;
          const x = -(m[0] * m[12] + m[1] * m[13] + m[2] * m[14]);
          const y = -(m[4] * m[12] + m[5] * m[13] + m[6] * m[14]);
          const z = -(m[8] * m[12] + m[9] * m[13] + m[10] * m[14]);
          window.__sceneStats.cameraPositions.push([x, y, z]);
          if (window.__sceneStats.cameraPositions.length > 200)
            window.__sceneStats.cameraPositions.shift();
        }
        return Reflect.apply(uniformMatrix4fv, this, [
          location,
          transpose,
          value,
          ...rest,
        ]);
      } as typeof prototype.uniformMatrix4fv;
      prototype.shaderSource = function (shader, source) {
        if (source.includes("cocBuffer") && source.includes("kernel64"))
          window.__sceneStats.hasDepthOfField = true;
        return shaderSource.call(this, shader, source);
      };
    }
  });
}

async function waitForParticles(page: Page, green: number, coral: number) {
  await page.waitForFunction(
    ({ green, coral }) =>
      window.__sceneStats.pointCounts.includes(green) &&
      window.__sceneStats.pointCounts.includes(coral),
    { green, coral },
    { timeout: 45_000 },
  );
  await expect(
    page.getByRole("status", { name: "Loading the FoodBridge experience" }),
  ).toHaveCount(0);
}

test.describe("active motion", () => {
  test.use({ reducedMotion: "no-preference" });
  test("desktop renders real WebGL, responds to pointer/scroll, and adapts to mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 650 });
    const errors: string[] = [];
    let environmentLoaded = false;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.url().endsWith("/environment/potsdamer_platz_512.hdr"))
        environmentLoaded = response.ok();
    });
    await observeScene(page);
    await page.goto("/");
    await waitForParticles(page, 2000, 500);
    await expect.poll(() => environmentLoaded).toBe(true);
    expect(
      await page.evaluate(() => window.__sceneStats.drawCalls),
    ).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.__sceneStats.hasDepthOfField)).toBe(
      false,
    );
    expect(
      await page.evaluate(
        () => document.querySelector(".css-globe")?.checkVisibility() ?? false,
      ),
    ).toBe(false);
    await page.mouse.move(850, 60);
    await page.waitForFunction(
      () =>
        window.__sceneStats.cameraPositions.some(
          ([x, y, z]) => x > 0.1 && y > 0.05 && Math.abs(z - 8) < 0.15,
        ),
      null,
      { timeout: 30_000 },
    );
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    );
    await page.waitForFunction(
      () => window.__sceneStats.cameraPositions.some(([, , z]) => z > 11.3),
      null,
      { timeout: 30_000 },
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForParticles(page, 640, 160);
    expect(errors).toEqual([]);
  });
});

test.describe("retina", () => {
  test.use({ deviceScaleFactor: 2 });
  test("desktop canvas uses DPR up to 2", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await observeScene(page);
    await page.goto("/");
    await waitForParticles(page, 2000, 500);
    const ratio = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      return canvas ? canvas.width / canvas.getBoundingClientRect().width : 0;
    });
    expect(ratio).toBeCloseTo(2, 1);
  });
});

test("reduced motion disables camera parallax and scroll travel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 650 });
  await observeScene(page);
  await page.goto("/");
  await waitForParticles(page, 2000, 500);
  await page.mouse.move(850, 60);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page.waitForTimeout(1200);
  const camera = await page.evaluate(() =>
    window.__sceneStats.cameraPositions.at(-1),
  );
  expect(camera?.[0]).toBeCloseTo(0, 3);
  expect(camera?.[1]).toBeCloseTo(0, 3);
  expect(camera?.[2]).toBeCloseTo(8, 3);
});

test.describe("mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  test("caps DPR at 1 and renders 800 total particles without depth-of-field", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await observeScene(page);
    await page.goto("/");
    await waitForParticles(page, 640, 160);
    const ratio = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      return canvas ? canvas.width / canvas.getBoundingClientRect().width : 0;
    });
    expect(ratio).toBeCloseTo(1, 1);
    expect(await page.evaluate(() => window.__sceneStats.hasDepthOfField)).toBe(
      false,
    );
    expect(errors).toEqual([]);
  });
});

test("keeps the DOM usable when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".css-globe")).toBeVisible();
  await expect(
    page.getByRole("status", { name: "Loading the FoodBridge experience" }),
  ).toHaveCount(0);
  await expect(page.locator("#live-rescues article")).toHaveCount(6);
});
