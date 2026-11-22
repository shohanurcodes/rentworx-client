"use client";

/* Inline styles: a global error can occur before the stylesheet is available. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ fontSize: 48, fontWeight: 800, margin: 0 }}>500</p>
          <h1 style={{ fontSize: 24, margin: "12px 0 8px" }}>
            RentWorx hit an unexpected error
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
            Please try again. If the problem continues, return to the home page.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#0f172a",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "#fff",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                padding: "10px 18px",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Back home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
