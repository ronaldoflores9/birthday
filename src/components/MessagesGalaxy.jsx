import { useState, useRef, useCallback, useEffect } from "react";
import { POSITIVE_MSGS, CONTENT } from "../config";
import { stars, BG_ROCKETS, pick, rand } from "../utils";
import { Rocket } from "./Rocket";

/* ── FLOATING MSG ── */
function FloatingMsg({ msg, style, onDone }) {
  return (
    <div
      onAnimationEnd={onDone}
      style={{
        position: "absolute",
        background:
          "linear-gradient(135deg,rgba(7,89,133,.55),rgba(6,182,212,.25))",
        border: "1px solid rgba(125,211,252,.22)",
        borderRadius: 14,
        padding: "10px 16px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontSize: 13,
        color: "rgba(224,242,254,.88)",
        lineHeight: 1.5,
        maxWidth: 260,
        pointerEvents: "none",
        animation: "msgFloat 6s ease-out forwards",
        ...style,
      }}
    >
      {msg}
    </div>
  );
}

export function MessagesGalaxy() {
  const [bubbles, setBubbles] = useState([]);
  const counter = useRef(0);
  const add = useCallback(() => {
    const id = counter.current++;
    setBubbles((b) => [
      ...b,
      { id, msg: pick(POSITIVE_MSGS), left: `${rand(2, 72)}%` },
    ]);
  }, []);
  useEffect(() => {
    add();
    const t = setInterval(add, 1800);
    return () => clearInterval(t);
  }, [add]);
  const remove = (id) => setBubbles((b) => b.filter((x) => x.id !== id));
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "60px 24px 80px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 52 }}>
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
              {CONTENT.messages.label}
          </span>
          <Rocket size={18} />
        </div>
        <h3
          style={{
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#fff,#7dd3fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 8px",
          }}
        >
          {CONTENT.messages.title}
        </h3>
        <p style={{ color: "rgba(125,211,252,.4)", fontSize: 14, margin: 0 }}>
          {CONTENT.messages.subtitle}
        </p>
      </div>
      <div
        style={{
          position: "relative",
          height: 420,
          overflow: "hidden",
          borderRadius: 20,
          border: "1px solid rgba(56,189,248,.1)",
          background: "rgba(4,21,37,.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {stars.slice(0, 40).map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size * 0.8,
              height: s.size * 0.8,
              borderRadius: "50%",
              background: "#7dd3fc",
              opacity: 0.2,
            }}
          />
        ))}
        {[15, 45, 72, 88].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              bottom: 0,
              opacity: 0.1,
              animation: `bgR ${8 + i * 2}s ${i * 2}s infinite ease-in-out`,
              "--a": "0deg",
            }}
          >
            <Rocket size={28 + i * 6} />
          </div>
        ))}
        {bubbles.map((b) => (
          <FloatingMsg
            key={b.id}
            msg={b.msg}
            style={{ left: b.left, bottom: 0 }}
            onDone={() => remove(b.id)}
          />
        ))}
      </div>
    </section>
  );
}
