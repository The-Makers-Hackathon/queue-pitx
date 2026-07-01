import { NextRequest, NextResponse } from "next/server";
import { startDemo, stopDemo, demoStatus } from "@/lib/demo";

export async function GET() {
  return NextResponse.json(demoStatus());
}

export async function POST(req: NextRequest) {
  const { action } = await req.json();
  if (action === "start") {
    const ok = startDemo();
    return NextResponse.json({ ok, ...demoStatus() });
  }
  if (action === "stop") {
    const ok = stopDemo();
    return NextResponse.json({ ok, ...demoStatus() });
  }
  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
