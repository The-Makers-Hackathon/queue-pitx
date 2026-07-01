import { CapacityStatus } from "./design";

export interface BusPosition {
  lat: number;
  lng: number;
  timestamp: string;
  route_id: string;
  capacity_status?: CapacityStatus;
}
