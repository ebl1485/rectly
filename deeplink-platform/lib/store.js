import { kv } from "@vercel/kv";

export async function saveLink(slug, data) {
  // Store for 1 year (in seconds)
  await kv.set(`link:${slug}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 365 });
}

export async function getLink(slug) {
  const raw = await kv.get(`link:${slug}`);
  if (!raw) return null;
  // Vercel KV auto-parses JSON
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}
