import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, Zap, Battery, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FormData {
  orgName: string;
  area: number;
  monthlyUsage: number;
  sunnyDays: number;
  rooftopSpace: number;
}

const OnboardingPage = () => {
  const [form, setForm] = useState<FormData>({ orgName: "", area: 0, monthlyUsage: 0, sunnyDays: 250, rooftopSpace: 30 });
  const [results, setResults] = useState<null | { panels: number; gridReduction: number; savings: number }>(null);
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      const panelArea = (form.area * form.rooftopSpace) / 100;
      const panels = Math.floor(panelArea / 17.5);
      const solarOutput = panels * 0.4 * form.sunnyDays * 5;
      const gridReduction = Math.min(95, Math.round((solarOutput / (form.monthlyUsage * 12)) * 100));
      const savings = Math.round(form.monthlyUsage * 8 * (gridReduction / 100));
      setResults({ panels, gridReduction, savings });
      setLoading(false);
    }, 2000);
  };

  const compareData = results ? [
    { name: "Your Org", gridDep: 100 - results.gridReduction, renewable: results.gridReduction },
    { name: "NMIMS Indore", gridDep: 85, renewable: 15 },
    { name: "MIT", gridDep: 72, renewable: 28 },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section with Animations */}
      <div className="relative glass-card rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-4 right-8 opacity-20">
          {/* Windmill */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin-slow">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <g fill="hsl(168, 80%, 42%)" transform="translate(32,32)">
                    <rect x="-2" y="-28" width="4" height="26" rx="2" />
                    <rect x="-2" y="-28" width="4" height="26" rx="2" transform="rotate(120)" />
                    <rect x="-2" y="-28" width="4" height="26" rx="2" transform="rotate(240)" />
                  </g>
                  <circle cx="32" cy="32" r="3" fill="hsl(168, 80%, 42%)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-32 opacity-20">
          {/* Solar Panel with glint */}
          <div className="relative w-12 h-12 overflow-hidden">
            <Sun className="h-12 w-12 text-energy-amber" />
            <div className="absolute inset-0 animate-sun-glint bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            Join the Net-Zero Movement
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Get a free energy audit for your organization. Whether you're a school, office, or factory — 
            discover your sun power rating and start your green journey today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm">Your Organization Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Organization Name</Label>
              <Input placeholder="e.g. Green Valley School" value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Total Area (sq. ft.)</Label>
                <Input type="number" placeholder="50000" value={form.area || ""}
                  onChange={(e) => setForm({ ...form, area: +e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Monthly Power Usage (kWh)</Label>
                <Input type="number" placeholder="15000" value={form.monthlyUsage || ""}
                  onChange={(e) => setForm({ ...form, monthlyUsage: +e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Sunny Days per Year</Label>
                <Input type="number" placeholder="250" value={form.sunnyDays || ""}
                  onChange={(e) => setForm({ ...form, sunnyDays: +e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Available Rooftop Space (%)</Label>
                <Input type="number" placeholder="30" value={form.rooftopSpace || ""}
                  onChange={(e) => setForm({ ...form, rooftopSpace: +e.target.value })} className="mt-1" />
              </div>
            </div>
            <Button onClick={calculate} className="w-full" disabled={!form.area || !form.monthlyUsage || loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Battery className="h-4 w-4 animate-pulse" /> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Calculate My Strategy</span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {loading && (
            <Card className="glass-card">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="relative w-16 h-24 border-2 border-primary/30 rounded-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/60 animate-battery-fill" />
                </div>
                <p className="text-xs text-muted-foreground mt-4">Crunching your energy data...</p>
              </CardContent>
            </Card>
          )}
          {results && !loading && (
            <>
              <Card className="glass-card animate-fade-in glow-primary">
                <CardHeader><CardTitle className="text-sm">🌱 Your Personalized Energy Roadmap</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card rounded-lg p-3 text-center">
                      <Sun className="h-5 w-5 text-energy-amber mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{results.panels}</p>
                      <p className="text-[10px] text-muted-foreground">Solar Panels</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 text-center">
                      <Leaf className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{results.gridReduction}%</p>
                      <p className="text-[10px] text-muted-foreground">Grid Independence</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 text-center">
                      <Zap className="h-5 w-5 text-energy-cyan mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">₹{results.savings.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Annual Savings</p>
                    </div>
                  </div>
                  <div className="glass-card rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground">💡 Quick Wins</p>
                    <p className="text-[11px] text-muted-foreground">• Switch to LED lighting — saves up to 40% on lighting bills</p>
                    <p className="text-[11px] text-muted-foreground">• Add motion sensors — keeps the lights on only when needed</p>
                    <p className="text-[11px] text-muted-foreground">• Smart HVAC scheduling — cut cooling costs during off-hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Compare Chart */}
              <Card className="glass-card animate-fade-in">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Compare Me</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={compareData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" />
                      <XAxis dataKey="name" stroke="hsl(200, 10%, 55%)" fontSize={10} />
                      <YAxis stroke="hsl(200, 10%, 55%)" fontSize={10} />
                      <Tooltip contentStyle={{ background: "hsl(200, 20%, 11%)", border: "1px solid hsl(200, 15%, 18%)", borderRadius: "8px", color: "hsl(160, 20%, 92%)" }} />
                      <Legend />
                      <Bar dataKey="renewable" name="Renewable %" fill="hsl(168, 80%, 42%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="gridDep" name="Grid Dependent %" fill="hsl(215, 20%, 55%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
          {!results && !loading && (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <Leaf className="h-10 w-10 text-primary/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Fill in your details and click "Calculate" to see your personalized energy roadmap</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
