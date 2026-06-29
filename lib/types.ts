import { CapacityStatus } from "./design";

export interface BusPosition {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: string;
  route_id: string;
}

export interface QueueData {
  queue_length: number;
  capacity_status: CapacityStatus;
}

export interface Recommendation {
  type: "stay" | "switch" | "all-full";
  currentRoute?: string;
  recommendedRoute?: string;
  message: string;
  score: number;
}
