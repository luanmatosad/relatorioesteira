import { getIdeaById } from "@/features/feature-requests/lib/feature-requests-store";

export async function getIdea(id: string) {
  return getIdeaById(id);
}
