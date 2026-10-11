import { ImageResponse } from "next/og";
import { BRAND } from "@/config/site";

export const alt = `${BRAND.name}: follow up every enquiry`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b1026", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#2dd4a0,#0f9d75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✉</div>
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
            {BRAND.prefix}
            <span style={{ color: "#2dd4a0", marginLeft: 10 }}>{BRAND.accent.trim()}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Rescue every enquiry before it goes cold.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#9aa3c0" }}>AI-drafted replies in English and Hindi. Follow-up reminders. From ₹499/month.</div>
        </div>
      </div>
    ),
    size,
  );
}
