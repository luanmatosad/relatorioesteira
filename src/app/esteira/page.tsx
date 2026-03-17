import { DeliveryPipelineView } from "@/features/executive-report/components/DeliveryPipelineView";
import { getReportItems } from "@/features/executive-report/services/getReportItems";
import { PortalShell } from "@/shared/layouts/PortalShell";

export const dynamic = "force-dynamic";

type PipelinePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DeliveryPipelinePage({
  searchParams,
}: PipelinePageProps) {
  const params = await searchParams;

  const itemsResponse = await getReportItems({
    status: getSingleParam(params.status),
    originalStatus: getSingleParam(params.originalStatus),
    category: getSingleParam(params.category),
    owner: getSingleParam(params.owner),
    itemType: getSingleParam(params.itemType),
    search: getSingleParam(params.search),
    page: getSingleParam(params.page) ?? 1,
    pageSize: getSingleParam(params.pageSize) ?? 25,
  });

  return (
    <PortalShell currentPath="/esteira">
      <DeliveryPipelineView
        initialFilters={{
          category: getSingleParam(params.category) ?? undefined,
          itemType: getSingleParam(params.itemType) ?? undefined,
          originalStatus: getSingleParam(params.originalStatus) ?? undefined,
          owner: getSingleParam(params.owner) ?? undefined,
          page: Number(getSingleParam(params.page) ?? 1),
          pageSize: Number(getSingleParam(params.pageSize) ?? 25),
          search: getSingleParam(params.search) ?? undefined,
          status: getSingleParam(params.status) ?? undefined,
        }}
        initialItemsResponse={itemsResponse}
      />
    </PortalShell>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
