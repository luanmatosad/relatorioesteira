import { notFound } from "next/navigation";
import { IdeaDetailView } from "@/features/feature-requests/components/IdeaDetailView";
import { getIdea } from "@/features/feature-requests/services/getIdea";
import { PortalShell } from "@/shared/layouts/PortalShell";

export const dynamic = "force-dynamic";

type IdeaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { id } = await params;
  const idea = await getIdea(id);

  if (!idea) {
    notFound();
  }

  return (
    <PortalShell currentPath="/sugestoes">
      <IdeaDetailView idea={idea} />
    </PortalShell>
  );
}
