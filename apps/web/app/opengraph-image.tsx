import { ImageResponse } from "next/og";

export const alt = "Javier Ramos — Developer Showroom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand-colored social card. Plain inline styles (satori) — no external fonts.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0e13",
          color: "#e7edf3",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              background: "#22d3ee",
              color: "#04141a",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            JR
          </div>
          <div style={{ fontSize: "30px", fontWeight: 600 }}>Javier Ramos</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "4px",
              color: "#22d3ee",
            }}
          >
            PRD → IMPLEMENT → VERIFY → SHIP
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: "sans-serif",
              maxWidth: "1000px",
            }}
          >
            The product and the build log.
          </div>
          <div style={{ fontSize: "30px", color: "#8a96a3", fontFamily: "sans-serif" }}>
            A full-stack showroom — shipped with agentic workflows.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "24px", color: "#586472" }}>
          javierramos.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
