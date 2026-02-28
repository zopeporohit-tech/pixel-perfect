import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingDown, Leaf, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const forecastData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  actual: i < 6 ? Math.round(4000 + Math.sin(i * 0.8) * 1200 + Math.random() * 500) : undefined,
  predicted: Math.round(4000 + Math.sin(i * 0.8) * 1200 - i * 80 + Math.random() * 300),
  withOptimization: Math.round(3500 + Math.sin(i * 0.8) * 900 - i * 120),
}));

const AIForecastingPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Brain className="h-6 w-6 text-primary" /> AI Energy Forecasting</h1>
      <p className="text-sm text-muted-foreground">Machine learning predictions for campus energy optimization</p>
    </div>
    <Card className="glass-card">
      <CardHeader><CardTitle className="text-sm">12-Month Consumption Forecast (MWh)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
            <XAxis dataKey="month" stroke="hsl(200, 10%, 55%)" fontSize={11} />
            <YAxis stroke="hsl(200, 10%, 55%)" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
            <Area type="monotone" dataKey="actual" stroke="hsl(38, 92%, 55%)" fill="none" name="Actual" strokeWidth={2} />
            <Area type="monotone" dataKey="predicted" stroke="hsl(168, 80%, 42%)" fill="url(#colorPred)" name="AI Predicted" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="withOptimization" stroke="hsl(142, 76%, 46%)" fill="url(#colorOpt)" name="With Optimization" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { icon: TrendingDown, label: "Predicted Savings", value: "18.5%", desc: "vs. current trajectory", color: "text-primary" },
        { icon: Leaf, label: "Carbon Reduction", value: "245 Tons", desc: "CO₂ equivalent by Dec 2026", color: "text-energy-green" },
        { icon: Zap, label: "Peak Demand Shift", value: "2.1 hrs", desc: "Optimal load balancing window", color: "text-energy-cyan" },
      ].map((item) => (
        <Card key={item.label} className="glass-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AIForecastingPage;
