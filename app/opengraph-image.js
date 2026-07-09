import { ImageResponse } from "next/og";

// Site-wide social preview card. Next applies this to every route's og:image
// and twitter:image automatically (unless a route defines its own).
export const runtime = "edge";
export const alt = "My Portfolio — Creative Work & Projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #4338ca 60%, #6d28d9 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "white",
              color: "#4338ca",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            ✦
          </div>
          <div style={{ fontSize: "30px", fontWeight: 600, opacity: 0.9 }}>
            My Portfolio
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05 }}>
            Creative Work
            <br />& Projects
          </div>
          <div style={{ fontSize: "32px", opacity: 0.75, maxWidth: "820px" }}>
            A curated portfolio of video, graphic, and web projects.
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Video", "Graphic", "Web"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 28px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontSize: "26px",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
