import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { euiComparison, universityData, type University } from "@/data/mockData";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";


const BenchmarksPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> EUI Benchmarks</h1>
      <p className="text-sm text-muted-foreground">Energy Use Intensity comparison across universities</p>
    </div>
    <Card className="glass-card">
      <CardHeader><CardTitle className="text-sm">EUI Comparison (kWh/m²)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={euiComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
            <XAxis dataKey="name" stroke="hsl(200, 10%, 55%)" fontSize={11} />
            <YAxis stroke="hsl(200, 10%, 55%)" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
            <Bar dataKey="eui" radius={[6, 6, 0, 0]}>
              {euiComparison.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="glass-card">
      <CardHeader><CardTitle className="text-sm">Multi-University Radar Overlay</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={universityData["MIT"].radarData.map((item, idx) => ({
            metric: item.metric,
            MIT: universityData["MIT"].radarData[idx].value,
            Stanford: universityData["Stanford"].radarData[idx].value,
            "NMIMS Indore": universityData["NMIMS Indore"].radarData[idx].value,
          }))}>
            <PolarGrid stroke="hsl(200, 15%, 18%)" />
            <PolarAngleAxis dataKey="metric" stroke="hsl(200, 10%, 55%)" fontSize={10} />
            <PolarRadiusAxis stroke="hsl(200, 15%, 18%)" fontSize={10} />
            <Radar name="MIT" dataKey="MIT" stroke="hsl(174, 72%, 50%)" fill="hsl(174, 72%, 50%)" fillOpacity={0.1} />
            <Radar name="Stanford" dataKey="Stanford" stroke="hsl(38, 92%, 55%)" fill="hsl(38, 92%, 55%)" fillOpacity={0.1} />
            <Radar name="NMIMS Indore" dataKey="NMIMS Indore" stroke="hsl(168, 80%, 42%)" fill="hsl(168, 80%, 42%)" fillOpacity={0.1} />
            <Legend />
            <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default BenchmarksPage;
