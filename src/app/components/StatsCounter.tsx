"use client";

import { useEffect, useState } from "react";

export default function StatsCounter({
  value,
  label,
  duration = 1400,
}: {
  value: number;
  label: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111916]/80 p-5 shadow-lg shadow-emerald-950/10 backdrop-blur-sm">
      <div className="font-mono text-3xl font-bold text-emerald-400">{count}+</div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b2c0b7]">{label}</p>
    </div>
  );
}
