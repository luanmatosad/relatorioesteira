import { NextResponse } from "next/server";
import { voteIdea } from "@/features/feature-requests/lib/feature-requests-store";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: Context) {
  const { id } = await context.params;
  const idea = voteIdea(id);

  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json({ data: idea });
}
