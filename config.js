// ============================================================
// BLD Lipa Youth Ministry — Emergence Digital Invitation
// EDITABLE CONFIGURATION — update this file to change content
// ============================================================

const CONFIG = {
  // --- Event Details ---
  eventName:    "The Emergence",
  eventDate:    "June 14, 2026",
  eventTime:    "1:00 PM",
  eventVenue:   "Marian Center for Peace, Lipa City",

  // --- Invitation Copy ---
  greetingLine: "Hello, beloved.",

  invitationBody: [
    "There is a stirring within the BLD Lipa Youth Ministry —",
    "a gathering of those who feel the quiet pull toward something more.",
    "We believe you are one of them.",
    "You are being called not merely to attend,",
    "but to discern, to lead, and to belong.",
    "Come and see what God is preparing through you."
  ],

  closingCTA: "Step forward. We are waiting for you.",

  // --- Polaroid Captions (one per anchor photo, optional) ---
  polaroidCaptions: [
    "Service. Joy. Community.",
    "Together",
    "Discernment",
    "Called",
    "Beloved",
  ],

  // --- Ambient Slideshow ---
  ambientOpacity: 0.15,   // coordinator may adjust between 0.10 and 0.25

  // --- Accent color override (or "default") ---
  accentColor: "default",
};

// --- Photo Pool ---
// Move filenames between ANCHOR_PHOTOS and AMBIENT_PHOTOS freely.
// ANCHOR_PHOTOS  → used in the polaroid drop sequence and the final grid (4–6 files).
// AMBIENT_PHOTOS → used only in the background slideshow during Stage 5 / 6.

const ANCHOR_PHOTOS = [
  { file: "penta-1.jpg",  alt: "BLD Youth community group shot" },
  { file: "penta-2.jpg",  alt: "Youth ministry gathering" },
  { file: "penta-3.jpg",  alt: "Leadership team together" },
  { file: "penta-4.jpg",  alt: "Community service moment" },
  { file: "penta-5.jpg",  alt: "Youth in prayer and fellowship" },
];

const AMBIENT_PHOTOS = [
  { file: "penta-6.jpg",  alt: "Youth ministry photo" },
  { file: "penta-7.jpg",  alt: "Youth ministry photo" },
  { file: "penta-8.jpg",  alt: "Youth ministry photo" },
  { file: "penta-9.jpg",  alt: "Youth ministry photo" },
  { file: "penta-10.jpg", alt: "Youth ministry photo" },
  { file: "penta-11.jpg", alt: "Youth ministry photo" },
  { file: "penta-12.jpg", alt: "Youth ministry photo" },
  { file: "penta-13.jpg", alt: "Youth ministry photo" },
  { file: "penta-14.jpg", alt: "Youth ministry photo" },
  { file: "penta-15.jpg", alt: "Youth ministry photo" },
  { file: "penta-16.jpg", alt: "Youth ministry photo" },
  { file: "penta-17.jpg", alt: "Youth ministry photo" },
  { file: "penta-18.jpg", alt: "Youth ministry photo" },
  { file: "penta-19.jpg", alt: "Youth ministry photo" },
  { file: "penta-20.jpg", alt: "Youth ministry photo" },
  { file: "penta-21.jpg", alt: "Youth ministry photo" },
  { file: "penta-22.jpg", alt: "Youth ministry photo" },
  { file: "penta-23.jpg", alt: "Youth ministry photo" },
  { file: "penta-24.jpg", alt: "Youth ministry photo" },
  { file: "penta-25.jpg", alt: "Youth ministry photo" },
  { file: "penta-26.jpg", alt: "Youth ministry photo" },
  { file: "penta-27.jpg", alt: "Youth ministry photo" },
  { file: "penta-28.jpg", alt: "Youth ministry photo" },
  { file: "penta-29.jpg", alt: "Youth ministry photo" },
  { file: "penta-30.jpg", alt: "Youth ministry photo" },
  { file: "penta-31.jpg", alt: "Youth ministry photo" },
  { file: "penta-32.png", alt: "Youth ministry photo" },
  { file: "penta-33.jpg", alt: "Youth ministry photo" },
  { file: "penta-34.jpg", alt: "Youth ministry photo" },
  { file: "penta-35.jpg", alt: "Youth ministry photo" },
  { file: "penta-36.jpg", alt: "Youth ministry photo" },
  { file: "penta-37.jpg", alt: "Youth ministry photo" },
  { file: "penta-38.jpg", alt: "Youth ministry photo" },
  { file: "penta-39.jpg", alt: "Youth ministry photo" },
  { file: "penta-40.jpg", alt: "Youth ministry photo" },
];
