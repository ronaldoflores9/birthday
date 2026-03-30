import { useState } from "react";
import { CONTENT } from "../config";
import { stars } from "../utils";
import { Rocket } from "./Rocket";

/* ── GIFT INTRO (para cuando ya es el día) ── */
export function GiftIntro({ onDone }) {
  const [phase, setPhase] = useState("idle");
  const start = () => {
    setPhase("shaking");
    setTimeout(() => setPhase("opening"), 900);
    setTimeout(() => setPhase("launching"), 1700);
    setTimeout(() => onDone(), 3100);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(160deg,#020d1a,#041525,#020a12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes shake2{0%,100%{transform:rotate(0)translateX(0)}20%{transform:rotate(-7deg)translateX(-7px)}40%{transform:rotate(7deg)translateX(7px)}60%{transform:rotate(-4deg)translateX(-4px)}80%{transform:rotate(4deg)translateX(4px)}}
        @keyframes lidOff2{0%{transform:translateY(0)rotate(0);opacity:1}60%{transform:translateY(-100px)rotate(-30deg);opacity:1}100%{transform:translateY(-180px)rotate(-50deg);opacity:0}}
        @keyframes rLaunch{0%{transform:translateY(0)scale(1);opacity:1}100%{transform:translateY(-600px)scale(0.3);opacity:0}}
        @keyframes flashW{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
        @keyframes promptP{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes mstar{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(0.2)}}
      `}</style>
      {stars.slice(0, 70).map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#7dd3fc",
            opacity: phase === "launching" ? 0 : 0.4,
            transition: "opacity .5s",
          }}
        />
      ))}
      {phase === "launching" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            animation: "flashW 1.4s ease forwards",
            pointerEvents: "none",
          }}
        />
      )}
      {phase === "launching" &&
        Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 7 + Math.random() * 8,
                height: 7 + Math.random() * 8,
                borderRadius: "50%",
                background: [
                  "#7dd3fc",
                  "#38bdf8",
                  "#a5f3fc",
                  "#fbbf24",
                  "#fff",
                  "#bae6fd",
                ][i % 6],
                "--tx": `${Math.cos(a) * (100 + Math.random() * 140)}px`,
                "--ty": `${Math.sin(a) * (100 + Math.random() * 140)}px`,
                animation: `mstar 1.2s ${i * 0.03}s ease-out forwards`,
              }}
            />
          );
        })}
      <div
        onClick={phase === "idle" ? start : undefined}
        style={{
          cursor: phase === "idle" ? "pointer" : "default",
          position: "relative",
          userSelect: "none",
          touchAction: "manipulation",
        }}
      >
        <div
          style={{
            width: 164,
            height: 46,
            background: "linear-gradient(135deg,#0369a1,#0284c7)",
            borderRadius: "10px 10px 0 0",
            border: "1.5px solid rgba(125,211,252,.4)",
            marginBottom: -2,
            position: "relative",
            animation:
              phase === "shaking"
                ? "shake2 .85s ease"
                : phase === "opening" || phase === "launching"
                  ? "lidOff2 .9s ease forwards"
                  : "none",
            boxShadow: "0 0 28px rgba(125,211,252,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -22,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {[
              [-18, -8, -30],
              [18, -8, 30],
            ].map(([x, y, rot], i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                  transform: `translate(${x}px,${y}px) rotate(${rot}deg)`,
                  border: "1px solid rgba(186,230,253,.5)",
                  position: "absolute",
                }}
              />
            ))}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#7dd3fc",
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>
          <div
            style={{
              width: 14,
              height: "100%",
              background: "rgba(186,230,253,.2)",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            width: 164,
            height: 136,
            background: "linear-gradient(160deg,#0c4a6e,#075985)",
            border: "1.5px solid rgba(125,211,252,.3)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 14,
              height: "100%",
              background: "rgba(186,230,253,.15)",
            }}
          />
          <div
            style={{
              animation:
                phase === "launching" ? "rLaunch 1.3s ease forwards" : "none",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Rocket size={54} glow />
          </div>
        </div>
      </div>
      {phase === "idle" && (
        <p
          style={{
            marginTop: 36,
            fontSize: 13,
            color: "rgba(125,211,252,.7)",
            letterSpacing: ".13em",
            textTransform: "uppercase",
            animation: "promptP 2s infinite",
          }}
        >
          {CONTENT.giftIntro.prompt}
        </p>
      )}
    </div>
  );
}
