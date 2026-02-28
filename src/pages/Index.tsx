import { useState, useMemo, Suspense, lazy } from "react";
import { Zap, Leaf, Factory, TrendingDown, Sun, Wind, TrendingUp, Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, AreaChart, Area,
} from "recharts";
import { universityData, hourlyDemand, euiComparison, buildingData, aiRecommendations, indianCampusComparison, type University } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import EnergyFlowMap from "@/components/EnergyFlowMap";
import AlertCenter from "@/components/AlertCenter";
import RetrofitCalculator from "@/components/RetrofitCalculator";
import CampusMap from "@/components/CampusMap";

const Campus3DView = lazy(() => import("@/components/Campus3DView"));

const Index = () => {
  const [selectedUni, setSelectedUni] = useState<University>("NMIMS Indore");
  const [solarSlider, setSolarSlider] = useState([15]);
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const data = universityData[selectedUni];

  const co2Reduction = useMemo(() => {
    return Math.round(data.totalConsumption * (solarSlider[0] / 100) * 0.7 / 1000);
  }, [data.totalConsumption, solarSlider]);

  const gridIndependence = data.renewablesPct + solarSlider[0] * 0.5;

  // Dynamic bg based on energy health
  const healthScore = data.renewablesPct;
  const bgGradient = healthScore > 25
    ? "from-emerald-950/20 via-background to-background"
    : healthScore > 15
    ? "from-amber-950/20 via-background to-background"
    : "from-red-950/20 via-background to-background";

  return (
    <div className={`space-y-6 min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
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
      </motion.div>

      {/* KPI Cards with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Consumption", value: `${(data.totalConsumption / 1000).toFixed(0)} MWh`, icon: Zap, color: "text-energy-cyan" },
          { label: "Current Grid Load", value: `${data.gridLoad.toLocaleString()} kW`, icon: Factory, color: "text-energy-amber" },
          { label: "Renewables", value: `${data.renewablesPct}%`, icon: Leaf, color: "text-energy-green" },
          { label: "Carbon Savings", value: `${(data.carbonSavings / 1000).toFixed(1)}k Tons`, icon: TrendingDown, color: "text-primary" },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", damping: 20 }}
          >
            <Card className="glass-card hover:scale-[1.03] transition-transform cursor-pointer">
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
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass-card flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campus-map">Campus Map</TabsTrigger>
          <TabsTrigger value="3d-campus">3D Campus</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmarks</TabsTrigger>
          <TabsTrigger value="simulator">Energy Lab</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
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

          {/* Energy Flow Map */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">⚡ Live Energy Flow Map</CardTitle></CardHeader>
            <CardContent>
              <EnergyFlowMap />
            </CardContent>
          </Card>

          {/* Building Heatmap with expandable cards */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Building Energy Intensity Heatmap</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {buildingData.map((b) => {
                  const hue = b.intensity > 0.7 ? 0 : b.intensity > 0.5 ? 38 : 142;
                  const isExpanded = expandedBuilding === b.name;
                  return (
                    <motion.div
                      key={b.name}
                      layout
                      onClick={() => setExpandedBuilding(isExpanded ? null : b.name)}
                      className={`rounded-lg p-3 text-center cursor-pointer border border-border/30 transition-shadow ${
                        isExpanded ? "col-span-2 row-span-2 z-10 shadow-2xl" : ""
                      }`}
                      style={{ background: `hsla(${hue}, 70%, ${50 - b.intensity * 15}%, 0.2)`, borderColor: `hsla(${hue}, 70%, 50%, 0.3)` }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <p className="text-xs font-medium text-foreground">{b.name}</p>
                      <p className="text-lg font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{Math.round(b.intensity * 100)}%</p>
                      <p className="text-[10px] text-muted-foreground">{b.type}</p>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-1 text-left"
                          >
                            <p className="text-[10px] text-muted-foreground">Avg Load: {Math.round(b.intensity * 850)} kW</p>
                            <p className="text-[10px] text-muted-foreground">Peak: {Math.round(b.intensity * 1200)} kW</p>
                            <p className="text-[10px] text-muted-foreground">Status: {b.intensity > 0.7 ? "⚠️ High" : b.intensity > 0.5 ? "⚡ Moderate" : "✅ Optimal"}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alert Center */}
          <AlertCenter />
        </TabsContent>

        {/* CAMPUS MAP TAB */}
        <TabsContent value="campus-map" className="space-y-4">
          <CampusMap selectedBuilding={expandedBuilding} onBuildingSelect={setExpandedBuilding} />
          {expandedBuilding && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card-active">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{expandedBuilding} — Detailed View</p>
                      <p className="text-[10px] text-muted-foreground">Filtered stats for selected building</p>
                    </div>
                    {(() => {
                      const b = buildingData.find(x => x.name === expandedBuilding);
                      if (!b) return null;
                      const hue = b.intensity > 0.7 ? 0 : b.intensity > 0.5 ? 38 : 142;
                      return (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div><p className="text-[10px] text-muted-foreground">Load</p><p className="text-lg font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{Math.round(b.intensity * 850)} kW</p></div>
                          <div><p className="text-[10px] text-muted-foreground">Peak</p><p className="text-lg font-bold text-foreground">{Math.round(b.intensity * 1200)} kW</p></div>
                          <div><p className="text-[10px] text-muted-foreground">Efficiency</p><p className="text-lg font-bold text-energy-green">{Math.round((1 - b.intensity) * 100)}%</p></div>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-energy-amber" /> Campus Green Leaderboard</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="text-[10px] w-12">Rank</TableHead>
                    <TableHead className="text-[10px]">Building</TableHead>
                    <TableHead className="text-[10px]">Type</TableHead>
                    <TableHead className="text-[10px] text-right">Efficiency Score</TableHead>
                    <TableHead className="text-[10px] text-right">24h Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...buildingData]
                    .sort((a, b) => a.intensity - b.intensity)
                    .map((b, idx) => {
                      const score = Math.round((1 - b.intensity) * 100);
                      const trendUp = Math.random() > 0.5;
                      const trendVal = (Math.random() * 8 + 1).toFixed(1);
                      const trophyIcon = idx === 0 ? <Trophy className="h-3.5 w-3.5 text-energy-amber glow-amber" /> : idx === 1 ? <Medal className="h-3.5 w-3.5 text-muted-foreground" style={{ color: "#c0c0c0" }} /> : idx === 2 ? <Award className="h-3.5 w-3.5" style={{ color: "#cd7f32" }} /> : null;
                      return (
                        <TableRow key={b.name} className={`border-border/20 ${idx < 3 ? "bg-primary/5" : ""}`}>
                          <TableCell className="text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                              {trophyIcon || <span className="text-muted-foreground">{idx + 1}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-foreground">{b.name}</TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">{b.type}</TableCell>
                          <TableCell className="text-right">
                            <span className={`text-xs font-bold ${score > 60 ? "text-energy-green" : score > 40 ? "text-energy-amber" : "text-energy-red"}`}>{score}%</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${trendUp ? "text-energy-red" : "text-energy-green"}`}>
                              {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {trendVal}%
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d-campus" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">🏗️ 3D Campus Digital Twin</CardTitle>
              <p className="text-[10px] text-muted-foreground">Rotate to explore • Building colors map to energy intensity • Red = High, Green = Optimal</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="w-full h-[400px] rounded-xl bg-secondary/30 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground animate-pulse">Loading 3D Campus...</p>
                </div>
              }>
                <Campus3DView />
              </Suspense>
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
                  <motion.div
                    className="glass-card rounded-lg p-4 text-center glow-primary"
                    animate={{ scale: solarSlider[0] > 50 ? [1, 1.02, 1] : 1 }}
                    transition={{ repeat: solarSlider[0] > 50 ? Infinity : 0, duration: 2 }}
                  >
                    <p className="text-xs text-muted-foreground">Projected CO₂ Reduction</p>
                    <p className="text-3xl font-bold text-primary">{co2Reduction}</p>
                    <p className="text-xs text-muted-foreground">Metric Tons/yr</p>
                  </motion.div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground">Grid Independence</p>
                    <p className="text-3xl font-bold text-energy-cyan">{Math.min(100, Math.round(gridIndependence))}%</p>
                    <p className="text-xs text-muted-foreground">Self-powered</p>
                  </div>
                </div>
                <AnimatePresence>
                  {solarSlider[0] >= 80 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="glass-card rounded-lg p-3 border-primary/30 border text-center"
                    >
                      <Leaf className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-primary font-semibold">🎉 Net-Zero trajectory achieved!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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

          {/* Retrofit Calculator */}
          <RetrofitCalculator />

          {/* AI Recommendations */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">🤖 Smart Recommendations for {selectedUni}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiRecommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-lg p-4 space-y-2 hover:scale-[1.02] transition-transform cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${rec.priority === "high" ? "bg-energy-red" : rec.priority === "medium" ? "bg-energy-amber" : "bg-energy-green"}`} />
                      <p className="text-xs font-semibold text-foreground">{rec.action}</p>
                    </div>
                    <p className="text-xs text-primary">{rec.impact}</p>
                    <p className="text-[10px] text-muted-foreground">ROI: {rec.roi}</p>
                  </motion.div>
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
            ].map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <Card className="glass-card">
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
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
