import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Leaf, TrendingDown, IndianRupee } from "lucide-react";
import { buildingData } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const upgrades = [
  { id: "led", label: "LED Lighting Retrofit", costPerSqft: 12, savingPct: 0.15, co2Factor: 0.08 },
  { id: "hvac", label: "Smart HVAC System", costPerSqft: 35, savingPct: 0.22, co2Factor: 0.14 },
  { id: "sensors", label: "Occupancy Sensors", costPerSqft: 8, savingPct: 0.12, co2Factor: 0.06 },
  { id: "insulation", label: "Thermal Insulation", costPerSqft: 20, savingPct: 0.18, co2Factor: 0.1 },
];

export default function RetrofitCalculator() {
  const [building, setBuilding] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleUpgrade = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    setShowResult(false);
  };

  const bData = buildingData.find((b) => b.name === building);
  const area = bData ? 5000 + bData.intensity * 15000 : 10000;
  const monthlyBill = area * 8;

  const totalSaving = selected.reduce((sum, id) => sum + (upgrades.find((u) => u.id === id)?.savingPct || 0), 0);
  const totalCost = selected.reduce((sum, id) => sum + (upgrades.find((u) => u.id === id)?.costPerSqft || 0) * area, 0);
  const annualSaving = monthlyBill * 12 * totalSaving;
  const roi = annualSaving > 0 ? Math.round(totalCost / annualSaving * 12) : 0;
  const co2Saved = selected.reduce((sum, id) => sum + (upgrades.find((u) => u.id === id)?.co2Factor || 0) * area / 100, 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" /> Smart Upgrade ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={building} onValueChange={(v) => { setBuilding(v); setShowResult(false); }}>
          <SelectTrigger className="glass-card">
            <SelectValue placeholder="Select a building..." />
          </SelectTrigger>
          <SelectContent>
            {buildingData.map((b) => (
              <SelectItem key={b.name} value={b.name}>{b.name} ({b.type})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Apply upgrades:</p>
          {upgrades.map((u) => (
            <label key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors">
              <Checkbox checked={selected.includes(u.id)} onCheckedChange={() => toggleUpgrade(u.id)} />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{u.label}</p>
                <p className="text-[10px] text-muted-foreground">~{u.savingPct * 100}% energy saving • ₹{u.costPerSqft}/sq.ft</p>
              </div>
            </label>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!building || selected.length === 0}
          onClick={() => setShowResult(true)}
        >
          Calculate ROI
        </Button>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 20 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-card rounded-lg p-3 text-center">
                  <IndianRupee className="h-4 w-4 text-energy-amber mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">₹{Math.round(annualSaving).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Annual Savings</p>
                </div>
                <div className="glass-card rounded-lg p-3 text-center">
                  <TrendingDown className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{roi} mo</p>
                  <p className="text-[9px] text-muted-foreground">Payback Period</p>
                </div>
                <div className="glass-card rounded-lg p-3 text-center">
                  <Leaf className="h-4 w-4 text-energy-green mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{co2Saved.toFixed(1)}T</p>
                  <p className="text-[9px] text-muted-foreground">CO₂ Reduced/yr</p>
                </div>
              </div>
              <Badge variant="outline" className="w-full justify-center py-1 text-xs border-primary/30 text-primary">
                Total investment: ₹{totalCost.toLocaleString()} • Energy reduction: {Math.round(totalSaving * 100)}%
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
