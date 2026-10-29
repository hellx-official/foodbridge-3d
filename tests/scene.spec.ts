import { expect, type Page, test } from "@playwright/test";

type SceneStats = {
  pointCounts: number[];
  shells: Record<number, { min: number; max: number }>;
  cameraPositions: [number, number, number][];
  hasDepthOfField: boolean;
};

declare global {
  interface Window {
    __sceneStats: SceneStats;
  }
}

// Observe the actual WebGL calls without exposing test-only hooks in the scene.
async function observeScene(page: Page) {
  await page.addInitScript(() => {
    window.__sceneStats = {
      pointCounts: [],
      shells: {},
      cameraPositions: [],
      hasDepthOfField: false,
    };
    const cameraUniforms = new WeakSet<WebGLUniformLocation>();
    for (const context of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const prototype = context.prototype;
      const drawArrays = prototype.drawArrays;
      const bufferData = prototype.bufferData;
      const getUniformLocation = prototype.getUniformLocation;
      const uniform3f = prototype.uniform3f;
      const shaderSource = prototype.shaderSource;

      prototype.drawArrays = function (mode, first, count) {
        if (
          mode === this.POINTS &&
          !window.__sceneStats.pointCounts.includes(count)
        ) {
          window.__sceneStats.pointCounts.push(count);
        }
        return drawArrays.call(this, mode, first, count);
      };
      prototype.bufferData = function (
        this: WebGLRenderingContext,
        ...args: unknown[]
      ) {
        const data = args[1];
        if (
          data instanceof Float32Array &&
          [1500, 2400, 6000].includes(data.length)
        ) {
          let min = Infinity;
          let max = 0;
          for (let i = 0; i < data.length; i += 3) {
            const radius = Math.hypot(data[i], data[i + 1], data[i + 2]);
            min = Math.min(min, radius);
            max = Math.max(max, radius);
          }
          if (min >= 7.99 && max <= 12.01) {
            window.__sceneStats.shells[data.length / 3] = { min, max };
          }
        }
        return Reflect.apply(bufferData, this, args);
      } as typeof prototype.bufferData;
      prototype.getUniformLocation = function (program, name) {
        const location = getUniformLocation.call(this, program, name);
        if (location && name === "cameraPosition") cameraUniforms.add(location);
        return location;
      };
      prototype.uniform3f = function (location, x, y, z) {
        if (location && cameraUniforms.has(location)) {
          window.__sceneStats.cameraPositions.push([x, y, z]);
          if (window.__sceneStats.cameraPositions.length > 100) {
            window.__sceneStats.cameraPositions.shift();
          }
        }
        return uniform3f.call(this, location, x, y, z);
      };
      prototype.shaderSource = function (shader, source) {
        if (source.includes("cocBuffer") && source.includes("kernel64")) {
          window.__sceneStats.hasDepthOfField = true;
        }
        return shaderSource.call(this, shader, source);
      };
    }
  });
}

async function waitForParticles(page: Page, mainCount: number) {
  await page.waitForFunction(
    (count) => {
      const stats = window.__sceneStats;
      return (
        stats.pointCounts.includes(count) &&
        stats.pointCounts.includes(500) &&
        !!stats.shells[count] &&
        !!stats.shells[500]
      );
    },
    mainCount,
    { timeout: 45_000 },
  );
}

async function expectOriginalContent(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Welcome To The New World" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "AI agents that actually bring value to businesses and elevate workers productivity.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Get started." }),
  ).toBeVisible();
  await expect(page.locator(".hero_main .planet-3D canvas")).toBeVisible();
}

test.describe("desktop scene", () => {
  test.use({ viewport: { width: 900, height: 560 }, deviceScaleFactor: 1 });

  test("preserves content and camera choreography while rendering the cinematic effects", async ({
    page,
  }) => {
    const errors: string[] = [];
    let environmentLoaded = false;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.url().endsWith("/environment/potsdamer_platz_1k.hdr")) {
        environmentLoaded = response.ok();
      }
    });
    await observeScene(page);
    await page.goto("/");
    await expectOriginalContent(page);
    await waitForParticles(page, 2000);
    await page.waitForFunction(
      () => window.__sceneStats.hasDepthOfField,
      null,
      { timeout: 45_000 },
    );

    await expect.poll(() => environmentLoaded, { timeout: 30_000 }).toBe(true);
    const dimensions = await page.evaluate(() => {
      const hero = document.querySelector(".hero_main") as HTMLElement;
      const overlay = getComputedStyle(document.body, "::after");
      return {
        heroHeight: hero.getBoundingClientRect().height,
        scrollHeight: document.body.scrollHeight,
        overlayPosition: overlay.position,
        overlayPointerEvents: overlay.pointerEvents,
        overlayOpacity: overlay.opacity,
      };
    });
    expect(dimensions.scrollHeight).toBeCloseTo(dimensions.heroHeight * 2, 0);
    expect(dimensions.overlayPosition).toBe("fixed");
    expect(dimensions.overlayPointerEvents).toBe("none");
    expect(Number(dimensions.overlayOpacity)).toBeCloseTo(0.03);

    // The original text sits behind the transparent canvas. An opaque
    // post-processing pass would otherwise hide it even though it is "visible" in the DOM.
    const heading = await page.getByRole("heading").boundingBox();
    expect(heading).not.toBeNull();
    const screenshot = (await page.screenshot()).toString("base64");
    const pixels = await page.evaluate(
      async ({ screenshot, heading }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${screenshot}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context || !heading)
          throw new Error("Could not inspect the screenshot");
        context.drawImage(image, 0, 0);
        const corner = context.getImageData(5, 5, 1, 1).data;
        const text = context.getImageData(
          Math.max(0, Math.floor(heading.x)),
          Math.max(0, Math.floor(heading.y)),
          Math.ceil(heading.width),
          Math.ceil(heading.height),
        ).data;
        let darkTextPixels = 0;
        for (let i = 0; i < text.length; i += 4) {
          if (text[i] < 60 && text[i + 1] < 60 && text[i + 2] < 60)
            darkTextPixels++;
        }
        return { corner: Array.from(corner), darkTextPixels };
      },
      { screenshot, heading },
    );
    expect(pixels.corner[0]).toBeGreaterThan(180);
    expect(pixels.darkTextPixels).toBeGreaterThan(100);

    await page.mouse.move(850, 60);
    await page.waitForFunction(
      () =>
        window.__sceneStats.cameraPositions.some(
          ([x, y, z]) => z === 4.5 && x > 0.01 && y > 2.155,
        ),
      null,
      { timeout: 30_000 },
    );
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      () =>
        window.__sceneStats.cameraPositions.some(
          ([, , z]) => Math.abs(z - 19) < 0.02,
        ),
      null,
      { timeout: 30_000 },
    );
    await expect(page.locator(".content")).toHaveCSS("opacity", "0", {
      timeout: 30_000,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await waitForParticles(page, 800);
    expect(errors).toEqual([]);
  });

  test("disables pointer parallax when reduced motion is preferred", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await observeScene(page);
    await page.goto("/");
    await waitForParticles(page, 2000);
    await page.waitForFunction(
      () => window.__sceneStats.cameraPositions.length > 0,
    );
    await page.mouse.move(850, 60);
    await page.waitForTimeout(2_000);
    const camera = await page.evaluate(() =>
      window.__sceneStats.cameraPositions.at(-1),
    );
    expect(camera).toBeDefined();
    expect(camera?.[0]).toBeCloseTo(0, 3);
    expect(camera?.[1]).toBeCloseTo(2.15, 3);
    expect(camera?.[2]).toBeCloseTo(4.5, 3);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      () =>
        window.__sceneStats.cameraPositions.some(
          ([x, y, z]) =>
            Math.abs(x) < 0.01 &&
            Math.abs(y - 0.1) < 0.01 &&
            Math.abs(z - 19) < 0.02,
        ),
      null,
      { timeout: 30_000 },
    );
  });
});

test.describe("mobile scene", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  test("uses the mobile particle budget and original mobile scroll target", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await observeScene(page);
    await page.goto("/");
    await expectOriginalContent(page);
    await waitForParticles(page, 800);
    expect(await page.evaluate(() => window.__sceneStats.hasDepthOfField)).toBe(
      false,
    );
    await page.getByRole("button", { name: "Get started." }).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      () =>
        window.__sceneStats.cameraPositions.some(
          ([x, y, z]) =>
            Math.abs(x - 0.1) < 0.01 &&
            Math.abs(y - 0.1) < 0.01 &&
            Math.abs(z - 30) < 0.02,
        ),
      null,
      { timeout: 30_000 },
    );
    await expect(page.locator(".content")).toHaveCSS("opacity", "0", {
      timeout: 30_000,
    });
    expect(errors).toEqual([]);
  });
});
