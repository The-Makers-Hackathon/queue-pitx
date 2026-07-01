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
    { lat: 14.30268, lng: 120.95397 },
    { lat: 14.30404, lng: 120.95387 },
    { lat: 14.3049, lng: 120.95355 },
    { lat: 14.30689, lng: 120.95272 },
    { lat: 14.30736, lng: 120.95252 },
    { lat: 14.30794, lng: 120.95208 },
    { lat: 14.3103, lng: 120.94984 },
    { lat: 14.31162, lng: 120.94857 },
    { lat: 14.31285, lng: 120.94739 },
    { lat: 14.31381, lng: 120.94651 },
    { lat: 14.31525, lng: 120.94516 },
    { lat: 14.31617, lng: 120.94434 },
    { lat: 14.31715, lng: 120.94348 },
    { lat: 14.31804, lng: 120.94291 },
    { lat: 14.32021, lng: 120.94215 },
    { lat: 14.32232, lng: 120.94157 },
    { lat: 14.32518, lng: 120.94075 },
    { lat: 14.32658, lng: 120.94035 },
    { lat: 14.32692, lng: 120.94024 },
    { lat: 14.32882, lng: 120.93969 },
    { lat: 14.33055, lng: 120.93921 },
    { lat: 14.33299, lng: 120.93852 },
    { lat: 14.33502, lng: 120.93794 },
    { lat: 14.3376, lng: 120.93721 },
    { lat: 14.33825, lng: 120.93709 },
    { lat: 14.33921, lng: 120.93709 },
    { lat: 14.34225, lng: 120.93726 },
    { lat: 14.34443, lng: 120.93736 },
    { lat: 14.34562, lng: 120.93743 },
    { lat: 14.34838, lng: 120.93757 },
    { lat: 14.34998, lng: 120.93764 },
    { lat: 14.35329, lng: 120.9378 },
    { lat: 14.35489, lng: 120.93788 },
    { lat: 14.35666, lng: 120.93798 },
    { lat: 14.35853, lng: 120.93807 },
    { lat: 14.35979, lng: 120.93808 },
    { lat: 14.36208, lng: 120.93823 },
    { lat: 14.36398, lng: 120.93832 },
    { lat: 14.3668, lng: 120.93845 },
    { lat: 14.36782, lng: 120.93851 },
    { lat: 14.36928, lng: 120.93858 },
    { lat: 14.3698, lng: 120.9386 },
    { lat: 14.37185, lng: 120.93873 },
    { lat: 14.37387, lng: 120.9388 },
    { lat: 14.37523, lng: 120.93887 },
    { lat: 14.37564, lng: 120.9389 },
    { lat: 14.37657, lng: 120.93894 },
    { lat: 14.37778, lng: 120.939 },
    { lat: 14.37848, lng: 120.93904 },
    { lat: 14.38139, lng: 120.9392 },
    { lat: 14.38239, lng: 120.93925 },
    { lat: 14.38391, lng: 120.93933 },
    { lat: 14.38464, lng: 120.93937 },
    { lat: 14.38712, lng: 120.93948 },
    { lat: 14.38954, lng: 120.93962 },
    { lat: 14.39212, lng: 120.93973 },
    { lat: 14.3943, lng: 120.93984 },
    { lat: 14.39658, lng: 120.93995 },
    { lat: 14.39913, lng: 120.94008 },
    { lat: 14.40068, lng: 120.94015 },
    { lat: 14.40163, lng: 120.94021 },
    { lat: 14.40255, lng: 120.94025 },
    { lat: 14.40511, lng: 120.94038 },
    { lat: 14.40746, lng: 120.94049 },
    { lat: 14.40937, lng: 120.94059 },
    { lat: 14.41141, lng: 120.94069 },
    { lat: 14.41258, lng: 120.94076 },
    { lat: 14.41346, lng: 120.94079 },
    { lat: 14.41403, lng: 120.94082 },
    { lat: 14.41579, lng: 120.94091 },
    { lat: 14.41715, lng: 120.94098 },
    { lat: 14.41904, lng: 120.94107 },
    { lat: 14.4204, lng: 120.9412 },
    { lat: 14.42173, lng: 120.94169 },
    { lat: 14.42318, lng: 120.94239 },
    { lat: 14.42408, lng: 120.94284 },
    { lat: 14.42532, lng: 120.94345 },
    { lat: 14.42764, lng: 120.94452 },
    { lat: 14.4293, lng: 120.94532 },
    { lat: 14.43112, lng: 120.94614 },
    { lat: 14.43317, lng: 120.94712 },
    { lat: 14.43387, lng: 120.94748 },
    { lat: 14.43614, lng: 120.94856 },
    { lat: 14.4386, lng: 120.94974 },
    { lat: 14.43979, lng: 120.95033 },
    { lat: 14.44057, lng: 120.95069 },
    { lat: 14.44278, lng: 120.95166 },
    { lat: 14.44374, lng: 120.95213 },
    { lat: 14.44499, lng: 120.95272 },
    { lat: 14.44688, lng: 120.9536 },
    { lat: 14.4479, lng: 120.9541 },
    { lat: 14.44908, lng: 120.95466 },
    { lat: 14.4512, lng: 120.95563 },
    { lat: 14.45312, lng: 120.95658 },
    { lat: 14.45615, lng: 120.95801 },
    { lat: 14.45802, lng: 120.95888 },
    { lat: 14.45945, lng: 120.95964 },
    { lat: 14.4604, lng: 120.95966 },
    { lat: 14.46246, lng: 120.9595 },
    { lat: 14.46313, lng: 120.95977 },
    { lat: 14.46421, lng: 120.96054 },
    { lat: 14.4659, lng: 120.96176 },
    { lat: 14.46647, lng: 120.96231 },
    { lat: 14.46672, lng: 120.96276 },
    { lat: 14.46703, lng: 120.96332 },
    { lat: 14.46733, lng: 120.9633 },
    { lat: 14.46945, lng: 120.96243 },
    { lat: 14.47071, lng: 120.96199 },
    { lat: 14.47185, lng: 120.96154 },
    { lat: 14.47247, lng: 120.96163 },
    { lat: 14.47281, lng: 120.96209 },
    { lat: 14.47269, lng: 120.9628 },
    { lat: 14.47235, lng: 120.96409 },
    { lat: 14.47266, lng: 120.96545 },
    { lat: 14.47303, lng: 120.96629 },
    { lat: 14.47433, lng: 120.96843 },
    { lat: 14.47559, lng: 120.97028 },
    { lat: 14.47643, lng: 120.97159 },
    { lat: 14.47728, lng: 120.97273 },
    { lat: 14.47836, lng: 120.97404 },
    { lat: 14.47954, lng: 120.97543 },
    { lat: 14.48115, lng: 120.9772 },
    { lat: 14.48509, lng: 120.98012 },
    { lat: 14.48896, lng: 120.98284 },
    { lat: 14.49113, lng: 120.98497 },
    { lat: 14.49291, lng: 120.98638 },
    { lat: 14.49601, lng: 120.98798 },
    { lat: 14.49949, lng: 120.98905 },
    { lat: 14.50173, lng: 120.98969 },
    { lat: 14.50184, lng: 120.98962 },
    { lat: 14.50256, lng: 120.98983 },
    { lat: 14.50399, lng: 120.99024 },
    { lat: 14.50449, lng: 120.99034 },
    { lat: 14.50471, lng: 120.99022 },
    { lat: 14.50507, lng: 120.98948 },
    { lat: 14.50598, lng: 120.98762 },
    { lat: 14.50811, lng: 120.98865 },
    { lat: 14.5086, lng: 120.99123 },
  ],
  TRE: [
    { lat: 14.24193, lng: 120.87938 },
    { lat: 14.24386, lng: 120.87869 },
    { lat: 14.2532, lng: 120.87767 },
    { lat: 14.25409, lng: 120.87755 },
    { lat: 14.25818, lng: 120.87705 },
    { lat: 14.26329, lng: 120.87675 },
    { lat: 14.26418, lng: 120.87656 },
    { lat: 14.27154, lng: 120.87293 },
    { lat: 14.27294, lng: 120.8729 },
    { lat: 14.27302, lng: 120.87321 },
    { lat: 14.27333, lng: 120.87326 },
    { lat: 14.27664, lng: 120.87301 },
    { lat: 14.2772, lng: 120.87294 },
    { lat: 14.27876, lng: 120.87252 },
    { lat: 14.28001, lng: 120.87223 },
    { lat: 14.28033, lng: 120.87201 },
    { lat: 14.2805, lng: 120.87167 },
    { lat: 14.28103, lng: 120.87097 },
    { lat: 14.28197, lng: 120.87012 },
    { lat: 14.28226, lng: 120.86953 },
    { lat: 14.28227, lng: 120.86921 },
    { lat: 14.28365, lng: 120.86829 },
    { lat: 14.28678, lng: 120.86801 },
    { lat: 14.28872, lng: 120.86806 },
    { lat: 14.29106, lng: 120.86813 },
    { lat: 14.29251, lng: 120.86761 },
    { lat: 14.2947, lng: 120.86623 },
    { lat: 14.29706, lng: 120.86493 },
    { lat: 14.30126, lng: 120.86398 },
    { lat: 14.30364, lng: 120.86343 },
    { lat: 14.30822, lng: 120.86271 },
    { lat: 14.31296, lng: 120.86197 },
    { lat: 14.31576, lng: 120.86155 },
    { lat: 14.32029, lng: 120.86084 },
    { lat: 14.32487, lng: 120.86013 },
    { lat: 14.32788, lng: 120.85998 },
    { lat: 14.35157, lng: 120.85986 },
    { lat: 14.35207, lng: 120.86003 },
    { lat: 14.3553, lng: 120.86295 },
    { lat: 14.35637, lng: 120.86227 },
    { lat: 14.35908, lng: 120.86202 },
    { lat: 14.36042, lng: 120.86157 },
    { lat: 14.3616, lng: 120.86116 },
    { lat: 14.3643, lng: 120.86173 },
    { lat: 14.36709, lng: 120.86326 },
    { lat: 14.36837, lng: 120.86384 },
    { lat: 14.36917, lng: 120.86398 },
    { lat: 14.37057, lng: 120.86395 },
    { lat: 14.37399, lng: 120.86349 },
    { lat: 14.3758, lng: 120.8627 },
    { lat: 14.37901, lng: 120.86141 },
    { lat: 14.38091, lng: 120.86036 },
    { lat: 14.38249, lng: 120.8588 },
    { lat: 14.38422, lng: 120.85699 },
    { lat: 14.38446, lng: 120.85699 },
    { lat: 14.38461, lng: 120.85691 },
    { lat: 14.38728, lng: 120.85627 },
    { lat: 14.38809, lng: 120.8568 },
    { lat: 14.38847, lng: 120.85811 },
    { lat: 14.38927, lng: 120.86154 },
    { lat: 14.3909, lng: 120.86445 },
    { lat: 14.39127, lng: 120.86518 },
    { lat: 14.39248, lng: 120.86759 },
    { lat: 14.3932, lng: 120.86877 },
    { lat: 14.39623, lng: 120.86666 },
    { lat: 14.39908, lng: 120.87045 },
    { lat: 14.40384, lng: 120.8766 },
    { lat: 14.40486, lng: 120.8773 },
    { lat: 14.40743, lng: 120.878 },
    { lat: 14.40827, lng: 120.87818 },
    { lat: 14.40886, lng: 120.87832 },
    { lat: 14.41125, lng: 120.87888 },
    { lat: 14.41435, lng: 120.87968 },
    { lat: 14.4174, lng: 120.88215 },
    { lat: 14.41979, lng: 120.88424 },
    { lat: 14.42052, lng: 120.88484 },
    { lat: 14.42173, lng: 120.88587 },
    { lat: 14.42501, lng: 120.89028 },
    { lat: 14.42834, lng: 120.89378 },
    { lat: 14.43217, lng: 120.89803 },
    { lat: 14.43394, lng: 120.90056 },
    { lat: 14.43547, lng: 120.9033 },
    { lat: 14.43713, lng: 120.90631 },
    { lat: 14.43833, lng: 120.90847 },
    { lat: 14.44043, lng: 120.91091 },
    { lat: 14.44214, lng: 120.91245 },
    { lat: 14.44343, lng: 120.91353 },
    { lat: 14.44525, lng: 120.91464 },
    { lat: 14.44702, lng: 120.9157 },
    { lat: 14.44921, lng: 120.91632 },
    { lat: 14.45092, lng: 120.91729 },
    { lat: 14.45149, lng: 120.91657 },
    { lat: 14.45198, lng: 120.9163 },
    { lat: 14.45336, lng: 120.91675 },
    { lat: 14.4554, lng: 120.91803 },
    { lat: 14.45696, lng: 120.9202 },
    { lat: 14.45896, lng: 120.92382 },
    { lat: 14.46124, lng: 120.92875 },
    { lat: 14.46396, lng: 120.93664 },
    { lat: 14.46518, lng: 120.94176 },
    { lat: 14.46794, lng: 120.95357 },
    { lat: 14.46937, lng: 120.95762 },
    { lat: 14.47178, lng: 120.96409 },
    { lat: 14.47337, lng: 120.96718 },
    { lat: 14.47557, lng: 120.97061 },
    { lat: 14.47868, lng: 120.9747 },
    { lat: 14.48225, lng: 120.97836 },
    { lat: 14.48972, lng: 120.98396 },
    { lat: 14.49451, lng: 120.98748 },
    { lat: 14.49944, lng: 120.98919 },
    { lat: 14.50417, lng: 120.99062 },
    { lat: 14.50457, lng: 120.99051 },
    { lat: 14.50582, lng: 120.98802 },
    { lat: 14.50863, lng: 120.98886 },
    { lat: 14.51204, lng: 120.99128 },
    { lat: 14.51231, lng: 120.99133 },
    { lat: 14.51219, lng: 120.992 },
    { lat: 14.51181, lng: 120.99206 },
    { lat: 14.50954, lng: 120.99147 },

  ],
};

const BUSES = [
  { id: "1", route: "DAS", stagger: 0 },
  { id: "2", route: "DAS", stagger: 3 },
  { id: "3", route: "TRE", stagger: 0 },
  { id: "4", route: "TRE", stagger: 3 },
];

function pingPongIndex(i: number, max: number): number {
  const cycle = max * 2;
  const mod = i % cycle;
  return mod <= max ? mod : cycle - mod;
}

const CAPACITY_STATUSES = ["seats", "full"] as const;
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

  const idx = pingPongIndex(waypointIndex, path.length - 1);
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
        busIndices[bus.id] += 1;
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
