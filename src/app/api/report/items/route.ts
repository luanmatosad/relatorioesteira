import { NextRequest, NextResponse } from "next/server";
import { getReportItems } from "@/features/executive-report/services/getReportItems";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const data = await getReportItems({
    category: searchParams.get("category") ?? undefined,
    itemType: searchParams.get("itemType") ?? undefined,
    originalStatus: searchParams.get("originalStatus") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  return NextResponse.json(data);
}
