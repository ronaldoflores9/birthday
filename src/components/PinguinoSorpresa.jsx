import { useState } from "react";
import { Rocket } from "./Rocket";

/* ── ÚLTIMA SORPRESA: APADRINAMIENTO PINGÜINO ── */
export function PinguinoSorpresa() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "60px 24px 80px",
        maxWidth: 780,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes pinguinoBounce {
          0%,100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes revealCard {
          from { opacity:0; transform: translateY(30px) scale(.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 30px rgba(125,211,252,.18), 0 0 80px rgba(6,182,212,.08); }
          50%     { box-shadow: 0 0 60px rgba(125,211,252,.35), 0 0 120px rgba(6,182,212,.18); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .sorpresa-btn:hover {
          transform: scale(1.06) !important;
          box-shadow: 0 0 40px rgba(125,211,252,.45) !important;
        }
        .sorpresa-btn:active {
          transform: scale(.97) !important;
        }
      `}</style>

      {/* Badge */}
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
          Última sorpresa
        </span>
        <Rocket size={18} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "clamp(22px,4vw,36px)",
          fontWeight: 700,
          background: "linear-gradient(135deg,#fff,#7dd3fc,#38bdf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 16px",
        }}
      >
        Pero espera… hay algo más 🐧
      </h3>

      <p
        style={{
          fontSize: "clamp(15px,2.5vw,18px)",
          color: "rgba(186,230,253,.65)",
          maxWidth: 520,
          margin: "0 auto 36px",
          lineHeight: 1.75,
        }}
      >
        Este regalo llegó desde el fin del mundo. Literalmente.
      </p>

      {/* Bouncing penguin + reveal button */}
      {!revealed && (
        <div>
          <div
            style={{
              fontSize: "clamp(64px,12vw,96px)",
              marginBottom: 28,
              animation: "pinguinoBounce 2s ease-in-out infinite",
              display: "inline-block",
              cursor: "pointer",
              filter: "drop-shadow(0 0 18px rgba(125,211,252,.4))",
            }}
            onClick={() => setRevealed(true)}
          >
            🐧
          </div>
          <br />
          <button
            className="sorpresa-btn"
            onClick={() => setRevealed(true)}
            style={{
              background:
                "linear-gradient(135deg,rgba(14,165,233,.25),rgba(6,182,212,.12))",
              border: "1px solid rgba(125,211,252,.4)",
              color: "#7dd3fc",
              borderRadius: 100,
              padding: "14px 38px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: ".06em",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "transform .2s, box-shadow .2s",
            }}
          >
            ✨ Descubre tu última sorpresa
          </button>
        </div>
      )}

      {/* Reveal */}
      {revealed && (
        <div style={{ animation: "revealCard .7s cubic-bezier(.22,1,.36,1) both" }}>
          {/* Penguin emoji big */}
          <div
            style={{
              fontSize: "clamp(52px,10vw,80px)",
              marginBottom: 20,
              filter: "drop-shadow(0 0 18px rgba(125,211,252,.5))",
            }}
          >
            🐧
          </div>

          <p
            style={{
              fontSize: "clamp(16px,2.8vw,20px)",
              color: "rgba(186,230,253,.85)",
              maxWidth: 560,
              margin: "0 auto 10px",
              lineHeight: 1.75,
            }}
          >
            Apadrinaste un pingüino macaroni en la{" "}
            <strong style={{ color: "#7dd3fc" }}>Antártida</strong>. Su nombre es{" "}
            <strong
              style={{
                background: "linear-gradient(135deg,#fbbf24,#f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
              }}
            >
              Sandy
            </strong>{" "}
            y vive en la Isla Decepción.
          </p>

          <p
            style={{
              fontSize: "clamp(13px,2vw,15px)",
              color: "rgba(125,211,252,.45)",
              marginBottom: 32,
            }}
          >
            Certificado oficial de la XXXIX Campaña Antártica · 30/03/2026
          </p>

          {/* PDF viewer */}
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(125,211,252,.2)",
              animation: "glowPulse 4s ease infinite",
              background: "rgba(4,26,46,.6)",
              marginBottom: 24,
            }}
          >
            <object
              data="/assets/diploma_657072.pdf"
              type="application/pdf"
              width="100%"
              style={{ height: "clamp(320px,60vw,540px)", display: "block" }}
            >
              {/* Fallback for mobile browsers that can't embed PDFs */}
              <div
                style={{
                  padding: "40px 24px",
                  color: "rgba(186,230,253,.7)",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                <p style={{ marginBottom: 16 }}>
                  Tu navegador no puede mostrar el PDF directamente.
                </p>
                <a
                  href="/assets/diploma_657072.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(135deg,rgba(14,165,233,.25),rgba(6,182,212,.12))",
                    border: "1px solid rgba(125,211,252,.4)",
                    color: "#7dd3fc",
                    borderRadius: 100,
                    padding: "12px 32px",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: ".06em",
                  }}
                >
                  🐧 Ver certificado
                </a>
              </div>
            </object>
          </div>

          {/* Download / open button */}
          <a
            href="/assets/diploma_657072.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg,rgba(14,165,233,.2),rgba(6,182,212,.08))",
              border: "1px solid rgba(125,211,252,.35)",
              color: "#7dd3fc",
              borderRadius: 100,
              padding: "11px 32px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: ".08em",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              textDecoration: "none",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,165,233,.28)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg,rgba(14,165,233,.2),rgba(6,182,212,.08))")
            }
          >
            ⬇️ Abrir / descargar certificado
          </a>
        </div>
      )}
    </section>
  );
}
