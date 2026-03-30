import { useState } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

export function LetterSection() {
  const [phase, setPhase] = useState("closed"); // closed | opening | open

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1100);
  };

  const download = () => {
    const win = window.open("", "_blank");
    win.document
      .write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Carta — ${CONTENT.name}</title><style>
      body{margin:0;padding:48px 56px;background:#020d1a;color:#e0f2fe;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.9}
      h1{font-size:20px;margin:0 0 8px;color:#7dd3fc;font-family:system-ui,sans-serif;font-weight:700}
      .sub{font-size:13px;color:rgba(125,211,252,.5);margin:0 0 36px;font-family:system-ui,sans-serif}
      pre{white-space:pre-wrap;word-break:break-word;margin:0}
      hr{border:none;border-top:1px solid rgba(125,211,252,.15);margin:32px 0}
    </style></head><body>
      <h1>${CONTENT.letter.title}</h1>
      <p class="sub">${CONTENT.letter.label}</p>
      <hr/>
      <pre>${CONTENT.letter.body}</pre>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 24px 80px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes flapOpen{0%{transform:rotateX(0deg);opacity:1}70%{opacity:1}100%{transform:rotateX(-160deg);opacity:0}}
        @keyframes letterRise{0%{opacity:0;transform:translateY(32px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes sealPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 14,
            alignItems: "center",
          }}
        >
          <Rocket size={18} />
          <span
            style={{
              fontSize: 12,
              color: "rgba(125,211,252,.5)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            {CONTENT.letter.label}
          </span>
          <Rocket size={18} />
        </div>
        <h3
          style={{
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#fff,#bae6fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 8px",
          }}
        >
          {CONTENT.letter.title}
        </h3>
      </div>

      {phase !== "open" ? (
        <div
          onClick={open}
          style={{
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            touchAction: "manipulation",
          }}
        >
          {/* envelope */}
          <div
            style={{
              position: "relative",
              width: "min(320px,88vw)",
              height: 210,
              perspective: 900,
            }}
          >
            {/* body + interior folds (SVG) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(160deg,#0c4a6e,#075985)",
                border: "1.5px solid rgba(125,211,252,.28)",
                borderRadius: 10,
                boxShadow: "0 12px 44px rgba(14,165,233,.25)",
                overflow: "hidden",
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 320 210"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0 }}
              >
                {/* bottom fold */}
                <polygon
                  points="0,210 320,210 160,118"
                  fill="rgba(0,0,0,.18)"
                />
                {/* left fold */}
                <polygon points="0,0 0,210 160,118" fill="rgba(0,0,0,.10)" />
                {/* right fold */}
                <polygon
                  points="320,0 320,210 160,118"
                  fill="rgba(0,0,0,.10)"
                />
                {/* fold lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.18)"
                  strokeWidth="1"
                />
                <line
                  x1="320"
                  y1="0"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.18)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="210"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.13)"
                  strokeWidth="1"
                />
                <line
                  x1="320"
                  y1="210"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.13)"
                  strokeWidth="1"
                />
              </svg>

              {/* center content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  zIndex: 1,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    animation:
                      phase === "closed" ? "sealPulse 2s infinite" : "none",
                  }}
                >
                  💌
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(125,211,252,.6)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {phase === "closed" ? "Toca para abrir 💫" : "✨"}
                </span>
              </div>
            </div>

            {/* top flap — rotates open from top edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "55%",
                clipPath: "polygon(0 0, 100% 0, 50% 82%)",
                background: "linear-gradient(180deg,#0e5fa8,#0c4a6e)",
                border: "1.5px solid rgba(125,211,252,.32)",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                zIndex: 2,
                animation:
                  phase === "opening" ? "flapOpen 1s ease forwards" : "none",
              }}
            />
          </div>

          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              color: "rgba(125,211,252,.45)",
              letterSpacing: ".06em",
            }}
          >
            {phase === "closed" ? "Toca el sobre para abrirlo" : "Abriendo..."}
          </p>
        </div>
      ) : (
        <div style={{ animation: "letterRise .7s ease both" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                background:
                  "linear-gradient(160deg,rgba(7,89,133,.28),rgba(4,26,50,.5))",
                border: "1px solid rgba(125,211,252,.18)",
                borderRadius: 20,
                padding: "44px 36px 36px",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  opacity: 0.18,
                  transform: "rotate(30deg)",
                }}
              >
                <Rocket size={30} />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 20,
                  opacity: 0.18,
                  transform: "rotate(-20deg)",
                }}
              >
                <Rocket size={24} />
              </div>
              <div
                style={{
                  fontFamily: "Georgia,'Times New Roman',serif",
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "rgba(224,242,254,.82)",
                  position: "relative",
                  zIndex: 1,
                  whiteSpace: "pre-line",
                }}
              >
                {CONTENT.letter.body}
              </div>
              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(56,189,248,.15)",
                  }}
                />
                <div style={{ opacity: 0.5 }}>
                  <Rocket size={18} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(56,189,248,.15)",
                  }}
                />
              </div>
            </div>
          </div>
          {/* download button */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={download}
              style={{
                background: "rgba(14,165,233,.15)",
                border: "1px solid rgba(56,189,248,.35)",
                color: "#7dd3fc",
                borderRadius: 100,
                padding: "10px 28px",
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: ".08em",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(14,165,233,.28)";
                e.target.style.borderColor = "rgba(56,189,248,.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(14,165,233,.15)";
                e.target.style.borderColor = "rgba(56,189,248,.35)";
              }}
            >
              📄 Descargar carta
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
