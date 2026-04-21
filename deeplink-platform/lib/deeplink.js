/**
 * Parses a web URL and returns the native app deep link URI
 * Supports: YouTube, Spotify, Instagram, TikTok, Twitter/X, Reddit,
 *           Apple Music, SoundCloud, Twitch, LinkedIn, Pinterest
 */
export function resolveDeepLink(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname;

    // ── YouTube ──────────────────────────────────────────────────────────────
    if (host === "youtube.com" || host === "youtu.be") {
      let videoId = u.searchParams.get("v");
      if (!videoId && host === "youtu.be") videoId = path.slice(1);

      if (videoId) {
        return {
          platform: "YouTube",
          appUri: `youtube://watch?v=${videoId}`,
          iosScheme: `youtube://watch?v=${videoId}`,
          androidIntent: `intent://watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`,
          icon: "▶️",
        };
      }

      const channelMatch = path.match(/^\/@?([^/]+)/);
      if (channelMatch) {
        return {
          platform: "YouTube",
          appUri: `youtube://www.youtube.com${path}`,
          iosScheme: `youtube://www.youtube.com${path}`,
          androidIntent: `intent://www.youtube.com${path}#Intent;package=com.google.android.youtube;scheme=https;end`,
          icon: "▶️",
        };
      }
    }

    // ── Spotify ───────────────────────────────────────────────────────────────
    if (host === "open.spotify.com") {
      const parts = path.split("/").filter(Boolean); // ['track','ID'] etc.
      if (parts.length >= 2) {
        const spotifyUri = `spotify:${parts.join(":")}`;
        return {
          platform: "Spotify",
          appUri: spotifyUri,
          iosScheme: spotifyUri,
          androidIntent: `intent://open.spotify.com${path}#Intent;package=com.spotify.music;scheme=https;end`,
          icon: "🎵",
        };
      }
    }

    // ── Instagram ─────────────────────────────────────────────────────────────
    if (host === "instagram.com") {
      return {
        platform: "Instagram",
        appUri: `instagram://instagram.com${path}`,
        iosScheme: `instagram://instagram.com${path}`,
        androidIntent: `intent://instagram.com${path}#Intent;package=com.instagram.android;scheme=https;end`,
        icon: "📸",
      };
    }

    // ── TikTok ────────────────────────────────────────────────────────────────
    if (host === "tiktok.com" || host === "vm.tiktok.com") {
      const videoMatch = path.match(/\/video\/(\d+)/);
      if (videoMatch) {
        return {
          platform: "TikTok",
          appUri: `snssdk1233://aweme/detail/${videoMatch[1]}`,
          iosScheme: `snssdk1233://aweme/detail/${videoMatch[1]}`,
          androidIntent: `intent://aweme/detail/${videoMatch[1]}#Intent;package=com.zhiliaoapp.musically;scheme=snssdk1233;end`,
          icon: "🎵",
        };
      }
      return {
        platform: "TikTok",
        appUri: `snssdk1233://user`,
        iosScheme: `snssdk1233://user`,
        androidIntent: `intent://tiktok.com${path}#Intent;package=com.zhiliaoapp.musically;scheme=https;end`,
        icon: "🎵",
      };
    }

    // ── Twitter / X ───────────────────────────────────────────────────────────
    if (host === "twitter.com" || host === "x.com") {
      const tweetMatch = path.match(/\/status\/(\d+)/);
      if (tweetMatch) {
        return {
          platform: "X (Twitter)",
          appUri: `twitter://status?id=${tweetMatch[1]}`,
          iosScheme: `twitter://status?id=${tweetMatch[1]}`,
          androidIntent: `intent://status?id=${tweetMatch[1]}#Intent;package=com.twitter.android;scheme=twitter;end`,
          icon: "𝕏",
        };
      }
      const userMatch = path.match(/^\/([^/]+)$/);
      if (userMatch) {
        return {
          platform: "X (Twitter)",
          appUri: `twitter://user?screen_name=${userMatch[1]}`,
          iosScheme: `twitter://user?screen_name=${userMatch[1]}`,
          androidIntent: `intent://user?screen_name=${userMatch[1]}#Intent;package=com.twitter.android;scheme=twitter;end`,
          icon: "𝕏",
        };
      }
    }

    // ── Reddit ────────────────────────────────────────────────────────────────
    if (host === "reddit.com" || host === "redd.it") {
      return {
        platform: "Reddit",
        appUri: `reddit://reddit.com${path}`,
        iosScheme: `reddit://reddit.com${path}`,
        androidIntent: `intent://reddit.com${path}#Intent;package=com.reddit.frontpage;scheme=https;end`,
        icon: "🤖",
      };
    }

    // ── Apple Music ───────────────────────────────────────────────────────────
    if (host === "music.apple.com") {
      return {
        platform: "Apple Music",
        appUri: `music://music.apple.com${path}`,
        iosScheme: `music://music.apple.com${path}`,
        androidIntent: url, // No Android app
        icon: "🎶",
      };
    }

    // ── SoundCloud ────────────────────────────────────────────────────────────
    if (host === "soundcloud.com") {
      return {
        platform: "SoundCloud",
        appUri: `soundcloud://soundcloud.com${path}`,
        iosScheme: `soundcloud://soundcloud.com${path}`,
        androidIntent: `intent://soundcloud.com${path}#Intent;package=com.soundcloud.android;scheme=https;end`,
        icon: "🔊",
      };
    }

    // ── Twitch ────────────────────────────────────────────────────────────────
    if (host === "twitch.tv") {
      const channel = path.split("/").filter(Boolean)[0];
      if (channel) {
        return {
          platform: "Twitch",
          appUri: `twitch://stream/${channel}`,
          iosScheme: `twitch://stream/${channel}`,
          androidIntent: `intent://stream/${channel}#Intent;package=tv.twitch.android.app;scheme=twitch;end`,
          icon: "🎮",
        };
      }
    }

    // ── LinkedIn ──────────────────────────────────────────────────────────────
    if (host === "linkedin.com") {
      return {
        platform: "LinkedIn",
        appUri: `linkedin://linkedin.com${path}`,
        iosScheme: `linkedin://linkedin.com${path}`,
        androidIntent: `intent://linkedin.com${path}#Intent;package=com.linkedin.android;scheme=https;end`,
        icon: "💼",
      };
    }

    // ── Pinterest ─────────────────────────────────────────────────────────────
    if (host === "pinterest.com" || host === "pin.it") {
      return {
        platform: "Pinterest",
        appUri: `pinterest://pinterest.com${path}`,
        iosScheme: `pinterest://pinterest.com${path}`,
        androidIntent: `intent://pinterest.com${path}#Intent;package=com.pinterest;scheme=https;end`,
        icon: "📌",
      };
    }

    // ── Generic fallback ─────────────────────────────────────────────────────
    return {
      platform: "Web",
      appUri: url,
      iosScheme: url,
      androidIntent: url,
      icon: "🔗",
    };
  } catch {
    return null;
  }
}

export function generateSlug(length = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
