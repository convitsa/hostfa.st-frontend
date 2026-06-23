import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "hostfa.st - Framer site hosting";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Fetch Geist font from Google Fonts, falling back to Inter if unreachable
  let fontData: ArrayBuffer;
  try {
    const res = await fetch("https://fonts.gstatic.com/s/geist/v1/Geist-Bold.ttf");
    if (!res.ok) {
      throw new Error("Geist font response not OK");
    }
    fontData = await res.arrayBuffer();
  } catch (e) {
    console.warn("Could not load Geist font, falling back to Inter:", e);
    fontData = await fetch(
      "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp5GP3JTkwlF.woff"
    ).then((r) => r.arrayBuffer());
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist, Inter, sans-serif",
        }}
      >
        <div
          style={{
            color: "#EDEDED",
            fontSize: "72px",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            marginBottom: "16px",
          }}
        >
          hostfa.st
        </div>
        <div
          style={{
            color: "#888888",
            fontSize: "24px",
            fontWeight: "normal",
          }}
        >
          Host your Framer site for $3/month
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
