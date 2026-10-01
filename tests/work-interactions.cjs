const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const filmRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("?player-test")) filmRequests.push(request.url());
    });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:4322/");
    const card = page.locator(".work-card-link").first();
    const image = card.locator("img");
    const cover = await image.getAttribute("src");
    assert.equal(await card.getAttribute("href"), "/projects/bring-kids-back-ua/");
    await card.hover();
    await page.waitForFunction(
      () =>
        document.querySelector(".work-card-link img").getAttribute("src") !==
        "/images/BKB3.png",
    );
    const firstFrame = await image.getAttribute("src");
    await page.waitForFunction(
      (previous) =>
        document.querySelector(".work-card-link img").getAttribute("src") !== previous,
      firstFrame,
    );
    await page.mouse.move(0, 0);
    assert.equal(await image.getAttribute("src"), cover);
    assert.equal(await page.locator(".film-player").getAttribute("src"), null);
    assert.equal(filmRequests.length, 0);

    // Provide a real local film only for this browser session.
    await card.evaluate((element) => {
      element.dataset.videoUrl = "/videos/hero3.mp4?player-test";
    });
    await card.click();
    await page.waitForFunction(
      () => document.querySelector(".film-player").readyState >= 2,
    );
    assert.equal(await page.locator(".film-dialog").evaluate((d) => d.open), true);
    assert.ok(filmRequests.length > 0);
    assert.equal(await page.locator(".film-player").evaluate((v) => v.muted), false);
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.querySelector(".film-player").hasAttribute("src"),
    );
    assert.equal(await page.locator(".film-dialog").evaluate((d) => d.open), false);
    assert.equal(await page.locator(".film-player").getAttribute("src"), null);
    assert.equal(await card.evaluate((e) => e === document.activeElement), true);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.mouse.move(0, 0);
    await card.hover();
    await page.waitForTimeout(850);
    assert.equal(await image.getAttribute("src"), cover);

    await page.setViewportSize({ width: 390, height: 844 });
    await card.click();
    const dimensions = await page.locator(".film-dialog").evaluate((d) => ({
      width: d.getBoundingClientRect().width,
      height: d.getBoundingClientRect().height,
    }));
    assert.ok(dimensions.width <= 390 && dimensions.height <= 844);
    await page.locator(".film-close").click();
    await page.waitForFunction(
      () => !document.querySelector(".film-player").hasAttribute("src"),
    );
    assert.equal(await page.locator(".film-player").getAttribute("src"), null);

    await card.evaluate((element) => {
      element.dataset.videoUrl = "/videos/missing-film.mp4";
    });
    await card.click();
    await page.locator(".film-error").waitFor({ state: "visible" });
    await page.locator(".film-close").click();
    assert.deepEqual(errors, []);
    console.log(
      "PASS: hover cycle/reset, reduced motion, click-only loading, playback, Escape/focus, mobile sizing, close/unload, missing-film error.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
