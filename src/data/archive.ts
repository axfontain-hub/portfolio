import { archiveWorks } from "./works";

export const archiveCategories = [
  { id: "documentary", label: "Documentary" },
  { id: "commercial", label: "Commercial" },
  { id: "fiction", label: "Fiction" },
  { id: "digital", label: "Digital" },
  { id: "music-video", label: "Music Video" },
].map((category) => ({
  ...category,
  count: archiveWorks.filter((work) => work.categories.includes(category.id)).length,
}));
