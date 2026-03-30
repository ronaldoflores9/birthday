import { useState, useRef, useCallback, useEffect } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

/* ── BIRTHDAY CAKE ── */
export function BirthdayCakeSection() {
  const N = 5;
  const [lit, setLit] = useState(() => Array(N).fill(true));
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const [allOut, setAllOut] = useState(false);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const litCountRef = useRef(N);

  const blowOne = useCallback(() => {
    setLit((prev) => {
      const idx = prev.findIndex(Boolean);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = false;
      litCountRef.current = next.filter(Boolean).length;
      return next;
    });
  }, []);

  const tapCandle = (i) => {
    setLit((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      litCountRef.current = next.filter(Boolean).length;
      return next;
    });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window["webkitAudioContext"])();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      let cd = 0;
      const tick = () => {
        if (litCountRef.current === 0) return;
        analyser.getByteFrequencyData(buf);
        const vol = buf.reduce((a, b) => a + b, 0) / buf.length;
        if (vol > 22 && cd <= 0) {
          blowOne();
          cd = 38;
        }
        cd--;
        rafRef.current = requestAnimationFrame(tick);
      };
      setMicActive(true);
      tick();
    } catch {
      setMicError(true);
    }
  };

  useEffect(() => {
    if (lit.every((v) => !v) && !allOut) {
      setAllOut(true);
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
  }, [lit, allOut]);

  const CANDLE_COLORS = [
    ["#f472b6", "#db2777"],
    ["#a78bfa", "#7c3aed"],
    ["#34d399", "#059669"],
    ["#fbbf24", "#d97706"],
    ["#38bdf8", "#0284c7"],
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "20px 24px 80px",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes flicker{0%,100%{transform:scaleX(1) scaleY(1) translateY(0);opacity:1}25%{transform:scaleX(.82) scaleY(1.12) translateY(-1px);opacity:.88}50%{transform:scaleX(1.12) scaleY(.9) translateY(1px);opacity:1}75%{transform:scaleX(.88) scaleY(1.06) translateY(-1px);opacity:.84}}
        @keyframes cakeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wishPop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        @keyframes smokeUp{0%{opacity:.7;transform:translateY(0) scaleX(1)}100%{opacity:0;transform:translateY(-28px) scaleX(1.8)}}
      `}</style>

      <div
        style={{ display: "inline-block", animation: "cakeIn .8s ease both" }}
      >
        {/* candles */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginBottom: 4,
            alignItems: "flex-end",
          }}
        >
          {lit.map((isLit, i) => (
            <div
              key={i}
              onClick={() => tapCandle(i)}
              style={{
                cursor: isLit ? "pointer" : "default",
                touchAction: "manipulation",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                padding: "8px 10px",
                margin: "-8px -10px",
              }}
            >
              {/* smoke when blown out */}
              {!isLit && (
                <div
                  style={{
                    width: 6,
                    height: 10,
                    background: "rgba(200,220,255,.35)",
                    borderRadius: "50%",
                    animation: "smokeUp .8s ease forwards",
                    marginBottom: 2,
                  }}
                />
              )}
              {/* flame */}
              <div
                style={{
                  width: 12,
                  height: isLit ? 20 : 0,
                  background:
                    "radial-gradient(ellipse at 50% 90%, #fff 0%, #fbbf24 35%, #f97316 70%, transparent 100%)",
                  borderRadius: "50% 50% 35% 35%",
                  animation: isLit
                    ? `flicker ${0.75 + i * 0.12}s ${i * 0.08}s infinite`
                    : "none",
                  transformOrigin: "bottom center",
                  transition: "height .25s",
                  filter: isLit
                    ? "drop-shadow(0 0 5px #fbbf24) drop-shadow(0 0 10px #f97316)"
                    : "none",
                  marginBottom: 1,
                }}
              />
              {/* body */}
              <div
                style={{
                  width: 12,
                  height: 40,
                  background: isLit
                    ? `linear-gradient(180deg,${CANDLE_COLORS[i][0]},${CANDLE_COLORS[i][1]})`
                    : "rgba(255,255,255,.15)",
                  borderRadius: "3px 3px 2px 2px",
                  transition: "background .6s",
                  position: "relative",
                  boxShadow: isLit
                    ? `0 0 8px ${CANDLE_COLORS[i][0]}55`
                    : "none",
                }}
              >
                {isLit && (
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 2,
                      width: 3,
                      height: 10,
                      background: "rgba(255,255,255,.3)",
                      borderRadius: 4,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* top tier */}
        <div
          style={{
            width: 190,
            margin: "0 auto",
            height: 38,
            background: "linear-gradient(180deg,#be185d,#9d174d)",
            borderRadius: "10px 10px 0 0",
            border: "2px solid rgba(255,255,255,.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "rgba(255,255,255,.08)",
              borderRadius: "10px 10px 0 0",
            }}
          />
          {[22, 58, 94, 130, 166].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: "50%",
                left: x,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "rgba(255,255,255,.55)",
                transform: "translateY(-50%)",
              }}
            />
          ))}
        </div>

        {/* middle tier */}
        <div
          style={{
            width: 250,
            margin: "0 auto",
            height: 46,
            background: "linear-gradient(180deg,#6d28d9,#4c1d95)",
            border: "2px solid rgba(255,255,255,.1)",
            borderTop: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "35%",
              background: "rgba(255,255,255,.07)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.55)",
                letterSpacing: ".15em",
                textTransform: "uppercase",
              }}
            >
              Feliz Cumpleaños
            </span>
          </div>
        </div>

        {/* bottom tier */}
        <div
          style={{
            width: 300,
            margin: "0 auto",
            height: 54,
            background: "linear-gradient(180deg,#0c4a6e,#075985)",
            border: "2px solid rgba(125,211,252,.18)",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: "rgba(125,211,252,.06)",
            }}
          />
          {[28, 68, 108, 148, 188, 228].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: 0,
                left: x,
                width: 16,
                height: "100%",
                background: "rgba(255,255,255,.03)",
              }}
            />
          ))}
          {/* plate */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: -10,
              right: -10,
              height: 14,
              background: "rgba(125,211,252,.12)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
        </div>
      </div>

      {/* controls */}
      {!allOut ? (
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{ fontSize: 14, color: "rgba(125,211,252,.55)", margin: 0 }}
          >
            Toca las velitas para apagarlas, o...
          </p>
          {!micActive ? (
            <button
              onClick={startMic}
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
              }}
            >
              🎤 Sopla con el micrófono
            </button>
          ) : (
            <p
              style={{
                fontSize: 13,
                color: "#7dd3fc",
                margin: 0,
                animation: "pulse 1.5s infinite",
              }}
            >
              🎤 Escuchando... ¡sopla!
            </p>
          )}
          {micError && (
            <p style={{ fontSize: 12, color: "rgba(239,68,68,.6)", margin: 0 }}>
              Micrófono no disponible — toca las velitas 👆
            </p>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 32, animation: "wishPop .6s ease both" }}>
          <p style={{ fontSize: 32, margin: "0 0 10px" }}>🎉</p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#7dd3fc",
              margin: "0 0 8px",
            }}
          >
            ¡Que se cumplan todos tus deseos!
          </p>
          <p style={{ fontSize: 14, color: "rgba(125,211,252,.5)", margin: 0 }}>
            El universo ya los está procesando ✨
          </p>
        </div>
      )}
    </section>
  );
}
