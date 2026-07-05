import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logo = await readFile(join(process.cwd(), "public", "white.png"));
  const logoData = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(120% 120% at 0% 0%, #10203f 0%, #05060a 55%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={logoData}
          width={320}
          height={90}
          style={{
            objectFit: "contain",
            marginBottom: 50,
          }}
        />

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -3,
            maxWidth: 900,
          }}
        >
          We design & build digital products that win.
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "#99a2b3",
          }}
        >
          The Digital Agency · Web · Mobile · AI
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #4D86F7, #8B5CF6)",
          }}
        />
      </div>
    ),
    size
  );
}