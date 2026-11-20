import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.specialty.title} in ${site.clinic.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (mirrors globals.css; next/og cannot read CSS variables).
const ink = "#14304F";
const paper = "#F7F8FC";
const accent = "#7CC4F0";
const brand = "#1B6BB0";

export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", site.clinic.logo.full));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: ink,
          color: paper,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: accent,
            opacity: 0.35,
            filter: "blur(80px)",
          }}
        />
        <div style={{ display: "flex", alignSelf: "flex-start", background: paper, borderRadius: 28, padding: "22px 32px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> only */}
          <img src={logoSrc} width={437} height={80} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: accent, fontWeight: 700 }}>
            {`${site.specialty.title} · ${site.clinic.city}`}
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2, marginTop: 16 }}>{site.doctor.name}</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#D7E2EE" }}>{site.specialty.tagline}</div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ background: brand, color: paper, borderRadius: 999, padding: "18px 34px", fontSize: 30, fontWeight: 700 }}>
            Book on WhatsApp
          </div>
        </div>
      </div>
    ),
    size,
  );
}
