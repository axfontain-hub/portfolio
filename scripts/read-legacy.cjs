const { chromium } = require("C:/Users/Oleksandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
let html = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => { html += chunk; });
process.stdin.on("end", async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    const records = await page.evaluate(source => {
      const doc = new DOMParser().parseFromString(source, "text/html");
      return [...doc.querySelectorAll(".uael-video__gallery-item")].map(item => ({
        text: item.textContent.trim().replace(/\s+/g, " "),
        tags: [...item.classList].filter(name => name.startsWith("filter-")).map(name => name.slice(7)),
        url: item.querySelector("a[href]")?.getAttribute("href"),
        image: item.querySelector("[style]")?.getAttribute("style"),
      }));
    }, html);
    console.log(JSON.stringify(records));
  } finally { await browser.close(); }
});
