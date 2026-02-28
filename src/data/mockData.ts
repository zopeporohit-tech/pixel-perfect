export type University = "MIT" | "Stanford" | "Harvard" | "Oxford" | "NMIMS Indore";

export const universityData: Record<University, {
  totalConsumption: number;
  gridLoad: number;
  renewablesPct: number;
  carbonSavings: number;
  eui: number;
  energySources: { name: string; value: number; color: string }[];
  radarData: { metric: string; value: number }[];
}> = {
  "MIT": {
    totalConsumption: 285000,
    gridLoad: 42500,
    renewablesPct: 28,
    carbonSavings: 18500,
    eui: 245,
    energySources: [
      { name: "Solar", value: 18, color: "hsl(38, 92%, 50%)" },
      { name: "Wind", value: 10, color: "hsl(174, 72%, 40%)" },
      { name: "Grid", value: 55, color: "hsl(215, 20%, 55%)" },
      { name: "Thermal", value: 17, color: "hsl(0, 72%, 51%)" },
    ],
    radarData: [
      { metric: "Solar Adoption", value: 85 },
      { metric: "Water Recycling", value: 72 },
      { metric: "Carbon Neutrality", value: 65 },
      { metric: "Smart Grid", value: 90 },
      { metric: "Green Building", value: 78 },
    ],
  },
  "Stanford": {
    totalConsumption: 310000,
    gridLoad: 38000,
    renewablesPct: 32,
    carbonSavings: 22000,
    eui: 220,
    energySources: [
      { name: "Solar", value: 25, color: "hsl(38, 92%, 50%)" },
      { name: "Wind", value: 7, color: "hsl(174, 72%, 40%)" },
      { name: "Grid", value: 48, color: "hsl(215, 20%, 55%)" },
      { name: "Thermal", value: 20, color: "hsl(0, 72%, 51%)" },
    ],
    radarData: [
      { metric: "Solar Adoption", value: 92 },
      { metric: "Water Recycling", value: 68 },
      { metric: "Carbon Neutrality", value: 70 },
      { metric: "Smart Grid", value: 85 },
      { metric: "Green Building", value: 88 },
    ],
  },
  "Harvard": {
    totalConsumption: 260000,
    gridLoad: 35000,
    renewablesPct: 25,
    carbonSavings: 15000,
    eui: 210,
    energySources: [
      { name: "Solar", value: 15, color: "hsl(38, 92%, 50%)" },
      { name: "Wind", value: 10, color: "hsl(174, 72%, 40%)" },
      { name: "Grid", value: 58, color: "hsl(215, 20%, 55%)" },
      { name: "Thermal", value: 17, color: "hsl(0, 72%, 51%)" },
    ],
    radarData: [
      { metric: "Solar Adoption", value: 70 },
      { metric: "Water Recycling", value: 82 },
      { metric: "Carbon Neutrality", value: 75 },
      { metric: "Smart Grid", value: 72 },
      { metric: "Green Building", value: 80 },
    ],
  },
  "Oxford": {
    totalConsumption: 195000,
    gridLoad: 28000,
    renewablesPct: 20,
    carbonSavings: 12000,
    eui: 180,
    energySources: [
      { name: "Solar", value: 12, color: "hsl(38, 92%, 50%)" },
      { name: "Wind", value: 8, color: "hsl(174, 72%, 40%)" },
      { name: "Grid", value: 62, color: "hsl(215, 20%, 55%)" },
      { name: "Thermal", value: 18, color: "hsl(0, 72%, 51%)" },
    ],
    radarData: [
      { metric: "Solar Adoption", value: 55 },
      { metric: "Water Recycling", value: 60 },
      { metric: "Carbon Neutrality", value: 58 },
      { metric: "Smart Grid", value: 50 },
      { metric: "Green Building", value: 65 },
    ],
  },
  "NMIMS Indore": {
    totalConsumption: 48000,
    gridLoad: 8500,
    renewablesPct: 15,
    carbonSavings: 3200,
    eui: 135,
    energySources: [
      { name: "Solar", value: 12, color: "hsl(38, 92%, 50%)" },
      { name: "Wind", value: 3, color: "hsl(174, 72%, 40%)" },
      { name: "Grid", value: 75, color: "hsl(215, 20%, 55%)" },
      { name: "Thermal", value: 10, color: "hsl(0, 72%, 51%)" },
    ],
    radarData: [
      { metric: "Solar Adoption", value: 40 },
      { metric: "Water Recycling", value: 45 },
      { metric: "Carbon Neutrality", value: 30 },
      { metric: "Smart Grid", value: 35 },
      { metric: "Green Building", value: 50 },
    ],
  },
};

export const hourlyDemand = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const base = 2000 + Math.sin((hour - 6) * Math.PI / 12) * 1500;
  return {
    hour: `${hour.toString().padStart(2, "0")}:00`,
    university: Math.max(500, Math.round(base + (Math.random() - 0.5) * 400)),
    globalAvg: Math.max(800, Math.round(base * 1.2 + (Math.random() - 0.5) * 300)),
  };
});

export const euiComparison = [
  { name: "MIT", eui: 245, fill: "hsl(174, 72%, 40%)" },
  { name: "Stanford", eui: 220, fill: "hsl(168, 80%, 42%)" },
  { name: "Harvard", eui: 210, fill: "hsl(142, 76%, 46%)" },
  { name: "Oxford", eui: 180, fill: "hsl(38, 92%, 55%)" },
  { name: "NMIMS", eui: 135, fill: "hsl(168, 80%, 36%)" },
  { name: "Top 10 Avg", eui: 200, fill: "hsl(215, 20%, 55%)" },
];

export const buildingData = [
  { name: "A-Block", intensity: 0.85, type: "Academic" },
  { name: "B-Block", intensity: 0.45, type: "Academic" },
  { name: "Library", intensity: 0.62, type: "Facility" },
  { name: "Lab Complex", intensity: 0.92, type: "Research" },
  { name: "Hostel-1", intensity: 0.38, type: "Residential" },
  { name: "Hostel-2", intensity: 0.42, type: "Residential" },
  { name: "Canteen", intensity: 0.55, type: "Facility" },
  { name: "Admin", intensity: 0.3, type: "Admin" },
  { name: "Sports Complex", intensity: 0.25, type: "Facility" },
  { name: "Auditorium", intensity: 0.7, type: "Facility" },
  { name: "Data Center", intensity: 0.95, type: "IT" },
  { name: "Workshop", intensity: 0.68, type: "Research" },
];

export const aiRecommendations = [
  { action: "Install occupancy sensors in Library", impact: "Save 12% HVAC energy", roi: "14 months", priority: "high" },
  { action: "Upgrade to LED lighting in Hostels", impact: "Reduce lighting costs by 40%", roi: "8 months", priority: "high" },
  { action: "Add solar panels on Canteen roof", impact: "Generate 15 kW peak power", roi: "3 years", priority: "medium" },
  { action: "Smart HVAC scheduling for A-Block", impact: "Cut cooling costs by 22%", roi: "6 months", priority: "high" },
  { action: "Install EV charging with solar", impact: "Green transport + revenue", roi: "4 years", priority: "low" },
];

export const indianCampusComparison = [
  { name: "NMIMS Indore", coolingEff: 78, solarAdoption: 15 },
  { name: "IIT Bombay", coolingEff: 82, solarAdoption: 22 },
  { name: "IIT Delhi", coolingEff: 75, solarAdoption: 18 },
  { name: "BITS Pilani", coolingEff: 88, solarAdoption: 25 },
  { name: "IIM Indore", coolingEff: 80, solarAdoption: 12 },
];
