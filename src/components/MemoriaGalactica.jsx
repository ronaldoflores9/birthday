import { useState, useEffect, useCallback } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

const PHOTOS = CONTENT.photos.images;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick 8 random photos, make pairs → 16 cards in 4x4 grid
function buildDeck() {
  const picked = shuffle(PHOTOS).slice(0, 8);
  return shuffle(
    [...picked, ...picked].map((src, i) => ({
      id: i,
      src,
      flipped: false,
      matched: false,
    }))
  );
}

export function MemoriaGalactica() {
  const [cards, setCards] = useState(buildDeck);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime || won) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(t);
  }, [startTime, won]);

  const flip = useCallback((id) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.includes(id)) return;

    if (!startTime) setStartTime(Date.now());

    const next = selected.length === 0 ? [id] : [...selected, id];
    setSelected(next);
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, flipped: true } : c));

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = next.map((sid) => cards.find((c) => c.id === sid));
      if (a.src === b.src) {
        setCards((prev) => {
          const updated = prev.map((c) => next.includes(c.id) ? { ...c, matched: true } : c);
          if (updated.every((c) => c.matched)) setWon(true);
          return updated;
        });
        setSelected([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => next.includes(c.id) ? { ...c, flipped: false } : c));
          setSelected([]);
          setLocked(false);
        }, 950);
      }
    }
  }, [cards, selected, locked, startTime]);

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setLocked(false);
    setMoves(0);
    setWon(false);
    setStartTime(null);
    setElapsed(0);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pairsFound = cards.filter((c) => c.matched).length / 2;

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
      <style>{`
        @keyframes matchPop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes wonBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <Rocket size={18} />
          <span style={{ fontSize: 12, color: "rgba(125,211,252,.5)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Mini juego
          </span>
          <Rocket size={18} />
        </div>
        <h3 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, background: "linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Memoria Galáctica 🧠
        </h3>
        <p style={{ fontSize: 14, color: "rgba(125,211,252,.45)", margin: 0 }}>
          Encuentra los 8 pares de fotos
        </p>
      </div>

      {/* stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
        {[
          { label: "Movimientos", val: moves },
          { label: "Tiempo", val: fmt(elapsed) },
          { label: "Pares", val: `${pairsFound}/8` },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(125,211,252,.12)",
            borderRadius: 12, padding: "8px 14px",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{val}</div>
            <div style={{ fontSize: 10, color: "rgba(125,211,252,.45)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 4x4 grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "clamp(6px, 2vw, 10px)",
        maxWidth: 440,
        margin: "0 auto 28px",
      }}>
        {cards.map((card) => {
          const isVisible = card.flipped || card.matched;
          return (
            <div
              key={card.id}
              onClick={() => flip(card.id)}
              style={{
                aspectRatio: "1",
                cursor: card.matched ? "default" : "pointer",
                touchAction: "manipulation",
                perspective: 600,
                userSelect: "none",
              }}
            >
              <div style={{
                width: "100%", height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform .45s cubic-bezier(.4,0,.2,1)",
                transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
              }}>
                {/* back */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: "linear-gradient(135deg,#0c4a6e,#075985)",
                  border: "1.5px solid rgba(125,211,252,.2)",
                  borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(14px,3.5vw,20px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,.3)",
                }}>
                  ✦
                </div>
                {/* front — photo */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `2px solid ${card.matched ? "rgba(52,211,153,.7)" : "rgba(125,211,252,.35)"}`,
                  animation: card.matched ? "matchPop .35s ease" : "none",
                  boxShadow: card.matched ? "0 0 16px rgba(52,211,153,.35)" : "none",
                }}>
                  <img
                    src={card.src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {card.matched && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(52,211,153,.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "clamp(16px,4vw,24px)",
                    }}>✓</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {won ? (
        <div style={{ animation: "wonBounce .5s ease" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>¡Lo lograste!</p>
          <p style={{ fontSize: 14, color: "rgba(125,211,252,.55)", margin: "0 0 24px" }}>
            {moves} movimientos · {fmt(elapsed)} · ¡Eres una crack! 🌟
          </p>
          <button onClick={reset} style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            border: "none", borderRadius: 100, padding: "11px 28px",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", touchAction: "manipulation",
            boxShadow: "0 4px 20px rgba(124,58,237,.4)",
          }}>
            🔄 Jugar de nuevo
          </button>
        </div>
      ) : (
        <button onClick={reset} style={{
          background: "none",
          border: "1px solid rgba(125,211,252,.18)",
          color: "rgba(125,211,252,.45)",
          borderRadius: 100, padding: "8px 22px",
          fontSize: 12, cursor: "pointer", touchAction: "manipulation",
        }}>
          🔄 Reiniciar
        </button>
      )}
    </section>
  );
}
