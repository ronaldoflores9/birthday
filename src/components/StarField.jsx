import { useState, useEffect } from "react";
import { rand, confettiPieces, stars } from "../utils";

/* ── CONFETTI ── */
export function Confetti() {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 7000);
    return () => clearTimeout(t);
  }, []);
  if (!alive) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9990,
        overflow: "hidden",
      }}
    >
      <style>{`@keyframes confettiFall{0%{opacity:1;transform:translateY(-20px) rotate(0deg) translateX(0)}100%{opacity:0;transform:translateY(110vh) rotate(720deg) translateX(var(--drift,0px))}}`}</style>
      {confettiPieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.isCircle ? "50%" : 2,
            "--drift": `${p.drift}px`,
            transform: `rotate(${p.rot}deg)`,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── STAR CURSOR ── */
export function StarCursor() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@keyframes starPop{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0)}}`;
    document.head.appendChild(style);
    let ticking = false;
    const colors = [
      "#7dd3fc",
      "#fbbf24",
      "#a5f3fc",
      "#fff",
      "#f472b6",
      "#38bdf8",
    ];
    const onMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = document.createElement("div");
        const s = 5 + Math.random() * 7;
        el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${s}px;height:${s}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};pointer-events:none;z-index:9999;animation:starPop .65s ease forwards;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 650);
        ticking = false;
      });
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      onMove({ clientX: t.clientX, clientY: t.clientY });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      style.remove();
    };
  }, []);
  return null;
}

export const StarField = () => (
  <div
    style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
  >
    {stars.map((s) => (
      <div
        key={s.id}
        style={{
          position: "absolute",
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          background:
            s.id % 6 === 0 ? "#7dd3fc" : s.id % 9 === 0 ? "#a5f3fc" : "#e0f2fe",
          opacity: 0.5,
          animation: `twinkle ${s.dur}s ${s.delay}s infinite alternate`,
        }}
      />
    ))}
    {[
      { t: "8%", d: "0s" },
      { t: "33%", d: "4s" },
      { t: "65%", d: "8s" },
    ].map((s, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: s.t,
          left: "-15%",
          width: 140,
          height: 2,
          animation: `shoot 8s ${s.d} infinite linear`,
          transform: "rotate(-12deg)",
        }}
      >
        <svg width="140" height="2" viewBox="0 0 140 2">
          <defs>
            <linearGradient id={`sg${i}`}>
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
          <rect width="140" height="2" rx="1" fill={`url(#sg${i})`} />
        </svg>
      </div>
    ))}
  </div>
);
