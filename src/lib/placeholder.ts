const PALETTE = [
  ["#111111", "#3a0a0d"],
  ["#e30613", "#7a0410"],
  ["#1a1a1d", "#e30613"],
  ["#2a2a2e", "#111111"],
  ["#e30613", "#111111"],
  ["#4a4a4f", "#1a1a1d"],
];

export function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function seededGradient(seed: string): [string, string] {
  const h = hashSeed(seed);
  const pair = PALETTE[h % PALETTE.length];
  return [pair[0], pair[1]];
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
