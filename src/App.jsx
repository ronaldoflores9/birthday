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
    title: "Constelación de recuerdos 📸",
    // Pon aquí las rutas de tus fotos. Usa null para mostrar el placeholder 📷
    images: [
      "/assets/IMG_0588.jpg",
      "/assets/IMG_0589.jpg",
      "/assets/IMG_0606.jpg",
      "/assets/IMG_0615.jpg",
      "/assets/IMG_0887.jpg",
      "/assets/IMG_5410.jpg",
      "/assets/IMG_5618.jpg",
      "/assets/79036423396__4EAC0B8A-7F4E-4D2B-B46E-6BE7FA63D56C.jpg",
      "/assets/79047295560__C8B63A2D-CCD6-4A3A-9255-2AD99DCFB556.jpg",
      "/assets/79084349540__EB3A7F6F-BDAC-4078-A452-0855E30D1649.jpg",
    ],
  },

  letter: {
    label: "Carta especial",
    title: "Un mensaje desde el corazón 🪐",
    body: `Queria Alexandra,

Hoy me siento a escribirte esta carta porque para cuando la leas es tu cumpleaños, y dejame decirte que eso es un día muy especial. Pues si piensas que es un cumpleaños es el dia que naciste y eso fue ya hace 21 años. WOW 21 años es pal y dificil de creer.

Pero eso quiere decir que hace 21 años nació una persona increíble, una persona que sin importar lo que pasa siempre esta ahi para apoyar a los demás. Nació una personita que aunque vive su dia en corre y corre nunca deja a sus amistades atrás.

Le agradezco a dios todos los dias por haberte puesto en mi vida, ya que como siempre te he dicho tu has hecho que mejore como persona. No puedo creer que ya tienes 21 (btw me sente a escribir esto sin saber que escribir asi que va a ser un rant algaro).

Espero que el dia de hoy la estes pasando increible y que todas las metas que tengas para toda la vida la logres porque en donde sea que estes siempre das lo mejor y mereces todo lo que se te pueda dar.

Nunca dejes de luchar por lo que quieres incluso cuando aveces las cosas se ven dificiles, la vida pone esos desafios porque sabe que podemos ante ellos. Y si hablamos de los mejores tu te encuentras entre ellos. Eres y siempre serás luz. Que dios siempre te me bendiga y te me cuide, te quiero un millon multiplicado por infinito y siempre voy a estar aqui para ti sin importar lo que pase en el pasado, presente y futuro.

Con mucho amor y cariño


PD: Tu regalo va a llegar tardecito pero esta duro.

Ronaldo Elier Flores Nazario`,
  },

  footer: {
    message: "¡Que cumplas muchos más! 🎂",
    sub: "Con amor desde el universo",
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
      <StarField />
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
                  fontSize: 13,
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
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -22,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "60px solid transparent",
            borderRight: "60px solid transparent",
            borderTop: "22px solid rgba(14,165,233,.2)",
          }}
        />
        <div
          style={{
            background:
              "linear-gradient(160deg,rgba(7,89,133,.28),rgba(4,26,50,.5))",
            border: "1px solid rgba(125,211,252,.18)",
            borderRadius: 20,
            padding: "44px 36px 36px",
            backdropFilter: "blur(14px)",
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
    </section>
  );
}

/* ── MAIN PAGE ── */
function MainPage() {
  const [giftDone, setGiftDone] = useState(false);
  return (
    <>
      {!giftDone && <GiftIntro onDone={() => setGiftDone(true)} />}
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
                fontSize: "clamp(26px,5.5vw,50px)",
                fontWeight: 700,
                margin: "0 0 20px",
                background: "linear-gradient(135deg,#38bdf8,#a5f3fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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

        <MessagesGalaxy />
        <PhotoTimeline />
        <LetterSection />

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "36px 24px 60px",
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
