import { useMemo } from "react";

const departments = [
  { id: "grid", label: "Power Grid", x: 50, y: 10, color: "hsl(var(--energy-slate))" },
  { id: "solar", label: "Solar Farm", x: 15, y: 10, color: "hsl(var(--energy-amber))" },
  { id: "main", label: "Main Hub", x: 50, y: 45, color: "hsl(var(--primary))" },
  { id: "academic", label: "Academic", x: 15, y: 80, color: "hsl(var(--energy-cyan))" },
  { id: "hostel", label: "Hostels", x: 50, y: 80, color: "hsl(var(--energy-green))" },
  { id: "lab", label: "Labs", x: 85, y: 80, color: "hsl(var(--energy-red))" },
  { id: "wind", label: "Wind", x: 85, y: 10, color: "hsl(var(--energy-cyan))" },
];

const flows = [
  { from: "grid", to: "main", volume: 0.7 },
  { from: "solar", to: "main", volume: 0.4 },
  { from: "wind", to: "main", volume: 0.2 },
  { from: "main", to: "academic", volume: 0.5 },
  { from: "main", to: "hostel", volume: 0.3 },
  { from: "main", to: "lab", volume: 0.8 },
];

export default function EnergyFlowMap() {
  const deptMap = useMemo(() => Object.fromEntries(departments.map(d => [d.id, d])), []);

  return (
    <div className="w-full h-[350px] relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {flows.map((f, i) => (
            <linearGradient key={i} id={`flow-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={deptMap[f.from]?.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={deptMap[f.to]?.color} stopOpacity="0.8" />
            </linearGradient>
          ))}
        </defs>
        
        {/* Flow lines */}
        {flows.map((f, i) => {
          const from = deptMap[f.from];
          const to = deptMap[f.to];
          if (!from || !to) return null;
          const speed = 3 - f.volume * 2;
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y + 4}
                x2={to.x} y2={to.y - 4}
                stroke={`url(#flow-grad-${i})`}
                strokeWidth={0.6 + f.volume}
                strokeDasharray={`${2 + f.volume * 2} ${3 - f.volume}`}
                opacity={0.6}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to={`-${10 + f.volume * 10}`}
                  dur={`${speed}s`}
                  repeatCount="indefinite"
                />
              </line>
              {/* Glow */}
              <line
                x1={from.x} y1={from.y + 4}
                x2={to.x} y2={to.y - 4}
                stroke={`url(#flow-grad-${i})`}
                strokeWidth={2 + f.volume * 2}
                strokeDasharray={`${2 + f.volume * 2} ${3 - f.volume}`}
                opacity={0.1}
                filter="blur(2px)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to={`-${10 + f.volume * 10}`}
                  dur={`${speed}s`}
                  repeatCount="indefinite"
                />
              </line>
            </g>
          );
        })}

        {/* Department nodes */}
        {departments.map((d) => (
          <g key={d.id}>
            <circle cx={d.x} cy={d.y} r="4" fill={d.color} opacity="0.15" />
            <circle cx={d.x} cy={d.y} r="2.5" fill={d.color} opacity="0.6">
              <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={d.x} cy={d.y} r="1.2" fill={d.color} />
            <text x={d.x} y={d.y + 7} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="2.5" fontWeight="600">
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
