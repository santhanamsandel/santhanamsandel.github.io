// Classroom & training photo gallery ("Beyond the Classroom").
// All photos are real, unedited moments (only resized / cropped to remove GPS stamps).
//
// To add a photo:
//   1. Export a WebP at ~1400px wide (`name.webp`) and ~720px wide (`name-sm.webp`) into /public/images or /public/images/gallery
//   2. Add an entry below with the real pixel size of the large file (w, h) and an accurate caption.
// To remove a photo, delete its entry (the files can stay).

export type GalleryCategory =
  | "Live Classroom Training"
  | "Hands-on Practical Sessions"
  | "AI & Generative AI Workshops"
  | "Student Mentoring & Project Guidance"
  | "Technical Training Activities"
  | "Collaborative Learning Sessions"
  | "Recognition";

export type GalleryPhoto = {
  src: string; // large image
  srcSm: string; // ~720px wide variant for grids and phones
  w: number;
  h: number;
  alt: string; // what is literally in the photo (for screen readers)
  caption: GalleryCategory;
  note: string; // short visible description
  /** CSS object-position used when a tile has to crop slightly (keeps faces in frame) */
  focus?: string;
};

export const gallery: GalleryPhoto[] = [
  {
    src: "/images/train-mic.webp",
    srcSm: "/images/train-mic-sm.webp",
    w: 900,
    h: 1350,
    alt: "Santhanam speaking to learners with a microphone during a training session",
    caption: "Live Classroom Training",
    note: "Addressing a training batch",
    focus: "50% 25%",
  },
  {
    src: "/images/gallery/classroom-whiteboard.webp",
    srcSm: "/images/gallery/classroom-whiteboard-sm.webp",
    w: 1400,
    h: 551,
    alt: "Santhanam teaching at the front of a classroom with slides projected on a whiteboard, an Employment Linked Skilling Programme banner on the left",
    caption: "Live Classroom Training",
    note: "Employment-linked skilling programme session",
  },
  {
    src: "/images/train-board.webp",
    srcSm: "/images/train-board-sm.webp",
    w: 1200,
    h: 800,
    alt: "Santhanam explaining a chatbot interface on a large interactive display",
    caption: "AI & Generative AI Workshops",
    note: "Walking through an AI chatbot interface",
  },
  {
    src: "/images/train-lab.webp",
    srcSm: "/images/train-lab-sm.webp",
    w: 1200,
    h: 968,
    alt: "Santhanam guiding participants working at computers in a lab",
    caption: "Hands-on Practical Sessions",
    note: "Guiding participants at their workstations",
  },
  {
    src: "/images/gallery/classroom-interaction.webp",
    srcSm: "/images/gallery/classroom-interaction-sm.webp",
    w: 1400,
    h: 543,
    alt: "Santhanam standing beside a programme banner, talking with a classroom of attentive students",
    caption: "Student Mentoring & Project Guidance",
    note: "Interacting with students during a session",
    focus: "80% 50%",
  },
  {
    src: "/images/train-hall.webp",
    srcSm: "/images/train-hall-sm.webp",
    w: 1200,
    h: 800,
    alt: "Santhanam presenting with a microphone to a large hall of learners at computers",
    caption: "Live Classroom Training",
    note: "Presenting to a large cohort",
  },
  {
    src: "/images/gallery/lab-walkthrough.webp",
    srcSm: "/images/gallery/lab-walkthrough-sm.webp",
    w: 1400,
    h: 788,
    alt: "Santhanam walking between rows of learners who are working on laptops",
    caption: "Hands-on Practical Sessions",
    note: "Checking in on learners during lab work",
  },
  {
    src: "/images/train-screen.webp",
    srcSm: "/images/train-screen-sm.webp",
    w: 1200,
    h: 675,
    alt: "Santhanam presenting slides on a screen to learners in a glass-walled training room",
    caption: "Technical Training Activities",
    note: "Slide-led technical session",
  },
  {
    src: "/images/train-computer.webp",
    srcSm: "/images/train-computer-sm.webp",
    w: 1200,
    h: 800,
    alt: "Santhanam standing in a computer lab while learners work at their screens",
    caption: "Hands-on Practical Sessions",
    note: "Supervising a computer-lab session",
  },
  {
    src: "/images/award.webp",
    srcSm: "/images/award-sm.webp",
    w: 1100,
    h: 971,
    alt: "Santhanam receiving an appreciation plaque from institution faculty members",
    caption: "Recognition",
    note: "Appreciation from institution faculty",
    focus: "35% 40%",
  },
  {
    src: "/images/batch.webp",
    srcSm: "/images/batch-sm.webp",
    w: 1200,
    h: 675,
    alt: "Santhanam standing with a batch of learners for a group photo",
    caption: "Collaborative Learning Sessions",
    note: "With a training batch",
  },
  {
    src: "/images/gallery/cohort-dept-cs.webp",
    srcSm: "/images/gallery/cohort-dept-cs-sm.webp",
    w: 1400,
    h: 1050,
    alt: "Large group photo of participants and faculty outside a Department of Computer Science building",
    caption: "Collaborative Learning Sessions",
    note: "Group photo at a Department of Computer Science",
  },
];
