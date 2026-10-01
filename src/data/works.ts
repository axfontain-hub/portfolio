import legacyWorks from "./legacy-works.json";

export type PreviewFrame = string | { src: string; position?: string };

export type Work = {
  slug: string;
  title: string;
  year: string;
  client: string;
  role: string;
  type: string;
  categories: string[];
  archiveImage?: string;
  archivePosition?: string;
  archiveFrames?: PreviewFrame[];
  services: string[];
  summary: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  coverPosition?: string;
  previewFrames?: PreviewFrame[];
  previewInterval?: number;
  // Direct MP4/WebM file URL, not a Vimeo or YouTube page.
  videoUrl?: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  publishedAt?: string;
  legacyOrder?: number;
  yearSource?: string;
  originalTitle?: string;
  externalVideoUrl?: string;
  sourceUrl?: string;
  tags?: string[];
  episodes?: { title: string; youtubeUrl: string }[];
  selected: boolean;
  selectedOrder?: number;
  featuredSize?: "large" | "medium";
  credits?: string[];
};

export const works: Work[] = [
  {
    slug: "myastoriya-steak-series",
    legacyOrder: 23.5,
    tags: ["director", "food", "youtube"],
    title: "Myastoriya / How to cook a steak",
    year: "2020–2021",
    client: "Myastoriya",
    role: "Director",
    type: "Cooking Series / 11 Films",
    categories: ["commercial", "digital"],
    services: ["Direction"],
    summary: "A series of 11 films about preparing different cuts of steak.",
    description: "An 11-film cooking series for Myastoriya, produced over approximately a year in 2020–2021. Each episode explores how to prepare a different cut of steak. Directed by Oleksandr Valko.",
    coverImage: "https://i.ytimg.com/vi/RW48FI5szW0/hqdefault.jpg",
    coverAlt: "Myastoriya: Filet Mignon",
    youtubeUrl: "https://www.youtube.com/watch?v=RW48FI5szW0",
    selected: false,
    episodes: [
      { title: "Filet mignon", youtubeUrl: "https://www.youtube.com/watch?v=RW48FI5szW0" },
      { title: "Ribeye steak", youtubeUrl: "https://www.youtube.com/watch?v=_jSSfKQMLkg" },
      { title: "Striploin steak", youtubeUrl: "https://www.youtube.com/watch?v=C00CfEgEPa4" },
      { title: "T-bone steak", youtubeUrl: "https://www.youtube.com/watch?v=Imp1eqBbiiU" },
      { title: "Eye of round steak", youtubeUrl: "https://www.youtube.com/watch?v=oe9v6oLpsPA" },
      { title: "Chuck steak", youtubeUrl: "https://www.youtube.com/watch?v=W01xM5y-KBE" },
      { title: "Chateau fillet steak", youtubeUrl: "https://www.youtube.com/watch?v=scuV9yNQ2AQ" },
      { title: "Shock Freeze beef burger", youtubeUrl: "https://www.youtube.com/watch?v=kEfFAke84yc" },
      { title: "Selected beef burger", youtubeUrl: "https://www.youtube.com/watch?v=MiirQ3liZD8" },
      { title: "Aberdeen beef burger", youtubeUrl: "https://www.youtube.com/watch?v=iIqLg-AUfe4" },
      { title: "Sirloin steak", youtubeUrl: "https://www.youtube.com/watch?v=OKMewZsniNs" },
    ],
  },
  {
    slug: "myastoriya-quality-control",
    legacyOrder: 22.5,
    tags: ["director", "food", "brand"],
    title: "Myastoriya / Steak quality control",
    year: "2020–2021",
    client: "Myastoriya",
    role: "Director",
    type: "Brand Film",
    categories: ["commercial"],
    services: ["Direction"],
    summary: "A separate film about steak quality control at Myastoriya.",
    description: "A film about quality control at Myastoriya. Directed by Oleksandr Valko.",
    coverImage: "https://i.ytimg.com/vi/tG1idpt-l-g/hqdefault.jpg",
    coverAlt: "Steak quality control at Myastoriya",
    youtubeUrl: "https://www.youtube.com/watch?v=tG1idpt-l-g",
    selected: false,
  },
  {
    slug: "bring-kids-back-ua",
    categories: ["documentary", "digital"],
    title: "Bring Kids Back UA",
    year: "2026",
    client: "Bring Kids Back UA",
    role: "Editor",
    type: "Social Film",
    services: ["Editing", "Narrative Structure"],
    summary:
      "An emotional opening piece built around restraint, silence and controlled escalation.",
    description:
      "A social film shaped to hold attention without overexplaining. The edit focuses on breath, absence and a gradual rise in pressure, leaving room for the message to land with weight.",
    coverImage: "/images/BKB3.png",
    coverAlt: "Placeholder: a lone figure walking along a damaged city street.",
    coverPosition: "50% 50%",
    previewFrames: ["/images/BKB1.png", "/images/BKB2.png", "/images/BKB3.png"],
    previewInterval: 900,
    youtubeUrl: "https://youtu.be/i0lMX7YqsVI",
    selected: true,
    selectedOrder: 1,
    featuredSize: "large",
    credits: ["Editorial pacing", "Color direction", "Sound-led timing"],
  },
  {
    slug: "metro",
    youtubeUrl: "https://www.youtube.com/watch?v=_6YoSvony_E",
    publishedAt: "2025-10-23T10:21:02.0000000+00:00",
    legacyOrder: 1,
    tags: ["motion"],
    categories: ["commercial"],
    title: "Metro",
    year: "2025",
    client: "METRO",
    role: "Motion / Edit",
    type: "Commercial Motion",
    services: ["Motion Design", "Editing"],
    summary: "A graphic, direct commercial motion piece with clean visual beats.",
    description:
      "A concise branded sequence where graphic timing carries the energy. Designed to feel quick, legible and polished across short-form placements.",
    coverImage: "/images/METRO.png",
    coverAlt: "Placeholder: a passenger looking through a car window.",
    coverPosition: "50% 50%",
    previewFrames: [],
    previewInterval: 700,
    videoUrl: "",
    selected: true,
    selectedOrder: 2,
    featuredSize: "medium",
  },
  {
    slug: "war-alarms-adventures",
    legacyOrder: 7.5,
    tags: ["edit"],
    categories: ["fiction"],
    title: "War, alarms & adventures",
    year: "2023",
    client: "Independent",
    role: "Editor",
    type: "Scripted / Sitcom",
    services: ["Editing", "Comedy Timing", "Story"],
    summary: "Scripted editing with pace, character reaction and tonal control.",
    description:
      "A scripted piece cut around performance, reaction and comic pressure. The rhythm keeps scenes moving while preserving the offbeat timing of the format.",
    coverImage: "/images/alert 1.png",
    coverAlt: "Placeholder: a passenger looking through a car window.",
    coverPosition: "50% 50%",
    previewFrames: [],
    previewInterval: 700,
    youtubeUrl: "https://youtu.be/dB2xo2_xU-s",
    selected: true,
    selectedOrder: 3,
    featuredSize: "medium",
  },
  {
    slug: "dtek",
    categories: ["commercial", "digital"],
    title: "DTEK",
    youtubeUrl: "https://youtu.be/iQdIAIEDW0c",
    year: "2026",
    client: "DTEK",
    role: "Motion Designer / Editor / Colorist",
    type: "Motion / Film",
    services: ["Motion Design", "Editing", "Color"],
    summary: "Motion design, editing and color for DTEK.",
    description: "A DTEK project with work across motion design, editing and color.",
    coverImage: "/images/dtek.png",
    coverAlt: "Placeholder: a passenger looking through a car window.",
    coverPosition: "50% 50%",
    previewFrames: [],
    previewInterval: 700,
    videoUrl: "",
    selected: true,
    selectedOrder: 4,
    featuredSize: "medium",
  },
  {
    slug: "dreamers-kyiv-drive-weekend",
    categories: ["commercial"],
    youtubeUrl: "https://www.youtube.com/watch?v=XxK4evk5nvA",
    title: "D.reamers / Kyiv Drive Weekend",
    year: "2025",
    client: "D.REAMERS",
    role: "Editor / Colorist",
    type: "Brand Film",
    services: ["Editing", "Color", "Look Development"],
    summary: "A glossy closing case with pace, atmosphere and road-film energy.",
    description:
      "A style-led brand film built around movement, texture and a confident visual finish. The cut leans into momentum while keeping the image language restrained.",
    coverImage: "/images/d.voted/dv cover.png",
    coverAlt: "Placeholder: a cinematic close-up portrait.",
    coverPosition: "50% 50%",
    previewFrames: [
      "/images/d.voted/dv1.png",
      "/images/d.voted/dv2.png",
      "/images/d.voted/dv3.png",
      "/images/d.voted/dv4.png",
      "/images/d.voted/dv5.png",
      "/images/d.voted/dv6.png",
    ],
    previewInterval: 700,
    videoUrl: "",
    selected: true,
    selectedOrder: 5,
    featuredSize: "large",
    credits: ["Color pass", "Rhythm system", "Campaign edit"],
  },
];

export const allWorks: Work[] = [...works, ...legacyWorks];

export const selectedWorks = allWorks
  .filter((work) => work.selected)
  .sort((a, b) => (a.selectedOrder ?? 999) - (b.selectedOrder ?? 999));

// Production/portfolio year leads; original portfolio order resolves entries within a year.
export const archiveWorks = [...allWorks].sort((a, b) => {
  const endYear = (year: string) => Number(year.match(/\d{4}/g)?.at(-1) ?? 0);
  const yearDifference = endYear(b.year) - endYear(a.year);
  if (yearDifference) return yearDifference;
  const orderDifference = (a.legacyOrder ?? -1) - (b.legacyOrder ?? -1);
  if (orderDifference) return orderDifference;
  return a.title.localeCompare(b.title);
});
