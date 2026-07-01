import { BusPosition } from "./types";
import { PITX_COORDS, STALE_DATA_MS, BUS_STALE_MS } from "./constants";

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

const AVG_SPEED_KMH = 30;

export function computeETA(bus: BusPosition): number | null {
  const now = Date.now();
  const busTime = new Date(bus.timestamp).getTime();
  if (now - busTime > BUS_STALE_MS) return null;

  const distance = greatCircleDistance(
    { lat: bus.lat, lng: bus.lng },
    PITX_COORDS
  );

  const etaHours = distance / AVG_SPEED_KMH;
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
