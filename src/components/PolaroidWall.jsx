import { useState } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

const PIN_COLORS = ["#ef4444","#f97316","#fbbf24","#34d399","#38bdf8","#a78bfa","#f472b6"];

const WALL_CONFIGS = CONTENT.photos.images.map((src, i) => ({
  src,
  rot:   (((i * 79 + 11) % 20) - 10),    // ±10deg — enough to look messy, safe on mobile
  jX:    (((i * 41 + 7)  % 12) - 6),     // ±6px
  jY:    (((i * 53 + 17) % 12) - 6),     // ±6px
  scale: 0.92 + ((i * 13 + 5) % 12) / 100, // 0.92–1.04
  pin:   PIN_COLORS[i % PIN_COLORS.length],
}));

export function PolaroidWall() {
  const [active, setActive] = useState(null);
  const [order, setOrder] = useState(() => WALL_CONFIGS.map((_, i) => i));

  const bringToFront = (idx) => {
    setOrder((prev) => [...prev.filter((x) => x !== idx), idx]);
    setActive(idx);
  };

  const zMap = {};
  order.forEach((idx, pos) => { zMap[idx] = pos + 1; });

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "40px 16px 80px" }}>
      <style>{`
        @keyframes pinDrop{from{opacity:0;transform:translateY(-16px) scale(.88)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes wallFade{from{opacity:0}to{opacity:1}}
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <Rocket size={18} />
          <span style={{ fontSize: 12, color: "rgba(125,211,252,.5)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Mural de recuerdos
          </span>
          <Rocket size={18} />
        </div>
        <h3 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, background: "linear-gradient(135deg,#fff,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Polaroid Wall 📌
        </h3>
        <p style={{ fontSize: 14, color: "rgba(125,211,252,.45)", margin: 0 }}>
          Toca cualquier foto para verla mejor
        </p>
      </div>

      {/* outer wrapper — overflow visible so rotated polaroids never clip */}
      <div style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        position: "relative",
      }}>
        {/* visual board background — positioned behind, with a little inset so it looks contained */}
        <div style={{
          position: "absolute",
          inset: "-8px -8px -8px -8px",
          background: "linear-gradient(160deg,#0a1f35,#071626)",
          borderRadius: 16,
          border: "1px solid rgba(125,211,252,.1)",
          boxShadow: "inset 0 0 60px rgba(0,0,0,.5), 0 20px 60px rgba(0,0,0,.4)",
          zIndex: 0,
          pointerEvents: "none",
        }}>
          {/* texture dots */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%`,
              width: 2, height: 2, borderRadius: "50%",
              background: "rgba(125,211,252,.05)", pointerEvents: "none",
            }} />
          ))}
        </div>

        {/* grid — overflow visible so rotation overhang shows */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(80px,18vw,120px), 1fr))",
          gap: "clamp(24px,4vw,44px)",
          position: "relative",
          zIndex: 1,
          padding: "clamp(20px,4vw,40px)",
        }}>
          {WALL_CONFIGS.map((p, idx) => {
            const isActive = active === idx;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 14,
                  zIndex: isActive ? 200 : zMap[idx],
                  position: "relative",
                  /* give each cell enough space so the rotated polaroid
                     never overlaps into neighbour cells causing clipping */
                  overflow: "visible",
                }}
              >
                <div
                  onClick={() => bringToFront(idx)}
                  style={{
                    cursor: "pointer",
                    touchAction: "manipulation",
                    position: "relative",
                    transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
                    transform: isActive
                      ? `translate(${p.jX}px,${p.jY}px) rotate(0deg) scale(1.22)`
                      : `translate(${p.jX}px,${p.jY}px) rotate(${p.rot}deg) scale(${p.scale})`,
                    animation: `pinDrop .45s ${idx * 0.05}s ease both`,
                    /* ensure the polaroid itself can show its full rotated extent */
                    willChange: "transform",
                  }}
                >
                  {/* pin */}
                  <div style={{
                    position: "absolute", top: -12, left: "50%",
                    transform: "translateX(-50%)",
                    width: 14, height: 14, borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, ${p.pin}, ${p.pin}aa)`,
                    boxShadow: `0 2px 6px rgba(0,0,0,.6), 0 0 10px ${p.pin}77`,
                    border: "1.5px solid rgba(255,255,255,.3)", zIndex: 2,
                  }} />
                  {/* polaroid */}
                  <div style={{
                    background: "#fefefe",
                    padding: "5px 5px 22px",
                    borderRadius: 3,
                    boxShadow: isActive
                      ? "0 20px 56px rgba(0,0,0,.8)"
                      : "0 5px 18px rgba(0,0,0,.6), 2px 3px 0 rgba(0,0,0,.2)",
                    width: "clamp(80px,16vw,116px)",
                    transition: "box-shadow .3s",
                  }}>
                    <img src={p.src} alt="" style={{
                      width: "100%",
                      height: "clamp(68px,13vw,96px)",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: 1,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* lightbox */}
      {active !== null && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, animation: "wallFade .2s ease both",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fefefe", padding: "10px 10px 36px",
            borderRadius: 4, boxShadow: "0 30px 80px rgba(0,0,0,.8)",
            maxWidth: "min(400px, 88vw)", width: "100%",
          }}>
            <img src={WALL_CONFIGS[active].src} alt="" style={{ width: "100%", display: "block", borderRadius: 2 }} />
          </div>
          <button onClick={() => setActive(null)} style={{
            position: "fixed", top: 20, right: 20,
            background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
            color: "#fff", borderRadius: "50%", width: 44, height: 44,
            fontSize: 18, cursor: "pointer", touchAction: "manipulation",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
      )}
    </section>
  );
}
