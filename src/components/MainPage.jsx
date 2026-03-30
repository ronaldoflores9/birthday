import { useState } from "react";
import { CONTENT } from "../config";
import { BG_ROCKETS } from "../utils";
import { Rocket, Planet } from "./Rocket";
import { StarField, StarCursor, Confetti } from "./StarField";
import { GiftIntro } from "./GiftIntro";
import { BirthdayCakeSection } from "./BirthdayCake";
import { MessagesGalaxy } from "./MessagesGalaxy";
import { PhotoTimeline } from "./PhotoTimeline";
import { LetterSection } from "./LetterSection";
import { PhotoBoothSection } from "./PhotoBooth";
import { CertificadoSection } from "./Certificado";
import { CoheteSection } from "./CoheteSection";

/* ── MAIN PAGE ── */
export function MainPage() {
  const [giftDone, setGiftDone] = useState(false);
  return (
    <>
      {!giftDone && <GiftIntro onDone={() => setGiftDone(true)} />}
      <StarCursor />
      {giftDone && <Confetti />}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#020d1a 0%,#041a2e 45%,#020f1c 100%)",
          color: "#e0f2fe",
          fontFamily: "var(--font-sans,system-ui,sans-serif)",
          position: "relative",
          overflow: "hidden",
          animation: giftDone ? "pageReveal .9s ease both" : "none",
          opacity: giftDone ? 1 : 0,
        }}
      >
        <style>{`
          @keyframes pageReveal{from{opacity:0}to{opacity:1}}
          @keyframes bgR{0%,100%{transform:translateY(0) rotate(var(--a,0deg))}50%{transform:translateY(-14px) rotate(var(--a,0deg))}}
          @keyframes msgFloat{0%{transform:translateY(0);opacity:0}8%{opacity:1}85%{opacity:.85}100%{transform:translateY(-420px);opacity:0}}
          *{box-sizing:border-box} ::-webkit-scrollbar{display:none}
        `}</style>
        <StarField />
        {BG_ROCKETS.map((r) => (
          <div
            key={r.id}
            style={{
              position: "fixed",
              left: `${r.x}%`,
              top: `${r.y}%`,
              opacity: 0.1,
              pointerEvents: "none",
              zIndex: 0,
              "--a": `${r.angle}deg`,
              animation: `bgR ${r.dur}s ${r.delay}s infinite ease-in-out`,
              transform: `rotate(${r.angle}deg)`,
            }}
          >
            <Rocket size={r.size} />
          </div>
        ))}
        {[
          { c: "#0369a1", t: -160, l: -120, w: 500 },
          { c: "#0891b2", t: 300, r: -100, w: 400 },
          { c: "#0284c7", b: 80, l: "28%", w: 360 },
        ].map((o, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              borderRadius: "50%",
              filter: "blur(70px)",
              width: o.w,
              height: o.w,
              background: `radial-gradient(${o.c},transparent)`,
              opacity: 0.14,
              top: o.t,
              left: o.l,
              right: o.r,
              bottom: o.b,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        <section
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "90px 24px 70px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "7%",
              opacity: 0.5,
              animation: "pulse 6s 1s infinite",
            }}
          >
            <Planet r={26} c1="#0c4a6e" c2="#0ea5e9" />
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: "5%",
              opacity: 0.45,
              animation: "pulse 8s 2s infinite",
            }}
          >
            <Planet r={38} c1="#065f46" c2="#06b6d4" ring />
          </div>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 44,
            }}
          >
            <div
              style={{
                width: 118,
                height: 118,
                borderRadius: "50%",
                margin: "0 auto",
                background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#38bdf8)",
                boxShadow:
                  "0 0 60px rgba(14,165,233,.55),0 0 120px rgba(6,182,212,.18)",
                animation: "pulse 3.5s infinite",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(125,211,252,.2)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -16,
                marginLeft: -16,
                width: 32,
                height: 32,
                animation: "orbit 4s linear infinite",
              }}
            >
              <div style={{ transform: "rotate(45deg)" }}>
                <Rocket size={28} />
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(14,165,233,.12)",
                border: "1px solid rgba(56,189,248,.28)",
                borderRadius: 100,
                padding: "6px 22px",
                fontSize: 12,
                color: "rgba(125,211,252,.9)",
                letterSpacing: ".13em",
                textTransform: "uppercase",
                marginBottom: 28,
              }}
            >
              {CONTENT.main.badge}
            </div>
            <h1
              style={{
                fontSize: "clamp(48px,10vw,94px)",
                fontWeight: 800,
                margin: "0 0 10px",
                lineHeight: 1.05,
                background:
                  "linear-gradient(135deg,#fff 20%,#7dd3fc 55%,#38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-.03em",
              }}
            >
              {CONTENT.main.title.split("\n").map((l, i) => (
                <span key={i}>
                  {l}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <h2
              style={{
                fontSize: "clamp(18px,5.5vw,50px)",
                fontWeight: 700,
                margin: "0 0 20px",
                background: "linear-gradient(135deg,#38bdf8,#a5f3fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {CONTENT.name}
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(186,230,253,.5)",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              {CONTENT.main.subtitle}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginTop: 52,
              alignItems: "flex-end",
            }}
          >
            {[
              { s: 32, d: "0s" },
              { s: 50, d: ".3s" },
              { s: 60, d: ".5s" },
              { s: 50, d: ".7s" },
              { s: 32, d: "1s" },
            ].map((r, i) => (
              <div key={i} style={{ animation: `pulse 2.5s ${r.d} infinite` }}>
                <Rocket size={r.s} />
              </div>
            ))}
          </div>
        </section>

        <BirthdayCakeSection />
        <CoheteSection />
        <MessagesGalaxy />
        <PhotoTimeline />
        <LetterSection />
        <PhotoBoothSection />
        <CertificadoSection />

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "36px 24px calc(60px + env(safe-area-inset-bottom))",
            borderTop: "1px solid rgba(56,189,248,.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginBottom: 18,
              alignItems: "flex-end",
            }}
          >
            {[24, 18, 32, 18, 24].map((s, i) => (
              <div
                key={i}
                style={{
                  opacity: 0.5 + (i === 2 ? 0.3 : 0),
                  animation: `pulse ${2 + i * 0.4}s ${i * 0.2}s infinite`,
                }}
              >
                <Rocket size={s} />
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: "clamp(16px,3.5vw,26px)",
              fontWeight: 700,
              background: "linear-gradient(135deg,#7dd3fc,#38bdf8,#a5f3fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 10px",
            }}
          >
            {CONTENT.footer.message}
          </p>
          <p
            style={{
              color: "rgba(125,211,252,.25)",
              fontSize: 12,
              letterSpacing: ".08em",
            }}
          >
            {CONTENT.footer.sub} · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}
