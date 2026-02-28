import { useState } from "react";
import { buildingData } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";

// Campus layout: building positions on a virtual SVG map
const buildingPositions: Record<string, { x: number; y: number; w: number; h: number }> = {
  "A-Block": { x: 10, y: 10, w: 18, h: 14 },
  "B-Block": { x: 32, y: 10, w: 18, h: 14 },
  "Library": { x: 55, y: 8, w: 20, h: 16 },
  "Lab Complex": { x: 78, y: 10, w: 18, h: 14 },
  "Hostel-1": { x: 10, y: 35, w: 15, h: 20 },
  "Hostel-2": { x: 28, y: 35, w: 15, h: 20 },
  "Canteen": { x: 48, y: 38, w: 14, h: 14 },
  "Admin": { x: 66, y: 35, w: 14, h: 14 },
  "Sports Complex": { x: 10, y: 68, w: 22, h: 16 },
  "Auditorium": { x: 36, y: 65, w: 18, h: 18 },
  "Data Center": { x: 58, y: 62, w: 16, h: 16 },
  "Workshop": { x: 78, y: 62, w: 18, h: 16 },
};

interface Props {
  onBuildingSelect?: (name: string | null) => void;
  selectedBuilding?: string | null;
}

export default function CampusMap({ onBuildingSelect, selectedBuilding }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const getColor = (intensity: number) => {
    if (intensity > 0.7) return { fill: "hsla(0, 72%, 55%, 0.35)", stroke: "hsl(0, 72%, 55%)", glow: "0 0 12px hsla(0,72%,55%,0.4)" };
    if (intensity > 0.5) return { fill: "hsla(38, 92%, 55%, 0.3)", stroke: "hsl(38, 92%, 55%)", glow: "0 0 12px hsla(38,92%,55%,0.3)" };
    return { fill: "hsla(142, 76%, 46%, 0.25)", stroke: "hsl(142, 76%, 46%)", glow: "0 0 12px hsla(142,76%,46%,0.3)" };
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Interactive Campus Map
          </CardTitle>
          {selectedBuilding && (
            <button onClick={() => onBuildingSelect?.(null)} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X className="h-3 w-3" /> Clear filter
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">Hover for details • Click to filter dashboard</p>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[16/10] relative">
          <svg viewBox="0 0 100 90" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid background */}
            <defs>
              <pattern id="campus-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(200, 15%, 15%)" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="90" fill="url(#campus-grid)" rx="2" />

            {/* Roads */}
            <line x1="0" y1="30" x2="100" y2="30" stroke="hsl(200, 15%, 18%)" strokeWidth="0.6" strokeDasharray="1 0.5" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="hsl(200, 15%, 18%)" strokeWidth="0.6" strokeDasharray="1 0.5" />
            <line x1="50" y1="0" x2="50" y2="90" stroke="hsl(200, 15%, 18%)" strokeWidth="0.6" strokeDasharray="1 0.5" />

            {/* Buildings */}
            {buildingData.map((b) => {
              const pos = buildingPositions[b.name];
              if (!pos) return null;
              const colors = getColor(b.intensity);
              const isActive = selectedBuilding === b.name;
              const isHover = hovered === b.name;

              return (
                <Tooltip key={b.name}>
                  <TooltipTrigger asChild>
                    <g
                      onMouseEnter={() => setHovered(b.name)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onBuildingSelect?.(isActive ? null : b.name)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={pos.x} y={pos.y}
                        width={pos.w} height={pos.h}
                        rx="1.5"
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={isActive ? "0.8" : "0.4"}
                        opacity={selectedBuilding && !isActive ? 0.3 : 1}
                        style={{
                          filter: isHover || isActive ? `drop-shadow(${colors.glow})` : "none",
                          transition: "all 0.3s ease",
                        }}
                      />
                      {/* Building label */}
                      <text
                        x={pos.x + pos.w / 2}
                        y={pos.y + pos.h / 2 - 1}
                        textAnchor="middle"
                        fill="hsl(160, 20%, 92%)"
                        fontSize="2.2"
                        fontWeight="600"
                        opacity={selectedBuilding && !isActive ? 0.3 : 1}
                      >
                        {b.name}
                      </text>
                      <text
                        x={pos.x + pos.w / 2}
                        y={pos.y + pos.h / 2 + 2.5}
                        textAnchor="middle"
                        fill={colors.stroke}
                        fontSize="2.8"
                        fontWeight="700"
                        opacity={selectedBuilding && !isActive ? 0.3 : 1}
                      >
                        {Math.round(b.intensity * 100)}%
                      </text>

                      {/* Pulse for critical buildings */}
                      {b.intensity > 0.8 && (
                        <circle
                          cx={pos.x + pos.w - 2}
                          cy={pos.y + 2}
                          r="1"
                          fill="hsl(0, 72%, 55%)"
                        >
                          <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card border-border/50 p-3">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground">Type: {b.type}</p>
                      <p className="text-[10px] text-muted-foreground">Load: {Math.round(b.intensity * 850)} kW</p>
                      <p className="text-[10px] text-muted-foreground">Efficiency: {Math.round((1 - b.intensity) * 100)}%</p>
                      <p className="text-[10px]" style={{ color: colors.stroke }}>
                        {b.intensity > 0.7 ? "⚠️ Critical" : b.intensity > 0.5 ? "⚡ Moderate" : "✅ Optimal"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Legend */}
            <g>
              <rect x="2" y="83" width="3" height="2" rx="0.3" fill="hsla(142, 76%, 46%, 0.4)" stroke="hsl(142, 76%, 46%)" strokeWidth="0.2" />
              <text x="6.5" y="84.8" fill="hsl(200, 10%, 55%)" fontSize="1.8">Optimal</text>
              <rect x="18" y="83" width="3" height="2" rx="0.3" fill="hsla(38, 92%, 55%, 0.4)" stroke="hsl(38, 92%, 55%)" strokeWidth="0.2" />
              <text x="22.5" y="84.8" fill="hsl(200, 10%, 55%)" fontSize="1.8">Moderate</text>
              <rect x="36" y="83" width="3" height="2" rx="0.3" fill="hsla(0, 72%, 55%, 0.4)" stroke="hsl(0, 72%, 55%)" strokeWidth="0.2" />
              <text x="40.5" y="84.8" fill="hsl(200, 10%, 55%)" fontSize="1.8">Critical</text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
