import { FeatureRequestsView } from "@/features/feature-requests/components/FeatureRequestsView";
import { getIdeas } from "@/features/feature-requests/services/getIdeas";
import { PortalShell } from "@/shared/layouts/PortalShell";

export const dynamic = "force-dynamic";

type SuggestionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuggestionsPage({ searchParams }: SuggestionsPageProps) {
  const params = await searchParams;

  const ideasResponse = await getIdeas({
    category: getSingleParam(params.category),
    search: getSingleParam(params.search),
    sort: (getSingleParam(params.sort) as "recent" | "votes" | "updated" | undefined) ?? "votes",
    status: getSingleParam(params.status) as
      | "new"
      | "under_review"
      | "planned"
      | "in_progress"
      | "released"
      | "not_prioritized"
      | undefined,
  });

  return (
    <PortalShell currentPath="/sugestoes">
      <FeatureRequestsView
        initialFilters={{
          category: getSingleParam(params.category) ?? undefined,
          search: getSingleParam(params.search) ?? undefined,
          sort:
            (getSingleParam(params.sort) as "recent" | "votes" | "updated" | undefined) ?? "votes",
          status:
            (getSingleParam(params.status) as
              | "new"
              | "under_review"
              | "planned"
              | "in_progress"
              | "released"
              | "not_prioritized"
              | undefined) ?? undefined,
        }}
        initialIdeasResponse={ideasResponse}
      />
    </PortalShell>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
