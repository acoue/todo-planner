// src/utils/projectColor.js
// Génère une couleur stable à partir du nom du projet (hash déterministe)
// Retourne { bg, bar, text } compatibles avec le reste de l'app

// Palette de teintes bien distinctes, agréables sur fond clair
const PALETTE = [
  { h: 221, s: 82, l: 58 },  // bleu
  { h: 38,  s: 87, l: 54 },  // orange
  { h: 158, s: 68, l: 36 },  // vert
  { h: 340, s: 72, l: 52 },  // rose
  { h: 262, s: 60, l: 55 },  // violet
  { h: 12,  s: 75, l: 50 },  // corail
  { h: 186, s: 65, l: 38 },  // teal
  { h: 84,  s: 55, l: 40 },  // olive
  { h: 196, s: 80, l: 45 },  // cyan
  { h: 24,  s: 90, l: 42 },  // brun
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convertit en int 32 bits
  }
  return Math.abs(hash);
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function projectColor(name) {
  if (!name) {
    return {
      bar:  "hsl(0, 0%, 53%)",
      bg:   "hsl(0, 0%, 96%)",
      text: "hsl(0, 0%, 27%)",
    };
  }

  const idx   = hashString(name.toLowerCase().trim()) % PALETTE.length;
  const { h, s, l } = PALETTE[idx];

  return {
    bar:  hsl(h, s, l),               // couleur principale (barre, dot, icône)
    bg:   hsl(h, Math.round(s * 0.3), 95), // fond très pâle
    text: hsl(h, s, Math.round(l * 0.55)), // texte sombre de la même teinte
  };
}