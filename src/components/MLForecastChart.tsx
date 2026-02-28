import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle } from "lucide-react";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { ForecastPoint } from "@/hooks/useRealtimeEngine";

interface Props {
  data: ForecastPoint[];
  anomalyActive: boolean;
}

export default function MLForecastChart({ data, anomalyActive }: Props) {
  if (data.length === 0) return null;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-energy-cyan" /> ML Energy Forecast
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-energy-cyan/10 text-energy-cyan border border-energy-cyan/20 font-medium">
              LSTM v2.4
            </span>
          </CardTitle>
          {anomalyActive && (
            <div className="flex items-center gap-1 text-energy-red animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold">Anomaly Detected</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">Solid = Live Data • Dashed = ML Predicted • Shaded = 95% Confidence Interval</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
            <XAxis dataKey="time" stroke="hsl(200, 10%, 55%)" fontSize={9} interval={2} />
            <YAxis stroke="hsl(200, 10%, 55%)" fontSize={9} />
            <Tooltip
              contentStyle={{
                background: "hsl(200, 20%, 11%)",
                border: "1px solid hsl(200, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(160, 20%, 92%)",
                fontSize: "11px",
              }}
            />
            {/* Confidence interval */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceGrad)" name="Upper CI" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" name="Lower CI" />
            {/* Actual / Live data */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(168, 80%, 42%)"
              fill="url(#liveGrad)"
              strokeWidth={2}
              name="Live Data"
              dot={false}
            />
            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(38, 92%, 55%)"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              name="ML Predicted"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
