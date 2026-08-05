import type { Category } from "./types";

const unsplash = (id: string, width = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

/** Verified working Unsplash images — all URLs return 200 */
export const FALLBACK_IMAGE = unsplash("photo-1616486338812-3dadae4b4ace");

export const AVATAR_IMAGE = unsplash("photo-1472099645785-5658abf4ff4e", 200);

export const CATEGORY_IMAGES: Record<Category, string[]> = {
  Baby: [
    unsplash("photo-1515488042361-ee00e0ddd4e4"),
    unsplash("photo-1522771739844-6a9f6d5f14af"),
    unsplash("photo-1596462502278-27bfdc403348"),
    unsplash("photo-1556911220-e15b29be8c8f"),
    unsplash("photo-1560448204-e02f11c3d0e2"),
  ],
  Home: [
    unsplash("photo-1616486338812-3dadae4b4ace"),
    unsplash("photo-1586023492125-27b2c045efd7"),
    unsplash("photo-1560448204-e02f11c3d0e2"),
    unsplash("photo-1522771739844-6a9f6d5f14af"),
    unsplash("photo-1497366216548-37526070297c"),
  ],
  Kitchen: [
    unsplash("photo-1556911220-e15b29be8c8f"),
    unsplash("photo-1556912173-46c336c7fd55"),
    unsplash("photo-1565538810643-b5bdb714032a"),
    unsplash("photo-1596755389378-c31d21fd1273"),
    unsplash("photo-1616486338812-3dadae4b4ace"),
  ],
  Beauty: [
    unsplash("photo-1596462502278-27bfdc403348"),
    unsplash("photo-1522335789203-aabd1fc54bc9"),
    unsplash("photo-1596755389378-c31d21fd1273"),
    unsplash("photo-1534528741775-53994a69daeb"),
    unsplash("photo-1507003211169-0a1dd7228f2d"),
  ],
  Pet: [
    unsplash("photo-1450778869180-41d0601e046e"),
    unsplash("photo-1587300003388-59208cc962cb"),
    unsplash("photo-1530281700549-e82e7bf110d6"),
    unsplash("photo-1515488042361-ee00e0ddd4e4"),
    unsplash("photo-1565538810643-b5bdb714032a"),
  ],
  Fitness: [
    unsplash("photo-1576678927484-cc907957088c"),
    unsplash("photo-1517836357463-d25dfeac3438"),
    unsplash("photo-1534438327276-14e5300c3a48"),
    unsplash("photo-1505751172876-fa1923c5c528"),
    unsplash("photo-1576091160399-112ba8d25d1d"),
  ],
  Electronics: [
    unsplash("photo-1498049794561-7780e7231661"),
    unsplash("photo-1527864550417-7fd91fc51a46"),
    unsplash("photo-1488646953014-85cb44e25828"),
    unsplash("photo-1497366811353-6870744d04b2"),
    unsplash("photo-1524758631624-e2822e304c36"),
  ],
  Travel: [
    unsplash("photo-1488646953014-85cb44e25828"),
    unsplash("photo-1436491865332-7a61a109cc05"),
    unsplash("photo-1522771739844-6a9f6d5f14af"),
    unsplash("photo-1560448204-e02f11c3d0e2"),
    unsplash("photo-1497366216548-37526070297c"),
  ],
  Office: [
    unsplash("photo-1497366216548-37526070297c"),
    unsplash("photo-1497366811353-6870744d04b2"),
    unsplash("photo-1524758631624-e2822e304c36"),
    unsplash("photo-1498049794561-7780e7231661"),
    unsplash("photo-1586023492125-27b2c045efd7"),
  ],
  Health: [
    unsplash("photo-1576091160399-112ba8d25d1d"),
    unsplash("photo-1505751172876-fa1923c5c528"),
    unsplash("photo-1576678927484-cc907957088c"),
    unsplash("photo-1534438327276-14e5300c3a48"),
    unsplash("photo-1517836357463-d25dfeac3438"),
  ],
};

function hashIndex(input: string | number, length: number): number {
  if (typeof input === "number") return Math.abs(input) % length;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash + input.charCodeAt(i) * (i + 1)) % 10000;
  }
  return hash % length;
}

export function getCategoryImage(category: Category | string, seed: string | number): string {
  const pool = CATEGORY_IMAGES[category as Category] ?? CATEGORY_IMAGES.Home;
  return pool[hashIndex(seed, pool.length)] ?? FALLBACK_IMAGE;
}

export function resolveImageUrl(url: string | undefined | null, category?: Category | string, seed?: string | number): string {
  if (url && url.startsWith("https://")) return url;
  if (category && seed !== undefined) return getCategoryImage(category, seed);
  return FALLBACK_IMAGE;
}
