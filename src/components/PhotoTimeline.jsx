import { useState } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

function PhotoCard({ index }) {
  const [hov, setHov] = useState(false);
  const rots = [-4, -2, 3, -1, 5, -3, 2, -5];
  const img = CONTENT.photos.images[index] ?? null;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onTouchStart={() => setHov(true)}
      onTouchEnd={() => setTimeout(() => setHov(false), 300)}
      style={{
        flexShrink: 0,
        width: 200,
        transform: `rotate(${hov ? 0 : rots[index % rots.length]}deg) scale(${hov ? 1.05 : 1})`,
        transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,rgba(7,89,133,.5),rgba(12,74,110,.75))",
          border: "1.5px solid rgba(125,211,252,.2)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: hov
            ? "0 20px 50px rgba(14,165,233,.35)"
            : "0 6px 24px rgba(0,0,0,.4)",
          transition: "box-shadow .35s",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "100%",
            position: "relative",
            background:
              "linear-gradient(135deg,rgba(7,89,133,.6),rgba(4,30,60,.9))",
          }}
        >
          {img ? (
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(56,189,248,.15)",
                  border: "1.5px dashed rgba(125,211,252,.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                📷
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(186,230,253,.4)",
                  letterSpacing: ".06em",
                }}
              >
                Tu foto aquí
              </span>
            </div>
          )}
        </div>
        <div style={{ height: 16, background: "rgba(4,21,37,.7)" }} />
      </div>
    </div>
  );
}

export function PhotoTimeline() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 0 80px",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}>
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
            {CONTENT.photos.label}
          </span>
          <Rocket size={18} />
        </div>
        <h3
          style={{
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#fff,#a5f3fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {CONTENT.photos.title}
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          paddingLeft: 32,
          overflowX: "auto",
          paddingBottom: 8,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CONTENT.photos.images.map((_, i) => (
          <PhotoCard key={i} index={i} />
        ))}
        <div style={{ flexShrink: 0, width: 8 }} />
      </div>
    </section>
  );
}
