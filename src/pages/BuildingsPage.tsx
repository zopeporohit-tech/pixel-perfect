import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildingData } from "@/data/mockData";
import { Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BuildingsPage = () => {
  const chartData = buildingData.map((b) => ({ ...b, intensity: Math.round(b.intensity * 100) }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Building2 className="h-6 w-6 text-primary" /> Building-wise Data</h1>
        <p className="text-sm text-muted-foreground">Energy intensity breakdown by campus building</p>
      </div>
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-sm">Energy Intensity by Building (%)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(200, 10%, 55%)" fontSize={10} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(200, 10%, 55%)" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
              <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.intensity > 70 ? "hsl(0, 72%, 55%)" : entry.intensity > 50 ? "hsl(38, 92%, 55%)" : "hsl(142, 76%, 46%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {buildingData.map((b) => {
          const hue = b.intensity > 0.7 ? 0 : b.intensity > 0.5 ? 38 : 142;
          return (
            <Card key={b.name} className="glass-card hover:scale-[1.02] transition-transform">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.type}</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: `hsl(${hue}, 70%, 50%)` }}>{Math.round(b.intensity * 100)}%</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BuildingsPage;
