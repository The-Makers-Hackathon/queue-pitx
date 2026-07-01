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
      "route_id": "DAS",
      "capacity_status": "seats"
    }
  }
}
```

Route IDs: `DAS` (Dasmariñas), `TRE` (Trece Martires).
Capacity status: `seats` | `standing` | `full` (per bus).

## Routes

| Path | Role | Auth |
|---|---|---|
| `/` | Landing / role selection | No |
| `/dashboard` | Commuter — bus list + live map | No |
| `/track` | Conductor — GPS broadcast + capacity | Yes (Google) |
| `/admin` | Admin — manage buses and capacities | Yes (Google) |
| `/login` | Google OAuth sign-in | No |

## Role-Based Access Control

Three roles: **commuter** (public, no auth), **conductor** (auth + `/track`), **admin** (auth + everything).

| Role | `/dashboard` | `/track` | `/admin` |
|---|---|---|---|
| Commuter | ✓ | ✗ | ✗ |
| Conductor | ✓ | ✓ | ✗ |
| Admin | ✓ | ✓ | ✓ |

Roles are stored in RTDB at `/roles/{email}` (dots replaced with commas). When a user signs in via Google, their email is looked up to determine their role.

### Seeding Roles

Edit `scripts/seed-roles.ts` with the email → role mappings you want.  
Requires a Firebase service account key set in one of:
- `GOOGLE_APPLICATION_CREDENTIALS` env var
- `FIREBASE_SERVICE_ACCOUNT` env var (raw JSON)

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
pnpm dlx tsx --env-file=.env.local scripts/seed-roles.ts
```

> **No service account?** You can also write roles manually in Firebase Console:  
> Database → `roles/{email_with_commas}` → value = `"admin"` or `"conductor"`  
> (dots become commas, e.g. `admin,queuepitx,com`)

**Fallback:** If no role is found for a signed-in user, they default to `"commuter"` and cannot access `/track` or `/admin`. Only explicitly seeded `"conductor"` and `"admin"` users can access `/track`. Only `"admin"` can access `/admin`.

## Scripts

```bash
pnpm dev       # Development server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # ESLint
```

Run `pnpm dlx tsx --env-file=.env.local scripts/simulate.ts` to populate RTDB with demo bus positions and capacity data.

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
