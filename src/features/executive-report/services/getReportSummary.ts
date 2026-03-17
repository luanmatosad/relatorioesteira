import { buildSummary } from "@/features/executive-report/lib/build-summary";
import { normalizeSheetRow } from "@/features/executive-report/lib/normalize-sheet-row";
import {
  DeliveryItem,
  ReportSummary,
} from "@/features/executive-report/types/report.types";
import { getSheetRows } from "@/services/google/sheets";

export async function getReportSummary(): Promise<ReportSummary> {
  const { connected, lastSyncAt, message, rows, source } = await getSheetRows();

  const normalizedRows = rows
    .map((row) => normalizeSheetRow(row))
    .filter((row): row is DeliveryItem => Boolean(row));

  return buildSummary(normalizedRows, lastSyncAt, {
    connected,
    message,
    mode: source,
  });
}
