import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          color: "white",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700 }}>
          Rate My Professor
        </div>
        <div style={{ fontSize: 28, color: "#F5A623", marginTop: 20 }}>
          Anonymous voting on USM CS professors
        </div>
      </div>
    ),
    { ...size }
  );
}