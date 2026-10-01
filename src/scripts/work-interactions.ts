import type { PreviewFrame } from "../data/works";

const dialog = document.querySelector<HTMLDialogElement>(".film-dialog")!;
const player = dialog.querySelector<HTMLVideoElement>(".film-player")!;
const youtube = dialog.querySelector<HTMLIFrameElement>(".film-youtube")!;

function youtubeEmbed(link: string): string | null {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "m.youtube.com"].includes(host)
          ? url.searchParams.get("v") || url.pathname.split("/")[2]
          : null;
    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
  } catch {
    return null;
  }
}
const error = dialog.querySelector<HTMLElement>(".film-error")!;
const directLink = dialog.querySelector<HTMLAnchorElement>(".film-direct-link")!;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const stopPreviews: Array<() => void> = [];
let opener: HTMLAnchorElement | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function closeFilm() {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  player.pause();
  youtube.removeAttribute("src");
  if (reducedMotion.matches) {
    dialog.close();
    return;
  }
  dialog.classList.add("is-closing");
  closeTimer = setTimeout(() => dialog.close(), 200);
}

document
  .querySelectorAll<HTMLAnchorElement>(".work-card-link, .archive-film")
  .forEach((card) => {
    const image = card.querySelector<HTMLImageElement>(
      ".work-media img, .archive-film-image",
    );
    if (!image) return;

    const cover = image.getAttribute("src")!;
    const coverPosition = image.style.objectPosition;
    const frames = (JSON.parse(card.dataset.previewFrames || "[]") as PreviewFrame[]).map(
      (frame) =>
        typeof frame === "string"
          ? { src: frame, position: coverPosition }
          : { src: frame.src, position: frame.position ?? coverPosition },
    );
    const interval = Math.max(200, Number(card.dataset.previewInterval) || 700);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let generation = 0;
    let readyFrames: Promise<typeof frames> | undefined;
    let hovered = false;
    let focused = false;

    function stop() {
      generation++;
      clearTimeout(timer);
      image!.src = cover;
      image!.style.objectPosition = coverPosition;
    }

    async function start() {
      stop();
      if (!frames.length || reducedMotion.matches || dialog.open || document.hidden)
        return;
      const current = generation;

      // Decode before displaying frames so a slow or missing image cannot flash blank.
      readyFrames ??= Promise.all(
        frames.map(async (frame) => {
          const preload = new Image();
          preload.src = frame.src;
          try {
            await preload.decode();
            return frame;
          } catch {
            return null;
          }
        }),
      ).then((loaded) =>
        loaded.filter((frame): frame is (typeof frames)[number] => frame !== null),
      );

      const loaded = await readyFrames;
      if (generation !== current || !loaded.length) return;
      let index = 0;
      function next() {
        if (generation !== current) return;
        const frame = loaded[index];
        image!.src = frame.src;
        image!.style.objectPosition = frame.position;
        index = (index + 1) % loaded.length;
        if (loaded.length > 1) timer = setTimeout(next, interval);
      }
      next();
    }

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch" || !canHover.matches) return;
      hovered = true;
      void start();
    });
    card.addEventListener("pointerleave", () => {
      hovered = false;
      if (!focused) stop();
    });
    card.addEventListener("focus", () => {
      focused = card.matches(":focus-visible");
      if (focused) void start();
    });
    card.addEventListener("blur", () => {
      focused = false;
      if (!hovered) stop();
    });
    stopPreviews.push(stop);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    observer.observe(card);

    card.addEventListener("click", (event) => {
      const url = card.dataset.youtubeUrl || card.dataset.videoUrl;
      const embed = card.dataset.youtubeUrl
        ? youtubeEmbed(card.dataset.youtubeUrl)
        : null;
      if (card.dataset.youtubeUrl && !embed) return;
      if (
        !url ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      stopPreviews.forEach((reset) => reset());
      opener = card;
      dialog.setAttribute("aria-label", card.dataset.videoTitle || "Film");
      clearTimeout(closeTimer);
      dialog.classList.remove("is-closing");
      error.hidden = true;
      directLink.href = url;
      player.hidden = Boolean(embed);
      youtube.hidden = !embed;
      if (embed) {
        youtube.title = card.dataset.videoTitle || "YouTube video";
        youtube.src = embed;
      } else {
        player.poster = card.dataset.videoPoster || cover;
        // No video source exists until an explicit click.
        player.src = url;
      }
      dialog.showModal();
      document.documentElement.classList.add("film-open");
      if (!embed)
        void player.play().catch(() => {
          // Browser autoplay restrictions still allow playback through native controls.
        });
    });
  });

dialog.querySelector(".film-close")!.addEventListener("click", closeFilm);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFilm();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    closeFilm();
});
dialog.addEventListener("close", () => {
  clearTimeout(closeTimer);
  dialog.classList.remove("is-closing");
  player.pause();
  player.removeAttribute("src");
  player.removeAttribute("poster");
  youtube.removeAttribute("src");
  youtube.hidden = true;
  player.load();
  document.documentElement.classList.remove("film-open");
  opener?.focus({ preventScroll: true });
  stopPreviews.forEach((reset) => reset());
});
player.addEventListener("error", () => {
  if (dialog.open && player.hasAttribute("src")) error.hidden = false;
});
reducedMotion.addEventListener("change", () => stopPreviews.forEach((stop) => stop()));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopPreviews.forEach((stop) => stop());
    player.pause();
  }
});
