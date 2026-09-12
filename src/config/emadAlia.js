// One config object drives the whole site. To re-skin for a new couple,
// duplicate this file, swap the values, and point src/config/index.js at it.
export const client = {
  namesEn: { groom: "Emad", bride: "Alia" },

  weddingDateISO: "2026-10-07T19:00:00+03:00", // Wed, 7 Oct 2026, 7:00 PM Cairo time
  weddingDayLabel: "Wednesday",
  weddingDateLabel: "7 · 10 · 2026",

  venue: {
    name: "Casa Maria Villa",
    area: "Orabi - Obour - Cairo",
    mapsUrl: "https://maps.google.com/?q=Casa+Maria+Villa+Orabi+Cairo",
    time: "7:00 PM",
    image: "https://abanouprefat.github.io/emad-alia/media/venue.jpg",
  },

  kidsNote: "We love your little ones, but for this event kindly leave them at home",

  story: [
    {
      id: "proposal",
      label: "Proposal",
      body: "The moment Emad asked, and Alia said yes.",
      image: "https://abanouprefat.github.io/emad-alia/media/story_proposal.jpg",
    },
    {
      id: "engagement",
      label: "Engagement",
      body: "Family gathered to celebrate the promise between them.",
      image: "https://abanouprefat.github.io/emad-alia/media/story_engagement.png",
    },
    {
      id: "katb-ketab",
      label: "Katb El-Ketab",
      body: "Their marriage contract, written and blessed.",
      image: "https://abanouprefat.github.io/emad-alia/media/story_katb_ketab.jpg",
    },
  ],

  heroVideo: {
    mp4: "https://abanouprefat.github.io/emad-alia/media/couple_hero.mp4",
    webm: "https://abanouprefat.github.io/emad-alia/media/couple_hero.webm",
    poster: "https://abanouprefat.github.io/emad-alia/media/couple_hero_poster.jpg",
  },

  closingMessage: "WE CAN'T WAIT TO CELEBRATE WITH YOU.",
  signature: "With love, Emad & Alia",
};

export const palette = {
  copperRose: "#A86A65",
  dustyRose: "#AB8882",
  rosewater: "#D8A694",
  chinaDoll: "#E0CB89",
  plumWine: "#754B4D",
};
