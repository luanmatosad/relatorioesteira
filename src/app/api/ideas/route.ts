import { NextRequest, NextResponse } from "next/server";
import { createIdea, listIdeas } from "@/features/feature-requests/lib/feature-requests-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const data = listIdeas({
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort: (searchParams.get("sort") as "recent" | "votes" | "updated" | null) ?? undefined,
    status: (searchParams.get("status") as
      | "new"
      | "under_review"
      | "planned"
      | "in_progress"
      | "released"
      | "not_prioritized"
      | null) ?? undefined,
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const idea = createIdea(body);

  return NextResponse.json({ data: idea }, { status: 201 });
}
