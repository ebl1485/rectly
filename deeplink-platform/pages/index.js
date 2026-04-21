import { useState } from "react";
import Head from "next/head";

const PLATFORMS = [
  { name: "YouTube", icon: "▶️", example: "youtube.com/watch?v=..." },
  { name: "Spotify", icon: "🎵", example: "open.spotify.com/track/..." },
  { name: "Instagram", icon: "📸", example: "instagram.com/p/..." },
  { name: "TikTok", icon: "🎵", example: "tiktok.com/@user/video/..." },
  { name: "X", icon: "𝕏", example: "x.com/user/status/..." },
  { name: "Twitch", icon: "🎮", example: "twitch.tv/channel" },
  { name: "Reddit", icon: "🤖", example: "reddit.com/r/..." },
  { name: "LinkedIn", icon: "💼", example: "linkedin.com/in/..." },
  { name: "SoundCloud", icon: "🔊", example: "soundcloud.com/..." },
  { name: "Pinterest", icon: "📌", example: "pinterest.com/..." },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    let input = url.trim();
    if (!input) return;
    if (!input.startsWith("http")) input = "https://" + input;

    setLoading(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Head>
        <title>rectly — Open links in the right app</title>
        <meta name="description" content="Convert any social media link into a deep link that opens directly in the native app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0c0c0e;
          --surface: #131316;
          --border: rgba(255,255,255,0.07);
          --text: #f0f0f0;
          --muted: #666;
          --accent: #4ade80;
          --accent-dim: rgba(74,222,128,0.12);
          --radius: 12px;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .grain {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        main {
          position: relative; z-index: 1;
          max-width: 640px;
          margin: 0 auto;
          padding: 80px 24px 40px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        header { text-align: center; }

        .logo-dot {
          display: inline-block;
          width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 50%;
          margin-right: 8px;
          box-shadow: 0 0 12px var(--accent);
        }

        h1 {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .subtitle {
          color: var(--muted);
          font-size: 15px;
          font-weight: 300;
          line-height: 1.6;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        input[type="text"] {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        input[type="text"]::placeholder { color: var(--muted); }
        input[type="text"]:focus { border-color: rgba(74,222,128,0.4); }

        button {
          cursor: pointer;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
        }

        .btn-primary {
          background: var(--accent);
          color: #0a0a0a;
          padding: 12px 20px;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #6ee7a0; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .error-msg {
          color: #f87171;
          font-size: 13px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .result-box {
          background: var(--accent-dim);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: var(--radius);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .result-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 500;
        }

        .result-link-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .result-link {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: var(--text);
          flex: 1;
          word-break: break-all;
        }

        .btn-copy {
          background: rgba(74,222,128,0.15);
          color: var(--accent);
          border: 1px solid rgba(74,222,128,0.25);
          padding: 8px 14px;
          font-size: 13px;
          flex-shrink: 0;
        }
        .btn-copy:hover { background: rgba(74,222,128,0.25); }

        .platform-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
        }

        .platforms-section { display: flex; flex-direction: column; gap: 16px; }
        .platforms-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }
        .platform-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        footer {
          text-align: center;
          padding: 24px;
          color: var(--muted);
          font-size: 12px;
          position: relative; z-index: 1;
        }
      `}</style>

      <div className="grain" aria-hidden="true" />

      <main>
        <header>
          <h1>
            <span className="logo-dot" />
            rectly
          </h1>
          <p className="subtitle">
            Paste any link. Get a short URL that opens<br />
            directly in the native app — not the in-app browser.
          </p>
        </header>

        <div className="card">
          <div className="input-row">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="https://youtube.com/watch?v=..."
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading || !url.trim()}
            >
              {loading ? "…" : "Generate"}
            </button>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          {result && (
            <div className="result-box">
              <div className="result-label">Your deep link is ready</div>
              <div className="result-link-row">
                <span className="result-link">{result.shortLink}</span>
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="platform-badge">
                {result.icon} Detected: {result.platform}
              </div>
            </div>
          )}
        </div>

        <div className="platforms-section">
          <div className="platforms-label">Supported platforms</div>
          <div className="platforms-grid">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="platform-item">
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        Built with Next.js · Links may expire on server restart
      </footer>
    </>
  );
}
