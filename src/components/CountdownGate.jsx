import { useState, useEffect } from "react";
import { CONTENT, FUNNY_MSGS, BIRTHDAY, EDITOR_PASSWORD } from "../config";
import { stars, BG_ROCKETS, FLOATING_PHOTOS, pick } from "../utils";
import { Rocket, Planet } from "./Rocket";
import { StarField } from "./StarField";

/* ── COUNTDOWN GATE ── */
export function CountdownGate({ onEditorAccess }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [funnyMsg, setFunnyMsg] = useState(null);
  const [giftPhase, setGiftPhase] = useState("idle");
  const [showPwInput, setShowPwInput] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = BIRTHDAY - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const shakeGift = () => {
    if (giftPhase !== "idle") return;
    setGiftPhase("shaking");
    setTimeout(() => {
      setFunnyMsg(pick(FUNNY_MSGS.filter((m) => m !== funnyMsg)));
      setGiftPhase("idle");
    }, 700);
  };

  const tryPw = () => {
    if (pw === EDITOR_PASSWORD) {
      onEditorAccess();
    } else {
      setPwError(true);
      setPw("");
      setTimeout(() => setPwError(false), 1500);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#020d1a,#041a2e,#020f1c)",
        color: "#e0f2fe",
        fontFamily: "var(--font-sans,system-ui,sans-serif)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "40px 24px",
      }}
    >
      <style>{`
        @keyframes twinkle{from{opacity:.1}to{opacity:.85}}
        @keyframes shoot{0%{left:-15%;opacity:0}5%{opacity:1}80%{opacity:.6}100%{left:110%;opacity:0}}
        @keyframes shake{0%,100%{transform:rotate(0)translateX(0)}20%{transform:rotate(-8deg)translateX(-8px)}40%{transform:rotate(8deg)translateX(8px)}60%{transform:rotate(-5deg)translateX(-5px)}80%{transform:rotate(5deg)translateX(5px)}}
        @keyframes pulse{0%,100%{opacity:.65;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes orbit{from{transform:rotate(0deg) translateX(80px) rotate(0deg)}to{transform:rotate(360deg) translateX(80px) rotate(-360deg)}}
        @keyframes msgPop{0%{opacity:0;transform:translateY(10px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes bgR{0%,100%{transform:translateY(0) rotate(var(--a,0deg))}50%{transform:translateY(-14px) rotate(var(--a,0deg))}}
        @keyframes errShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      `}</style>
      <style>{`
        @keyframes floatPic{0%,100%{transform:translateY(0px)}50%{transform:translateY(-12px)}}
      `}</style>
      <StarField />

      {/* Fotos flotantes polaroid — ocultas en pantallas < 480px */}
      {FLOATING_PHOTOS.map((p, i) => (
        <div
          key={i}
          className="floating-pic"
          style={{
            position: "fixed",
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            zIndex: 0,
            pointerEvents: "none",
            animation: `floatPic ${p.dur}s ${p.delay}s infinite ease-in-out`,
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "6px 6px 22px",
              borderRadius: 4,
              boxShadow: "0 6px 24px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.3)",
              width: 86,
              opacity: 0.75,
            }}
          >
            <img
              src={p.src}
              alt=""
              style={{
                width: "100%",
                height: 90,
                objectFit: "cover",
                display: "block",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}

      {BG_ROCKETS.map((r) => (
        <div
          key={r.id}
          style={{
            position: "fixed",
            left: `${r.x}%`,
            top: `${r.y}%`,
            opacity: 0.08,
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

      {/* planet deco */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: "6%",
          opacity: 0.4,
          animation: "pulse 7s infinite",
        }}
      >
        <Planet r={28} c1="#0c4a6e" c2="#0ea5e9" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: "5%",
          opacity: 0.38,
          animation: "pulse 9s 2s infinite",
        }}
      >
        <Planet r={38} c1="#065f46" c2="#06b6d4" ring />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 560,
          width: "100%",
        }}
      >
        {/* badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "rgba(14,165,233,.12)",
              border: "1px solid rgba(56,189,248,.28)",
              borderRadius: 100,
              padding: "5px 20px",
              fontSize: 11,
              color: "rgba(125,211,252,.85)",
              letterSpacing: ".13em",
              textTransform: "uppercase",
            }}
          >
            {CONTENT.countdown.badge}
          </div>
        </div>

        {/* orbiting planet */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              margin: "0 auto",
              background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#38bdf8)",
              boxShadow:
                "0 0 50px rgba(14,165,233,.5),0 0 100px rgba(6,182,212,.15)",
              animation: "pulse 3.5s infinite",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: "50%",
                border: "1.5px solid rgba(125,211,252,.18)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -14,
              marginLeft: -14,
              width: 28,
              height: 28,
              animation: "orbit 5s linear infinite",
            }}
          >
            <div style={{ transform: "rotate(45deg)" }}>
              <Rocket size={24} />
            </div>
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px,7vw,62px)",
            fontWeight: 800,
            margin: "0 0 8px",
            lineHeight: 1.1,
            background: "linear-gradient(135deg,#fff 20%,#7dd3fc 55%,#38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-.02em",
          }}
        >
          {CONTENT.countdown.title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "rgba(186,230,253,.45)",
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          La misión se activa el{" "}
          <strong style={{ color: "rgba(125,211,252,.75)" }}>
            {CONTENT.countdown.dateStr}
          </strong>
          . {CONTENT.countdown.subtitle}
        </p>

        {/* countdown boxes */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { v: time.d, l: "Días" },
            { v: time.h, l: "Horas" },
            { v: time.m, l: "Min" },
            { v: time.s, l: "Seg" },
          ].map(({ v, l }) => (
            <div
              key={l}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(125,211,252,.14)",
                borderRadius: 16,
                padding: "18px 22px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                minWidth: 78,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(v).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,.38)",
                  marginTop: 5,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* gift box */}
        <p
          style={{
            fontSize: 13,
            color: "rgba(125,211,252,.45)",
            marginBottom: 20,
            letterSpacing: ".06em",
          }}
        >
          {CONTENT.countdown.curiousText}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* lid */}
          <div
            style={{
              width: 130,
              position: "relative",
              zIndex: 2,
              marginBottom: -2,
            }}
          >
            <div
              style={{
                height: 34,
                background: "linear-gradient(135deg,#0369a1,#0284c7)",
                borderRadius: "10px 10px 0 0",
                border: "1.5px solid rgba(125,211,252,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {[
                  [-14, -6, -28],
                  [14, -6, 28],
                ].map(([x, y, rot], i) => (
                  <div
                    key={i}
                    style={{
                      width: 26,
                      height: 18,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                      transform: `translate(${x}px,${y}px) rotate(${rot}deg)`,
                      position: "absolute",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "#7dd3fc",
                    position: "absolute",
                    top: 6,
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              </div>
              <div
                style={{
                  width: 12,
                  height: "100%",
                  background: "rgba(186,230,253,.2)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          {/* body */}
          <div
            onClick={shakeGift}
            style={{
              cursor: "pointer",
              userSelect: "none",
              touchAction: "manipulation",
              width: 130,
              animation: giftPhase === "shaking" ? "shake .65s ease" : "none",
            }}
          >
            <div
              style={{
                height: 110,
                background: "linear-gradient(160deg,#0c4a6e,#075985)",
                border: "1.5px solid rgba(125,211,252,.3)",
                borderRadius: "0 0 12px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 28px rgba(14,165,233,.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 12,
                  height: "100%",
                  background: "rgba(186,230,253,.14)",
                }}
              />
              <span style={{ fontSize: 38 }}>🎁</span>
            </div>
          </div>
        </div>

        {/* funny message */}
        {funnyMsg && (
          <div
            key={funnyMsg}
            style={{
              marginTop: 28,
              background:
                "linear-gradient(135deg,rgba(7,89,133,.5),rgba(6,182,212,.2))",
              border: "1px solid rgba(125,211,252,.22)",
              borderRadius: 14,
              padding: "14px 20px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              fontSize: 14,
              color: "rgba(224,242,254,.9)",
              animation: "msgPop .4s ease both",
              lineHeight: 1.5,
            }}
          >
            {funnyMsg}
          </div>
        )}

        {/* editor access */}
        <div
          style={{
            marginTop: 48,
            borderTop: "1px solid rgba(56,189,248,.08)",
            paddingTop: 28,
          }}
        >
          {!showPwInput ? (
            <button
              onClick={() => setShowPwInput(true)}
              style={{
                background: "none",
                border: "1px solid rgba(56,189,248,.2)",
                color: "rgba(125,211,252,.5)",
                borderRadius: 100,
                padding: "7px 20px",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: ".08em",
                transition: "all .2s",
                touchAction: "manipulation",
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderColor = "rgba(56,189,248,.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.borderColor = "rgba(56,189,248,.2)")
              }
            >
              🔑 Acceso editor
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tryPw()}
                placeholder="Contraseña..."
                style={{
                  background: "rgba(7,89,133,.3)",
                  border: `1px solid ${pwError ? "rgba(239,68,68,.7)" : "rgba(125,211,252,.25)"}`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  color: "#e0f2fe",
                  fontSize: 16,
                  outline: "none",
                  width: 180,
                  animation: pwError ? "errShake .3s ease" : "none",
                }}
              />
              <button
                onClick={tryPw}
                style={{
                  background: "rgba(14,165,233,.2)",
                  border: "1px solid rgba(56,189,248,.3)",
                  color: "#7dd3fc",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  touchAction: "manipulation",
                }}
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setShowPwInput(false);
                  setPw("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(125,211,252,.4)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                cancelar
              </button>
            </div>
          )}
          {pwError && (
            <p
              style={{
                fontSize: 12,
                color: "rgba(239,68,68,.7)",
                marginTop: 8,
              }}
            >
              Contraseña incorrecta 🚫
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
