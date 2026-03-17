import { NextResponse } from "next/server";
import { getReportSummary } from "@/features/executive-report/services/getReportSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getReportSummary();

  return NextResponse.json({ data });
}
