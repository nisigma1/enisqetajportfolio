const mediaRoot = "/projects/duo-bar";

export const duoBarProject = {
  slug: "duo-bar",
  title: "DUO Bar",
  category: "Hospitality / POS software",
  description:
    "I built this application for day-to-day service at DUO Bar. It runs on Malera POS, a point-of-sale system for bars and restaurants available by monthly subscription.",
  photos: {
    terminal: {
      src: `${mediaRoot}/terminal.webp`,
      small: `${mediaRoot}/terminal-720.webp`,
      width: 1440,
      height: 1920,
      alt: "Malera POS terminal at DUO Bar showing the floor plan and order panel",
      caption: "Malera POS on the DUO Bar terminal.",
    },
    orders: {
      src: `${mediaRoot}/orders.webp`,
      small: `${mediaRoot}/orders-720.webp`,
      width: 1440,
      height: 1920,
      alt: "DUO Bar’s floor plan with active and reserved tables and an order in progress",
      caption: "The floor plan shows open orders and reserved tables at a glance.",
    },
    venue: {
      src: `${mediaRoot}/at-the-bar-clear-720.webp`,
      compact: `${mediaRoot}/at-the-bar-clear-720.avif`,
      large: `${mediaRoot}/at-the-bar-clear-1440.webp`,
      // UHD export of the authentic venue photo, not a native UHD capture.
      uhd: {
        src: `${mediaRoot}/at-the-bar-uhd.webp`,
        avif: `${mediaRoot}/at-the-bar-uhd.avif`,
        width: 3840,
        height: 2160,
      },
      width: 720,
      height: 1280,
      alt: "Malera POS installed on the counter inside DUO Bar",
      caption: "The terminal in place at DUO Bar.",
    },
  },
} as const;
