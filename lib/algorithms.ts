import { BusPosition, QueueData, Recommendation } from "./types";
import { PITX_COORDS, AVG_BOARDING_TIME, STALE_DATA_MS, BUS_STALE_MS, ROUTE_LABELS } from "./constants";

export function calculateHeading(
  prev: { lat: number; lng: number },
  curr: { lat: number; lng: number }
): number {
  const dLng = ((curr.lng - prev.lng) * Math.PI) / 180;
  const lat1 = (prev.lat * Math.PI) / 180;
  const lat2 = (curr.lat * Math.PI) / 180;

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const heading = (Math.atan2(x, y) * 180) / Math.PI;
  return (heading + 360) % 360;
}

export function greatCircleDistance(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeETA(bus: BusPosition): number | null {
  const now = Date.now();
  const busTime = new Date(bus.timestamp).getTime();
  if (now - busTime > BUS_STALE_MS) return null;

  const distance = greatCircleDistance(
    { lat: bus.lat, lng: bus.lng },
    PITX_COORDS
  );

  let speed = bus.speed;
  if (speed <= 0) speed = 20;

  const etaHours = distance / speed;
  return Math.round(etaHours * 60 * 10) / 10;
}

export function findNextBus(
  buses: Record<string, BusPosition>,
  routeId: string
): BusPosition | null {
  const now = Date.now();
  const routeBuses = Object.values(buses).filter(
    (b) => b.route_id === routeId && now - new Date(b.timestamp).getTime() <= BUS_STALE_MS
  );

  if (routeBuses.length === 0) return null;

  return routeBuses.reduce((nearest, bus) => {
    const d = greatCircleDistance(
      { lat: bus.lat, lng: bus.lng },
      PITX_COORDS
    );
    const nearestD = greatCircleDistance(
      { lat: nearest.lat, lng: nearest.lng },
      PITX_COORDS
    );
    return d < nearestD ? bus : nearest;
  });
}

export function computeRecommendation(
  buses: Record<string, BusPosition>,
  queues: Record<string, QueueData>,
  currentRouteId: string | null
): Recommendation {
  const activeRoutes: { routeId: string; eta: number | null; queue: QueueData | null }[] = [];

  for (const [routeId, queue] of Object.entries(queues)) {
    const nextBus = findNextBus(buses, routeId);
    const eta = nextBus ? computeETA(nextBus) : null;
    activeRoutes.push({ routeId, eta, queue });
  }

  const evaluated = activeRoutes.map((r) => {
    let score: number;
    if (r.queue && r.eta !== null) {
      score = r.queue.queue_length * AVG_BOARDING_TIME + r.eta;
    } else if (r.eta !== null) {
      score = r.eta;
    } else {
      score = Infinity;
    }
    return { ...r, score };
  });

  const allFull = evaluated.every((r) => r.queue?.capacity_status === "full");
  if (allFull && evaluated.length > 0) {
    const minEta = Math.min(
      ...evaluated.map((r) => (r.eta !== null ? r.eta : Infinity))
    );
    return {
      type: "all-full",
      message:
        minEta !== Infinity
          ? `All routes full - next bus in ${Math.round(minEta)} min`
          : "All routes full",
      score: minEta !== Infinity ? minEta : 0,
    };
  }

  if (evaluated.length === 0) {
    return {
      type: "stay",
      message: "No route data available",
      score: Infinity,
    };
  }

  if (!currentRouteId || !evaluated.find((r) => r.routeId === currentRouteId)) {
    const best = evaluated.reduce((a, b) => (a.score < b.score ? a : b));
    return {
      type: "stay",
      currentRoute: best.routeId,
      message: queueRecommendationMessage(best),
      score: best.score,
    };
  }

  const currentScore =
    evaluated.find((r) => r.routeId === currentRouteId)?.score ?? Infinity;

  const alternatives = evaluated.filter((r) => r.routeId !== currentRouteId);
  if (alternatives.length === 0) {
    const current = evaluated[0];
    return {
      type: "stay",
      currentRoute: current.routeId,
      message: queueRecommendationMessage(current),
      score: current.score,
    };
  }
  const bestAlt = alternatives.reduce((a, b) => (a.score < b.score ? a : b));

  if (bestAlt.score <= currentScore - 4) {
    return {
      type: "switch",
      currentRoute: currentRouteId,
      recommendedRoute: bestAlt.routeId,
      message: `${ROUTE_LABELS[bestAlt.routeId] || bestAlt.routeId} is ${Math.round(currentScore - bestAlt.score)} min faster`,
      score: bestAlt.score,
    };
  }

  return {
    type: "stay",
    currentRoute: currentRouteId,
    message: queueRecommendationMessage(
      evaluated.find((r) => r.routeId === currentRouteId)!
    ),
    score: currentScore,
  };
}

function queueRecommendationMessage(r: {
  routeId: string;
  eta: number | null;
  score: number;
}): string {
  const name = ROUTE_LABELS[r.routeId] || r.routeId;
  if (r.eta === null) return `${name} - ETA unavailable`;
  return `${name} ~ ${Math.round(r.score)} min total wait`;
}

export function isDataStale(timestamp: string): boolean {
  return Date.now() - new Date(timestamp).getTime() > STALE_DATA_MS;
}

export function relativeTime(timestamp: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000
  );
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}
