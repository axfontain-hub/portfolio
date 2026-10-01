import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://oleksandr-valko.example",
  devToolbar: { enabled: false },
  vite: { optimizeDeps: { noDiscovery: true, include: [] } },
});
