# Oleksandr Valko Portfolio

Static Astro portfolio for Oleksandr Valko. No CMS, no backend: content lives in local data files and the archive is generated automatically.

## Run locally

On this Windows computer, double-click `Start-Site.cmd`. It opens the project folder automatically and starts the local server. Open the Local URL printed in that window (normally `http://127.0.0.1:4322/`). Keep the window open while using the site; press Ctrl+C to stop. If the port is busy, use the alternate URL Astro prints. The launcher uses the bundled Codex Node runtime, or Node.js from PATH.

```bash
pnpm install
pnpm run dev
```

Build for production:

```bash
pnpm run build
pnpm run preview
```

If Astro telemetry cannot write to your local system folder, run commands with `ASTRO_TELEMETRY_DISABLED=1`.

## Edit content

- Site-wide text, contact links, navigation, and about copy: `src/data/site.ts`
- Projects, Vimeo fields, image placeholders, selected-work flags, and ordering: `src/data/works.ts`
- Global visual styling: `src/styles/global.css`

To change the five works on the homepage, edit `src/data/works.ts`:

- set `selected: true` on the projects you want on Home;
- set `selectedOrder` from `1` to `5`;
- set `featuredSize: "large"` for the first and last selected works, and `"medium"` for the three middle works.

The Archive combines curated and imported projects, sorted by project year (newest first), then `legacyOrder` from the original portfolio within each year. Known production years are preserved; otherwise verified YouTube/Vimeo publication years are used. `yearSource` records this distinction; `publishedAt` preserves the release date separately. `src/data/youtube-dates.json` retains fetched YouTube dates. No metadata requests are made at runtime.

## Media fields

Each project supports:

- `coverImage` for poster/placeholder artwork;
- `coverPosition` for image cropping, e.g. `"65% 50%"`;
- `previewFrames` for an array of still images shown on hover;
- `previewInterval` for milliseconds per still (default 700, minimum 200);
- `videoUrl` for a direct MP4/WebM file, loaded only when clicked on Home;
- `credits`, `services`, `client`, `year`, `role`, and `summary` for the project template.

Current photographic placeholders are in `public/images/`. Replace these with real project stills and update the paths in `src/data/works.ts`. These generated images are visual stand-ins, not footage from the named projects.

About and Archive image paths, the four-line hero title, hero notes and homepage About text are editable in `src/data/site.ts`. Arrays preserve the desktop reference's intended line breaks. The original SVG placeholders remain available in `public/placeholders/`.

The current homepage hero video is set in `src/pages/index.astro`, in the `<source src="/videos/..." />` element. The hero contact links are also in that file, in `hero-contacts`. The `heroImage` setting currently does not control the video.

## Hover previews and full films

For a YouTube film, set `youtubeUrl: "https://www.youtube.com/watch?v=XxK4evk5nvA"` in the project. It takes priority over `videoUrl` on Home. YouTube loads in the existing modal only after a click; closing the modal unloads the embed. Covers and hover frames remain local and independent. D.REAMERS is configured with this example. The video must allow embedding.

Edit each project in `src/data/works.ts`:

```ts
coverImage: "/images/metro/cover.webp",
coverPosition: "65% 50%",
previewFrames: [
  "/images/metro/frame-01.webp",
  { src: "/images/metro/frame-02.webp", position: "30% 50%" },
  "/images/metro/frame-03.webp",
],
previewInterval: 700,
videoUrl: "/videos/metro.mp4",
```

Place images in `public/images/metro/` and the film in `public/videos/`. Omit `public` from URLs. Each frame inherits `coverPosition` unless its own `position` is provided.

On Home, hovering or keyboard-focusing a card starts the still sequence. Leaving returns to the cover. Touch devices and reduced-motion users keep a static cover. Frames load on interaction; broken frames are skipped.

A card with `videoUrl` opens the full film in a dialog with native sound, seek and fullscreen controls. Escape, the close button or backdrop dismisses it and stops playback. Without `videoUrl`, the card still links to its project page. Without `previewFrames`, its cover stays static. Use a direct video file URL, not a Vimeo/YouTube watch-page link.

The first project's preview uses the existing BKB1/BKB2/BKB3 images. Other preview arrays and full-film URLs remain empty for your own assets.

## Archive

Imported portfolio records are in `src/data/legacy-works.json` (source: https://fayno.art/oleksandr-valko-all-works/). The import adds 45 records from 59 original cards, excluding 12 existing Myastoriya films, the existing TV series, and the Metro duplicate merged into the curated Metro project. English display titles retain their source in `originalTitle`. Original tags are retained in `tags` and translated into descriptions; `categories` are editable filter mappings. Unknown clients stay blank. Source cover URLs depend on the original hosts. Ten Vimeo records now use `vimeoUrl` for embedded playback with `externalVideoUrl` as a fallback link. Existing curated content remains in `works.ts`; both datasets contribute to the archive and project pages.

Series use an optional `episodes` array in `src/data/works.ts`. Each entry has `title` and `youtubeUrl`. Keep the first episode equal to the project's main `youtubeUrl`; it is the default film. Episode thumbnails switch the panel's player without leaving the project. Myastoriya contains 11 episodes; its quality-control film is a separate project. Replace numbered episode titles with the actual cut names when available. Empty years are intentionally unspecified.

The archive is generated from every entry in `src/data/works.ts`, including works where `selected` is false. Its main counter counts projects, including those without a video URL yet. Category counts and the visible-result counter are automatic; a project in multiple categories is counted only once in All.

Set categories on each project:

```ts
categories: ["commercial", "digital"],
archiveImage: "/images/project/archive.webp",
archivePosition: "50% 30%",
```

Available category IDs are `documentary`, `commercial`, `fiction`, `digital`, and `music-video`. Edit their labels or add options in `src/data/archive.ts`. The initial assignments are editable editorial groupings.

`archiveImage` and `archivePosition` are optional: they override the cover in the archive's 16:9 thumbnails. Otherwise the cover and its position are used. Change the introduction in `src/data/site.ts` (`archiveDescription`), layout in `src/pages/archive.astro`, and styles in `src/styles/archive.css`.

On desktop, selecting a row narrows the list, hides its thumbnails, and opens a detail panel aligned with the filters. On mobile (up to 900px), only the player and close button appear on a dark overlay; project information stays in the list. Closing returns to the same scroll position. The player uses `youtubeUrl` first, then `vimeoUrl`, then `videoUrl`, or the cover when none is set. Closing it or pressing Escape stops playback. Desktop previous/next arrows cycle through the current category.

Mobile layout overrides are in `src/styles/mobile.css`: Selected Works and Archive use full-width 16:9 previews above their titles and project details. The Home email has a short mobile label without changing its mailto address. About keeps its photo gradient on desktop only; on mobile the photo appears before location and career-start details. The shared `BackToTop.astro` component adds a scroll-to-header button to every page and respects reduced-motion preferences.

The gallery uses `previewFrames` by default. To choose different stills just for the archive, add this field to a project in `src/data/works.ts`:

```ts
archiveFrames: [
  "/images/project/frame-01.webp",
  { src: "/images/project/frame-02.webp", position: "30% 50%" },
  "/images/project/frame-03.webp",
],
```

Files go in `public/images/project/`. Use `archiveFrames: []` to hide the gallery. These are local stills, not automatically extracted YouTube frames.

Filtering updates the count immediately. Category and selected project are saved in the URL; browser Back restores them. Empty categories show an empty state. Modified clicks still open the standalone project page.

## Fonts

The shared text hierarchy is in `src/styles/typography.css`. Edit the `--type-*` tokens there to change a role across all pages: display headings, project-page headings, statements, project titles, body, captions and metadata. Responsive values use explicit breakpoints. About and Archive share the same display-heading role. The multiline Home hero has a separate size for its four-line composition. Page CSS remains responsible for layout, not typography overrides.

Inter Variable is the only locally bundled family. Hero and Archive use Bold (700), About and inner-page headings use Light (300), project titles and body copy use Regular (400), and section labels use Medium (500).

The family and weight tokens are at the top of `src/styles/global.css`: `--font-body`, `--font-heading` and `--weight-*`. The font is bundled through the Inter Fontsource import in `src/layouts/BaseLayout.astro`. No external font service is contacted by visitors.

## Formatting

Editable source files use two spaces per indentation level. Astro markup, CSS rules and content objects are expanded over multiple lines for readability.

Run `pnpm run format` to format files after editing, or `pnpm run format:check` to check formatting without changing them. Formatting rules are in `.prettierrc.json`; editor indentation defaults are in `.editorconfig`. Generated output and media are excluded.

Image generation notes and prompts: `public/images/ASSETS.md`.
