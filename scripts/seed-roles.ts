/**
 * Role Seeder for QueuePITX
 *
 * Writes preset email → role mappings to Firebase Realtime Database.
 *
 * Setup:
 *   1. Firebase Console → Project Settings → Service Accounts → Generate key
 *   2. Save JSON, then either:
 *      a. export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
 *      b. Or paste JSON content into FIREBASE_SERVICE_ACCOUNT env var
 *
 * Usage:
 *   pnpm dlx tsx --env-file=.env.local scripts/seed-roles.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// ── Edit these emails to match your users ──
const ROLES: Record<string, "admin" | "conductor"> = {
  "william.eduard123@gmail.com": "admin",
  "conductor@queuepitx.com": "admin",
};

async function main() {
  if (!getApps().length) {
    const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

    if (!databaseURL) {
      console.error("Missing NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env.local");
      process.exit(1);
    }

    if (saJson) {
      initializeApp({ credential: cert(JSON.parse(saJson)), databaseURL });
    } else if (saPath) {
      initializeApp({ credential: cert(saPath), databaseURL });
    } else {
      console.error(
        "Missing service account.\n" +
        "Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT.\n" +
        "See: https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk"
      );
      process.exit(1);
    }
  }

  const db = getDatabase();
  const updates: Record<string, string> = {};

  for (const [email, role] of Object.entries(ROLES)) {
    const key = email.replace(/\./g, ",");
    updates[`roles/${key}`] = role;
    console.log(`  ${email} → ${role}`);
  }

  await db.ref().update(updates);
  console.log("\nRoles seeded successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
