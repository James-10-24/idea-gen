import { NextRequest, NextResponse } from "next/server";
import { mockIdeas } from "@/lib/mockIdeas";
import { generateStartThis } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing idea id" }, { status: 400 });
    }

    const idea = mockIdeas.find((i) => i.id === id);
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const output = await generateStartThis(idea);
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate action" },
      { status: 500 }
    );
  }
}
