import { useState, useRef, useEffect, useCallback } from "react";
import { CONTENT } from "../config";

const W = 640;
const H = 480;

// Generate overlay elements once (stable across renders)
const STARS = Array.from({ length: 42 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 2.5 + 0.8,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.03 + 0.01,
}));

const ROCKETS_POS = Array.from({ length: 7 }, () => ({
  x: Math.random() * 0.85 + 0.07,
  y: Math.random() * 0.75 + 0.07,
  size: Math.random() * 16 + 12,
  angle: (Math.random() - 0.5) * 0.8,
  phase: Math.random() * Math.PI * 2,
  bobSpeed: Math.random() * 0.8 + 0.4,
}));

function drawRocket(ctx, cx, cy, size, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Body
  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.45, -size * 0.6, size * 0.45, size * 0.15, size * 0.4, size * 0.3);
  ctx.lineTo(-size * 0.4, size * 0.3);
  ctx.bezierCurveTo(-size * 0.45, size * 0.15, -size * 0.45, -size * 0.6, 0, -size);
  ctx.fill();

  // Window
  ctx.fillStyle = "#0ea5e9";
  ctx.beginPath();
  ctx.arc(0, -size * 0.3, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.arc(-size * 0.06, -size * 0.36, size * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Fins
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, size * 0.15);
  ctx.lineTo(-size * 0.72, size * 0.48);
  ctx.lineTo(-size * 0.4, size * 0.35);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.4, size * 0.15);
  ctx.lineTo(size * 0.72, size * 0.48);
  ctx.lineTo(size * 0.4, size * 0.35);
  ctx.fill();

  // Flame
  const flameGrad = ctx.createLinearGradient(0, size * 0.28, 0, size * 0.78);
  flameGrad.addColorStop(0, "#fef08a");
  flameGrad.addColorStop(0.4, "#f97316");
  flameGrad.addColorStop(1, "transparent");
  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.54, size * 0.18, size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawOverlay(ctx, t, width, height, bottomText) {
  ctx.clearRect(0, 0, width, height);

  // Stars
  STARS.forEach((s) => {
    const alpha = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + t * s.speed * 8));
    const x = s.x * width;
    const y = s.y * height;
    ctx.save();
    ctx.globalAlpha = alpha;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, s.r * 4);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(0.35, "rgba(125,211,252,0.6)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    // Cross sparkle
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(x - s.r * 3, y);
    ctx.lineTo(x + s.r * 3, y);
    ctx.moveTo(x, y - s.r * 3);
    ctx.lineTo(x, y + s.r * 3);
    ctx.stroke();
    ctx.restore();
  });

  // Rockets
  ROCKETS_POS.forEach((r) => {
    const bobY = Math.sin(r.phase + t * r.bobSpeed) * 6;
    ctx.save();
    ctx.globalAlpha = 0.82;
    drawRocket(ctx, r.x * width, r.y * height + bobY, r.size, r.angle);
    ctx.restore();
  });

  // Cosmic frame border
  const frameW = 10;
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "rgba(14,165,233,0.7)");
  grad.addColorStop(0.5, "rgba(56,189,248,0.45)");
  grad.addColorStop(1, "rgba(6,182,212,0.7)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = frameW;
  ctx.strokeRect(frameW / 2, frameW / 2, width - frameW, height - frameW);

  // Corner brackets
  const cs = 36;
  const pad = frameW / 2 + 5;
  ctx.strokeStyle = "#7dd3fc";
  ctx.lineWidth = 2.5;
  [
    [pad, pad, 1, 1],
    [width - pad, pad, -1, 1],
    [pad, height - pad, 1, -1],
    [width - pad, height - pad, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * cs);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * cs, y);
    ctx.stroke();
  });

  // Bottom birthday text
  ctx.save();
  ctx.font = `bold ${Math.round(height * 0.038)}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.shadowColor = "#0ea5e9";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(bottomText, width / 2, height - 16);
  ctx.restore();
}

export function CamaraAR({ label = "Filtro AR", photoText = `✨ Feliz Cumpleaños ${CONTENT.name.split(" ")[0]} ✨` }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const [error, setError] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [shutterFlash, setShutterFlash] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setHasStream(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: W }, height: { ideal: H } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasStream(true);
      }
    } catch {
      setError("No se pudo acceder a la cámara 😔\nVerifica los permisos del navegador.");
    }
  }, []);

  // Animate overlay
  useEffect(() => {
    if (!hasStream) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = (ts) => {
      drawOverlay(ctx, ts / 1000, canvas.width, canvas.height, photoText);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasStream]);

  const open = () => {
    setCaptured(null);
    setError(null);
    setIsOpen(true);
  };

  const close = () => {
    stopCamera();
    setIsOpen(false);
    setCaptured(null);
  };

  useEffect(() => {
    if (isOpen) startCamera();
  }, [isOpen, startCamera]);

  const takePhoto = () => {
    const video = videoRef.current;
    const overlay = canvasRef.current;
    if (!video || !overlay) return;

    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");

    // Mirror for selfie
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, W, H);
    ctx.restore();

    // Overlay on top
    ctx.drawImage(overlay, 0, 0, W, H);

    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 350);
    setCaptured(out.toDataURL("image/png"));
  };

  const downloadPhoto = () => {
    const a = document.createElement("a");
    a.href = captured;
    a.download = "alexandra-cosmica.png";
    a.click();
  };

  const retake = () => setCaptured(null);

  return (
    <>
      <style>{`
        @keyframes arBtnGlow {
          0%,100% { box-shadow: 0 0 10px rgba(56,189,248,.5); }
          50%      { box-shadow: 0 0 26px rgba(56,189,248,.9), 0 0 50px rgba(14,165,233,.35); }
        }
        @keyframes arModalIn {
          from { opacity:0; transform:scale(.93); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes shutterFlash {
          0%,100% { opacity:0; }
          15%,55% { opacity:1; }
        }
        @keyframes capturedIn {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* ── Floating trigger button ── */}
      <button
        onClick={open}
        title="Filtro AR espacial"
        style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          zIndex: 99999,
          background: "linear-gradient(135deg,#0c4a6e,#0284c7)",
          color: "#e0f2fe",
          border: "2px solid rgba(56,189,248,.6)",
          borderRadius: 50,
          padding: "12px 20px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: ".05em",
          animation: "arBtnGlow 2.4s infinite",
          display: "flex",
          alignItems: "center",
          gap: 8,
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: 18 }}>🚀</span>
        {label}
      </button>

      {/* ── Modal ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(2,13,26,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "linear-gradient(160deg,#041a2e,#020d1a)",
              border: "1.5px solid rgba(56,189,248,.3)",
              borderRadius: 20,
              padding: 20,
              width: "100%",
              maxWidth: 680,
              animation: "arModalIn .35s ease both",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ color: "#7dd3fc", fontWeight: 800, fontSize: 18 }}>
                  🚀 Filtro AR Espacial
                </div>
                <div style={{ color: "rgba(125,211,252,.45)", fontSize: 12 }}>
                  {captured ? "Tu foto cósmica está lista" : "Sonríe al universo ✨"}
                </div>
              </div>
              <button
                onClick={close}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "#e0f2fe",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Viewfinder */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: 12,
                overflow: "hidden",
                background: "#000",
              }}
            >
              {/* Shutter flash */}
              {shutterFlash && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#fff",
                    zIndex: 10,
                    pointerEvents: "none",
                    animation: "shutterFlash .35s ease forwards",
                  }}
                />
              )}

              {/* Live video — siempre montado para no perder el stream al repetir */}
              <video
                ref={videoRef}
                muted
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  display: captured ? "none" : "block",
                }}
              />
              {/* Overlay canvas — siempre montado */}
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  display: captured ? "none" : "block",
                }}
              />
              {/* Loading / error states */}
              {!captured && !hasStream && !error && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(125,211,252,.7)",
                    fontSize: 14,
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 32 }}>📷</div>
                  Iniciando cámara…
                </div>
              )}
              {!captured && error && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fca5a5",
                    fontSize: 14,
                    flexDirection: "column",
                    gap: 10,
                    padding: 24,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                  }}
                >
                  <div style={{ fontSize: 36 }}>🚫</div>
                  {error}
                </div>
              )}
              {/* Foto capturada */}
              {captured && (
                <img
                  src={captured}
                  alt="Foto cósmica"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    animation: "capturedIn .4s ease both",
                  }}
                />
              )}
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {!captured ? (
                <button
                  onClick={takePhoto}
                  disabled={!hasStream}
                  style={{
                    background: hasStream
                      ? "linear-gradient(135deg,#0ea5e9,#06b6d4)"
                      : "rgba(255,255,255,.08)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 50,
                    padding: "13px 36px",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: hasStream ? "pointer" : "not-allowed",
                    letterSpacing: ".06em",
                    boxShadow: hasStream
                      ? "0 0 24px rgba(14,165,233,.5)"
                      : "none",
                    transition: "all .2s",
                  }}
                >
                  📸 Tomar Foto
                </button>
              ) : (
                <>
                  <button
                    onClick={retake}
                    style={{
                      background: "rgba(56,189,248,.12)",
                      color: "#7dd3fc",
                      border: "1.5px solid rgba(56,189,248,.35)",
                      borderRadius: 50,
                      padding: "12px 28px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🔄 Repetir
                  </button>
                  <button
                    onClick={downloadPhoto}
                    style={{
                      background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 50,
                      padding: "12px 28px",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(14,165,233,.45)",
                    }}
                  >
                    💾 Guardar foto
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
