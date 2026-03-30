/* ── SVG ROCKET ── */
export const Rocket = ({ size = 40, glow = false }) => (
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

export const Planet = ({ r = 36, c1 = "#0c4a6e", c2 = "#06b6d4", ring = false }) => (
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
