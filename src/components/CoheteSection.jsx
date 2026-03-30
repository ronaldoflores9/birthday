import { useState, useRef } from "react";
import { Rocket } from "./Rocket";

/* ── COHETE PERSONALIZABLE ── */
export function CoheteSection() {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | ready | launching | space
  const [trail, setTrail] = useState([]);
  const rocketRef = useRef(null);

  const MAX = 18;

  const handleInput = (e) => {
    const val = e.target.value.slice(0, MAX);
    setName(val);
    if (phase === "launching" || phase === "space") setPhase("idle");
  };

  const launch = () => {
    if (!name.trim() || phase === "launching" || phase === "space") return;
    setPhase("launching");
    // generate star trail particles
    setTrail(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: 38 + Math.random() * 24,
        delay: i * 0.06,
        dur: 0.6 + Math.random() * 0.5,
        size: 3 + Math.random() * 5,
        color: ["#7dd3fc","#fbbf24","#a5f3fc","#f472b6","#34d399"][i % 5],
      }))
    );
    setTimeout(() => setPhase("space"), 2200);
  };

  const reset = () => {
    setName("");
    setPhase("idle");
    setTrail([]);
  };

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <style>{`
        @keyframes rocketLaunch{0%{transform:translateY(0) scale(1);opacity:1}60%{opacity:1}100%{transform:translateY(-120vh) scale(.4);opacity:0}}
        @keyframes trailStar{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}
        @keyframes spaceFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes nameGlow{0%,100%{text-shadow:0 0 8px rgba(125,211,252,.4)}50%{text-shadow:0 0 20px rgba(125,211,252,.9),0 0 40px rgba(56,189,248,.4)}}
        @keyframes exhaustFlame{0%,100%{scaleY(1);opacity:.9}50%{scaleY(1.3);opacity:1}}
      `}</style>

      {/* header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <Rocket size={18} />
          <span style={{ fontSize: 12, color: "rgba(125,211,252,.5)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Misión personal
          </span>
          <Rocket size={18} />
        </div>
        <h3 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, background: "linear-gradient(135deg,#fff,#7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Lanza tu cohete 🚀
        </h3>
        <p style={{ fontSize: 14, color: "rgba(125,211,252,.45)", margin: 0 }}>
          Escribe tu nombre, personaliza tu cohete y lánzalo al universo
        </p>
      </div>

      {phase !== "space" ? (
        <>
          {/* input */}
          <div style={{ marginBottom: 32, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input
              value={name}
              onChange={handleInput}
              placeholder="Tu nombre aquí..."
              maxLength={MAX}
              style={{
                background: "rgba(7,89,133,.25)",
                border: "1.5px solid rgba(56,189,248,.3)",
                borderRadius: 12,
                padding: "12px 18px",
                color: "#e0f2fe",
                fontSize: 16,
                outline: "none",
                width: "min(260px, 80vw)",
                letterSpacing: ".04em",
              }}
            />
            <button
              onClick={launch}
              disabled={!name.trim() || phase === "launching"}
              style={{
                background: name.trim() ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "rgba(255,255,255,.06)",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                color: name.trim() ? "#fff" : "rgba(125,211,252,.3)",
                fontSize: 15,
                fontWeight: 700,
                cursor: name.trim() ? "pointer" : "not-allowed",
                touchAction: "manipulation",
                boxShadow: name.trim() ? "0 4px 20px rgba(14,165,233,.4)" : "none",
                transition: "all .2s",
              }}
            >
              {phase === "launching" ? "🔥 Despegando..." : "🚀 ¡Lanzar!"}
            </button>
          </div>

          {/* rocket preview */}
          <div style={{ position: "relative", height: 260, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>

            {/* launch pad */}
            <div style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: 120, height: 14,
              background: "linear-gradient(90deg,transparent,rgba(125,211,252,.18),transparent)",
              borderRadius: 4,
            }} />
            <div style={{
              position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
              width: 6, height: 40,
              background: "rgba(125,211,252,.12)",
              borderRadius: 3,
            }} />

            {/* trail particles */}
            {phase === "launching" && trail.map((t) => (
              <div key={t.id} style={{
                position: "absolute",
                bottom: `${20 + Math.random() * 40}%`,
                left: `${t.left}%`,
                width: t.size, height: t.size,
                borderRadius: "50%",
                background: t.color,
                "--tx": `${(Math.random() - .5) * 60}px`,
                "--ty": `${20 + Math.random() * 60}px`,
                animation: `trailStar ${t.dur}s ${t.delay}s ease-out forwards`,
                pointerEvents: "none",
              }} />
            ))}

            {/* the rocket */}
            <div
              ref={rocketRef}
              style={{
                position: "relative",
                animation: phase === "launching" ? "rocketLaunch 2.2s cubic-bezier(.4,0,.2,1) forwards" : "spaceFloat 3s ease-in-out infinite",
                zIndex: 2,
                paddingBottom: 54,
              }}
            >
              {/* name tag on rocket */}
              {name && (
                <div style={{
                  position: "absolute",
                  top: 18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  background: "rgba(14,165,233,.7)",
                  border: "1px solid rgba(125,211,252,.5)",
                  borderRadius: 100,
                  padding: "2px 8px",
                  letterSpacing: ".06em",
                  zIndex: 3,
                  animation: phase === "idle" ? "nameGlow 2s infinite" : "none",
                  backdropFilter: "blur(4px)",
                }}>
                  {name}
                </div>
              )}
              <Rocket size={72} glow />
            </div>
          </div>
        </>
      ) : (
        /* ── SPACE VIEW ── */
        <div style={{ animation: "msgPop .6s ease both" }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "spaceFloat 4s infinite" }}>🌌</div>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            ¡<span style={{ color: "#7dd3fc" }}>{name}</span> llegó al universo!
          </p>
          <p style={{ fontSize: 14, color: "rgba(125,211,252,.5)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Tu cohete ya está orbitando entre las estrellas ✨<br />
            El cosmos te recibió con los brazos abiertos.
          </p>

          {/* mini stars scattered */}
          <div style={{ position: "relative", height: 80, marginBottom: 24 }}>
            {["⭐","🌟","✨","💫","🌠","⭐","✨"].map((s, i) => (
              <span key={i} style={{
                position: "absolute",
                left: `${8 + i * 13}%`,
                top: `${20 + (i % 3) * 25}%`,
                fontSize: 14 + (i % 3) * 6,
                animation: `pulse ${2 + i * .3}s ${i * .2}s infinite`,
                opacity: .7 + (i % 2) * .2,
              }}>{s}</span>
            ))}
          </div>

          <button
            onClick={reset}
            style={{
              background: "rgba(14,165,233,.15)",
              border: "1px solid rgba(56,189,248,.35)",
              color: "#7dd3fc",
              borderRadius: 100,
              padding: "11px 28px",
              fontSize: 14,
              cursor: "pointer",
              touchAction: "manipulation",
              letterSpacing: ".06em",
            }}
          >
            🔄 Lanzar otro cohete
          </button>
        </div>
      )}
    </section>
  );
}
