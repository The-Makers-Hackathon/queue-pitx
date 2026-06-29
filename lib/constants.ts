import { C, ROUTES_META } from "./design";

export const PITX_COORDS = { lat: 14.4994, lng: 120.9922 };

export const ROUTE_COLORS: Record<string, string> = {
  DAS: C.blue,
  TRE: C.red,
};

export const ROUTE_LABELS: Record<string, string> = {
  DAS: "Dasmariñas",
  TRE: "Trece Martires",
};

export const AVG_BOARDING_TIME = 0.5;

export const ROUTE_PATHS: Record<string, { lat: number; lng: number }[]> = {
  DAS: [
    { lat: 14.3344, lng: 120.9273 },
    { lat: 14.3522, lng: 120.9342 },
    { lat: 14.3700, lng: 120.9411 },
    { lat: 14.3878, lng: 120.9480 },
    { lat: 14.4056, lng: 120.9549 },
    { lat: 14.4234, lng: 120.9618 },
    { lat: 14.4412, lng: 120.9687 },
    { lat: 14.4589, lng: 120.9756 },
    { lat: 14.4767, lng: 120.9825 },
    { lat: 14.4994, lng: 120.9922 },
  ],
  TRE: [
    { lat: 14.3698, lng: 120.7924 },
    { lat: 14.3842, lng: 120.8146 },
    { lat: 14.3986, lng: 120.8368 },
    { lat: 14.4130, lng: 120.8590 },
    { lat: 14.4274, lng: 120.8812 },
    { lat: 14.4418, lng: 120.9034 },
    { lat: 14.4562, lng: 120.9256 },
    { lat: 14.4706, lng: 120.9478 },
    { lat: 14.4850, lng: 120.9700 },
    { lat: 14.4994, lng: 120.9922 },
  ],
};

export const FB_ROUTE_MAP: Record<string, string> = {
  dasmañinas: "DAS",
  trece_martires: "TRE",
};

export const ROUTE_TO_FB: Record<string, string> = {
  DAS: "dasmañinas",
  TRE: "trece_martires",
};

export const STALE_DATA_MS = 5 * 60 * 1000;
export const BUS_STALE_MS = 60 * 1000;
