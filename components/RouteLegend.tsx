"use client";

import { ROUTE_COLORS, ROUTE_LABELS } from "@/lib/constants";

export default function RouteLegend() {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur rounded-lg shadow-md p-3 text-sm">
      <p className="font-semibold text-xs uppercase tracking-wide text-zinc-500 mb-2">
        Routes
      </p>
      {Object.entries(ROUTE_COLORS).map(([id, color]) => (
        <div key={id} className="flex items-center gap-2 py-0.5">
          <span
            className="inline-block w-4 h-1 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-zinc-700 dark:text-zinc-300">
            {ROUTE_LABELS[id] || id}
          </span>
        </div>
      ))}
    </div>
  );
}
