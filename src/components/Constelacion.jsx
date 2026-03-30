import { useEffect, useRef, useState } from "react";
import { Rocket } from "./Rocket";

/* Puntos que forman la letra "A" y "R" como constelación */
const LETTER_POINTS = {
  A: [
    { x: 0.5,  y: 0.0  }, // cima
    { x: 0.15, y: 1.0  }, // pie izq
    { x: 0.85, y: 1.0  }, // pie der
    { x: 0.28, y: 0.55 }, // barra izq
    { x: 0.72, y: 0.55 }, // barra der
  ],
  R: [
    { x: 0.15, y: 0.0  }, // top
    { x: 0.15, y: 1.0  }, // bottom
    { x: 0.15, y: 0.0  }, // vuelve al top
    { x: 0.75, y: 0.0  }, // arco top-right
    { x: 0.85, y: 0.18 }, // arco right
    { x: 0.75, y: 0.45 }, // arco bottom
    { x: 0.15, y: 0.45 }, // vuelve al centro
    { x: 0.75, y: 0.45 }, // inicio pata
    { x: 0.85, y: 1.0  }, // pata der
  ],
};

const CONNECTIONS = {
  A: [[0,1],[0,2],[3,4]],
  R: [[0,1],[0,3],[3,4],[4,5],[5,6],[5,8]],
};

const BG_STARS = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.4 + 0.3,
  o: Math.random() * 0.3 + 0.05,
}));

export function ConstelacionSection() {
  const canvasRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [progress, setProgress] = useState(0); // 0→1 animation

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    let frame;

    const draw = (prog) => {
      ctx.clearRect(0, 0, W, H);

      // bg stars
      BG_STARS.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,242,254,${s.o})`;
        ctx.fill();
      });

      const LETTER_W = W * 0.28;
      const LETTER_H = H * 0.72;
      const offsets = [
        { lx: W * 0.14, ly: H * 0.14, letter: "A" },
        { lx: W * 0.53, ly: H * 0.14, letter: "R" },
      ];

      offsets.forEach(({ lx, ly, letter }) => {
        const pts = LETTER_POINTS[letter].map((p) => ({
          x: lx + p.x * LETTER_W,
          y: ly + p.y * LETTER_H,
        }));
        const conns = CONNECTIONS[letter];
        const total = conns.length;

        conns.forEach(([a, b], ci) => {
          const start = pts[a];
          const end = pts[b];
          const lineProgress = Math.max(0, Math.min(1, prog * total - ci));
          if (lineProgress <= 0) return;

          // glow line
          const ex = start.x + (end.x - start.x) * lineProgress;
          const ey = start.y + (end.y - start.y) * lineProgress;

          const grad = ctx.createLinearGradient(start.x, start.y, ex, ey);
          grad.addColorStop(0, "rgba(125,211,252,.08)");
          grad.addColorStop(1, "rgba(56,189,248,.55)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // travelling dot at front
          if (lineProgress < 1) {
            ctx.beginPath();
            ctx.arc(ex, ey, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#7dd3fc";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        // star nodes
        pts.forEach((p, pi) => {
          const appear = Math.min(1, Math.max(0, prog * total * 1.2 - pi * 0.4));
          if (appear <= 0) return;
          const r = 3.5 + appear * 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          rg.addColorStop(0, `rgba(255,255,255,${appear})`);
          rg.addColorStop(1, `rgba(56,189,248,${appear * 0.3})`);
          ctx.fillStyle = rg;
          ctx.shadowBlur = 12 * appear;
          ctx.shadowColor = "#7dd3fc";
          ctx.fill();
          ctx.shadowBlur = 0;

          // small cross sparkle
          if (appear > 0.8) {
            ctx.strokeStyle = `rgba(125,211,252,${(appear - 0.8) * 3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x - 7, p.y); ctx.lineTo(p.x + 7, p.y);
            ctx.moveTo(p.x, p.y - 7); ctx.lineTo(p.x, p.y + 7);
            ctx.stroke();
          }
        });
      });

      // initials text when done
      if (prog >= 1) {
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgba(125,211,252,.35)";
        ctx.font = "11px Georgia, serif";
        ctx.fillText("A · R", W / 2, H - 14);
      }
    };

    if (!drawn) {
      draw(0);
      return;
    }

    let start = null;
    const DURATION = 2800;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / DURATION);
      // ease in-out
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setProgress(eased);
      draw(eased);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [drawn]);

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <style>{`@keyframes consPulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <Rocket size={18} />
          <span style={{ fontSize: 12, color: "rgba(125,211,252,.5)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Constelación personal
          </span>
          <Rocket size={18} />
        </div>
        <h3 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, background: "linear-gradient(135deg,#fff,#a5f3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Tu constelación ✦
        </h3>
        <p style={{ fontSize: 14, color: "rgba(125,211,252,.45)", margin: 0 }}>
          Tus iniciales grabadas en el universo para siempre
        </p>
      </div>

      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(125,211,252,.12)", boxShadow: "0 0 60px rgba(14,165,233,.08)" }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={340}
          style={{ width: "100%", height: "auto", display: "block", background: "linear-gradient(160deg,#020d1a,#041a2e,#020f1c)" }}
        />

        {!drawn && (
          <button
            onClick={() => setDrawn(true)}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 12, touchAction: "manipulation",
            }}
          >
            <div style={{ fontSize: 38, animation: "consPulse 2s infinite" }}>✦</div>
            <span style={{ fontSize: 14, color: "rgba(125,211,252,.7)", letterSpacing: ".08em" }}>
              Toca para revelar tu constelación
            </span>
          </button>
        )}
      </div>

      {drawn && progress >= 1 && (
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(125,211,252,.45)", animation: "consPulse 3s infinite" }}>
          ✦ &nbsp;Tus iniciales brillan en el cosmos para siempre&nbsp; ✦
        </p>
      )}
    </section>
  );
}
