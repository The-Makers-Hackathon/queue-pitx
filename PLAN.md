# Implementation Plan: QueuePITX Hackathon MVP

This plan outlines the implementation steps for **QueuePITX**, a real-time bus queue intelligence web application built with **Next.js (React)** and **Firebase Realtime Database**. 

---

## 1. System Setup & Architecture
- **Framework:** Next.js (App Router or Pages Router, client-side heavy).
- **Database:** Firebase Realtime Database (RTDB).
- **Styling:** Tailwind CSS (recommended for fast hackathon styling).
- **Maps API:** Google Maps JavaScript API (requires environment variable for API Key).

### Firebase Schema
Ensure your Firebase RTDB has the following structure:

```

```text
PLAN.md generated successfully.

```json
{
  "buses": {
    "bus_id": {
      "lat": 14.4994,
      "lng": 120.9922,
      "heading": 90.0,
      "speed": 25.5,
      "timestamp": "2026-06-15T09:42:01Z",
      "route_id": "dasmañinas"
    }
  },
  "queues": {
    "dasmañinas": {
      "queue_length": 18,
      "capacity_status": "available"
    },
    "trece_martires": {
      "queue_length": 5,
      "capacity_status": "full"
    }
  }
}

```

*Note: ETA constants/fields like `next_bus_ETA`, `last_bus_departed`, and `dwell_time` are removed from the schema and must NOT be added.*

### Global Constants

```typescript
export const PITX_COORDS = { lat: 14.4994, lng: 120.9922 };
export const ROUTE_COLORS = {
  dasmañinas: "#2563EB",     // Blue
  trece_martires: "#16A34A"  // Green
};
export const AVG_BOARDING_TIME = 0.5; // minutes per person

```

---

## 2. Shared State & Core Algorithms

### A. Heading Calculation (Fallback)

If `position.coords.heading` is null, NaN, or undefined, compute heading between previous and current positions:

```typescript
function calculateHeading(prev: {lat: number, lng: number}, curr: {lat: number, lng: number}): number {
  const dLng = ((curr.lng - prev.lng) * Math.PI) / 180;
  const lat1 = (prev.lat * Math.PI) / 180;
  const lat2 = (curr.lat * Math.PI) / 180;

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let heading = (Math.atan2(x, y) * 180) / Math.PI;
  return (heading + 360) % 360;
}

```

### B. Next Approaching Bus & ETA Calculation

1. **Filter Active Buses:** Exclude buses with a timestamp older than 60 seconds.
2. **Find Next Bus:** Use proximity fallback (shortest great-circle distance to PITX) or a 5km geofence array.
3. **Compute ETA:** 
$$\text{Distance } D = \text{Great-Circle Distance(Bus, PITX)}$$


$$\text{Speed } S = \text{bus.speed (if } \le 0 \text{ use last known } >0 \text{ or default to 20 km/h)}$$


$$\text{ETA (Minutes)} = \frac{D}{S} \times 60 \quad (\text{rounded to 1 decimal place})$$


4. If no approaching bus is detected, output `"ETA: --"`.

### C. Recommendation Scoring

* Compute Score: $\text{estimated\_wait} = (\text{queue\_length} \times \text{AVG\_BOARDING\_TIME}) + \text{ETA}$
* If `queue_length` is missing, use `ETA` only.
* Exclude routes with data older than 5 minutes.
* **Rules:**
* *Stay State:* Current route has the lowest score. (Green: `#22C55E`)
* *Switch State:* Alternative route is $\ge 4$ minutes faster than current line. (Blue: `#3B82F6`)
* *All-Full State:* All active routes are `"full"`. Display `"All routes full - next bus in X min"`. (Amber: `#F59E0B`, where X is min ETA).



---

## 3. View Implementations

### View 1: Commuter Dashboard (`/`)

* **Full-Screen Loading Overlay:** Spinner + `"Loading live data..."`. Dismiss only when Firebase connection is active AND at least one valid bus position is received. Timeout at 10s to show network error.
* **No-Active-Buses State:** Triggered if all data is older than 5 minutes. Display empty map, banner on queue panel (*"No active buses detected. Data may be delayed."*), and replace recommendation card with text: *"Recommendation unavailable - no active buses."*
* **FR-MAP Components:**
* Center on PITX, zoom level 14.
* Draw color-coded static polylines via GeoJSON LineStrings for both Cavite routes.
* Map Markers: Smoothly animated transitions, matching heading rotation. Faded to 40% opacity if data > 60 seconds old.
* Interactive Tooltips on marker click: `Route Name`, `Speed (km/h)`, `Last Updated`.
* Route Color Legend overlay.


* **FR-QUEUE Panel:** Sidebar/bottom sheet showing route cards. Displays Name, computed ETA, Capacity Status badge, Queue Length, calculated Wait Time, and a human-readable relative timestamp (e.g., *"14 seconds ago"*). Gray out metrics and show warning if data > 5 minutes old.
* **FR-REC Card:** Prominent element at top of queue panel driving the Stay/Switch/All-Full visual triggers.

### View 2: Conductor Tracker (`/track`)

* Mobile-optimized minimal layout.
* Bus/Route selection dropdown on load (e.g., `DAS-01 / Dasmañinas`). Must select before starting tracking.
* Prominent **Start / Stop GPS Tracking** toggle button using `navigator.geolocation.watchPosition()`.
* Real-time coordinates display (lat/lng) and Firebase connection status indicator (Connected/Disconnected).
* Two large one-tap buttons: **Available** and **Full** that immediately overwrite `/queues/{route_id}/capacity_status` to `"available"` or `"full"`.

### View 3: Admin Override Panel (`/admin`)

* Direct URL access only (unlinked).
* Sliders for each route to set `queue_length` (clamped 0–50), updating Firebase on change.
* Dropdown selector to override `capacity_status` (`"available"` vs `"full"`).
* Reset button to restore standard defaults.

---

## 4. Mock Data & Simulation Scripts

### GPS Simulation Engine (`FR-SIM`)

Create a client-side or server-side runner script that manages demo streams.

* **Constraint:** Single-source write enforcement. The simulation engine and the live conductor tracker **MUST NOT** write simultaneously. Throw an operator warning if unexpected writes are detected.
* **Route Tracking:** Replay preset GPX array waypoints for at least 2 buses per route (4 total) starting at staggered locations.
* **Write Cadence:** Push position updates to `/buses/{bus_id}` every 2 seconds. Loop waypoints infinitely when reaching the route endpoint.

### Queue Length Simulator

* Independently fluctuate `queue_length` values for active lines by $\pm1$ to $\pm5$ every 30–60 seconds (randomized per route).
* Clamp range to `[0, 50]`. Initial seed: random integer `[5, 25]`.

---

## 5. Non-Functional Checklist (Demo Benchmarks)

* [ ] Map fully rendered and interactive within 3 seconds.
* [ ] Queue panel update latency $\le 2$ seconds on Firebase changes.
* [ ] Recommendation card reflects admin updates within 2 seconds.
* [ ] Tracker position writes complete within 1 second.
* [ ] App operates reliably in standard mobile browsers (Chrome / Safari).
