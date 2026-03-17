import { PrintReportView } from "@/features/executive-report/components/PrintReportView";
import { getReportItems } from "@/features/executive-report/services/getReportItems";
import { getReportSummary } from "@/features/executive-report/services/getReportSummary";

export const dynamic = "force-dynamic";

export default async function ExecutiveReportPdfPage() {
  const [summary, itemsResponse] = await Promise.all([
    getReportSummary(),
    getReportItems({ page: 1, pageSize: 200 }),
  ]);

  return <PrintReportView items={itemsResponse.data} summary={summary} />;
}
