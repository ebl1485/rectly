/**
 * Simple in-memory link store.
 * On Vercel free tier, this resets on cold start.
 * For production: swap with Vercel KV, Upstash Redis, or PlanetScale.
 */

const store = global._linkStore || (global._linkStore = new Map());

export function saveLink(slug, data) {
  store.set(slug, { ...data, createdAt: Date.now() });
}

export function getLink(slug) {
  return store.get(slug) || null;
}

export function getAllLinks() {
  return Array.from(store.entries()).map(([slug, data]) => ({ slug, ...data }));
}
