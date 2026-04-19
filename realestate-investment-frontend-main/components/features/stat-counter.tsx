"use client";

import { useEffect, useState } from "react";

export function StatCounter({
  label,
  value,
  prefix = "",
  suffix = ""
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 16;
    const safeValue = value || 0;
    const increment = safeValue / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= safeValue) {
        setCount(safeValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}
