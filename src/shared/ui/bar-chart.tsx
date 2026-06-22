"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip);

interface BarChartProps {
  labels: string[];
  values: number[];
  height?: number;
  ariaLabel?: string;
}

/**
 * Chart.js Bar chart wrapper — 캔버스 직접 사용.
 * react-chartjs-2 없이 lib만 import해 번들 사이즈 절약.
 * 호출 쪽에서 next/dynamic으로 ssr: false 권장.
 */
export function BarChart({ labels, values, height = 160, ariaLabel }: BarChartProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const instanceRef = useRef<Chart | null>(null);

  const config = useMemo<ChartConfiguration<"bar">>(
    () => ({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: "rgba(36, 121, 255, 0.85)",
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(20, 20, 24, 0.92)",
            padding: 10,
            cornerRadius: 8,
            titleColor: "#fff",
            bodyColor: "rgba(255,255,255,0.85)",
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "rgba(245,245,247,0.5)", font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "rgba(245,245,247,0.4)", font: { size: 10 }, stepSize: 1 },
            border: { display: false },
          },
        },
      },
    }),
    [labels, values],
  );

  useEffect(() => {
    if (!ref.current) return;
    instanceRef.current = new Chart(ref.current, config);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [config]);

  return (
    <div style={{ height }} className="w-full" role="img" aria-label={ariaLabel}>
      <canvas ref={ref} />
    </div>
  );
}
