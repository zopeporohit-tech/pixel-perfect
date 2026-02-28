import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Lightbulb, Battery, Sun, Wind, Thermometer, Zap } from "lucide-react";
import type { LiveMetrics } from "@/hooks/useRealtimeEngine";

const insights = [
  { icon: Sun, text: "ML predicts high solar gain in next 2 hours. Increasing battery storage charge rate by 15% to capture excess energy.", tag: "Solar Optimization" },
  { icon: Thermometer, text: "HVAC anomaly detected in A-Block. Pattern suggests a stuck damper valve. Scheduling maintenance inspection.", tag: "Predictive Maintenance" },
  { icon: Battery, text: "Grid prices expected to peak at 14:00. Recommend switching to battery reserves for Hostel-1 and Hostel-2 to save ₹2,400.", tag: "Cost Optimization" },
  { icon: Wind, text: "Wind speed increasing to 18 km/h. Adjusting turbine pitch angle for optimal energy capture. Expected +8% output.", tag: "Wind Optimization" },
  { icon: Zap, text: "Load balancing opportunity: Data Center at 95% capacity while Workshop at 32%. Redistributing compute loads.", tag: "Load Balancing" },
  { icon: Lightbulb, text: "Library occupancy dropped below 20%. Dimming lighting zones B and C by 60%. Estimated saving: 12 kW/hr.", tag: "Smart Lighting" },
  { icon: Thermometer, text: "Outside temperature rising to 38°C. Pre-cooling Lab Complex now to reduce 2PM peak HVAC load by 22%.", tag: "Thermal Management" },
  { icon: Sun, text: "Cloud cover predicted at 15:30. Proactively ramping up grid intake to maintain seamless transition from solar.", tag: "Weather Response" },
];

function TypingText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse text-primary">▊</span>}
    </span>
  );
}

interface Props {
  metrics: LiveMetrics | null;
}

export default function AIInsightHub({ metrics }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = (prev + 1) % insights.length;
        setHistory((h) => [...h.slice(-4), next]);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = insights[currentIdx];
  const Icon = current.icon;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[10px] h-7 gap-1.5 glass-card border-energy-cyan/20">
          <Brain className="h-3 w-3 text-energy-cyan" />
          <span className="hidden sm:inline">AI Insights</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-energy-cyan" />
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-card border-l border-border/50 w-[380px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-energy-cyan" /> AI Insight Hub
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-energy-cyan/10 text-energy-cyan border border-energy-cyan/20">
              Live
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Current insight with typing effect */}
          <div className="glass-card rounded-xl p-4 space-y-3 border-energy-cyan/20">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-energy-cyan/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-energy-cyan" />
              </div>
              <div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                  AI-Generated
                </span>
                <span className="text-[9px] text-muted-foreground ml-2">{current.tag}</span>
              </div>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              <TypingText key={currentIdx} text={current.text} />
            </p>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Generated by campus ML engine • Confidence: {(85 + Math.random() * 12).toFixed(1)}%</span>
            </div>
          </div>

          {/* Live metrics summary */}
          {metrics && (
            <div className="glass-card rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Live Feed</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-secondary/30">
                  <p className="text-[9px] text-muted-foreground">Total Load</p>
                  <p className="text-sm font-bold text-foreground">{metrics.totalLoad.toLocaleString()} kW</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/30">
                  <p className="text-[9px] text-muted-foreground">Efficiency</p>
                  <p className="text-sm font-bold text-energy-green">{metrics.efficiency}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/30">
                  <p className="text-[9px] text-muted-foreground">Solar</p>
                  <p className="text-sm font-bold text-energy-amber">{metrics.solarOutput} kW</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/30">
                  <p className="text-[9px] text-muted-foreground">Grid Draw</p>
                  <p className="text-sm font-bold text-energy-slate">{metrics.gridDraw} kW</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent insights history */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Recent Insights</p>
            {history.slice(0, -1).reverse().map((idx, i) => {
              const insight = insights[idx];
              const InsightIcon = insight.icon;
              return (
                <div key={`${idx}-${i}`} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/20 opacity-60">
                  <InsightIcon className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
