import { useState, useMemo } from "react";
import { Zap, Leaf, Factory, TrendingDown, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, AreaChart, Area,
} from "recharts";
import { universityData, hourlyDemand, euiComparison, buildingData, aiRecommendations, indianCampusComparison, type University } from "@/data/mockData";

const Index = () => {
  const [selectedUni, setSelectedUni] = useState<University>("NMIMS Indore");
  const [solarSlider, setSolarSlider] = useState([15]);
  const data = universityData[selectedUni];

  const co2Reduction = useMemo(() => {
    return Math.round(data.totalConsumption * (solarSlider[0] / 100) * 0.7 / 1000);
  }, [data.totalConsumption, solarSlider]);

  const gridIndependence = data.renewablesPct + solarSlider[0] * 0.5;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Energy Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time campus energy monitoring & benchmarking</p>
        </div>
        <Select value={selectedUni} onValueChange={(v) => setSelectedUni(v as University)}>
          <SelectTrigger className="w-[200px] glass-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(universityData) as University[]).map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Consumption", value: `${(data.totalConsumption / 1000).toFixed(0)} MWh`, icon: Zap, color: "text-energy-cyan" },
          { label: "Current Grid Load", value: `${data.gridLoad.toLocaleString()} kW`, icon: Factory, color: "text-energy-amber" },
          { label: "Renewables", value: `${data.renewablesPct}%`, icon: Leaf, color: "text-energy-green" },
          { label: "Carbon Savings", value: `${(data.carbonSavings / 1000).toFixed(1)}k Tons`, icon: TrendingDown, color: "text-primary" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card animate-scale-in">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmarks</TabsTrigger>
          <TabsTrigger value="simulator">Energy Lab</TabsTrigger>
          <TabsTrigger value="nmims">NMIMS Focus</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donut */}
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm">Energy Source Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={data.energySources} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} strokeWidth={0}>
                      {data.energySources.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 24hr Demand */}
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm">24-Hour Energy Demand</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={hourlyDemand}>
                    <defs>
                      <linearGradient id="colorUni" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                    <XAxis dataKey="hour" stroke="hsl(200, 10%, 55%)" fontSize={10} />
                    <YAxis stroke="hsl(200, 10%, 55%)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                    <Area type="monotone" dataKey="university" stroke="hsl(168, 80%, 42%)" fill="url(#colorUni)" name={selectedUni} />
                    <Line type="monotone" dataKey="globalAvg" stroke="hsl(215, 20%, 55%)" strokeDasharray="5 5" name="Global Avg" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Building Heatmap */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Building Energy Intensity Heatmap</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {buildingData.map((b) => {
                  const hue = b.intensity > 0.7 ? 0 : b.intensity > 0.5 ? 38 : 142;
                  return (
                    <div key={b.name} className="rounded-lg p-3 text-center transition-all hover:scale-105 cursor-pointer border border-border/30"
                      style={{ background: `hsla(${hue}, 70%, ${50 - b.intensity * 15}%, 0.2)`, borderColor: `hsla(${hue}, 70%, 50%, 0.3)` }}>
                      <p className="text-xs font-medium text-foreground">{b.name}</p>
                      <p className="text-lg font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{Math.round(b.intensity * 100)}%</p>
                      <p className="text-[10px] text-muted-foreground">{b.type}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BENCHMARKS TAB */}
        <TabsContent value="benchmark" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm">EUI Comparison (kWh/m²)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={euiComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                    <XAxis type="number" stroke="hsl(200, 10%, 55%)" fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke="hsl(200, 10%, 55%)" fontSize={10} width={80} />
                    <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                    <Bar dataKey="eui" radius={[0, 6, 6, 0]}>
                      {euiComparison.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm">Green Infrastructure Radar</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data.radarData}>
                    <PolarGrid stroke="hsl(200, 15%, 18%)" />
                    <PolarAngleAxis dataKey="metric" stroke="hsl(200, 10%, 55%)" fontSize={10} />
                    <PolarRadiusAxis stroke="hsl(200, 15%, 18%)" fontSize={10} />
                    <Radar name={selectedUni} dataKey="value" stroke="hsl(168, 80%, 42%)" fill="hsl(168, 80%, 42%)" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ENERGY LAB / SIMULATOR TAB */}
        <TabsContent value="simulator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sun className="h-4 w-4 text-energy-amber" /> What-If Solar Simulator</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-xs text-muted-foreground">Increase Solar Coverage: {solarSlider[0]}%</label>
                  <Slider value={solarSlider} onValueChange={setSolarSlider} min={0} max={100} step={1} className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-lg p-4 text-center glow-primary">
                    <p className="text-xs text-muted-foreground">Projected CO₂ Reduction</p>
                    <p className="text-3xl font-bold text-primary">{co2Reduction}</p>
                    <p className="text-xs text-muted-foreground">Metric Tons/yr</p>
                  </div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground">Grid Independence</p>
                    <p className="text-3xl font-bold text-energy-cyan">{Math.min(100, Math.round(gridIndependence))}%</p>
                    <p className="text-xs text-muted-foreground">Self-powered</p>
                  </div>
                </div>
                {solarSlider[0] >= 80 && (
                  <div className="glass-card rounded-lg p-3 border-primary/30 border text-center animate-fade-in">
                    <Leaf className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-primary font-semibold">🎉 Net-Zero trajectory achieved!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grid Independence Gauge */}
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Wind className="h-4 w-4 text-energy-cyan" /> Grid Independence Gauge</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(200, 15%, 18%)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(168, 80%, 42%)" strokeWidth="8"
                      strokeDasharray={`${Math.min(100, gridIndependence) * 2.51} 251`} strokeLinecap="round"
                      className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-primary">{Math.min(100, Math.round(gridIndependence))}%</p>
                    <p className="text-[10px] text-muted-foreground">Renewable</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">Current renewable energy contribution to campus power</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">🤖 Smart Recommendations for {selectedUni}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiRecommendations.map((rec, i) => (
                  <div key={i} className="glass-card rounded-lg p-4 space-y-2 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${rec.priority === "high" ? "bg-energy-red" : rec.priority === "medium" ? "bg-energy-amber" : "bg-energy-green"}`} />
                      <p className="text-xs font-semibold text-foreground">{rec.action}</p>
                    </div>
                    <p className="text-xs text-primary">{rec.impact}</p>
                    <p className="text-[10px] text-muted-foreground">ROI: {rec.roi}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NMIMS FOCUS TAB */}
        <TabsContent value="nmims" className="space-y-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Regional Efficiency: NMIMS vs Indian Tech Campuses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={indianCampusComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(200, 10%, 55%)" fontSize={10} />
                  <YAxis stroke="hsl(200, 10%, 55%)" fontSize={10} />
                  <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                  <Legend />
                  <Bar dataKey="coolingEff" name="Cooling Efficiency %" fill="hsl(174, 72%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="solarAdoption" name="Solar Adoption %" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Solar Adoption", nmims: "15%", mit: "28%", trend: "↑ 5%/quarter goal" },
              { label: "Water Recycling", nmims: "45%", mit: "72%", trend: "Target: 60% by 2026" },
              { label: "Carbon Neutrality", nmims: "30%", mit: "65%", trend: "Net-Zero by 2035" },
            ].map((card) => (
              <Card key={card.label} className="glass-card">
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">{card.label}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground">NMIMS</p>
                      <p className="text-lg font-bold text-primary">{card.nmims}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">MIT</p>
                      <p className="text-lg font-bold text-energy-cyan">{card.mit}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-energy-green">{card.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
