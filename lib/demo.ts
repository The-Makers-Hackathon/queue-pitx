import { spawn, ChildProcess } from "child_process";
import path from "path";

let proc: ChildProcess | null = null;

export function startDemo(): boolean {
  if (proc) return false;
  try {
    const script = path.join(process.cwd(), "scripts/simulate.ts");
    proc = spawn("npx", ["tsx", script], {
      stdio: "ignore",
      detached: true,
      env: { ...process.env },
    });
    proc.unref();
    proc.on("exit", () => { proc = null; });
    proc.on("error", () => { proc = null; });
    return true;
  } catch {
    return false;
  }
}

export function stopDemo(): boolean {
  const p = proc;
  if (!p) return false;
  proc = null;
  if (p.pid != null) try { process.kill(-p.pid, "SIGTERM"); } catch {}
  return true;
}

export function demoStatus(): { running: boolean } {
  return { running: proc !== null };
}
