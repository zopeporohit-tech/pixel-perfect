import { useState, useMemo, Suspense, lazy, useEffect, useRef } from "react";
import { Zap, Leaf, Factory, TrendingDown, Sun, Wind, TrendingUp, Trophy, Medal, Award, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, AreaChart, Area, LineChart,
} from "recharts";
import { universityData, hourlyDemand, euiComparison, buildingData, aiRecommendations, indianCampusComparison, type University } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import EnergyFlowMap from "@/components/EnergyFlowMap";
import AlertCenter from "@/components/AlertCenter";
import RetrofitCalculator from "@/components/RetrofitCalculator";
import CampusMap from "@/components/CampusMap";
import MLForecastChart from "@/components/MLForecastChart";
import { useRealtime } from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";

const Campus3DView = lazy(() => import("@/components/Campus3DView"));

const Index = () => {
  const [selectedUni, setSelectedUni] = useState<University>("NMIMS Indore");
  const [solarSlider, setSolarSlider] = useState([15]);
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const data = universityData[selectedUni];
  const { liveMetrics, forecastData, anomalies, liveHistory } = useRealtime();
  const lastAnomalyRef = useRef<string>("");

  // Anomaly toast notification
  useEffect(() => {
    if (anomalies.size > 0) {
      const anomalyList = Array.from(anomalies).join(", ");
      if (anomalyList !== lastAnomalyRef.current) {
        lastAnomalyRef.current = anomalyList;
        toast({
          title: "⚠️ Anomaly Detected",
          description: `Energy spike in: ${anomalyList}. Usage 20%+ above moving average.`,
          variant: "destructive",
        });
      }
    }
  }, [anomalies]);

  const co2Reduction = useMemo(() => {
    return Math.round(data.totalConsumption * (solarSlider[0] / 100) * 0.7 / 1000);
  }, [data.totalConsumption, solarSlider]);

  const gridIndependence = data.renewablesPct + solarSlider[0] * 0.5;

  const healthScore = data.renewablesPct;
  const bgGradient = healthScore > 25
    ? "from-emerald-950/20 via-background to-background"
    : healthScore > 15
    ? "from-amber-950/20 via-background to-background"
    : "from-red-950/20 via-background to-background";

  // Live KPI values (blend static + real-time)
  const liveLoad = liveMetrics?.totalLoad ?? data.gridLoad;
  const liveEfficiency = liveMetrics?.efficiency ?? 82;
  const liveSolar = liveMetrics?.solarOutput ?? 0;

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

      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Annual Consumption", value: `${(data.totalConsumption / 1000).toFixed(0)} MWh`, icon: Zap, color: "text-energy-cyan" },
          { label: "Live Grid Load", value: `${liveLoad.toLocaleString()} kW`, icon: Factory, color: "text-energy-amber", live: true },
          { label: "Efficiency", value: `${liveEfficiency}%`, icon: Activity, color: "text-energy-green", live: true },
          { label: "Solar Output", value: `${liveSolar} kW`, icon: Sun, color: "text-energy-amber", live: true },
          { label: "Carbon Savings", value: `${(data.carbonSavings / 1000).toFixed(1)}k T`, icon: TrendingDown, color: "text-primary" },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.08, type: "spring", damping: 20 }}
          >
            <Card className={`glass-card hover:scale-[1.03] transition-all cursor-pointer ${kpi.live ? "animate-pulse-glow" : ""}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg bg-secondary flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    {kpi.label}
                    {kpi.live && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-green opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-energy-green" />
                      </span>
                    )}
                  </p>
                  <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass-card flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ml-forecast">
            ML Forecast
            <span className="ml-1 relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-energy-cyan" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="campus-map">Campus Map</TabsTrigger>
          <TabsTrigger value="3d-campus">3D Campus</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmarks</TabsTrigger>
          <TabsTrigger value="simulator">Energy Lab</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="nmims">NMIMS Focus</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          {/* Live streaming chart */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-energy-cyan" /> Live Campus Load
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-energy-green" />
                </span>
                <span className="text-[9px] text-muted-foreground ml-2">Updated every 1s</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={liveHistory}>
                  <defs>
                    <linearGradient id="liveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(168, 80%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                  <XAxis dataKey="time" stroke="hsl(200, 10%, 55%)" fontSize={9} interval={9} />
                  <YAxis stroke="hsl(200, 10%, 55%)" fontSize={9} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(168, 80%, 42%)" fill="url(#liveAreaGrad)" strokeWidth={2} dot={false} name="Load (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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

          {/* Building Heatmap with live anomaly indicators */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Building Energy Intensity Heatmap</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {buildingData.map((b) => {
                  const liveBuilding = liveMetrics?.buildings.find((lb) => lb.name === b.name);
                  const intensity = liveBuilding?.intensity ?? b.intensity;
                  const hasAnomaly = anomalies.has(b.name);
                  const hue = intensity > 0.7 ? 0 : intensity > 0.5 ? 38 : 142;
                  const isExpanded = expandedBuilding === b.name;
                  return (
                    <motion.div
                      key={b.name}
                      layout
                      onClick={() => setExpandedBuilding(isExpanded ? null : b.name)}
                      className={`rounded-lg p-3 text-center cursor-pointer border border-border/30 transition-shadow relative ${
                        isExpanded ? "col-span-2 row-span-2 z-10 shadow-2xl" : ""
                      } ${hasAnomaly ? "glow-neon-red" : ""}`}
                      style={{ background: `hsla(${hue}, 70%, ${50 - intensity * 15}%, 0.2)`, borderColor: `hsla(${hue}, 70%, 50%, 0.3)` }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {hasAnomaly && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <AlertTriangle className="h-3.5 w-3.5 text-energy-red animate-pulse" />
                        </div>
                      )}
                      <p className="text-xs font-medium text-foreground">{b.name}</p>
                      <p className="text-lg font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{Math.round(intensity * 100)}%</p>
                      <p className="text-[10px] text-muted-foreground">{liveBuilding ? `${liveBuilding.load} kW` : b.type}</p>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-1 text-left"
                          >
                            <p className="text-[10px] text-muted-foreground">Avg Load: {liveBuilding?.load ?? Math.round(b.intensity * 850)} kW</p>
                            <p className="text-[10px] text-muted-foreground">Peak: {Math.round((liveBuilding?.intensity ?? b.intensity) * 1200)} kW</p>
                            <p className="text-[10px] text-muted-foreground">Status: {hasAnomaly ? "🔴 Anomaly" : intensity > 0.7 ? "⚠️ High" : intensity > 0.5 ? "⚡ Moderate" : "✅ Optimal"}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <AlertCenter />
        </TabsContent>

        {/* ML FORECAST TAB */}
        <TabsContent value="ml-forecast" className="space-y-4">
          <MLForecastChart data={forecastData} anomalyActive={anomalies.size > 0} />

          {/* Anomaly list */}
          {anomalies.size > 0 && (
            <Card className="glass-card border-energy-red/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-energy-red">
                  <AlertTriangle className="h-4 w-4" /> Active Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(anomalies).map((name) => (
                    <span key={name} className="text-[10px] px-2 py-1 rounded-full bg-energy-red/10 text-energy-red border border-energy-red/20 font-medium animate-pulse">
                      ⚠️ {name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live streaming mini-chart */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-energy-cyan" /> Real-time Load Stream
                <span className="text-[9px] text-muted-foreground">• 1s interval • sine-wave simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={liveHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                  <XAxis dataKey="time" stroke="hsl(200, 10%, 55%)" fontSize={9} interval={9} />
                  <YAxis stroke="hsl(200, 10%, 55%)" fontSize={9} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                  <Line type="monotone" dataKey="value" stroke="hsl(168, 80%, 42%)" strokeWidth={2} dot={false} name="Live kW" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
                      const lb = liveMetrics?.buildings.find(x => x.name === expandedBuilding);
                      const b = buildingData.find(x => x.name === expandedBuilding);
                      if (!b) return null;
                      const intensity = lb?.intensity ?? b.intensity;
                      const hue = intensity > 0.7 ? 0 : intensity > 0.5 ? 38 : 142;
                      return (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div><p className="text-[10px] text-muted-foreground">Load</p><p className="text-lg font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{lb?.load ?? Math.round(b.intensity * 850)} kW</p></div>
                          <div><p className="text-[10px] text-muted-foreground">Peak</p><p className="text-lg font-bold text-foreground">{Math.round(intensity * 1200)} kW</p></div>
                          <div><p className="text-[10px] text-muted-foreground">Efficiency</p><p className="text-lg font-bold text-energy-green">{Math.round((1 - intensity) * 100)}%</p></div>
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
                    <TableHead className="text-[10px] text-right">Efficiency</TableHead>
                    <TableHead className="text-[10px] text-right">Live Load</TableHead>
                    <TableHead className="text-[10px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...buildingData]
                    .sort((a, b) => a.intensity - b.intensity)
                    .map((b, idx) => {
                      const lb = liveMetrics?.buildings.find(x => x.name === b.name);
                      const score = Math.round((1 - (lb?.intensity ?? b.intensity)) * 100);
                      const hasAnomaly = anomalies.has(b.name);
                      const trophyIcon = idx === 0 ? <Trophy className="h-3.5 w-3.5 text-energy-amber" /> : idx === 1 ? <Medal className="h-3.5 w-3.5" style={{ color: "#c0c0c0" }} /> : idx === 2 ? <Award className="h-3.5 w-3.5" style={{ color: "#cd7f32" }} /> : null;
                      return (
                        <TableRow key={b.name} className={`border-border/20 ${idx < 3 ? "bg-primary/5" : ""} ${hasAnomaly ? "bg-energy-red/5" : ""}`}>
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
                          <TableCell className="text-right text-xs font-mono text-foreground">{lb?.load ?? "—"} kW</TableCell>
                          <TableCell className="text-right">
                            {hasAnomaly ? (
                              <span className="text-[10px] text-energy-red font-bold animate-pulse">⚠️ SPIKE</span>
                            ) : (
                              <span className="text-[10px] text-energy-green">✅ Normal</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3D CAMPUS TAB */}
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
              </CardContent>
            </Card>
          </div>
          <RetrofitCalculator />
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
