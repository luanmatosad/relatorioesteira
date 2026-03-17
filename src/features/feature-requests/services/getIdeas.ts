import { listIdeas } from "@/features/feature-requests/lib/feature-requests-store";
import { IdeaFilters, IdeasResponse } from "@/features/feature-requests/types/feature-requests.types";

export async function getIdeas(filters: IdeaFilters = {}): Promise<IdeasResponse> {
  return listIdeas(filters);
}
