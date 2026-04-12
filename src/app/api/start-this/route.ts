import { NextRequest, NextResponse } from "next/server";
import { mockIdeas } from "@/lib/mockIdeas";
import { generateStartThis } from "@/lib/ai";
import { StepContext } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stepNumber, previousSteps } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing idea id" }, { status: 400 });
    }

    const idea = mockIdeas.find((i) => i.id === id);
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const context: StepContext | undefined =
      stepNumber && stepNumber > 1
        ? { stepNumber, previousSteps: previousSteps ?? [] }
        : undefined;

    const output = await generateStartThis(idea, context);
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate action" },
      { status: 500 }
    );
  }
}
