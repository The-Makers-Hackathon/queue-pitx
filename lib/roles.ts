import { getDb, ref, get } from "@/lib/firebase";

export type Role = "admin" | "conductor" | "commuter";

export async function fetchRoleByEmail(email: string): Promise<Role> {
  const db = getDb();
  const snapshot = await get(ref(db, `roles/${email.replace(/\./g, ",")}`));
  return snapshot.val() ?? "commuter";
}

export function canAccess(role: Role | null, page: "track" | "admin"): boolean {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT") return true;
  if (page === "admin") return role === "admin";
  if (page === "track") return role === "admin" || role === "conductor";
  return false;
}
