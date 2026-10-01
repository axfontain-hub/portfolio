import type { Work } from "../data/works";

const page = document.querySelector<HTMLElement>(".archive-page")!;
const works = JSON.parse(page.dataset.archiveWorks || "[]") as Work[];
const filters = [...page.querySelectorAll<HTMLButtonElement>("[data-category]")];
const rows = [...page.querySelectorAll<HTMLElement>(".archive-item")];
const panel = page.querySelector<HTMLElement>(".archive-detail")!;
const panelHome = panel.parentElement!;
const mobileArchive = window.matchMedia("(max-width: 900px)");
const mobileDialog = document.createElement("dialog");
mobileDialog.className = "archive-mobile-dialog";
mobileDialog.setAttribute("aria-labelledby", "detail-title");
document.body.append(mobileDialog);
mobileDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  clearSelection(true);
  writeUrl();
});
mobileArchive.addEventListener("change", () => {
  if (selected) {
    clearSelection(true);
    writeUrl();
  }
});
mobileDialog.addEventListener("click", (event) => {
  if (event.target !== mobileDialog) return;
  const bounds = mobileDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  ) {
    clearSelection(true);
    writeUrl();
  }
});
const video = panel.querySelector<HTMLVideoElement>(".detail-video")!;
const iframe = panel.querySelector<HTMLIFrameElement>(".detail-youtube")!;
const poster = panel.querySelector<HTMLImageElement>(".detail-poster")!;
const gallery = panel.querySelector<HTMLElement>(".detail-gallery")!;
const episodes = panel.querySelector<HTMLElement>(".detail-episodes")!;
const error = panel.querySelector<HTMLElement>(".detail-error")!;
const previous = panel.querySelector<HTMLButtonElement>("[data-detail-prev]")!;
const next = panel.querySelector<HTMLButtonElement>("[data-detail-next]")!;
const close = panel.querySelector<HTMLButtonElement>("[data-detail-close]")!;
let category = "all";
let visible = works;
let selected: string | null = null;
let returnScroll = 0;
let opener: HTMLAnchorElement | null = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const list = page.querySelector<HTMLElement>(".archive-list-column")!;
let panelAnimation: Animation | undefined;
let listAnimation: Animation | undefined;
const motion = { duration: 650, easing: "cubic-bezier(.4,0,.2,1)" };
let closing = 0;
let revealCleanup: (() => void) | undefined;
let switchTimer = 0;
let pendingProject: Work | undefined;
let detailEffects: Animation[] = [];
let typedText: Array<{ element: HTMLElement; text: string }> = [];
let typingTimer = 0;

function resetDetailEffects() {
  window.clearTimeout(switchTimer);
  window.clearTimeout(typingTimer);
  pendingProject = undefined;
  detailEffects.forEach((animation) => animation.cancel());
  detailEffects = [];
  typedText.forEach(({ element, text }) => {
    element.textContent = text;
  });
  typedText = [];
}

function animateDetailContent() {
  if (reducedMotion.matches || mobileArchive.matches) return;
  panel
    .querySelectorAll<HTMLElement>(
      ".detail-media, .detail-meta, .detail-gallery, .detail-type",
    )
    .forEach((element, index) => {
      detailEffects.push(
        element.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 420, delay: index * 45, easing: "ease-out", fill: "backwards" },
        ),
      );
    });
  panel
    .querySelectorAll<HTMLElement>("#detail-title, .detail-description")
    .forEach((element) => {
      const text = element.textContent || "";
      typedText.push({ element, text });
      const accessible = document.createElement("span");
      accessible.className = "archive-reveal-accessible";
      accessible.textContent = text;
      const visual = document.createElement("span");
      visual.setAttribute("aria-hidden", "true");
      const characters = Array.from(text);
      characters.forEach((character, index) => {
        const span = document.createElement("span");
        span.textContent = character;
        visual.append(span);
        detailEffects.push(
          span.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 1,
            delay: 100 + index * Math.min(22, 850 / Math.max(1, characters.length)),
            fill: "backwards",
          }),
        );
      });
      element.replaceChildren(accessible, visual);
    });
  typingTimer = window.setTimeout(resetDetailEffects, 1050);
}

function switchProject(work: Work) {
  if (!selected || reducedMotion.matches || mobileArchive.matches) {
    renderDetails(work);
    return;
  }
  if (work.slug === selected && !pendingProject) return;
  resetDetailEffects();
  pendingProject = work;
  video.pause();
  panel
    .querySelectorAll<HTMLElement>(".detail-media, .detail-copy, .detail-gallery")
    .forEach((element) => {
      detailEffects.push(
        element.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 160,
          easing: "ease-in",
          fill: "forwards",
        }),
      );
    });
  switchTimer = window.setTimeout(() => {
    renderDetails(work);
    animateDetailContent();
    writeUrl();
  }, 160);
}

function revealListContent() {
  revealCleanup?.();
  if (reducedMotion.matches) return;
  const animations: Animation[] = [];
  const originals: Array<{ element: HTMLElement; text: string }> = [];
  let timer = 0;
  revealCleanup = () => {
    window.clearTimeout(timer);
    animations.forEach((animation) => animation.cancel());
    originals.forEach(({ element, text }) => {
      element.textContent = text;
    });
    revealCleanup = undefined;
  };
  rows
    .filter((row) => !row.hidden)
    .forEach((row) => {
      const image = row.querySelector<HTMLElement>(".archive-film-image")!;
      animations.push(
        image.animate(
          [
            { opacity: 0, clipPath: "inset(0 100% 0 0)" },
            { opacity: 1, clipPath: "inset(0 0% 0 0)" },
          ],
          {
            duration: 750,
            easing: "ease-in-out",
            fill: "backwards",
          },
        ),
      );
      const element = row.querySelector<HTMLElement>(".archive-summary")!;
      if (!element.getClientRects().length) return;
      const text = element.textContent || "";
      originals.push({ element, text });
      const accessible = document.createElement("span");
      accessible.className = "archive-reveal-accessible";
      accessible.textContent = text;
      const visual = document.createElement("span");
      visual.setAttribute("aria-hidden", "true");
      const characters = Array.from(text);
      characters.forEach((character, index) => {
        const span = document.createElement("span");
        span.textContent = character;
        visual.append(span);
        animations.push(
          span.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 1,
            delay: index * Math.min(18, 1100 / Math.max(1, characters.length)),
            fill: "backwards",
          }),
        );
      });
      element.replaceChildren(accessible, visual);
    });
  timer = window.setTimeout(() => revealCleanup?.(), 1200);
}
function createSlider(gallery: HTMLElement) {
  let sliderFrame = 0;
  let sliderPaused = false;
  let dragged = false;
  let drag: { id: number; x: number; scroll: number } | null = null;
  gallery.tabIndex = 0;
  gallery.addEventListener("dragstart", (event) => event.preventDefault());
  gallery.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragged = false;
    drag = { id: event.pointerId, x: event.clientX, scroll: gallery.scrollLeft };
  });
  gallery.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (!dragged && Math.abs(drag.x - event.clientX) < 6) return;
    dragged = true;
    gallery.setPointerCapture(event.pointerId);
    gallery.classList.add("is-dragging");
    gallery.scrollLeft = drag.scroll + drag.x - event.clientX;
  });
  function endDrag() {
    drag = null;
    gallery.classList.remove("is-dragging");
  }
  gallery.addEventListener("pointerup", endDrag);
  gallery.addEventListener("pointercancel", endDrag);
  gallery.addEventListener("lostpointercapture", endDrag);
  gallery.addEventListener(
    "click",
    (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      dragged = false;
    },
    true,
  );
  gallery.addEventListener("pointerenter", () => {
    sliderPaused = true;
  });
  gallery.addEventListener("pointerleave", () => {
    sliderPaused = false;
  });
  gallery.addEventListener("focusin", () => {
    sliderPaused = true;
  });
  gallery.addEventListener("focusout", () => {
    sliderPaused = false;
  });

  function startSlider() {
    cancelAnimationFrame(sliderFrame);
    gallery.scrollLeft = 0;
    let last = 0;
    let direction = 1;
    let position = 0;
    const tick = (now: number) => {
      const elapsed = last ? Math.min(now - last, 50) : 0;
      last = now;
      const max = gallery.scrollWidth - gallery.clientWidth;
      if (
        !reducedMotion.matches &&
        !sliderPaused &&
        !drag &&
        !document.hidden &&
        !gallery.hidden &&
        max > 1
      ) {
        position = Math.max(0, Math.min(max, position + direction * elapsed * 0.025));
        gallery.scrollLeft = position;
        if (position >= max) direction = -1;
        if (position <= 0) direction = 1;
      } else position = gallery.scrollLeft;
      sliderFrame = requestAnimationFrame(tick);
    };
    sliderFrame = requestAnimationFrame(tick);
  }
  return {
    start: startSlider,
    stop: () => {
      cancelAnimationFrame(sliderFrame);
      endDrag();
    },
  };
}
const gallerySlider = createSlider(gallery);
const episodeSlider = createSlider(episodes);

function animateList(from: number, to = list.getBoundingClientRect().width) {
  if (reducedMotion.matches || window.innerWidth <= 900) return;
  listAnimation?.cancel();
  listAnimation = list.animate([{ width: from + "px" }, { width: to + "px" }], motion);
}

function stopMedia() {
  video.pause();
  video.removeAttribute("src");
  video.removeAttribute("poster");
  video.load();
  iframe.removeAttribute("src");
  video.hidden = true;
  iframe.hidden = true;
  poster.hidden = true;
  error.hidden = true;
}

function embedUrl(link: string) {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=0&dnt=1` : null;
    }
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "m.youtube.com"].includes(host)
          ? url.searchParams.get("v") || url.pathname.split("/")[2]
          : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`
      : null;
  } catch {
    return null;
  }
}

function text(selector: string, value: string) {
  panel.querySelector<HTMLElement>(selector)!.textContent = value;
}

function renderDetails(work: Work) {
  resetDetailEffects();
  revealCleanup?.();
  window.clearTimeout(closing);
  panelAnimation?.cancel();
  panel.inert = false;
  mobileDialog.classList.remove("is-closing");
  const opening = !selected;
  const oldWidth = list.getBoundingClientRect().width;
  listAnimation?.cancel();
  stopMedia();
  selected = work.slug;
  page.classList.toggle("has-selection", !mobileArchive.matches);
  panel.hidden = false;
  if (mobileArchive.matches) {
    mobileDialog.append(panel);
    if (!mobileDialog.open) mobileDialog.showModal();
    mobileDialog.scrollTop = 0;
  }
  if (opening && !reducedMotion.matches && !mobileArchive.matches) {
    animateList(oldWidth);
    panelAnimation = panel.animate(
      [
        { opacity: 0, transform: "translateX(48px)" },
        { opacity: 1, transform: "translateX(0)" },
      ],
      {
        ...motion,
        delay: window.innerWidth > 900 ? motion.duration : 0,
        fill: "backwards",
      },
    );
  }
  rows.forEach((row) => {
    const active = row.dataset.slug === selected;
    row.classList.toggle("is-selected", active);
    const link = row.querySelector("a")!;
    link.setAttribute("aria-expanded", String(active));
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  text("#detail-title", work.title);
  text(".detail-type", work.type);
  text(".detail-description", work.description || work.summary);
  text(".detail-tags", (work.tags || []).join(" / "));
  panel.querySelector<HTMLElement>(".detail-description")!.hidden = !(
    work.description || work.summary
  );
  panel.querySelector<HTMLElement>(".detail-tags")!.hidden = !work.tags?.length;
  const external = panel.querySelector<HTMLAnchorElement>(".detail-external")!;
  external.hidden = !work.externalVideoUrl;
  if (work.externalVideoUrl) external.href = work.externalVideoUrl;
  else external.removeAttribute("href");
  text("[data-detail-role]", work.role);
  text("[data-detail-type]", work.type);
  text("[data-detail-client]", work.client);
  text("[data-detail-year]", work.year);
  panel.querySelector<HTMLElement>("[data-detail-year]")!.parentElement!.hidden =
    !work.year;
  panel.querySelector<HTMLElement>("[data-detail-client]")!.parentElement!.hidden =
    !work.client;
  text(
    ".detail-index",
    `${String(visible.findIndex((item) => item.slug === selected) + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`,
  );
  previous.disabled = next.disabled = visible.length < 2;
  const mediaUrl = work.youtubeUrl || work.vimeoUrl;
  const embed = mediaUrl ? embedUrl(mediaUrl) : null;
  if (embed) {
    iframe.title = work.title;
    iframe.src = embed;
    iframe.hidden = false;
  } else if (work.videoUrl) {
    video.poster = work.coverImage;
    video.src = work.videoUrl;
    video.hidden = false;
    panel.querySelector<HTMLAnchorElement>(".detail-direct")!.href = work.videoUrl;
  } else {
    poster.src = work.coverImage;
    poster.alt = work.title;
    poster.hidden = false;
  }
  gallery.replaceChildren();
  episodes.replaceChildren();
  episodes.hidden = !work.episodes?.length;
  work.episodes?.forEach((episode, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "detail-episode";
    button.setAttribute("aria-pressed", String(index === 0));
    const thumbnail = new Image();
    const url = embedUrl(episode.youtubeUrl);
    if (!url) return;
    const id = new URL(url).pathname.split("/").pop();
    thumbnail.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = "\u25b6 " + episode.title;
    button.append(thumbnail, label);
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;
      stopMedia();
      iframe.title = work.title + " / " + episode.title;
      iframe.src = url;
      iframe.hidden = false;
      episodes
        .querySelectorAll("button")
        .forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      if (!reducedMotion.matches)
        iframe.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 350,
          easing: "ease-out",
        });
    });
    episodes.append(button);
  });
  const frames = work.archiveFrames ?? work.previewFrames ?? [];
  gallery.hidden = frames.length === 0;
  frames.forEach((frame, index) => {
    const image = new Image();
    image.src = typeof frame === "string" ? frame : frame.src;
    image.style.objectPosition =
      (typeof frame === "string" ? undefined : frame.position) ||
      work.coverPosition ||
      "50% 50%";
    image.alt = `${work.title} — still ${index + 1}`;
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove(), { once: true });
    gallery.append(image);
  });
  if (!mobileArchive.matches) {
    gallerySlider.start();
    episodeSlider.start();
  }
}

function clearSelection(restoreFocus = false) {
  resetDetailEffects();
  window.clearTimeout(closing);
  panelAnimation?.cancel();
  gallerySlider.stop();
  episodeSlider.stop();
  const wasOpen = !panel.hidden;
  const oldWidth = list.getBoundingClientRect().width;
  stopMedia();
  selected = null;
  panel.inert = true;
  const finish = () => {
    panel.hidden = true;
    if (mobileDialog.open) mobileDialog.close();
    mobileDialog.classList.remove("is-closing");
    panelHome.append(panel);
    gallery.replaceChildren();
    page.classList.remove("has-selection");
    if (wasOpen && !mobileArchive.matches) revealListContent();
    if (restoreFocus) window.scrollTo({ top: returnScroll, behavior: "instant" });
  };
  if (mobileDialog.open && !reducedMotion.matches) {
    mobileDialog.classList.add("is-closing");
    closing = window.setTimeout(() => {
      finish();
      if (restoreFocus) opener?.focus({ preventScroll: true });
    }, 200);
  } else if (wasOpen && !reducedMotion.matches && !mobileArchive.matches) {
    animateList(
      oldWidth,
      page.querySelector<HTMLElement>(".archive-workspace")!.clientWidth,
    );
    panelAnimation = panel.animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: "translateX(48px)" },
      ],
      { ...motion, fill: "forwards" },
    );
    closing = window.setTimeout(finish, motion.duration);
  } else finish();
  rows.forEach((row) => {
    row.classList.remove("is-selected");
    row.querySelector("a")!.setAttribute("aria-expanded", "false");
    row.querySelector("a")!.removeAttribute("aria-current");
  });
  if (restoreFocus) {
    opener?.focus({ preventScroll: true });
  }
}

function writeUrl() {
  const url = new URL(location.href);
  if (category === "all") url.searchParams.delete("category");
  else url.searchParams.set("category", category);
  if (selected) url.searchParams.set("project", selected);
  else url.searchParams.delete("project");
  if (url.href !== location.href) history.pushState(null, "", url);
}

function applyCategory(value: string) {
  resetDetailEffects();
  category = filters.some((button) => button.dataset.category === value) ? value : "all";
  visible = works.filter(
    (work) => category === "all" || work.categories.includes(category),
  );
  filters.forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.category === category)),
  );
  rows.forEach((row) => {
    const index = visible.findIndex((work) => work.slug === row.dataset.slug);
    row.hidden = index === -1;
    if (index !== -1)
      row.querySelector(".archive-number")!.textContent = String(index + 1).padStart(
        2,
        "0",
      );
  });
  page.querySelector("#archive-count")!.textContent = String(visible.length);
  page.querySelector("#archive-count-label")!.textContent =
    visible.length === 1 ? "project" : "projects";
  page.querySelector<HTMLElement>(".archive-empty")!.hidden = visible.length !== 0;
}

filters.forEach((button) =>
  button.addEventListener("click", () => {
    applyCategory(button.dataset.category!);
    if (selected) {
      const work = visible.find((work) => work.slug === selected);
      if (work) {
        text(
          ".detail-index",
          `${String(visible.indexOf(work) + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`,
        );
        previous.disabled = next.disabled = visible.length < 2;
      } else clearSelection();
    }
    writeUrl();
  }),
);

rows.forEach((row) => {
  const link = row.querySelector<HTMLAnchorElement>("a")!;
  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const work = works.find((work) => work.slug === link.dataset.project);
    if (!work) return;
    event.preventDefault();
    if (!selected) returnScroll = window.scrollY;
    opener = link;
    switchProject(work);
    writeUrl();
    close.focus({ preventScroll: true });
  });
});

function step(direction: number) {
  if (!selected || visible.length < 2) return;
  const index = visible.findIndex(
    (work) => work.slug === (pendingProject?.slug || selected),
  );
  switchProject(visible[(index + direction + visible.length) % visible.length]);
  writeUrl();
}
previous.addEventListener("click", () => step(-1));
next.addEventListener("click", () => step(1));
close.addEventListener("click", () => {
  clearSelection(true);
  writeUrl();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && selected && !document.fullscreenElement) {
    clearSelection(true);
    writeUrl();
  }
});
video.addEventListener("error", () => {
  if (selected && video.hasAttribute("src")) error.hidden = false;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) video.pause();
});
function restore() {
  const url = new URL(location.href);
  applyCategory(url.searchParams.get("category") || "all");
  const work = visible.find((work) => work.slug === url.searchParams.get("project"));
  if (work) renderDetails(work);
  else clearSelection();
}
window.addEventListener("popstate", restore);
restore();
