import { CONTENT } from "./config";

export const rand = (a, b) => Math.random() * (b - a) + a;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const CONFETTI_COLORS = [
  "#7dd3fc",
  "#fbbf24",
  "#a5f3fc",
  "#f472b6",
  "#34d399",
  "#fb923c",
  "#fff",
  "#38bdf8",
];
export const confettiPieces = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: rand(0, 100),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: rand(7, 14),
  dur: rand(2.8, 5.5),
  delay: rand(0, 3.5),
  rot: rand(0, 360),
  drift: rand(-80, 80),
  isCircle: i % 3 === 0,
}));

// Fotos flotantes para la pantalla de countdown
export const PHOTO_SLOTS = [
  { top: "5%", left: "2%", rot: -12, dur: 6, delay: 0 },
  { top: "4%", right: "2%", rot: 10, dur: 7, delay: 1.5 },
  { top: "38%", left: "1%", rot: -8, dur: 8, delay: 0.8 },
  { top: "36%", right: "0%", rot: 7, dur: 6.5, delay: 2 },
  { bottom: "12%", left: "1%", rot: 14, dur: 7.5, delay: 0.3 },
  { bottom: "10%", right: "1%", rot: -10, dur: 9, delay: 1 },
];
const _shuffled = [...CONTENT.photos.images].sort(() => Math.random() - 0.5);
export const FLOATING_PHOTOS = PHOTO_SLOTS.map((slot, i) => ({
  ...slot,
  src: _shuffled[i % _shuffled.length],
}));

export const stars = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  x: rand(0, 100),
  y: rand(0, 100),
  size: rand(0.4, 2.2),
  delay: rand(0, 6),
  dur: rand(2, 5),
}));
export const BG_ROCKETS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: rand(2, 95),
  y: rand(5, 92),
  size: rand(22, 52),
  angle: rand(-35, 35),
  dur: rand(12, 24),
  delay: rand(0, 10),
}));
