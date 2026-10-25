export interface DesignWork {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaType?: "video" | "photo";
  image: string | null;
  imageAlt: string | null;
  video?: string;
  showCreatorCredit?: boolean;
  creatorCredit?: string;
}

export const designCategories = [
  {
    name: "Pubmats & Graphic Design",
    description:
      "Promotional materials, event announcements, posters, and publication layouts.",
  },
  {
    name: "CorelDRAW Designs & Editing",
    description:
      "Layouts and graphic outputs created or edited using CorelDRAW.",
  },
  {
    name: "Audio-Visual Presentations",
    description:
      "Event presentations, pageant visuals, LED screen graphics, and multimedia outputs.",
  },
  {
    name: "T-shirt Layouts",
    description: "Shirt graphics, custom layouts, and design concepts.",
  },
  {
    name: "Event & Pageant Designs",
    description:
      "Logos, certificates, event branding, and supporting visual assets.",
  },
] as const;

const actualDesignWorks: DesignWork[] = [
  {
    id: "pubmat-poster",
    title: "Pubmat Poster",
    category: "Pubmats & Graphic Design",
    description: "Promotional poster design.",
    mediaType: "photo",
    image: "/images/design/pubmat-poster.png",
    imageAlt: "Pubmat poster design",
  },
  {
    id: "coreldraw-layout",
    title: "CorelDRAW Layout",
    category: "CorelDRAW Designs & Editing",
    description: "Graphic layout created or edited using CorelDRAW.",
    mediaType: "photo",
    image: "/images/design/coreldraw-layout.jpg",
    imageAlt: "CorelDRAW graphic layout",
  },
  {
    id: "av-presentation",
    title: "Audio-Visual Presentation",
    category: "Audio-Visual Presentations",
    description: "Video presentation and multimedia work.",
    mediaType: "video",
    image: null,
    imageAlt: "Audio-visual presentation video",
    video: "/images/design/av-presentation.mp4",
  },
  {
    id: "animated-story-edit",
    title: "Animated Story Edit",
    category: "Audio-Visual Presentations",
    description:
      "My first animated-story editing attempt, adding sound effects, a background, and blended transitions.",
    mediaType: "video",
    image: null,
    imageAlt: "Animated story edit with sound effects and blended transitions",
    video: "/images/design/animation.mp4",
  },
  {
    id: "tshirt-layout",
    title: "T-shirt Layout",
    category: "T-shirt Layouts",
    description: "Custom T-shirt graphic layout.",
    mediaType: "photo",
    image: "/images/design/tshirt-layout.png",
    imageAlt: "T-shirt graphic layout",
  },
  {
    id: "pageant-event-design",
    title: "Pageant Event Design",
    category: "Event & Pageant Designs",
    description: "Visual design for an event or pageant.",
    mediaType: "photo",
    image: "/images/design/pageant-event-design.jpg",
    imageAlt: "Pageant event design",
  },
  {
    id: "third-birthday-layout",
    title: "3rd Birthday Layout",
    category: "Event & Pageant Designs",
    description: "A birthday layout created for a friend's child's 3rd birthday.",
    mediaType: "photo",
    image: "/images/design/3rd.png",
    imageAlt: "Birthday layout for a friend's child's 3rd birthday",
  },
  {
    id: "seventh-birthday-layout",
    title: "7th Birthday Layout",
    category: "Event & Pageant Designs",
    description: "A birthday layout created for a friend's child's 7th birthday.",
    mediaType: "photo",
    image: "/images/design/7th.png",
    imageAlt: "Birthday layout for a friend's child's 7th birthday",
  },
  {
    id: "e-sports-mlbb-ccs-2026-certificate",
    title: "E-Sports MLBB CCS 2026 Certificate",
    category: "Event & Pageant Designs",
    description: "Certificate layout for the E-Sports MLBB CCS 2026 event.",
    mediaType: "photo",
    image: "/images/design/e-sports.png",
    imageAlt: "Certificate layout for E-Sports MLBB CCS 2026",
  },
  {
    id: "mass-demonstration-ccs-2026-judge-certificate",
    title: "Mass Demonstration Competition CCS 2026 Judge Certificate",
    category: "Event & Pageant Designs",
    description:
      "Judge certificate layout for the Mass Demonstration Competition CCS 2026.",
    mediaType: "photo",
    image: "/images/design/mass-cert.png",
    imageAlt:
      "Judge certificate layout for Mass Demonstration Competition CCS 2026",
  },
  {
    id: "smoking-awareness-flyer",
    title: "Smoking Awareness Flyer",
    category: "Pubmats & Graphic Design",
    description:
      "An early digital-editing design created to promote awareness about smoking.",
    mediaType: "photo",
    image: "/images/design/flyer.png",
    imageAlt: "Flyer design promoting awareness about smoking",
  },
  {
    id: "pageant-visual-edit",
    title: "Pageant Visual Edit",
    category: "Event & Pageant Designs",
    description: "Video edit for a pageant event.",
    mediaType: "video",
    image: null,
    imageAlt: "Pageant event video edit",
    video: "/images/design/pageant-visual-edit.mp4",
  },
];

export const designWorks: DesignWork[] = actualDesignWorks;
