const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ================================
   DASHBOARD API
================================ */

app.get("/api/dashboard", (req, res) => {
  res.json({
    totalBuildings: 12,
    totalEnergy: 4583,
    averageEnergy: 381.9,
    liveLoad: 4583,
    efficiency: 71.8,
    solarOutput: 320,
    carbonSavings: 3.2
  });
});

/* ================================
   BUILDINGS API
================================ */

app.get("/api/buildings", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Data Center",
      energyUsage: 1200,
      status: "High Usage"
    },
    {
      id: 2,
      name: "Library",
      energyUsage: 780,
      status: "Normal"
    },
    {
      id: 3,
      name: "Lab Complex",
      energyUsage: 980,
      status: "Warning"
    }
  ]);
});

/* ================================
   REAL-TIME FEED API
================================ */

app.get("/api/feed", (req, res) => {
  res.json([
    {
      id: 1,
      message: "Energy spike detected in Lab Complex",
      time: "2 minutes ago"
    },
    {
      id: 2,
      message: "Solar output increased by 15%",
      time: "10 minutes ago"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Bright Wave Backend running on http://localhost:${PORT}`);
});