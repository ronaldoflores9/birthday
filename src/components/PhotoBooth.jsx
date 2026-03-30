import { useState, useRef } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";
import { roundRect } from "./Certificado";

/* ── PHOTO BOOTH ── */
export function PhotoBoothSection() {
  const MAX = 5;
  const [photos, setPhotos] = useState(Array(MAX).fill(null));
  const [phase, setPhase] = useState("select"); // select | printing | done
  const [activeSlot, setActiveSlot] = useState(null);
  const fileInputRef = useRef(null);

  const SLOT_W = 64;
  const SLOT_H = 56;
  const STRIP_PH = 128;
  const STRIP_PAD = 8;
  const STRIP_HEADER_H = 40;
  const STRIP_FOOTER_H = 40;

  const filled = photos.filter(Boolean);
  const stripContentH =
    STRIP_HEADER_H +
    filled.length * (STRIP_PH + STRIP_PAD) +
    STRIP_FOOTER_H;

  const pickPhoto = (i) => {
    if (phase !== "select") return;
    setActiveSlot(i);
    fileInputRef.current.click();
  };

  const removePhoto = (i, e) => {
    e.stopPropagation();
    setPhotos((prev) => {
      const n = [...prev];
      n[i] = null;
      return n;
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotos((prev) => {
        const n = [...prev];
        n[activeSlot] = ev.target.result;
        return n;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const print = () => {
    if (!filled.length) return;
    setPhase("printing");
    setTimeout(() => setPhase("done"), 3200);
  };

  const reset = () => {
    setPhotos(Array(MAX).fill(null));
    setPhase("select");
  };

  const download = async () => {
    const SCALE = 2;
    const BW = 400;
    const BORDER = 32;
    const PW = BW - BORDER * 2;
    const PH = Math.round(PW * 0.75);
    const GAP = 10;
    const HDR = 68;
    const FTR = 58;
    const BH = HDR + filled.length * (PH + GAP) - GAP + FTR;

    const canvas = document.createElement("canvas");
    canvas.width = BW * SCALE;
    canvas.height = BH * SCALE;
    const ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);

    // background
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, BW, BH);

    // side film borders
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, BORDER, BH);
    ctx.fillRect(BW - BORDER, 0, BORDER, BH);

    // sprocket holes
    const holes = Math.max(4, filled.length * 2 + 1);
    for (let i = 0; i < holes; i++) {
      const y = HDR * 0.5 + (i / (holes - 1)) * (BH - HDR * 0.5 - FTR * 0.5);
      [6, BW - 20].forEach((x) => {
        ctx.fillStyle = "#000";
        roundRect(ctx, x, y - 7, 14, 14, 3);
        ctx.fill();
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // header
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Georgia, serif";
    ctx.fillText("✦  PHOTO BOOTH  ✦", BW / 2, 28);
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.font = "10px Georgia, serif";
    ctx.fillText("Galaxy Edition  ✨", BW / 2, 46);
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(BORDER + 10, 58);
    ctx.lineTo(BW - BORDER - 10, 58);
    ctx.stroke();

    // photos
    await Promise.all(
      filled.map(
        (src, i) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const x = BORDER;
              const y = HDR + i * (PH + GAP);
              // white frame
              ctx.fillStyle = "rgba(255,255,255,.92)";
              ctx.fillRect(x - 5, y - 5, PW + 10, PH + 10);
              // cover fit
              const iR = img.width / img.height;
              const tR = PW / PH;
              let sx, sy, sw, sh;
              if (iR > tR) {
                sh = img.height;
                sw = sh * tR;
                sx = (img.width - sw) / 2;
                sy = 0;
              } else {
                sw = img.width;
                sh = sw / tR;
                sx = 0;
                sy = (img.height - sh) / 2;
              }
              // draw to temp canvas, convert to grayscale, then stamp
              const tmp = document.createElement("canvas");
              tmp.width = PW;
              tmp.height = PH;
              const tc = tmp.getContext("2d");
              tc.drawImage(img, sx, sy, sw, sh, 0, 0, PW, PH);
              const id = tc.getImageData(0, 0, PW, PH);
              const d = id.data;
              for (let j = 0; j < d.length; j += 4) {
                const g = d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
                d[j] = d[j + 1] = d[j + 2] = g;
              }
              tc.putImageData(id, 0, 0);
              ctx.drawImage(tmp, x, y, PW, PH);
              resolve();
            };
            img.src = src;
          })
      )
    );

    // footer
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(BORDER + 10, BH - FTR + 8);
    ctx.lineTo(BW - BORDER - 10, BH - FTR + 8);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.font = "italic 13px Georgia, serif";
    ctx.fillText(
      CONTENT.name.split(" ").slice(0, 2).join(" "),
      BW / 2,
      BH - FTR + 28
    );
    ctx.fillStyle = "rgba(255,255,255,.38)";
    ctx.font = "9px Georgia, serif";
    ctx.fillText("19 de abril de 2026  ·  🎂  Feliz Cumpleaños", BW / 2, BH - FTR + 44);

    const link = document.createElement("a");
    link.download = "photobooth-birthday-2026.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const slotRows = [[0, 1], [2, 3], [4]];
  const LED_COLORS = ["#f472b6","#fbbf24","#34d399","#38bdf8","#a78bfa","#f97316","#f472b6","#38bdf8"];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 24px 80px",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes ledBlink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes machineGlow{0%,100%{box-shadow:0 8px 40px rgba(0,0,0,.4)}50%{box-shadow:0 0 60px rgba(14,165,233,.55)}}
        @keyframes paperOut{0%{opacity:0}10%{opacity:1}100%{opacity:1}}
      `}</style>

      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <Rocket size={18} />
          <span style={{ fontSize: 12, color: "rgba(125,211,252,.5)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Photo Booth
          </span>
          <Rocket size={18} />
        </div>
        <h3 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, background: "linear-gradient(135deg,#fff,#a5f3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          Galaxy Photo Booth 📸
        </h3>
        <p style={{ fontSize: 14, color: "rgba(125,211,252,.45)", margin: 0 }}>
          Añade hasta 5 fotos — desde tu galería o cámara
        </p>
      </div>

      {/* ── MACHINE ── */}
      <div style={{
        width: "min(340px, 90vw)",
        margin: "0 auto",
        background: "linear-gradient(180deg,#0c4a6e,#064e7a,#075985)",
        border: "2px solid rgba(125,211,252,.28)",
        borderRadius: 20,
        padding: "18px 18px 0",
        animation: phase === "printing" ? "machineGlow 1s infinite" : "none",
        boxShadow: "0 8px 40px rgba(0,0,0,.4)",
      }}>
        {/* label */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", color: "#7dd3fc", textTransform: "uppercase" }}>
            ✦ Photo Booth ✦
          </div>
          <div style={{ fontSize: 8, color: "rgba(125,211,252,.4)", letterSpacing: ".1em", marginTop: 2 }}>
            GALAXY EDITION · 2026
          </div>
        </div>

        {/* LEDs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 14 }}>
          {LED_COLORS.map((c, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: c,
              boxShadow: `0 0 5px ${c}`,
              opacity: phase === "printing" ? 1 : 0.55,
              animation: phase === "printing" ? `ledBlink ${0.45 + i * 0.08}s ${i * 0.05}s infinite` : "none",
            }} />
          ))}
        </div>

        {/* Lens */}
        <div style={{
          width: 62, height: 62, borderRadius: "50%",
          background: "radial-gradient(circle at 33% 33%, #1c3e60, #020d1a)",
          border: "3px solid rgba(125,211,252,.32)",
          margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(14,165,233,.22), inset 0 0 18px rgba(0,0,0,.7)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "radial-gradient(circle at 33% 33%, #0ea5e9, #041525)",
            border: "2px solid rgba(125,211,252,.22)",
            position: "relative",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.65)", position: "absolute", top: 6, left: 6 }} />
          </div>
        </div>

        {/* Photo slots */}
        <div style={{ marginBottom: 14 }}>
          {slotRows.map((row, ri) => (
            <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: ri < slotRows.length - 1 ? 8 : 0 }}>
              {row.map((idx) => (
                <div
                  key={idx}
                  onClick={() => pickPhoto(idx)}
                  style={{
                    width: SLOT_W, height: SLOT_H,
                    borderRadius: 8,
                    border: photos[idx] ? "2px solid rgba(125,211,252,.55)" : "1.5px dashed rgba(125,211,252,.22)",
                    background: photos[idx] ? "transparent" : "rgba(0,0,0,.25)",
                    cursor: phase === "select" ? "pointer" : "default",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {photos[idx] ? (
                    <>
                      <img src={photos[idx]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(1)" }} alt="" />
                      {phase === "select" && (
                        <div
                          onClick={(e) => removePhoto(idx, e)}
                          style={{
                            position: "absolute", top: 2, right: 2,
                            width: 22, height: 22, borderRadius: "50%",
                            background: "rgba(0,0,0,.75)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: "#fff", cursor: "pointer",
                            fontWeight: 700, touchAction: "manipulation",
                          }}
                        >✕</div>
                      )}
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <span style={{ fontSize: 14, opacity: .45 }}>📷</span>
                      <span style={{ fontSize: 7, color: "rgba(125,211,252,.38)" }}>{idx + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Print button */}
        <div style={{ padding: "0 0 18px", textAlign: "center" }}>
          {phase === "select" ? (
            <button
              onClick={print}
              disabled={!filled.length}
              style={{
                background: filled.length ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "rgba(255,255,255,.06)",
                border: "none",
                borderRadius: 100,
                padding: "9px 28px",
                color: filled.length ? "#fff" : "rgba(125,211,252,.28)",
                fontSize: 13,
                fontWeight: 700,
                cursor: filled.length ? "pointer" : "not-allowed",
                letterSpacing: ".04em",
                boxShadow: filled.length ? "0 4px 20px rgba(14,165,233,.38)" : "none",
                transition: "all .2s",
              }}
            >
              📸 {filled.length ? `Revelar ${filled.length} foto${filled.length > 1 ? "s" : ""}` : "Añade al menos 1 foto"}
            </button>
          ) : (
            <p style={{ fontSize: 13, color: "#7dd3fc", margin: 0, animation: phase === "printing" ? "pulse 1s infinite" : "none" }}>
              {phase === "printing" ? "⚙️ Revelando tu strip..." : "✅ ¡Lista!"}
            </p>
          )}
        </div>

        {/* Paper slot */}
        <div style={{
          height: 12,
          background: "#050e18",
          margin: "0 -2px",
          borderRadius: "0 0 2px 2px",
          borderTop: "2px solid rgba(0,0,0,.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: "55%", height: 2, background: "rgba(255,255,255,.04)", borderRadius: 1 }} />
        </div>
      </div>

      {/* ── STRIP OUTPUT ── */}
      <div style={{
        width: "min(200px, 58vw)",
        margin: "0 auto",
        overflow: "hidden",
        height: phase === "select" ? 0 : `${stripContentH}px`,
        transition: phase === "printing" ? "height 3s cubic-bezier(.25,.46,.45,.94)" : "none",
        animation: phase !== "select" ? "paperOut .3s ease both" : "none",
      }}>
        <div style={{ background: "#0d0d0d", width: "100%", minHeight: stripContentH }}>
          {/* strip header */}
          <div style={{
            height: STRIP_HEADER_H,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,.07)",
          }}>
            <div style={{ fontSize: 8, color: "#fff", fontWeight: 700, letterSpacing: ".18em" }}>✦ PHOTO BOOTH ✦</div>
            <div style={{ fontSize: 6, color: "rgba(255,255,255,.38)", marginTop: 2, letterSpacing: ".1em" }}>GALAXY EDITION</div>
          </div>

          {/* photos */}
          {filled.map((src, i) => (
            <div key={i} style={{ padding: `${STRIP_PAD}px ${STRIP_PAD}px 0` }}>
              <div style={{ border: "3px solid #fff", overflow: "hidden", lineHeight: 0 }}>
                <img src={src} style={{ width: "100%", height: `${STRIP_PH}px`, objectFit: "cover", display: "block", filter: "grayscale(1)" }} alt="" />
              </div>
            </div>
          ))}

          {/* strip footer */}
          <div style={{
            height: STRIP_FOOTER_H,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            marginTop: STRIP_PAD,
            borderTop: "1px solid rgba(255,255,255,.07)",
          }}>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,.65)", fontStyle: "italic" }}>
              {CONTENT.name.split(" ").slice(0, 2).join(" ")}
            </div>
            <div style={{ fontSize: 6, color: "rgba(255,255,255,.32)", marginTop: 2 }}>
              19 de abril de 2026 · 🎂
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {phase === "done" && (
        <div style={{ textAlign: "center", marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={download}
            style={{
              background: "rgba(14,165,233,.15)",
              border: "1px solid rgba(56,189,248,.4)",
              color: "#7dd3fc",
              borderRadius: 100,
              padding: "10px 24px",
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: ".06em",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            ⬇️ Guardar strip
          </button>
          <button
            onClick={reset}
            style={{
              background: "none",
              border: "1px solid rgba(125,211,252,.2)",
              color: "rgba(125,211,252,.5)",
              borderRadius: 100,
              padding: "10px 24px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🔄 Nueva strip
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </section>
  );
}
