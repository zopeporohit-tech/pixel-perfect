import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Share2, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

const leaderboard = [
  { rank: 1, name: "Admin Block", saved: 42, badge: "🏆", change: "+8%", trend: "up" },
  { rank: 2, name: "Hostel-1", saved: 38, badge: "🥈", change: "+12%", trend: "up" },
  { rank: 3, name: "Library", saved: 35, badge: "🥉", change: "+5%", trend: "up" },
  { rank: 4, name: "Canteen", saved: 28, badge: "⭐", change: "+3%", trend: "up" },
  { rank: 5, name: "B-Block", saved: 22, badge: "⭐", change: "-2%", trend: "down" },
];

const hallOfFame = { name: "Hostel-1", improvement: "+12%", month: "Feb 2026" };

export default function GamificationPanel() {
  const [goalProgress, setGoalProgress] = useState(0);
  const targetKwh = 500;
  const currentSaved = 467;
  const pct = Math.round((currentSaved / targetKwh) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setGoalProgress(pct), 300);
    return () => clearTimeout(timer);
  }, [pct]);

  useEffect(() => {
    if (goalProgress >= 100) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2dd4bf", "#4ade80", "#fbbf24"],
      });
    }
  }, [goalProgress]);

  return (
    <div className="space-y-4">
      {/* Campus Goal Tracker */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Today's Campus Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Save {targetKwh} kWh today</span>
            <span className="text-primary font-bold">{currentSaved} / {targetKwh} kWh</span>
          </div>
          <div className="relative">
            <Progress value={goalProgress} className="h-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground drop-shadow">{goalProgress}%</span>
            </div>
          </div>
          {goalProgress >= 90 && goalProgress < 100 && (
            <p className="text-xs text-energy-amber animate-pulse text-center">🔥 Almost there! Just {targetKwh - currentSaved} kWh to go!</p>
          )}
          {goalProgress >= 100 && (
            <div className="text-center animate-fade-in">
              <Sparkles className="h-5 w-5 text-energy-amber mx-auto" />
              <p className="text-xs text-primary font-bold">🎉 Goal Achieved! Campus saved {targetKwh} kWh today!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-energy-amber" /> Energy Champion Podium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-2 rounded-lg transition-all hover:scale-[1.01] ${
                item.rank <= 3 ? "glass-card border-primary/20" : "bg-secondary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.badge}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Saved {item.saved}% energy</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${item.trend === "up" ? "text-energy-green" : "text-energy-red"}`}>
                {item.change}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hall of Fame */}
      <Card className="glass-card border-energy-amber/30 glow-primary">
        <CardContent className="p-4 text-center space-y-2">
          <Award className="h-8 w-8 text-energy-amber mx-auto" />
          <p className="text-xs text-muted-foreground">Most Improved — {hallOfFame.month}</p>
          <p className="text-lg font-bold text-foreground">{hallOfFame.name}</p>
          <p className="text-sm text-energy-green font-bold">{hallOfFame.improvement} improvement</p>
          <Button variant="outline" size="sm" className="text-xs mt-2">
            <Share2 className="h-3 w-3 mr-1" /> Share Badge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
