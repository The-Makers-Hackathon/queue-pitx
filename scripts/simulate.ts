import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

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

const WRITE_INTERVAL_MS = 2000;
const QUEUE_UPDATE_INTERVAL_MS = 30000;

const queueState: Record<string, { length: number; seed: number }> = {};

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
  const nextIdx = (idx + 1) % path.length;
  const next = path[nextIdx];

  const dLng = ((next.lng - waypoint.lng) * Math.PI) / 180;
  const lat1 = (waypoint.lat * Math.PI) / 180;
  const lat2 = (next.lat * Math.PI) / 180;
  const x = Math.sin(dLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let heading = (Math.atan2(x, y) * 180) / Math.PI;
  heading = (heading + 360) % 360;

  const speed = 25 + Math.random() * 10;

  const busData = {
    lat: waypoint.lat,
    lng: waypoint.lng,
    heading,
    speed: Math.round(speed * 10) / 10,
    timestamp: new Date().toISOString(),
    route_id: routeId,
  };

  await set(ref(db, `buses/${busId}`), busData);
}

async function writeQueueLength(
  db: ReturnType<typeof getDatabase>,
  routeId: string
) {
  if (!queueState[routeId]) {
    queueState[routeId] = {
      length: Math.floor(Math.random() * 20) + 5,
      seed: Math.random(),
    };
  }

  const state = queueState[routeId];
  const delta = Math.floor(Math.random() * 11) - 5;
  state.length = Math.max(0, Math.min(50, state.length + delta));
  state.seed = Math.random();

  const snapshot = await get(child(ref(db), `queues/${routeId}/capacity_status`));
  const currentStatus = snapshot.val() || "seats";

  await set(ref(db, `queues/${routeId}`), {
    queue_length: state.length,
    capacity_status: currentStatus,
  });
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  console.log("=== GPS Simulation Engine Started ===");
  console.log(`Writing every ${WRITE_INTERVAL_MS}ms for ${BUSES.length} buses`);
  console.log(`Queue updates every ${QUEUE_UPDATE_INTERVAL_MS}ms`);

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
    for (const routeId of Object.keys(ROUTE_PATHS)) {
      try {
        await writeQueueLength(db, routeId);
      } catch (err) {
        console.error(`Failed to update queue for ${routeId}:`, err);
      }
    }
  }, QUEUE_UPDATE_INTERVAL_MS);

  console.log("Simulation running. Press Ctrl+C to stop.");
}

main().catch(console.error);
