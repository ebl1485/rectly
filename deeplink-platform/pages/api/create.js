import { resolveDeepLink, generateSlug } from "../../lib/deeplink";
import { saveLink, getLink } from "../../lib/store";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  // Basic URL validation
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL. Please include https://" });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: "Only http/https URLs are supported" });
  }

  const deepLinkInfo = resolveDeepLink(url);
  if (!deepLinkInfo) {
    return res.status(400).json({ error: "Could not process this URL" });
  }

  // Generate unique slug
  let slug;
  do {
    slug = generateSlug(7);
  } while (getLink(slug));

  saveLink(slug, {
    originalUrl: url,
    ...deepLinkInfo,
  });

  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";
  const shortLink = `${protocol}://${host}/${slug}`;

  return res.status(200).json({
    slug,
    shortLink,
    platform: deepLinkInfo.platform,
    icon: deepLinkInfo.icon,
  });
}
