import { ExecutiveReportView } from "@/features/executive-report/components/ExecutiveReportView";
import { getReportItems } from "@/features/executive-report/services/getReportItems";
import { getReportSummary } from "@/features/executive-report/services/getReportSummary";
import { PortalShell } from "@/shared/layouts/PortalShell";

export const dynamic = "force-dynamic";

type ReportPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExecutiveReportPage({
  searchParams,
}: ReportPageProps) {
  const params = await searchParams;

  const [itemsResponse, summary] = await Promise.all([
    getReportItems({
      status: getSingleParam(params.status),
      originalStatus: getSingleParam(params.originalStatus),
      category: getSingleParam(params.category),
      owner: getSingleParam(params.owner),
      itemType: getSingleParam(params.itemType),
      search: getSingleParam(params.search),
    }),
    getReportSummary(),
  ]);

  return (
    <PortalShell currentPath="/relatorio-executivo">
      <ExecutiveReportView
        initialFilters={{
          category: getSingleParam(params.category) ?? undefined,
          itemType: getSingleParam(params.itemType) ?? undefined,
          originalStatus: getSingleParam(params.originalStatus) ?? undefined,
          owner: getSingleParam(params.owner) ?? undefined,
          search: getSingleParam(params.search) ?? undefined,
          status: getSingleParam(params.status) ?? undefined,
        }}
        initialItemsResponse={itemsResponse}
        initialSummary={summary}
      />
    </PortalShell>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
