import { useState, useRef, useEffect } from "react";

const FRASES = [
  "¡DIOS MÍO!",
  "¡NO PUEDE SER!",
  "¡TRAICIÓN!",
  "¡ME HAS ROTO EL CORAZÓN!",
  "¿POR QUÉ?!",
  "¡ESTO NO ES POSIBLE!",
  "¡LO SABÍA!",
  "¡MALDITA SEA!",
  "¡EL AMOR TODO LO PUEDE!",
  "¡NOOOOOO!",
];

function playDramaticHit(ctx, startTime, freq, dur = 1.2) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const distortion = ctx.createWaveShaper();

  // Simple distortion curve
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = ((Math.PI + 80) * x) / (Math.PI + 80 * Math.abs(x));
  }
  distortion.curve = curve;

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.85, startTime + dur);

  gain.gain.setValueAtTime(0.0, startTime);
  gain.gain.linearRampToValueAtTime(0.22, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

  osc.connect(distortion);
  distortion.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

function playDramaDunDun(ctx) {
  const now = ctx.currentTime;
  // "DUN  DUN  DUUUN"
  playDramaticHit(ctx, now + 0.0, 110, 0.6);
  playDramaticHit(ctx, now + 0.7, 98, 0.6);
  playDramaticHit(ctx, now + 1.4, 82, 1.8);

  // Add a subtle high tone for drama
  [220, 330].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.06, now + 1.4);
    g.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + 1.4 + i * 0.04);
    osc.stop(now + 3.3);
  });
}

export function ModoDrama() {
  const [active, setActive] = useState(false);
  const [frase, setFrase] = useState(FRASES[0]);
  const [flash, setFlash] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const fraseIdxRef = useRef(0);

  const activate = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    playDramaDunDun(audioCtxRef.current);

    setFlash(true);
    setTimeout(() => setFlash(false), 400);

    fraseIdxRef.current = 0;
    setFrase(FRASES[0]);

    intervalRef.current = setInterval(() => {
      fraseIdxRef.current = (fraseIdxRef.current + 1) % FRASES.length;
      setFrase(FRASES[fraseIdxRef.current]);
    }, 1800);

    setActive(true);
  };

  const deactivate = () => {
    clearInterval(intervalRef.current);
    setActive(false);
  };

  const toggle = () => (active ? deactivate() : activate());

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <>
      <style>{`
        @keyframes dramaVignettePulse {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 0.75; }
        }
        @keyframes dramaTextPop {
          0%   { transform: translate(-50%,-50%) scale(0.4) rotate(-6deg); opacity: 0; }
          18%  { transform: translate(-50%,-50%) scale(1.12) rotate(2deg);  opacity: 1; }
          30%  { transform: translate(-50%,-50%) scale(1)    rotate(0deg);  opacity: 1; }
          80%  { transform: translate(-50%,-50%) scale(1)    rotate(0deg);  opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(0.9)  rotate(-3deg); opacity: 0; }
        }
        @keyframes scanlines {
          0%   { background-position: 0 0; }
          100% { background-position: 0 8px; }
        }
        @keyframes dramaFlash {
          0%,100% { opacity: 0; }
          10%,50% { opacity: 1; }
        }
        @keyframes dramaBtnPulse {
          0%,100% { box-shadow: 0 0 14px rgba(220,38,38,.6); }
          50%      { box-shadow: 0 0 28px rgba(220,38,38,1), 0 0 60px rgba(220,38,38,.4); }
        }
      `}</style>

      {/* ── Flash on activate ── */}
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#fff",
            zIndex: 99998,
            pointerEvents: "none",
            animation: "dramaFlash .4s ease forwards",
          }}
        />
      )}

      {/* ── Drama overlay ── */}
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9997,
            pointerEvents: "none",
          }}
        >
          {/* Red vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 25%, rgba(180,0,0,.55) 80%, rgba(120,0,0,.85) 100%)",
              animation: "dramaVignettePulse 1.2s ease-in-out infinite",
            }}
          />

          {/* Scanlines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.18) 3px, rgba(0,0,0,.18) 4px)",
              backgroundSize: "100% 8px",
              animation: "scanlines .15s linear infinite",
              mixBlendMode: "overlay",
            }}
          />

          {/* Red tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(160,0,0,.12)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Dramatic frase */}
          <div
            key={frase}
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              animation: "dramaTextPop 1.8s ease forwards",
              textAlign: "center",
              pointerEvents: "none",
              width: "90vw",
            }}
          >
            <div
              style={{
                fontSize: "clamp(36px,10vw,100px)",
                fontWeight: 900,
                color: "#fff",
                textShadow:
                  "0 0 8px #fff, 0 0 30px rgba(255,60,60,1), 0 0 70px rgba(200,0,0,.9), 3px 3px 0 #7f0000",
                letterSpacing: ".04em",
                lineHeight: 1.1,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {frase}
            </div>
          </div>

          {/* Corner watermark */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 20,
              color: "rgba(255,255,255,.35)",
              fontSize: 11,
              letterSpacing: ".12em",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            ★ Canal Telenovela HD ★
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          bottom: 28,
          right: 24,
          zIndex: 99999,
          background: active
            ? "linear-gradient(135deg,#7f0000,#dc2626)"
            : "linear-gradient(135deg,#1e1e2e,#3b0000)",
          color: "#fff",
          border: "2px solid rgba(220,38,38,.7)",
          borderRadius: 50,
          padding: "12px 20px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: ".05em",
          animation: active ? "dramaBtnPulse 1s infinite" : "none",
          boxShadow: active
            ? "0 0 14px rgba(220,38,38,.6)"
            : "0 4px 20px rgba(0,0,0,.5)",
          transition: "background .3s, box-shadow .3s",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>{active ? "💔" : "🎭"}</span>
        {active ? "Salir del drama" : "Modo Drama"}
      </button>
    </>
  );
}
