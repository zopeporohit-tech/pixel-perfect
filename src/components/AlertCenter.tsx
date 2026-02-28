import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Zap, Thermometer, BellRing, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  building: string;
}

const mockAlerts: Alert[] = [
  { id: "1", type: "critical", title: "Energy Spike Detected", message: "Data Center consuming 40% above threshold", time: "2 min ago", building: "Data Center" },
  { id: "2", type: "warning", title: "HVAC Inefficiency", message: "A-Block cooling running at peak during low occupancy", time: "15 min ago", building: "A-Block" },
  { id: "3", type: "info", title: "Solar Output Peak", message: "Solar farm generating at 95% capacity", time: "1 hr ago", building: "Solar Farm" },
  { id: "4", type: "warning", title: "Lighting Override", message: "Library lights on during scheduled off-hours", time: "30 min ago", building: "Library" },
  { id: "5", type: "critical", title: "Grid Load Warning", message: "Campus approaching 90% grid capacity limit", time: "5 min ago", building: "Main Hub" },
];

const typeConfig = {
  critical: { icon: AlertTriangle, bg: "bg-energy-red/10", border: "border-energy-red/30", text: "text-energy-red", pulse: true },
  warning: { icon: Thermometer, bg: "bg-energy-amber/10", border: "border-energy-amber/30", text: "text-energy-amber", pulse: false },
  info: { icon: CheckCircle2, bg: "bg-energy-green/10", border: "border-energy-green/30", text: "text-energy-green", pulse: false },
};

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BellRing className="h-4 w-4 text-energy-amber" /> Alert Center
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] h-6"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? "🔔 Sound On" : "🔕 Sound Off"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {alerts.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle2 className="h-8 w-8 text-energy-green mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">All clear! No active alerts.</p>
          </div>
        )}
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border} transition-all hover:scale-[1.01] ${
                config.pulse ? "animate-pulse" : ""
              }`}
              role="alert"
              aria-label={`${alert.type} alert: ${alert.title}`}
            >
              <div className={`mt-0.5 ${config.text}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-semibold ${config.text}`}>{alert.title}</p>
                  <span className="text-[9px] text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">📍 {alert.building}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 shrink-0"
                onClick={() => dismiss(alert.id)}
                aria-label="Dismiss alert"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
