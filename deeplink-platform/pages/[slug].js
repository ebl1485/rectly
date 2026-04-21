import { getLink } from "../lib/store";

export default function RedirectPage({ link }) {
  if (!link) {
    return (
      <div style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>404</div>
        <div style={{ color: "#666" }}>Dieser Link existiert nicht oder ist abgelaufen.</div>
        <a href="/" style={{ color: "#4ade80", textDecoration: "none" }}>← Neuen Link erstellen</a>
      </div>
    );
  }

  const redirectScript = `
    (function() {
      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = /android/.test(ua);
      var isIOS = /iphone|ipad|ipod/.test(ua);
      var isFB = /fban|fbav|instagram|snapchat|twitter|tiktok/.test(ua);

      var appUri    = ${JSON.stringify(link.appUri)};
      var iosScheme = ${JSON.stringify(link.iosScheme)};
      var androidIntent = ${JSON.stringify(link.androidIntent)};
      var fallback  = ${JSON.stringify(link.originalUrl)};

      function openFallback() {
        // On iOS, try to force out of in-app browser using a universal link trick
        if (isIOS && isFB) {
          // Safari-handoff: open in safari via itms-style workaround
          window.location.href = fallback;
        } else {
          window.location.href = fallback;
        }
      }

      function tryOpen() {
        var target;
        if (isAndroid) {
          target = androidIntent;
        } else if (isIOS) {
          target = iosScheme;
        } else {
          // Desktop: just go to original URL
          window.location.href = fallback;
          return;
        }

        // Set fallback timer BEFORE trying to open app
        var timer = setTimeout(openFallback, 2500);

        // Cancel fallback if page becomes hidden (app opened successfully)
        function onHide() {
          clearTimeout(timer);
        }
        document.addEventListener("visibilitychange", function() {
          if (document.visibilityState === "hidden") onHide();
        });
        window.addEventListener("pagehide", onHide);
        window.addEventListener("blur", onHide);

        // Try opening app
        try {
          window.location.href = target;
        } catch(e) {
          openFallback();
        }
      }

      // Small delay so page renders first
      setTimeout(tryOpen, 300);
    })();
  `;

  return (
    <>
      <head>
        <title>Öffne {link.platform}…</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            width: 36px; height: 36px;
            border: 2px solid rgba(74,222,128,0.2);
            border-top-color: #4ade80;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: none; }
          }
          .wrap {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            min-height: 100vh; gap: 20px; padding: 24px;
            text-align: center;
            animation: fadeIn 0.4s ease;
          }
          .icon { font-size: 52px; }
          h2 { margin: 0; font-weight: 500; font-size: 22px; }
          .sub { color: #666; font-size: 14px; margin: 0; line-height: 1.6; }
          .manual { margin-top: 8px; }
          .manual a { color: #4ade80; font-size: 13px; }
        `}</style>

        <div className="wrap">
          <div className="icon">{link.icon}</div>
          <div className="spinner" />
          <h2>Öffne {link.platform}…</h2>
          <p className="sub">
            Die App wird gestartet.<br />
            Bitte bestätige den Dialog auf deinem Gerät.
          </p>
          <p className="manual">
            <a href={link.originalUrl}>Nichts passiert? Hier tippen →</a>
          </p>
        </div>

        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </body>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const link = await getLink(slug);

  if (!link) {
    return { props: { link: null } };
  }

  return {
    props: {
      link: {
        originalUrl: link.originalUrl,
        platform: link.platform,
        icon: link.icon,
        appUri: link.appUri,
        iosScheme: link.iosScheme,
        androidIntent: link.androidIntent,
      },
    },
  };
}
