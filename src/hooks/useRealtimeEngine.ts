import { useState, useEffect, useCallback, useRef } from "react";
import { buildingData } from "@/data/mockData";

export interface LiveMetrics {
  timestamp: number;
  totalLoad: number;
  efficiency: number;
  solarOutput: number;
  gridDraw: number;
  buildings: { name: string; load: number; intensity: number; anomaly: boolean }[];
}

export interface ForecastPoint {
  time: string;
  actual: number;
  predicted: number;
  upper: number;
  lower: number;
}

const ANOMALY_THRESHOLD = 1.20; // 20% above moving average
const HISTORY_SIZE = 60;

function sineWaveValue(base: number, amplitude: number, tickOffset: number, periodSeconds: number) {
  return base + amplitude * Math.sin((2 * Math.PI * tickOffset) / periodSeconds);
}

export function useRealtimeEngine() {
  const [tick, setTick] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [anomalies, setAnomalies] = useState<Set<string>>(new Set());
  const [liveHistory, setLiveHistory] = useState<{ time: string; value: number }[]>([]);
  const movingAvgRef = useRef<Map<string, number[]>>(new Map());

  const generateMetrics = useCallback((t: number): LiveMetrics => {
    // Simulate a 24-hour campus day compressed into ~120 seconds
    const dayProgress = (t % 120) / 120; // 0..1 representing a full day
    const hourOfDay = dayProgress * 24;

    // Campus load follows sine: peak at 14:00 (2PM), low at 3AM
    const baseLoad = 5500;
    const loadAmplitude = 2500;
    const totalLoad = sineWaveValue(baseLoad, loadAmplitude, hourOfDay - 6, 24) + (Math.random() - 0.5) * 300;

    const efficiency = Math.max(60, Math.min(98, 82 + 12 * Math.sin((hourOfDay - 10) * Math.PI / 12) + (Math.random() - 0.5) * 4));

    // Solar follows daylight: peak at noon
    const solarBase = hourOfDay > 6 && hourOfDay < 18 ? 800 * Math.sin((hourOfDay - 6) * Math.PI / 12) : 0;
    const solarOutput = Math.max(0, solarBase + (Math.random() - 0.5) * 100);

    const gridDraw = Math.max(0, totalLoad - solarOutput);

    // Per-building metrics with anomaly detection
    const newAnomalies = new Set<string>();
    const buildings = buildingData.map((b) => {
      const buildingLoad = sineWaveValue(
        b.intensity * 850,
        b.intensity * 200,
        hourOfDay + b.name.length, // phase offset per building
        24
      ) + (Math.random() - 0.5) * 50;

      // Moving average for anomaly detection
      if (!movingAvgRef.current.has(b.name)) {
        movingAvgRef.current.set(b.name, []);
      }
      const history = movingAvgRef.current.get(b.name)!;
      history.push(buildingLoad);
      if (history.length > 10) history.shift();
      const avg = history.reduce((s, v) => s + v, 0) / history.length;

      // Randomly inject anomalies (3% chance per tick for high-intensity buildings)
      const hasSpike = b.intensity > 0.6 && Math.random() < 0.03;
      const finalLoad = hasSpike ? buildingLoad * 1.35 : buildingLoad;
      const isAnomaly = finalLoad > avg * ANOMALY_THRESHOLD;
      if (isAnomaly) newAnomalies.add(b.name);

      return {
        name: b.name,
        load: Math.round(finalLoad),
        intensity: Math.min(1, finalLoad / 1200),
        anomaly: isAnomaly,
      };
    });

    setAnomalies(newAnomalies);

    return {
      timestamp: Date.now(),
      totalLoad: Math.round(totalLoad),
      efficiency: Math.round(efficiency * 10) / 10,
      solarOutput: Math.round(solarOutput),
      gridDraw: Math.round(gridDraw),
      buildings,
    };
  }, []);

  const generateForecast = useCallback((t: number): ForecastPoint[] => {
    const points: ForecastPoint[] = [];
    const now = (t % 120) / 120 * 24;

    for (let i = -12; i <= 6; i++) {
      const hour = now + i * 0.5;
      const displayHour = ((hour % 24) + 24) % 24;
      const timeStr = `${Math.floor(displayHour).toString().padStart(2, "0")}:${(displayHour % 1 >= 0.5 ? "30" : "00")}`;

      const baseValue = 5500 + 2500 * Math.sin(((displayHour - 6) * Math.PI) / 12);
      const actual = i <= 0 ? baseValue + (Math.random() - 0.5) * 400 : undefined;
      const predicted = baseValue + (Math.random() - 0.5) * 200;
      const uncertainty = Math.abs(i) * 120 + 200; // grows with distance

      points.push({
        time: timeStr,
        actual: actual !== undefined ? Math.round(actual) : predicted, // for past data, use actual
        predicted: Math.round(predicted),
        upper: Math.round(predicted + uncertainty),
        lower: Math.round(Math.max(0, predicted - uncertainty)),
      });
    }
    return points;
  }, []);

  // Update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate metrics on each tick
  useEffect(() => {
    const metrics = generateMetrics(tick);
    setLiveMetrics(metrics);

    // Update history for live chart
    const dayProgress = (tick % 120) / 120 * 24;
    const timeStr = `${Math.floor(dayProgress).toString().padStart(2, "0")}:${Math.floor((dayProgress % 1) * 60).toString().padStart(2, "0")}`;
    setLiveHistory((prev) => {
      const next = [...prev, { time: timeStr, value: metrics.totalLoad }];
      return next.slice(-HISTORY_SIZE);
    });

    // Update forecast every 5 ticks
    if (tick % 5 === 0) {
      setForecastData(generateForecast(tick));
    }
  }, [tick, generateMetrics, generateForecast]);

  return { liveMetrics, forecastData, anomalies, liveHistory, tick };
}
