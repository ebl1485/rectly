import { resolveDeepLink, generateSlug } from "../../lib/deeplink";
import { saveLink, getLink } from "../../lib/store";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "Ungültige URL. Bitte https:// nicht vergessen." });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: "Nur http/https URLs werden unterstützt." });
  }

  const deepLinkInfo = resolveDeepLink(url);
  if (!deepLinkInfo) {
    return res.status(400).json({ error: "Diese URL konnte nicht verarbeitet werden." });
  }

  // Generate unique slug
  let slug;
  let attempts = 0;
  do {
    slug = generateSlug(7);
    attempts++;
    if (attempts > 10) break;
  } while (await getLink(slug));

  await saveLink(slug, {
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
