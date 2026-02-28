import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { title: "Q1 2025 Sustainability Report", date: "Apr 2025", size: "2.4 MB", type: "Quarterly" },
  { title: "Annual Energy Audit 2024-25", date: "Mar 2025", size: "5.1 MB", type: "Annual" },
  { title: "Solar Installation Progress", date: "Feb 2025", size: "1.8 MB", type: "Project" },
  { title: "Carbon Offset Certificate", date: "Jan 2025", size: "0.5 MB", type: "Certificate" },
  { title: "HVAC Optimization Results", date: "Dec 2024", size: "3.2 MB", type: "Analysis" },
  { title: "Q4 2024 Sustainability Report", date: "Jan 2025", size: "2.1 MB", type: "Quarterly" },
];

const ReportsPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Sustainability Reports</h1>
      <p className="text-sm text-muted-foreground">Download and review campus sustainability documentation</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((r) => (
        <Card key={r.title} className="glass-card hover:scale-[1.02] transition-transform">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{r.type}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{r.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">{r.date} • {r.size}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Download className="h-3 w-3 mr-1" /> Download PDF
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ReportsPage;
