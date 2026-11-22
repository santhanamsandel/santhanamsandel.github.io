import type { Project } from "@/data/profile";

/** Lightweight SVG illustrations for each project type (no fake screenshots). */
export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  const common = "h-full w-full";
  switch (kind) {
    case "agent":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="20" y="20" width="250" height="170" rx="10" fill="#0b1224" stroke="#1e3a5f" />
          <rect x="20" y="20" width="250" height="24" rx="10" fill="#0f1b33" />
          {[36, 50, 64].map((x, i) => (
            <circle key={x} cx={x} cy="32" r="4" fill={["#f87171", "#fbbf24", "#34d399"][i]} opacity=".7" />
          ))}
          <rect x="85" y="26" width="160" height="12" rx="6" fill="#132341" />
          <rect x="40" y="62" width="120" height="10" rx="5" fill="#1e3a5f" />
          <rect x="40" y="82" width="200" height="8" rx="4" fill="#13233f" />
          <rect x="40" y="98" width="170" height="8" rx="4" fill="#13233f" />
          <rect x="40" y="122" width="90" height="26" rx="6" fill="#22d3ee" opacity=".85" className="animate-pulse" />
          <path d="M120 140 l14 10 -6 2 4 8 -4 2 -4 -8 -5 4z" fill="#e8eef8" />
          <g>
            <rect x="290" y="60" width="92" height="100" rx="12" fill="#0f1b33" stroke="#a855f7" strokeOpacity=".5" />
            <text x="336" y="88" textAnchor="middle" fontSize="11" fill="#c4b5fd" fontFamily="monospace">LLM</text>
            <text x="336" y="110" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">plan → act</text>
            <text x="336" y="126" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">observe</text>
            <circle cx="336" cy="144" r="5" fill="#a855f7" className="animate-ping" style={{ transformOrigin: "336px 144px" }} />
          </g>
          <path d="M270 105 H290" stroke="#22d3ee" strokeWidth="2" className="flow-line" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="90" y="16" width="220" height="190" rx="14" fill="#0b1224" stroke="#1e3a5f" />
          <rect x="106" y="34" width="130" height="30" rx="12" fill="#13233f" />
          <rect x="116" y="44" width="100" height="8" rx="4" fill="#64748b" />
          <rect x="166" y="76" width="128" height="40" rx="12" fill="#0e7490" opacity=".7" />
          <rect x="176" y="86" width="100" height="7" rx="3.5" fill="#cffafe" opacity=".8" />
          <rect x="176" y="99" width="70" height="7" rx="3.5" fill="#cffafe" opacity=".6" />
          <rect x="106" y="128" width="110" height="30" rx="12" fill="#13233f" />
          <g className="animate-pulse">
            <circle cx="126" cy="143" r="3.5" fill="#22d3ee" />
            <circle cx="138" cy="143" r="3.5" fill="#22d3ee" opacity=".7" />
            <circle cx="150" cy="143" r="3.5" fill="#22d3ee" opacity=".4" />
          </g>
          <rect x="106" y="172" width="188" height="22" rx="11" fill="#0f1b33" stroke="#1e3a5f" />
          <text x="40" y="60" fontSize="10" fill="#22d3ee" fontFamily="monospace">−40%</text>
          <text x="22" y="74" fontSize="8" fill="#94a3b8" fontFamily="monospace">response time</text>
          <text x="322" y="160" fontSize="10" fill="#a855f7" fontFamily="monospace">+35%</text>
          <text x="318" y="174" fontSize="8" fill="#94a3b8" fontFamily="monospace">accuracy</text>
        </svg>
      );
    case "churn":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          {Array.from({ length: 46 }).map((_, i) => {
            const x = 30 + ((i * 53) % 340);
            const y = 30 + ((i * 37) % 150);
            const churn = x + y * 0.9 > 290;
            return <circle key={i} cx={x} cy={y} r="5" fill={churn ? "#a855f7" : "#22d3ee"} opacity=".8" />;
          })}
          <path d="M60 200 C 160 150, 220 90, 360 20" stroke="#e8eef8" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <rect x="262" y="166" width="118" height="40" rx="8" fill="#0b1224" stroke="#1e3a5f" />
          <text x="321" y="184" textAnchor="middle" fontSize="11" fill="#e8eef8" fontFamily="monospace">accuracy 88%</text>
          <text x="321" y="198" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">FN −15%</text>
        </svg>
      );
    case "dashboard":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="16" y="16" width="368" height="188" rx="12" fill="#0b1224" stroke="#1e3a5f" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={32 + i * 116} y="30" width="104" height="40" rx="8" fill="#0f1b33" />
              <rect x={42 + i * 116} y="40" width="40" height="6" rx="3" fill="#64748b" />
              <rect x={42 + i * 116} y="52" width="64" height="10" rx="3" fill={["#22d3ee", "#3b82f6", "#a855f7"][i]} />
            </g>
          ))}
          {[60, 95, 75, 120, 100, 140, 115].map((h, i) => (
            <rect key={i} x={36 + i * 30} y={190 - h * 0.7} width="18" height={h * 0.7} rx="3" fill="url(#bar)" />
          ))}
          <circle cx="320" cy="140" r="40" fill="none" stroke="#13233f" strokeWidth="14" />
          <circle cx="320" cy="140" r="40" fill="none" stroke="#22d3ee" strokeWidth="14" strokeDasharray="160 252" transform="rotate(-90 320 140)" />
          <circle cx="320" cy="140" r="40" fill="none" stroke="#a855f7" strokeWidth="14" strokeDasharray="60 252" strokeDashoffset="-160" transform="rotate(-90 320 140)" />
          <defs>
            <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity=".3" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "api":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="24" y="24" width="352" height="172" rx="12" fill="#0b1224" stroke="#1e3a5f" />
          {[
            ["GET", "/students", "#34d399"],
            ["POST", "/students", "#22d3ee"],
            ["PUT", "/students/{id}", "#fbbf24"],
            ["DELETE", "/students/{id}", "#f87171"],
          ].map(([m, p, c], i) => (
            <g key={m} transform={`translate(44 ${48 + i * 36})`}>
              <rect width="62" height="22" rx="5" fill={c} opacity=".18" />
              <text x="31" y="15" textAnchor="middle" fontSize="10" fill={c} fontFamily="monospace" fontWeight="bold">{m}</text>
              <text x="78" y="15" fontSize="11" fill="#cbd5e1" fontFamily="monospace">{p}</text>
            </g>
          ))}
          <rect x="280" y="70" width="72" height="80" rx="10" fill="#0f1b33" stroke="#3b82f6" strokeOpacity=".5" />
          <ellipse cx="316" cy="86" rx="22" ry="7" fill="none" stroke="#3b82f6" />
          <path d="M294 86 v40 a22 7 0 0 0 44 0 v-40" fill="none" stroke="#3b82f6" />
          <text x="316" y="142" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">MySQL</text>
        </svg>
      );
    case "nlp":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          {["The", "model", "reads", "context"].map((w, i) => (
            <g key={w}>
              <rect x={30 + i * 88} y="34" width="74" height="28" rx="8" fill="#0f1b33" stroke="#1e3a5f" />
              <text x={67 + i * 88} y="52" textAnchor="middle" fontSize="11" fill="#e8eef8" fontFamily="monospace">{w}</text>
              <rect x={30 + i * 88} y="158" width="74" height="28" rx="8" fill="#0f1b33" stroke="#a855f7" strokeOpacity=".5" />
              <text x={67 + i * 88} y="176" textAnchor="middle" fontSize="10" fill="#c4b5fd" fontFamily="monospace">h{i + 1}</text>
            </g>
          ))}
          {[0, 1, 2, 3].flatMap((i) =>
            [0, 1, 2, 3].map((j) => (
              <line
                key={`${i}-${j}`}
                x1={67 + i * 88}
                y1="62"
                x2={67 + j * 88}
                y2="158"
                stroke="#22d3ee"
                strokeOpacity={i === j ? 0.7 : 0.15 + ((i + j) % 3) * 0.1}
                strokeWidth={i === j ? 2 : 1}
              />
            )),
          )}
          <text x="200" y="114" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">self-attention</text>
        </svg>
      );
    case "qr":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="60" y="30" width="130" height="160" rx="12" fill="#0b1224" stroke="#1e3a5f" />
          <circle cx="125" cy="72" r="20" fill="#13233f" />
          <rect x="90" y="104" width="70" height="7" rx="3.5" fill="#64748b" />
          <g transform="translate(95 120)">
            {Array.from({ length: 36 }).map((_, i) => (
              <rect key={i} x={(i % 6) * 10} y={Math.floor(i / 6) * 10} width="8" height="8" fill={(i * 7) % 3 ? "#e8eef8" : "transparent"} />
            ))}
          </g>
          <path d="M200 110 H250" stroke="#22d3ee" strokeWidth="2" className="flow-line" />
          <rect x="255" y="60" width="100" height="100" rx="12" fill="#0f1b33" stroke="#22d3ee" strokeOpacity=".5" />
          <path d="M282 112 l14 14 28 -30" stroke="#34d399" strokeWidth="5" fill="none" strokeLinecap="round" />
          <text x="305" y="178" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">marked present</text>
        </svg>
      );
    case "streamlit":
      return (
        <svg viewBox="0 0 400 220" className={common} aria-hidden>
          <rect x="24" y="24" width="352" height="172" rx="12" fill="#0b1224" stroke="#1e3a5f" />
          <rect x="24" y="24" width="90" height="172" rx="12" fill="#0f1b33" />
          {[50, 70, 90].map((y) => (
            <rect key={y} x="38" y={y} width="60" height="8" rx="4" fill="#334155" />
          ))}
          <rect x="132" y="44" width="150" height="14" rx="4" fill="#e8eef8" opacity=".8" />
          <rect x="132" y="72" width="220" height="28" rx="6" fill="#13233f" stroke="#1e3a5f" />
          <rect x="132" y="112" width="220" height="6" rx="3" fill="#13233f" />
          <rect x="132" y="112" width="130" height="6" rx="3" fill="#f43f5e" />
          <circle cx="262" cy="115" r="7" fill="#f43f5e" />
          <rect x="132" y="136" width="80" height="28" rx="6" fill="#f43f5e" opacity=".85" />
          <text x="172" y="154" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="monospace">Run</text>
        </svg>
      );
  }
}
