# QueuePITX

Real-time bus queue intelligence for PITX Cavite Lines. A mobile-first PWA built with Next.js, Firebase Realtime Database, and Google Maps.

## Stack

- **Framework:** Next.js 16 (App Router, client-side heavy)
- **Database:** Firebase Realtime Database (Asia Southeast 1)
- **Maps:** Google Maps JavaScript API + `@react-google-maps/api`
- **Auth:** Firebase Authentication (Google OAuth)
- **Styling:** Inline styles + Tailwind CSS v4 base tokens
- **Fonts:** Roboto (UI), Bricolage Grotesque (brand)

## Getting Started

**Prerequisites:** Node.js 20+, pnpm (or npm/yarn).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.local` from the project root:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | RTDB instance URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS API key |

## Firebase Schema

```json
{
  "buses": {
    "{busId}": {
      "lat": 14.4994,
      "lng": 120.9922,
      "heading": 90,
      "speed": 25.5,
      "timestamp": 1719500000000,
      "route_id": "DAS"
    }
  },
  "queues": {
    "{routeId}": {
      "queue_length": 18,
      "capacity_status": "seats"
    }
  }
}
```

Route IDs: `DAS` (Dasmariñas), `TRE` (Trece Martires).
Capacity status: `seats` | `standing` | `full`.

## Routes

| Path | Role | Auth |
|---|---|---|
| `/` | Landing / role selection | No |
| `/dashboard` | Commuter — queue panel + live map | No |
| `/track` | Conductor — GPS broadcast + capacity | Yes (Google) |
| `/admin` | Admin — queue overrides | Yes (Google) |
| `/login` | Google OAuth sign-in | No |

## Scripts

```bash
pnpm dev       # Development server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # ESLint
```

Run `npx tsx scripts/simulate.ts` to populate the RTDB with demo bus positions and queue data.

## Design System

See [DESIGN.md](./DESIGN.md) for full tokens (colors, spacing, typography, components).

Key colors: primary `#E38C89`, Dasmariñas `#2563EB`, Trece Martires `#16A34A`.
Key fonts: Roboto (body), Bricolage Grotesque (logo/headings).

## Project Structure

```
app/            — Next.js App Router pages
components/     — Reusable UI components
lib/            — Firebase init, hooks, algorithms, design tokens, types
scripts/        — Simulation runner for RTDB seeding
public/         — Static assets
```
