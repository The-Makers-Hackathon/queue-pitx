import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const ROUTE_PATHS: Record<string, { lat: number; lng: number }[]> = {
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

const BUSES = [
  { id: "1", route: "DAS", stagger: 0 },
  { id: "2", route: "DAS", stagger: 3 },
  { id: "3", route: "TRE", stagger: 0 },
  { id: "4", route: "TRE", stagger: 3 },
];

const CAPACITY_STATUSES = ["seats", "standing", "full"] as const;
type CapacityStatus = (typeof CAPACITY_STATUSES)[number];

const WRITE_INTERVAL_MS = 2000;
const CAPACITY_UPDATE_INTERVAL_MS = 30000;

const busCapacities: Record<string, CapacityStatus> = {};

async function writeBusPosition(
  db: ReturnType<typeof getDatabase>,
  busId: string,
  routeId: string,
  waypointIndex: number
) {
  const path = ROUTE_PATHS[routeId];
  if (!path) return;

  const idx = waypointIndex % path.length;
  const waypoint = path[idx];

  if (!busCapacities[busId]) {
    busCapacities[busId] = CAPACITY_STATUSES[Math.floor(Math.random() * CAPACITY_STATUSES.length)];
  }

  const busData: Record<string, unknown> = {
    lat: waypoint.lat,
    lng: waypoint.lng,
    timestamp: new Date().toISOString(),
    route_id: routeId,
    capacity_status: busCapacities[busId],
  };

  await set(ref(db, `buses/${busId}`), busData);
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  console.log("=== GPS Simulation Engine Started ===");
  console.log(`Writing every ${WRITE_INTERVAL_MS}ms for ${BUSES.length} buses`);
  console.log(`Capacity updates every ${CAPACITY_UPDATE_INTERVAL_MS}ms`);

  const busIndices: Record<string, number> = {};
  for (const bus of BUSES) {
    busIndices[bus.id] = bus.stagger;
  }

  setInterval(async () => {
    for (const bus of BUSES) {
      try {
        await writeBusPosition(db, bus.id, bus.route, busIndices[bus.id]);
        busIndices[bus.id] = (busIndices[bus.id] + 1) % ROUTE_PATHS[bus.route].length;
      } catch (err) {
        console.error(`Failed to write ${bus.id}:`, err);
      }
    }
  }, WRITE_INTERVAL_MS);

  setInterval(async () => {
    for (const bus of BUSES) {
      try {
        const status = CAPACITY_STATUSES[Math.floor(Math.random() * CAPACITY_STATUSES.length)];
        busCapacities[bus.id] = status;
        await set(ref(db, `buses/${bus.id}/capacity_status`), status);
      } catch (err) {
        console.error(`Failed to update capacity for ${bus.id}:`, err);
      }
    }
  }, CAPACITY_UPDATE_INTERVAL_MS);

  console.log("Simulation running. Press Ctrl+C to stop.");
}

main().catch(console.error);
