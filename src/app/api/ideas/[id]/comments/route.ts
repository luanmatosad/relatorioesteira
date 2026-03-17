import { NextRequest, NextResponse } from "next/server";
import { addIdeaComment } from "@/features/feature-requests/lib/feature-requests-store";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = (await request.json()) as { author: string; message: string };
  const idea = addIdeaComment(id, body);

  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json({ data: idea });
}
