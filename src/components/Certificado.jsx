import { useRef, useEffect } from "react";
import { CONTENT } from "../config";
import { Rocket } from "./Rocket";

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ── CERTIFICADO OFICIAL ── */
export function CertificadoSection() {
  const canvasRef = useRef(null);
  const starsRef = useRef(
    Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      o: Math.random() * 0.35 + 0.1,
    })),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#020d1a");
    bg.addColorStop(0.5, "#041a2e");
    bg.addColorStop(1, "#020f1c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // stars
    starsRef.current.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224,242,254,${s.o})`;
      ctx.fill();
    });

    // helper: horizontal gradient line
    const hLine = (y) => {
      const g = ctx.createLinearGradient(60, 0, W - 60, 0);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.25, "rgba(251,191,36,.5)");
      g.addColorStop(0.75, "rgba(251,191,36,.5)");
      g.addColorStop(1, "transparent");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(W - 60, y);
      ctx.stroke();
    };

    // outer border
    ctx.strokeStyle = "rgba(251,191,36,.65)";
    ctx.lineWidth = 3;
    roundRect(ctx, 16, 16, W - 32, H - 32, 10);
    ctx.stroke();
    // inner border
    ctx.strokeStyle = "rgba(251,191,36,.25)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, 28, 28, W - 56, H - 56, 6);
    ctx.stroke();

    // corner stars
    [
      [24, 24],
      [W - 24, 24],
      [24, H - 24],
      [W - 24, H - 24],
    ].forEach(([x, y]) => {
      ctx.fillStyle = "rgba(251,191,36,.85)";
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", x, y);
    });

    // header
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(251,191,36,.9)";
    ctx.font = "bold 14px Georgia, serif";
    ctx.fillText(CONTENT.certificado.header, W / 2, 78);
    ctx.fillStyle = "rgba(125,211,252,.55)";
    ctx.font = "12px Georgia, serif";
    ctx.fillText(CONTENT.certificado.subheader, W / 2, 102);

    hLine(120);

    // body
    ctx.fillStyle = "rgba(186,230,253,.6)";
    ctx.font = "15px Georgia, serif";
    ctx.fillText(CONTENT.certificado.intro, W / 2, 158);

    // name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText(CONTENT.name, W / 2, 208);

    // glow line under name
    const nameGlow = ctx.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0);
    nameGlow.addColorStop(0, "transparent");
    nameGlow.addColorStop(0.3, "rgba(56,189,248,.55)");
    nameGlow.addColorStop(0.7, "rgba(56,189,248,.55)");
    nameGlow.addColorStop(1, "transparent");
    ctx.strokeStyle = nameGlow;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 280, 218);
    ctx.lineTo(W / 2 + 280, 218);
    ctx.stroke();

    ctx.fillStyle = "rgba(186,230,253,.6)";
    ctx.font = "15px Georgia, serif";
    ctx.fillText(CONTENT.certificado.middle, W / 2, 252);

    // award
    const aGrad = ctx.createLinearGradient(W / 2 - 220, 0, W / 2 + 220, 0);
    aGrad.addColorStop(0, "#fbbf24");
    aGrad.addColorStop(0.5, "#ffffff");
    aGrad.addColorStop(1, "#fbbf24");
    ctx.fillStyle = aGrad;
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText(CONTENT.certificado.award, W / 2, 292);

    ctx.fillStyle = "rgba(186,230,253,.45)";
    ctx.font = "12px Georgia, serif";
    ctx.fillText(CONTENT.certificado.reason, W / 2, 320);

    hLine(342);

    ctx.fillStyle = "rgba(125,211,252,.38)";
    ctx.font = "11px Georgia, serif";
    ctx.fillText(CONTENT.certificado.serial, W / 2, 364);

    // ── SEAL ──
    const sx = W / 2,
      sy = 468,
      sr = 58;

    const sealBg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    sealBg.addColorStop(0, "rgba(14,165,233,.18)");
    sealBg.addColorStop(1, "rgba(2,13,26,.0)");
    ctx.fillStyle = sealBg;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(251,191,36,.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(251,191,36,.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy, sr - 9, 0, Math.PI * 2);
    ctx.stroke();

    // rocket in seal
    ctx.font = "30px serif";
    ctx.textBaseline = "middle";
    ctx.fillText("🚀", sx - 1, sy + 2);
    ctx.textBaseline = "alphabetic";

    // curved text around seal
    const sealStr = CONTENT.certificado.sealText;
    const chars = sealStr.split("");
    const angleStep = (Math.PI * 1.75) / chars.length;
    const startA = -Math.PI / 2 - (Math.PI * 1.75) / 2;
    ctx.fillStyle = "rgba(251,191,36,.7)";
    ctx.font = "bold 7.5px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    chars.forEach((ch, i) => {
      const a = startA + i * angleStep;
      ctx.save();
      ctx.translate(sx + Math.cos(a) * (sr - 5), sy + Math.sin(a) * (sr - 5));
      ctx.rotate(a + Math.PI / 2);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });

    // ── SIGNATURES ──
    const drawSig = (x, name, role) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.strokeStyle = "rgba(125,211,252,.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 80, 535);
      ctx.lineTo(x + 80, 535);
      ctx.stroke();
      ctx.fillStyle = "rgba(125,211,252,.65)";
      ctx.font = "italic 13px Georgia, serif";
      ctx.fillText(name, x, 554);
      ctx.fillStyle = "rgba(125,211,252,.32)";
      ctx.font = "10px Georgia, serif";
      ctx.fillText(role, x, 570);
    };
    drawSig(180, CONTENT.certificado.sig1Name, CONTENT.certificado.sig1Role);
    drawSig(
      W - 180,
      CONTENT.certificado.sig2Name,
      CONTENT.certificado.sig2Role,
    );
  }, []);

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = CONTENT.certificado.filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 24px 80px",
        maxWidth: 940,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            {CONTENT.certificado.label}
          </span>
          <Rocket size={18} />
        </div>
        <h3
          style={{
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#fff,#fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {CONTENT.certificado.sectionTitle}
        </h3>
      </div>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 0 60px rgba(251,191,36,.12), 0 20px 60px rgba(0,0,0,.5)",
          border: "1px solid rgba(251,191,36,.15)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={download}
          style={{
            background:
              "linear-gradient(135deg,rgba(251,191,36,.2),rgba(251,191,36,.08))",
            border: "1px solid rgba(251,191,36,.4)",
            color: "#fbbf24",
            borderRadius: 100,
            padding: "11px 32px",
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: ".08em",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(251,191,36,.25)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg,rgba(251,191,36,.2),rgba(251,191,36,.08))";
          }}
        >
          ⬇️ Descargar certificado
        </button>
      </div>
    </section>
  );
}
