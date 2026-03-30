import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   CONFIG — edita aquí
───────────────────────────────────────────── */
const BIRTHDAY = new Date("2026-04-19T00:00:00");
const EDITOR_PASSWORD = "cohete2026"; // ← tu contraseña para editar

/* ─────────────────────────────────────────────
   CONTENIDO — edita aquí textos e imágenes
───────────────────────────────────────────── */
const CONTENT = {
  name: "Alexandra Solimar (Dumbass) Rivera Méndez", // ← nombre de quien cumple años

  countdown: {
    badge: "🚀 Misión — 19 de abril",
    title: "Cuenta regresiva",
    dateStr: "19 de abril", // ← fecha que aparece en el subtítulo
    subtitle: "El universo está preparando algo especial 🌌",
    curiousText: "¿Curiosa? 👀",
  },

  giftIntro: {
    prompt: "Toca para abrir tu regalo ✨",
  },

  main: {
    badge: "🚀 Misión Cumpleaños",
    title: "¡Feliz\nCumpleaños!",
    subtitle:
      "Hoy el universo lanza sus cohetes más brillantes o algo asi para celebrar a alguien muy especial.",
  },

  messages: {
    label: "Mensajes del universo",
    title: "Galaxia del Positivismo 💫",
    subtitle: "Mensajes que el cosmos te manda",
  },

  photos: {
    label: "Momentos",
    title: "Constelación de Fotos",
    // Pon aquí las rutas de tus fotos. Usa null para mostrar el placeholder 📷
    images: [
      "/assets/IMG_0588.jpg",
      "/assets/IMG_0589.jpg",
      "/assets/IMG_0606.jpg",
      "/assets/WhatsApp Image 2026-03-29 at 17.17.51.jpeg",
      "/assets/IMG_0615.jpg",
      "/assets/IMG_0887.jpg",
      "/assets/IMG_5410.jpg",
      "/assets/IMG_5618.jpg",
      "/assets/79036423396__4EAC0B8A-7F4E-4D2B-B46E-6BE7FA63D56C.jpg",
      "/assets/79047295560__C8B63A2D-CCD6-4A3A-9255-2AD99DCFB556.jpg",
      "/assets/79084349540__EB3A7F6F-BDAC-4078-A452-0855E30D1649.jpg",
      "/assets/IMG_5053.JPG",
      "/assets/IMG_5094.JPG",
      "/assets/IMG_8749.jpg",
      "/assets/PHOTO-2025-04-11-22-30-25.jpg",
    ],
  },

  letter: {
    label: "Carta especial",
    title: "Un mensaje desde el corazón 🪐",
    body: `Querida Alexandra,



Ronaldo Elier Flores Nazario`,
  },

//   Hoy me siento a escribirte esta carta porque para cuando la leas es tu cumpleaños, y dejame decirte que eso es un día muy especial. Pues si piensas que es un cumpleaños es el día que naciste y eso fue ya hace 21 años. WOW 21 años es pal y difícil de creer.

// Pero eso quiere decir que hace 21 años nació una persona increíble, una persona que sin importar lo que pasa siempre está ahí para apoyar a los demás. Nació una personita que aunque vive su día en un corre y corre nunca deja a sus amistades atrás.

// Le agradezco a dios todos los días por haberte puesto en mi vida, ya que como siempre te he dicho tú has hecho que mejore como persona. No puedo creer que ya tienes 21 (btw me senté a escribir esto sin saber que escribir así que va a ser un rant algaro).

// Espero que el día de hoy la estés pasando increíble y que todas las metas que tengas para toda la vida la logres porque en donde sea que estés siempre das lo mejor y mereces todo lo que se te pueda dar.

// Nunca dejes de luchar por lo que quieres incluso cuando a veces las cosas se ven difíciles, la vida pone esos desafíos porque sabe que podemos ante ellos. Y si hablamos de los mejores tú te encuentras entre ellos. Eres y siempre serás luz. Que dios siempre te me bendiga y te me cuide, te quiero un millón multiplicado por infinito y siempre voy a estar aquí para ti sin importar lo que pase en el pasado, presente y futuro.

// Con mucho amor y cariño


// PD: Tu regalo va a llegar tardecito pero está duro.

  footer: {
    message: "¡Que cumplas muchos más! 🎂",
    sub: "Con amor desde el universo",
  },

  certificado: {
    label: "Reconocimiento oficial",
    sectionTitle: "Certificado de la Galaxia 🏆",
    header: "✦   CERTIFICADO OFICIAL   ✦",
    subheader: "— expedido por el Universo —",
    intro: "Por la presente se certifica que",
    middle: "es oficialmente reconocida como",
    award: '"Persona Más Especial de la Galaxia"',
    reason:
      "por mérito propio, por ser exactamente quien es y por iluminar cada rincón del cosmos",
    serial: "Expedido el 19 de abril de 2026  ·  Nº GAL-2026-ALEX-001",
    sealText: "✦ UNIVERSO OFICIAL ✦ GALAXIA 2026 ✦",
    sig1Name: "Ronaldo Flores",
    sig1Role: "Simplemente el mejor",
    sig2Name: "El Cosmos",
    sig2Role: "Director General del Universo",
    filename: "certificado-alexandra-2026.png",
  },
};

const FUNNY_MSGS = [
  "¡Espera! El cohete aún está en mantenimiento 🔧",
  "Todavía no. Vuelve el 19 de abril, impaciente espacial 🛸",
  "El universo dice: aún no. Sigue esperando 🌌",
  "Error 404: Cumpleaños no encontrado todavía 💻",
  "Houston, tenemos un problema... ¡aún no es tu día! 🚀",
  "Los aliens pidieron que esperaras un poco más 👽",
  "El pastel sigue en el horno, astronauta 🎂",
  "Paciencia, joven Skywalker del cosmos ✨",
  "¡Prohibido entrar sin ser el/la cumpleañero/a! 🚫",
  "El agujero negro se tragó tu acceso... por ahora ⚫",
  "La NASA bloqueó tu entrada temporalmente 🛑",
  "Las estrellas dicen: 'aún no, pero pronto' 🌠",
  "Intento fallido. El universo tiene sentido del humor 😏",
  "Ni el telescopio Hubble ve tan lejos hacia adelante ⏰",
  "¡INTRUSO ESPACIAL DETECTADO! Regresa el 19 abril 🚨",
];

const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const CONFETTI_COLORS = [
  "#7dd3fc",
  "#fbbf24",
  "#a5f3fc",
  "#f472b6",
  "#34d399",
  "#fb923c",
  "#fff",
  "#38bdf8",
];
const confettiPieces = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: rand(0, 100),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: rand(7, 14),
  dur: rand(2.8, 5.5),
  delay: rand(0, 3.5),
  rot: rand(0, 360),
  drift: rand(-80, 80),
  isCircle: i % 3 === 0,
}));

// Fotos flotantes para la pantalla de countdown
const PHOTO_SLOTS = [
  { top: "5%", left: "2%", rot: -12, dur: 6, delay: 0 },
  { top: "4%", right: "2%", rot: 10, dur: 7, delay: 1.5 },
  { top: "38%", left: "1%", rot: -8, dur: 8, delay: 0.8 },
  { top: "36%", right: "0%", rot: 7, dur: 6.5, delay: 2 },
  { bottom: "12%", left: "1%", rot: 14, dur: 7.5, delay: 0.3 },
  { bottom: "10%", right: "1%", rot: -10, dur: 9, delay: 1 },
];
const _shuffled = [...CONTENT.photos.images].sort(() => Math.random() - 0.5);
const FLOATING_PHOTOS = PHOTO_SLOTS.map((slot, i) => ({
  ...slot,
  src: _shuffled[i % _shuffled.length],
}));

const stars = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  x: rand(0, 100),
  y: rand(0, 100),
  size: rand(0.4, 2.2),
  delay: rand(0, 6),
  dur: rand(2, 5),
}));
const BG_ROCKETS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: rand(2, 95),
  y: rand(5, 92),
  size: rand(22, 52),
  angle: rand(-35, 35),
  dur: rand(12, 24),
  delay: rand(0, 10),
}));

const POSITIVE_MSGS = [
  "Eres la estrella más brillante de toda la galaxia 🌟",
  "Tu sonrisa ilumina el universo entero ✨",
  "Cada día contigo es una aventura cósmica 🚀",
  "Eres tan único como una constelación irrepetible 🌌",
  "El universo conspiró para traerte al mundo 💫",
  "Tu energía carga de vida cada rincón del cosmos ⚡",
  "Eres la razón por la que las estrellas brillan más 🌠",
  "Tu corazón es más grande que cualquier nebulosa 💙",
  "El mundo es infinitamente mejor porque tú estás en él 🌍",
  "Tienes la capacidad de convertir días grises en cielo estrellado ☀️",
  "Cada momento a tu lado vale más que mil galaxias 🪐",
  "Tu risa es el sonido favorito del universo 🎶",
  "La NASA no ha descubierto nada más maravilloso que tú 🔭",
  "Eres la misión espacial más exitosa de la historia 🏆",
  "Llevas en ti la luz de mil soles 🌞",
  "El espacio es infinito, pero tu impacto aún es mayor 💥",
  "Tu alegría es combustible para los cohetes más poderosos 🔥",
  "El universo te eligió para ser exactamente quien eres 🎯",
  "Incluso los agujeros negros se iluminan cuando sonríes 😊",
  "Eres la frecuencia de amor más alta en toda la galaxia 📡",
];

/* ── SVG ROCKET ── */
const Rocket = ({ size = 40, glow = false }) => (
  <svg width={size} height={size * 2.2} viewBox="0 0 40 88" fill="none">
    <defs>
      <linearGradient
        id="rb"
        x1="8"
        y1="4"
        x2="32"
        y2="38"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="60%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>
      {glow && (
        <filter id="rg">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      )}
    </defs>
    <path
      d="M20 4 C12 4 8 22 8 38 L32 38 C32 22 28 4 20 4Z"
      fill="url(#rb)"
      filter={glow ? "url(#rg)" : undefined}
    />
    <path d="M20 2 C16 2 12 10 12 18 L28 18 C28 10 24 2 20 2Z" fill="#bae6fd" />
    <circle
      cx="20"
      cy="28"
      r="5"
      fill="#0ea5e9"
      stroke="#7dd3fc"
      strokeWidth="1.5"
    />
    <circle cx="18.5" cy="26.5" r="1.5" fill="rgba(255,255,255,0.5)" />
    <path d="M8 38 L2 50 L8 48Z" fill="#0284c7" />
    <path d="M32 38 L38 50 L32 48Z" fill="#0284c7" />
    <rect x="10" y="38" width="20" height="6" rx="2" fill="#075985" />
    <ellipse cx="20" cy="56" rx="6" ry="12" fill="url(#rf)" opacity="0.9" />
    <ellipse cx="20" cy="52" rx="3" ry="7" fill="#fef08a" opacity="0.8" />
    <circle cx="15" cy="62" r="1.2" fill="#fbbf24" opacity="0.7" />
    <circle cx="25" cy="64" r="1" fill="#f97316" opacity="0.6" />
  </svg>
);

const Planet = ({ r = 36, c1 = "#0c4a6e", c2 = "#06b6d4", ring = false }) => (
  <svg
    width={r * 2 + (ring ? 44 : 0)}
    height={r * 2 + (ring ? 18 : 0)}
    viewBox={`0 0 ${r * 2 + (ring ? 44 : 0)} ${r * 2 + (ring ? 18 : 0)}`}
  >
    <defs>
      <radialGradient id={`pg${r}`} cx="35%" cy="30%">
        <stop offset="0%" stopColor={c2} />
        <stop offset="100%" stopColor={c1} />
      </radialGradient>
    </defs>
    {ring && (
      <ellipse
        cx={r + 22}
        cy={r + 14}
        rx={r + 18}
        ry={9}
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4"
        opacity="0.3"
      />
    )}
    <circle
      cx={r + (ring ? 22 : 0)}
      cy={r + (ring ? 8 : 0)}
      r={r}
      fill={`url(#pg${r})`}
      opacity="0.88"
    />
  </svg>
);

/* ── CONFETTI ── */
function Confetti() {
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
function StarCursor() {
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

const StarField = () => (
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

/* ── COUNTDOWN GATE ── */
function CountdownGate({ onEditorAccess }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [funnyMsg, setFunnyMsg] = useState(null);
  const [giftPhase, setGiftPhase] = useState("idle");
  const [showPwInput, setShowPwInput] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = BIRTHDAY - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const shakeGift = () => {
    if (giftPhase !== "idle") return;
    setGiftPhase("shaking");
    setTimeout(() => {
      setFunnyMsg(pick(FUNNY_MSGS.filter((m) => m !== funnyMsg)));
      setGiftPhase("idle");
    }, 700);
  };

  const tryPw = () => {
    if (pw === EDITOR_PASSWORD) {
      onEditorAccess();
    } else {
      setPwError(true);
      setPw("");
      setTimeout(() => setPwError(false), 1500);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#020d1a,#041a2e,#020f1c)",
        color: "#e0f2fe",
        fontFamily: "var(--font-sans,system-ui,sans-serif)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "40px 24px",
      }}
    >
      <style>{`
        @keyframes twinkle{from{opacity:.1}to{opacity:.85}}
        @keyframes shoot{0%{left:-15%;opacity:0}5%{opacity:1}80%{opacity:.6}100%{left:110%;opacity:0}}
        @keyframes shake{0%,100%{transform:rotate(0)translateX(0)}20%{transform:rotate(-8deg)translateX(-8px)}40%{transform:rotate(8deg)translateX(8px)}60%{transform:rotate(-5deg)translateX(-5px)}80%{transform:rotate(5deg)translateX(5px)}}
        @keyframes pulse{0%,100%{opacity:.65;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes orbit{from{transform:rotate(0deg) translateX(80px) rotate(0deg)}to{transform:rotate(360deg) translateX(80px) rotate(-360deg)}}
        @keyframes msgPop{0%{opacity:0;transform:translateY(10px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes bgR{0%,100%{transform:translateY(0) rotate(var(--a,0deg))}50%{transform:translateY(-14px) rotate(var(--a,0deg))}}
        @keyframes errShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      `}</style>
      <style>{`
        @keyframes floatPic{0%,100%{transform:translateY(0px)}50%{transform:translateY(-12px)}}
      `}</style>
      <StarField />

      {/* Fotos flotantes polaroid — ocultas en pantallas < 480px */}
      {FLOATING_PHOTOS.map((p, i) => (
        <div
          key={i}
          className="floating-pic"
          style={{
            position: "fixed",
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            zIndex: 0,
            pointerEvents: "none",
            animation: `floatPic ${p.dur}s ${p.delay}s infinite ease-in-out`,
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "6px 6px 22px",
              borderRadius: 4,
              boxShadow: "0 6px 24px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.3)",
              width: 86,
              opacity: 0.75,
            }}
          >
            <img
              src={p.src}
              alt=""
              style={{
                width: "100%",
                height: 90,
                objectFit: "cover",
                display: "block",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}

      {BG_ROCKETS.map((r) => (
        <div
          key={r.id}
          style={{
            position: "fixed",
            left: `${r.x}%`,
            top: `${r.y}%`,
            opacity: 0.08,
            pointerEvents: "none",
            zIndex: 0,
            "--a": `${r.angle}deg`,
            animation: `bgR ${r.dur}s ${r.delay}s infinite ease-in-out`,
            transform: `rotate(${r.angle}deg)`,
          }}
        >
          <Rocket size={r.size} />
        </div>
      ))}

      {/* planet deco */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: "6%",
          opacity: 0.4,
          animation: "pulse 7s infinite",
        }}
      >
        <Planet r={28} c1="#0c4a6e" c2="#0ea5e9" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: "5%",
          opacity: 0.38,
          animation: "pulse 9s 2s infinite",
        }}
      >
        <Planet r={38} c1="#065f46" c2="#06b6d4" ring />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 560,
          width: "100%",
        }}
      >
        {/* badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "rgba(14,165,233,.12)",
              border: "1px solid rgba(56,189,248,.28)",
              borderRadius: 100,
              padding: "5px 20px",
              fontSize: 11,
              color: "rgba(125,211,252,.85)",
              letterSpacing: ".13em",
              textTransform: "uppercase",
            }}
          >
            {CONTENT.countdown.badge}
          </div>
        </div>

        {/* orbiting planet */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              margin: "0 auto",
              background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#38bdf8)",
              boxShadow:
                "0 0 50px rgba(14,165,233,.5),0 0 100px rgba(6,182,212,.15)",
              animation: "pulse 3.5s infinite",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: "50%",
                border: "1.5px solid rgba(125,211,252,.18)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -14,
              marginLeft: -14,
              width: 28,
              height: 28,
              animation: "orbit 5s linear infinite",
            }}
          >
            <div style={{ transform: "rotate(45deg)" }}>
              <Rocket size={24} />
            </div>
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px,7vw,62px)",
            fontWeight: 800,
            margin: "0 0 8px",
            lineHeight: 1.1,
            background: "linear-gradient(135deg,#fff 20%,#7dd3fc 55%,#38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-.02em",
          }}
        >
          {CONTENT.countdown.title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "rgba(186,230,253,.45)",
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          La misión se activa el{" "}
          <strong style={{ color: "rgba(125,211,252,.75)" }}>
            {CONTENT.countdown.dateStr}
          </strong>
          . {CONTENT.countdown.subtitle}
        </p>

        {/* countdown boxes */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { v: time.d, l: "Días" },
            { v: time.h, l: "Horas" },
            { v: time.m, l: "Min" },
            { v: time.s, l: "Seg" },
          ].map(({ v, l }) => (
            <div
              key={l}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(125,211,252,.14)",
                borderRadius: 16,
                padding: "18px 22px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                minWidth: 78,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(v).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,.38)",
                  marginTop: 5,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* gift box */}
        <p
          style={{
            fontSize: 13,
            color: "rgba(125,211,252,.45)",
            marginBottom: 20,
            letterSpacing: ".06em",
          }}
        >
          {CONTENT.countdown.curiousText}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* lid */}
          <div
            style={{
              width: 130,
              position: "relative",
              zIndex: 2,
              marginBottom: -2,
            }}
          >
            <div
              style={{
                height: 34,
                background: "linear-gradient(135deg,#0369a1,#0284c7)",
                borderRadius: "10px 10px 0 0",
                border: "1.5px solid rgba(125,211,252,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {[
                  [-14, -6, -28],
                  [14, -6, 28],
                ].map(([x, y, rot], i) => (
                  <div
                    key={i}
                    style={{
                      width: 26,
                      height: 18,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                      transform: `translate(${x}px,${y}px) rotate(${rot}deg)`,
                      position: "absolute",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "#7dd3fc",
                    position: "absolute",
                    top: 6,
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              </div>
              <div
                style={{
                  width: 12,
                  height: "100%",
                  background: "rgba(186,230,253,.2)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          {/* body */}
          <div
            onClick={shakeGift}
            style={{
              cursor: "pointer",
              userSelect: "none",
              touchAction: "manipulation",
              width: 130,
              animation: giftPhase === "shaking" ? "shake .65s ease" : "none",
            }}
          >
            <div
              style={{
                height: 110,
                background: "linear-gradient(160deg,#0c4a6e,#075985)",
                border: "1.5px solid rgba(125,211,252,.3)",
                borderRadius: "0 0 12px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 28px rgba(14,165,233,.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 12,
                  height: "100%",
                  background: "rgba(186,230,253,.14)",
                }}
              />
              <span style={{ fontSize: 38 }}>🎁</span>
            </div>
          </div>
        </div>

        {/* funny message */}
        {funnyMsg && (
          <div
            key={funnyMsg}
            style={{
              marginTop: 28,
              background:
                "linear-gradient(135deg,rgba(7,89,133,.5),rgba(6,182,212,.2))",
              border: "1px solid rgba(125,211,252,.22)",
              borderRadius: 14,
              padding: "14px 20px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              fontSize: 14,
              color: "rgba(224,242,254,.9)",
              animation: "msgPop .4s ease both",
              lineHeight: 1.5,
            }}
          >
            {funnyMsg}
          </div>
        )}

        {/* editor access */}
        <div
          style={{
            marginTop: 48,
            borderTop: "1px solid rgba(56,189,248,.08)",
            paddingTop: 28,
          }}
        >
          {!showPwInput ? (
            <button
              onClick={() => setShowPwInput(true)}
              style={{
                background: "none",
                border: "1px solid rgba(56,189,248,.2)",
                color: "rgba(125,211,252,.5)",
                borderRadius: 100,
                padding: "7px 20px",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: ".08em",
                transition: "all .2s",
                touchAction: "manipulation",
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderColor = "rgba(56,189,248,.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.borderColor = "rgba(56,189,248,.2)")
              }
            >
              🔑 Acceso editor
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tryPw()}
                placeholder="Contraseña..."
                style={{
                  background: "rgba(7,89,133,.3)",
                  border: `1px solid ${pwError ? "rgba(239,68,68,.7)" : "rgba(125,211,252,.25)"}`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  color: "#e0f2fe",
                  fontSize: 16,
                  outline: "none",
                  width: 180,
                  animation: pwError ? "errShake .3s ease" : "none",
                }}
              />
              <button
                onClick={tryPw}
                style={{
                  background: "rgba(14,165,233,.2)",
                  border: "1px solid rgba(56,189,248,.3)",
                  color: "#7dd3fc",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  touchAction: "manipulation",
                }}
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setShowPwInput(false);
                  setPw("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(125,211,252,.4)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                cancelar
              </button>
            </div>
          )}
          {pwError && (
            <p
              style={{
                fontSize: 12,
                color: "rgba(239,68,68,.7)",
                marginTop: 8,
              }}
            >
              Contraseña incorrecta 🚫
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── GIFT INTRO (para cuando ya es el día) ── */
function GiftIntro({ onDone }) {
  const [phase, setPhase] = useState("idle");
  const start = () => {
    setPhase("shaking");
    setTimeout(() => setPhase("opening"), 900);
    setTimeout(() => setPhase("launching"), 1700);
    setTimeout(() => onDone(), 3100);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(160deg,#020d1a,#041525,#020a12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes shake2{0%,100%{transform:rotate(0)translateX(0)}20%{transform:rotate(-7deg)translateX(-7px)}40%{transform:rotate(7deg)translateX(7px)}60%{transform:rotate(-4deg)translateX(-4px)}80%{transform:rotate(4deg)translateX(4px)}}
        @keyframes lidOff2{0%{transform:translateY(0)rotate(0);opacity:1}60%{transform:translateY(-100px)rotate(-30deg);opacity:1}100%{transform:translateY(-180px)rotate(-50deg);opacity:0}}
        @keyframes rLaunch{0%{transform:translateY(0)scale(1);opacity:1}100%{transform:translateY(-600px)scale(0.3);opacity:0}}
        @keyframes flashW{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
        @keyframes promptP{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes mstar{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(0.2)}}
      `}</style>
      {stars.slice(0, 70).map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#7dd3fc",
            opacity: phase === "launching" ? 0 : 0.4,
            transition: "opacity .5s",
          }}
        />
      ))}
      {phase === "launching" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            animation: "flashW 1.4s ease forwards",
            pointerEvents: "none",
          }}
        />
      )}
      {phase === "launching" &&
        Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 7 + Math.random() * 8,
                height: 7 + Math.random() * 8,
                borderRadius: "50%",
                background: [
                  "#7dd3fc",
                  "#38bdf8",
                  "#a5f3fc",
                  "#fbbf24",
                  "#fff",
                  "#bae6fd",
                ][i % 6],
                "--tx": `${Math.cos(a) * (100 + Math.random() * 140)}px`,
                "--ty": `${Math.sin(a) * (100 + Math.random() * 140)}px`,
                animation: `mstar 1.2s ${i * 0.03}s ease-out forwards`,
              }}
            />
          );
        })}
      <div
        onClick={phase === "idle" ? start : undefined}
        style={{
          cursor: phase === "idle" ? "pointer" : "default",
          position: "relative",
          userSelect: "none",
          touchAction: "manipulation",
        }}
      >
        <div
          style={{
            width: 164,
            height: 46,
            background: "linear-gradient(135deg,#0369a1,#0284c7)",
            borderRadius: "10px 10px 0 0",
            border: "1.5px solid rgba(125,211,252,.4)",
            marginBottom: -2,
            position: "relative",
            animation:
              phase === "shaking"
                ? "shake2 .85s ease"
                : phase === "opening" || phase === "launching"
                  ? "lidOff2 .9s ease forwards"
                  : "none",
            boxShadow: "0 0 28px rgba(125,211,252,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -22,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {[
              [-18, -8, -30],
              [18, -8, 30],
            ].map(([x, y, rot], i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                  transform: `translate(${x}px,${y}px) rotate(${rot}deg)`,
                  border: "1px solid rgba(186,230,253,.5)",
                  position: "absolute",
                }}
              />
            ))}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#7dd3fc",
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>
          <div
            style={{
              width: 14,
              height: "100%",
              background: "rgba(186,230,253,.2)",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            width: 164,
            height: 136,
            background: "linear-gradient(160deg,#0c4a6e,#075985)",
            border: "1.5px solid rgba(125,211,252,.3)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 14,
              height: "100%",
              background: "rgba(186,230,253,.15)",
            }}
          />
          <div
            style={{
              animation:
                phase === "launching" ? "rLaunch 1.3s ease forwards" : "none",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Rocket size={54} glow />
          </div>
        </div>
      </div>
      {phase === "idle" && (
        <p
          style={{
            marginTop: 36,
            fontSize: 13,
            color: "rgba(125,211,252,.7)",
            letterSpacing: ".13em",
            textTransform: "uppercase",
            animation: "promptP 2s infinite",
          }}
        >
          {CONTENT.giftIntro.prompt}
        </p>
      )}
    </div>
  );
}

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

/* ── BIRTHDAY CAKE ── */
function BirthdayCakeSection() {
  const N = 5;
  const [lit, setLit] = useState(() => Array(N).fill(true));
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const [allOut, setAllOut] = useState(false);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const litCountRef = useRef(N);

  const blowOne = useCallback(() => {
    setLit((prev) => {
      const idx = prev.findIndex(Boolean);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = false;
      litCountRef.current = next.filter(Boolean).length;
      return next;
    });
  }, []);

  const tapCandle = (i) => {
    setLit((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      litCountRef.current = next.filter(Boolean).length;
      return next;
    });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window["webkitAudioContext"])();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      let cd = 0;
      const tick = () => {
        if (litCountRef.current === 0) return;
        analyser.getByteFrequencyData(buf);
        const vol = buf.reduce((a, b) => a + b, 0) / buf.length;
        if (vol > 22 && cd <= 0) {
          blowOne();
          cd = 38;
        }
        cd--;
        rafRef.current = requestAnimationFrame(tick);
      };
      setMicActive(true);
      tick();
    } catch {
      setMicError(true);
    }
  };

  useEffect(() => {
    if (lit.every((v) => !v) && !allOut) {
      setAllOut(true);
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
  }, [lit, allOut]);

  const CANDLE_COLORS = [
    ["#f472b6", "#db2777"],
    ["#a78bfa", "#7c3aed"],
    ["#34d399", "#059669"],
    ["#fbbf24", "#d97706"],
    ["#38bdf8", "#0284c7"],
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "20px 24px 80px",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes flicker{0%,100%{transform:scaleX(1) scaleY(1) translateY(0);opacity:1}25%{transform:scaleX(.82) scaleY(1.12) translateY(-1px);opacity:.88}50%{transform:scaleX(1.12) scaleY(.9) translateY(1px);opacity:1}75%{transform:scaleX(.88) scaleY(1.06) translateY(-1px);opacity:.84}}
        @keyframes cakeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wishPop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        @keyframes smokeUp{0%{opacity:.7;transform:translateY(0) scaleX(1)}100%{opacity:0;transform:translateY(-28px) scaleX(1.8)}}
      `}</style>

      <div
        style={{ display: "inline-block", animation: "cakeIn .8s ease both" }}
      >
        {/* candles */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginBottom: 4,
            alignItems: "flex-end",
          }}
        >
          {lit.map((isLit, i) => (
            <div
              key={i}
              onClick={() => tapCandle(i)}
              style={{
                cursor: isLit ? "pointer" : "default",
                touchAction: "manipulation",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                padding: "8px 10px",
                margin: "-8px -10px",
              }}
            >
              {/* smoke when blown out */}
              {!isLit && (
                <div
                  style={{
                    width: 6,
                    height: 10,
                    background: "rgba(200,220,255,.35)",
                    borderRadius: "50%",
                    animation: "smokeUp .8s ease forwards",
                    marginBottom: 2,
                  }}
                />
              )}
              {/* flame */}
              <div
                style={{
                  width: 12,
                  height: isLit ? 20 : 0,
                  background:
                    "radial-gradient(ellipse at 50% 90%, #fff 0%, #fbbf24 35%, #f97316 70%, transparent 100%)",
                  borderRadius: "50% 50% 35% 35%",
                  animation: isLit
                    ? `flicker ${0.75 + i * 0.12}s ${i * 0.08}s infinite`
                    : "none",
                  transformOrigin: "bottom center",
                  transition: "height .25s",
                  filter: isLit
                    ? "drop-shadow(0 0 5px #fbbf24) drop-shadow(0 0 10px #f97316)"
                    : "none",
                  marginBottom: 1,
                }}
              />
              {/* body */}
              <div
                style={{
                  width: 12,
                  height: 40,
                  background: isLit
                    ? `linear-gradient(180deg,${CANDLE_COLORS[i][0]},${CANDLE_COLORS[i][1]})`
                    : "rgba(255,255,255,.15)",
                  borderRadius: "3px 3px 2px 2px",
                  transition: "background .6s",
                  position: "relative",
                  boxShadow: isLit
                    ? `0 0 8px ${CANDLE_COLORS[i][0]}55`
                    : "none",
                }}
              >
                {isLit && (
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 2,
                      width: 3,
                      height: 10,
                      background: "rgba(255,255,255,.3)",
                      borderRadius: 4,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* top tier */}
        <div
          style={{
            width: 190,
            margin: "0 auto",
            height: 38,
            background: "linear-gradient(180deg,#be185d,#9d174d)",
            borderRadius: "10px 10px 0 0",
            border: "2px solid rgba(255,255,255,.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "rgba(255,255,255,.08)",
              borderRadius: "10px 10px 0 0",
            }}
          />
          {[22, 58, 94, 130, 166].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: "50%",
                left: x,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "rgba(255,255,255,.55)",
                transform: "translateY(-50%)",
              }}
            />
          ))}
        </div>

        {/* middle tier */}
        <div
          style={{
            width: 250,
            margin: "0 auto",
            height: 46,
            background: "linear-gradient(180deg,#6d28d9,#4c1d95)",
            border: "2px solid rgba(255,255,255,.1)",
            borderTop: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "35%",
              background: "rgba(255,255,255,.07)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.55)",
                letterSpacing: ".15em",
                textTransform: "uppercase",
              }}
            >
              Feliz Cumpleaños
            </span>
          </div>
        </div>

        {/* bottom tier */}
        <div
          style={{
            width: 300,
            margin: "0 auto",
            height: 54,
            background: "linear-gradient(180deg,#0c4a6e,#075985)",
            border: "2px solid rgba(125,211,252,.18)",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: "rgba(125,211,252,.06)",
            }}
          />
          {[28, 68, 108, 148, 188, 228].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: 0,
                left: x,
                width: 16,
                height: "100%",
                background: "rgba(255,255,255,.03)",
              }}
            />
          ))}
          {/* plate */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: -10,
              right: -10,
              height: 14,
              background: "rgba(125,211,252,.12)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
        </div>
      </div>

      {/* controls */}
      {!allOut ? (
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{ fontSize: 14, color: "rgba(125,211,252,.55)", margin: 0 }}
          >
            Toca las velitas para apagarlas, o...
          </p>
          {!micActive ? (
            <button
              onClick={startMic}
              style={{
                background: "rgba(14,165,233,.15)",
                border: "1px solid rgba(56,189,248,.35)",
                color: "#7dd3fc",
                borderRadius: 100,
                padding: "10px 28px",
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: ".08em",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              🎤 Sopla con el micrófono
            </button>
          ) : (
            <p
              style={{
                fontSize: 13,
                color: "#7dd3fc",
                margin: 0,
                animation: "pulse 1.5s infinite",
              }}
            >
              🎤 Escuchando... ¡sopla!
            </p>
          )}
          {micError && (
            <p style={{ fontSize: 12, color: "rgba(239,68,68,.6)", margin: 0 }}>
              Micrófono no disponible — toca las velitas 👆
            </p>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 32, animation: "wishPop .6s ease both" }}>
          <p style={{ fontSize: 32, margin: "0 0 10px" }}>🎉</p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#7dd3fc",
              margin: "0 0 8px",
            }}
          >
            ¡Que se cumplan todos tus deseos!
          </p>
          <p style={{ fontSize: 14, color: "rgba(125,211,252,.5)", margin: 0 }}>
            El universo ya los está procesando ✨
          </p>
        </div>
      )}
    </section>
  );
}

function MessagesGalaxy() {
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

function PhotoTimeline() {
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

function LetterSection() {
  const [phase, setPhase] = useState("closed"); // closed | opening | open

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1100);
  };

  const download = () => {
    const win = window.open("", "_blank");
    win.document
      .write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Carta — ${CONTENT.name}</title><style>
      body{margin:0;padding:48px 56px;background:#020d1a;color:#e0f2fe;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.9}
      h1{font-size:20px;margin:0 0 8px;color:#7dd3fc;font-family:system-ui,sans-serif;font-weight:700}
      .sub{font-size:13px;color:rgba(125,211,252,.5);margin:0 0 36px;font-family:system-ui,sans-serif}
      pre{white-space:pre-wrap;word-break:break-word;margin:0}
      hr{border:none;border-top:1px solid rgba(125,211,252,.15);margin:32px 0}
    </style></head><body>
      <h1>${CONTENT.letter.title}</h1>
      <p class="sub">${CONTENT.letter.label}</p>
      <hr/>
      <pre>${CONTENT.letter.body}</pre>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 24px 80px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes flapOpen{0%{transform:rotateX(0deg);opacity:1}70%{opacity:1}100%{transform:rotateX(-160deg);opacity:0}}
        @keyframes letterRise{0%{opacity:0;transform:translateY(32px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes sealPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
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
            {CONTENT.letter.label}
          </span>
          <Rocket size={18} />
        </div>
        <h3
          style={{
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#fff,#bae6fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 8px",
          }}
        >
          {CONTENT.letter.title}
        </h3>
      </div>

      {phase !== "open" ? (
        <div
          onClick={open}
          style={{
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            touchAction: "manipulation",
          }}
        >
          {/* envelope */}
          <div
            style={{
              position: "relative",
              width: "min(320px,88vw)",
              height: 210,
              perspective: 900,
            }}
          >
            {/* body + interior folds (SVG) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(160deg,#0c4a6e,#075985)",
                border: "1.5px solid rgba(125,211,252,.28)",
                borderRadius: 10,
                boxShadow: "0 12px 44px rgba(14,165,233,.25)",
                overflow: "hidden",
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 320 210"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0 }}
              >
                {/* bottom fold */}
                <polygon
                  points="0,210 320,210 160,118"
                  fill="rgba(0,0,0,.18)"
                />
                {/* left fold */}
                <polygon points="0,0 0,210 160,118" fill="rgba(0,0,0,.10)" />
                {/* right fold */}
                <polygon
                  points="320,0 320,210 160,118"
                  fill="rgba(0,0,0,.10)"
                />
                {/* fold lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.18)"
                  strokeWidth="1"
                />
                <line
                  x1="320"
                  y1="0"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.18)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="210"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.13)"
                  strokeWidth="1"
                />
                <line
                  x1="320"
                  y1="210"
                  x2="160"
                  y2="118"
                  stroke="rgba(125,211,252,.13)"
                  strokeWidth="1"
                />
              </svg>

              {/* center content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  zIndex: 1,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    animation:
                      phase === "closed" ? "sealPulse 2s infinite" : "none",
                  }}
                >
                  💌
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(125,211,252,.6)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {phase === "closed" ? "Toca para abrir 💫" : "✨"}
                </span>
              </div>
            </div>

            {/* top flap — rotates open from top edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "55%",
                clipPath: "polygon(0 0, 100% 0, 50% 82%)",
                background: "linear-gradient(180deg,#0e5fa8,#0c4a6e)",
                border: "1.5px solid rgba(125,211,252,.32)",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                zIndex: 2,
                animation:
                  phase === "opening" ? "flapOpen 1s ease forwards" : "none",
              }}
            />
          </div>

          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              color: "rgba(125,211,252,.45)",
              letterSpacing: ".06em",
            }}
          >
            {phase === "closed" ? "Toca el sobre para abrirlo" : "Abriendo..."}
          </p>
        </div>
      ) : (
        <div style={{ animation: "letterRise .7s ease both" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                background:
                  "linear-gradient(160deg,rgba(7,89,133,.28),rgba(4,26,50,.5))",
                border: "1px solid rgba(125,211,252,.18)",
                borderRadius: 20,
                padding: "44px 36px 36px",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  opacity: 0.18,
                  transform: "rotate(30deg)",
                }}
              >
                <Rocket size={30} />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 20,
                  opacity: 0.18,
                  transform: "rotate(-20deg)",
                }}
              >
                <Rocket size={24} />
              </div>
              <div
                style={{
                  fontFamily: "Georgia,'Times New Roman',serif",
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "rgba(224,242,254,.82)",
                  position: "relative",
                  zIndex: 1,
                  whiteSpace: "pre-line",
                }}
              >
                {CONTENT.letter.body}
              </div>
              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(56,189,248,.15)",
                  }}
                />
                <div style={{ opacity: 0.5 }}>
                  <Rocket size={18} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(56,189,248,.15)",
                  }}
                />
              </div>
            </div>
          </div>
          {/* download button */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={download}
              style={{
                background: "rgba(14,165,233,.15)",
                border: "1px solid rgba(56,189,248,.35)",
                color: "#7dd3fc",
                borderRadius: 100,
                padding: "10px 28px",
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: ".08em",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(14,165,233,.28)";
                e.target.style.borderColor = "rgba(56,189,248,.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(14,165,233,.15)";
                e.target.style.borderColor = "rgba(56,189,248,.35)";
              }}
            >
              📄 Descargar carta
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── CERTIFICADO OFICIAL ── */
function CertificadoSection() {
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

function roundRect(ctx, x, y, w, h, r) {
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

/* ── PHOTO BOOTH ── */
function PhotoBoothSection() {
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

/* ── MAIN PAGE ── */
function MainPage() {
  const [giftDone, setGiftDone] = useState(false);
  return (
    <>
      {!giftDone && <GiftIntro onDone={() => setGiftDone(true)} />}
      <StarCursor />
      {giftDone && <Confetti />}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#020d1a 0%,#041a2e 45%,#020f1c 100%)",
          color: "#e0f2fe",
          fontFamily: "var(--font-sans,system-ui,sans-serif)",
          position: "relative",
          overflow: "hidden",
          animation: giftDone ? "pageReveal .9s ease both" : "none",
          opacity: giftDone ? 1 : 0,
        }}
      >
        <style>{`
          @keyframes pageReveal{from{opacity:0}to{opacity:1}}
          @keyframes bgR{0%,100%{transform:translateY(0) rotate(var(--a,0deg))}50%{transform:translateY(-14px) rotate(var(--a,0deg))}}
          @keyframes msgFloat{0%{transform:translateY(0);opacity:0}8%{opacity:1}85%{opacity:.85}100%{transform:translateY(-420px);opacity:0}}
          *{box-sizing:border-box} ::-webkit-scrollbar{display:none}
        `}</style>
        <StarField />
        {BG_ROCKETS.map((r) => (
          <div
            key={r.id}
            style={{
              position: "fixed",
              left: `${r.x}%`,
              top: `${r.y}%`,
              opacity: 0.1,
              pointerEvents: "none",
              zIndex: 0,
              "--a": `${r.angle}deg`,
              animation: `bgR ${r.dur}s ${r.delay}s infinite ease-in-out`,
              transform: `rotate(${r.angle}deg)`,
            }}
          >
            <Rocket size={r.size} />
          </div>
        ))}
        {[
          { c: "#0369a1", t: -160, l: -120, w: 500 },
          { c: "#0891b2", t: 300, r: -100, w: 400 },
          { c: "#0284c7", b: 80, l: "28%", w: 360 },
        ].map((o, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              borderRadius: "50%",
              filter: "blur(70px)",
              width: o.w,
              height: o.w,
              background: `radial-gradient(${o.c},transparent)`,
              opacity: 0.14,
              top: o.t,
              left: o.l,
              right: o.r,
              bottom: o.b,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        <section
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "90px 24px 70px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "7%",
              opacity: 0.5,
              animation: "pulse 6s 1s infinite",
            }}
          >
            <Planet r={26} c1="#0c4a6e" c2="#0ea5e9" />
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: "5%",
              opacity: 0.45,
              animation: "pulse 8s 2s infinite",
            }}
          >
            <Planet r={38} c1="#065f46" c2="#06b6d4" ring />
          </div>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 44,
            }}
          >
            <div
              style={{
                width: 118,
                height: 118,
                borderRadius: "50%",
                margin: "0 auto",
                background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#38bdf8)",
                boxShadow:
                  "0 0 60px rgba(14,165,233,.55),0 0 120px rgba(6,182,212,.18)",
                animation: "pulse 3.5s infinite",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(125,211,252,.2)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -16,
                marginLeft: -16,
                width: 32,
                height: 32,
                animation: "orbit 4s linear infinite",
              }}
            >
              <div style={{ transform: "rotate(45deg)" }}>
                <Rocket size={28} />
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(14,165,233,.12)",
                border: "1px solid rgba(56,189,248,.28)",
                borderRadius: 100,
                padding: "6px 22px",
                fontSize: 12,
                color: "rgba(125,211,252,.9)",
                letterSpacing: ".13em",
                textTransform: "uppercase",
                marginBottom: 28,
              }}
            >
              {CONTENT.main.badge}
            </div>
            <h1
              style={{
                fontSize: "clamp(48px,10vw,94px)",
                fontWeight: 800,
                margin: "0 0 10px",
                lineHeight: 1.05,
                background:
                  "linear-gradient(135deg,#fff 20%,#7dd3fc 55%,#38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-.03em",
              }}
            >
              {CONTENT.main.title.split("\n").map((l, i) => (
                <span key={i}>
                  {l}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <h2
              style={{
                fontSize: "clamp(18px,5.5vw,50px)",
                fontWeight: 700,
                margin: "0 0 20px",
                background: "linear-gradient(135deg,#38bdf8,#a5f3fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {CONTENT.name}
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(186,230,253,.5)",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              {CONTENT.main.subtitle}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginTop: 52,
              alignItems: "flex-end",
            }}
          >
            {[
              { s: 32, d: "0s" },
              { s: 50, d: ".3s" },
              { s: 60, d: ".5s" },
              { s: 50, d: ".7s" },
              { s: 32, d: "1s" },
            ].map((r, i) => (
              <div key={i} style={{ animation: `pulse 2.5s ${r.d} infinite` }}>
                <Rocket size={r.s} />
              </div>
            ))}
          </div>
        </section>

        <BirthdayCakeSection />
        <MessagesGalaxy />
        <PhotoTimeline />
        <LetterSection />
        <PhotoBoothSection />
        <CertificadoSection />

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "36px 24px calc(60px + env(safe-area-inset-bottom))",
            borderTop: "1px solid rgba(56,189,248,.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginBottom: 18,
              alignItems: "flex-end",
            }}
          >
            {[24, 18, 32, 18, 24].map((s, i) => (
              <div
                key={i}
                style={{
                  opacity: 0.5 + (i === 2 ? 0.3 : 0),
                  animation: `pulse ${2 + i * 0.4}s ${i * 0.2}s infinite`,
                }}
              >
                <Rocket size={s} />
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: "clamp(16px,3.5vw,26px)",
              fontWeight: 700,
              background: "linear-gradient(135deg,#7dd3fc,#38bdf8,#a5f3fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 10px",
            }}
          >
            {CONTENT.footer.message}
          </p>
          <p
            style={{
              color: "rgba(125,211,252,.25)",
              fontSize: 12,
              letterSpacing: ".08em",
            }}
          >
            {CONTENT.footer.sub} · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}

/* ── ROOT ── */
export default function App() {
  const isBirthday = Date.now() >= BIRTHDAY.getTime();
  const [editorAccess, setEditorAccess] = useState(false);

  if (isBirthday || editorAccess) return <MainPage />;
  return <CountdownGate onEditorAccess={() => setEditorAccess(true)} />;
}
