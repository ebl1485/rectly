import { getLink } from "../lib/store";

export default function RedirectPage({ link }) {
  if (!link) {
    return (
      <div style={{
        fontFamily: "monospace",
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
        <div style={{ color: "#666" }}>This link does not exist or has expired.</div>
        <a href="/" style={{ color: "#4ade80", textDecoration: "none" }}>← Create a new link</a>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Opening {link.platform}…</title>
        <meta httpEquiv="refresh" content={`0;url=${link.originalUrl}`} />
        {/* iOS Smart App Banner */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0, background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div id="__redirect_page__" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 24,
          textAlign: "center",
          gap: 16,
        }}>
          <div style={{ fontSize: 56 }}>{link.icon}</div>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Opening {link.platform}…</h2>
          <p style={{ color: "#888", margin: 0, fontSize: 14 }}>
            We're redirecting you to the app.
          </p>
          <p style={{ color: "#555", margin: 0, fontSize: 12 }}>
            If nothing happens,{" "}
            <a href={link.originalUrl} style={{ color: "#4ade80" }}>click here to open in browser</a>.
          </p>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var isAndroid = /android/i.test(navigator.userAgent);
            var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
            var appUri = ${JSON.stringify(link.appUri)};
            var iosScheme = ${JSON.stringify(link.iosScheme)};
            var androidIntent = ${JSON.stringify(link.androidIntent)};
            var fallback = ${JSON.stringify(link.originalUrl)};

            // Try to open app
            var appLink = isAndroid ? androidIntent : (isIOS ? iosScheme : appUri);

            // Set a timer: if app doesn't open in 2s, fall back to browser
            var fallbackTimer = setTimeout(function() {
              window.location.href = fallback;
            }, 2000);

            // Try opening app link
            window.location.href = appLink;

            // If user comes back (app opened), clear the timer
            window.addEventListener('blur', function() {
              clearTimeout(fallbackTimer);
            });
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) clearTimeout(fallbackTimer);
            });
          })();
        ` }} />
      </body>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const link = getLink(slug);

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

