import { NextRequest, NextResponse } from "next/server";
import { getValidation } from "@/lib/mockIdeaDetails";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing idea id" }, { status: 400 });
  }

  // Simulate network latency for realistic loading states
  await new Promise((r) => setTimeout(r, 1200));

  const validation = getValidation(id);
  return NextResponse.json(validation);
}
