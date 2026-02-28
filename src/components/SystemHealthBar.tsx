import { useState, useEffect } from "react";
import { Wifi, Activity, Server, ChevronDown, Brain } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AIInsightHub from "@/components/AIInsightHub";
import type { LiveMetrics } from "@/hooks/useRealtimeEngine";

interface Props {
  metrics: LiveMetrics | null;
  modelTraining?: boolean;
}

export default function SystemHealthBar({ metrics, modelTraining = true }: Props) {
  const [latency, setLatency] = useState(12);
  const [activeNodes, setActiveNodes] = useState(142);
  const [epoch, setEpoch] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.round(8 + Math.random() * 15));
      setActiveNodes(138 + Math.floor(Math.random() * 8));
      setEpoch((e) => e + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 text-[10px]">
      {/* AI Engine Status */}
      <div className="hidden md:flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-energy-cyan" />
        </span>
        <span className="text-energy-cyan font-medium">AI Engine</span>
        <span className="text-muted-foreground">Epoch {epoch}</span>
      </div>

      {/* Live sensor indicator */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-green opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-energy-green" />
        </span>
        <span className="text-muted-foreground font-medium">Sensors</span>
      </div>

      {/* Uptime */}
      <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
        <Activity className="h-3 w-3 text-energy-cyan" />
        <span>99.97%</span>
      </div>

      {/* Live data dropdown */}
      <Popover>
        <PopoverTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <Server className="h-3 w-3" />
          <span className="hidden sm:inline">Feed</span>
          <ChevronDown className="h-2.5 w-2.5" />
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 glass-card" align="end">
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-foreground">System Diagnostics</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Latency</span>
                <span className={`font-mono font-bold ${latency < 15 ? "text-energy-green" : "text-energy-amber"}`}>{latency}ms</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Active Nodes</span>
                <span className="font-mono font-bold text-energy-cyan">{activeNodes}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Data Rate</span>
                <span className="font-mono font-bold text-foreground">1.2k msg/s</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">ML Model</span>
                <span className="font-mono font-bold text-energy-cyan">LSTM v2.4</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Training</span>
                <span className="font-mono font-bold text-energy-green">Active (Epoch {epoch})</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Protocol</span>
                <span className="font-mono text-muted-foreground">MQTT v5</span>
              </div>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-energy-green" />
              <span className="text-[10px] text-energy-green font-medium">All systems operational</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* AI Insight Hub */}
      <AIInsightHub metrics={metrics} />
    </div>
  );
}
