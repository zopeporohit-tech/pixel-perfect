import GamificationPanel from "@/components/GamificationPanel";
import { Trophy } from "lucide-react";

const GamificationPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Trophy className="h-6 w-6 text-energy-amber" /> Energy Champions
      </h1>
      <p className="text-sm text-muted-foreground">Campus-wide energy saving competition & goals</p>
    </div>
    <GamificationPanel />
  </div>
);

export default GamificationPage;
