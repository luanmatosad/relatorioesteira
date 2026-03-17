"use client";

import { useMemo, useState } from "react";
import { App, Button, Col, Row, Space, Statistic, Typography } from "antd";
import { useRouter } from "next/navigation";
import { IdeaCard } from "@/features/feature-requests/components/IdeaCard";
import { IdeaFilters } from "@/features/feature-requests/components/IdeaFilters";
import { NewIdeaModal } from "@/features/feature-requests/components/NewIdeaModal";
import { CreateIdeaInput } from "@/features/feature-requests/schemas/feature-requests.schema";
import { IdeasResponse } from "@/features/feature-requests/types/feature-requests.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageHeader } from "@/shared/components/PageHeader";

type FeatureRequestsViewProps = {
  initialIdeasResponse: IdeasResponse;
  initialFilters: {
    status?: "new" | "under_review" | "planned" | "in_progress" | "released" | "not_prioritized" | "";
    category?: string;
    search?: string;
    sort?: "recent" | "votes" | "updated";
  };
};

export function FeatureRequestsView({
  initialFilters,
  initialIdeasResponse,
}: FeatureRequestsViewProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [ideasResponse, setIdeasResponse] = useState(initialIdeasResponse);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const featuredStats = useMemo(
    () => ({
      total: ideasResponse.meta.total,
      planned: ideasResponse.data.filter((idea) => idea.status === "planned").length,
      inProgress: ideasResponse.data.filter((idea) => idea.status === "in_progress").length,
      released: ideasResponse.data.filter((idea) => idea.status === "released").length,
    }),
    [ideasResponse],
  );

  async function refreshIdeas(nextFilters = filters) {
    setLoading(true);
    const params = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });

    try {
      const response = await fetch(`/api/ideas?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("ideas_request_failed");
      }

      const data = (await response.json()) as IdeasResponse;
      setIdeasResponse(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(ideaId: string) {
    setLoading(true);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/vote`, { method: "POST" });

      if (!response.ok) {
        throw new Error("vote_failed");
      }

      await refreshIdeas();
      message.success("Voto registrado.");
    } catch {
      message.error("Não foi possível registrar o voto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(values: CreateIdeaInput) {
    setCreating(true);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("create_failed");
      }

      setModalOpen(false);
      await refreshIdeas({ ...filters, sort: "recent" });
      message.success("Sugestão publicada.");
    } catch {
      message.error("Não foi possível publicar a sugestão.");
    } finally {
      setCreating(false);
    }
  }

  const handleFilterChange = async (nextFilters: typeof initialFilters) => {
    setFilters(nextFilters);
    router.replace(`/sugestoes?${buildSearchParams(nextFilters)}`);
    await refreshIdeas(nextFilters);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageHeader
        eyebrow="Co-criação com clientes"
        title="Sugestões e Votação"
        subtitle="Centralize ideias, agrupe demanda recorrente e acompanhe o que entrou em análise, planejamento e entrega."
        extraActions={
          <Button onClick={() => setModalOpen(true)} type="primary">
            Nova sugestão
          </Button>
        }
      />

      <div className="panel-card">
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Statistic title="Sugestões no recorte" value={featuredStats.total} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Planejadas" value={featuredStats.planned} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Em desenvolvimento" value={featuredStats.inProgress} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Entregues" value={featuredStats.released} />
          </Col>
        </Row>
      </div>

      <div className="panel-card">
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
            Antes de criar uma ideia nova, procure temas semelhantes. Isso ajuda a concentrar votos e priorização.
          </Typography.Paragraph>

          <IdeaFilters
            filters={filters}
            meta={ideasResponse.meta}
            onChange={handleFilterChange}
          />

          {ideasResponse.data.length ? (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {ideasResponse.data.map((idea) => (
                <IdeaCard
                  idea={idea}
                  key={idea.id}
                  onVote={handleVote}
                  voting={loading}
                />
              ))}
            </Space>
          ) : (
            <EmptyState
              title="Nenhuma sugestão encontrada"
              description="Ajuste os filtros ou publique a primeira ideia para esse tema."
            />
          )}
        </Space>
      </div>

      <NewIdeaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        submitting={creating}
      />
    </Space>
  );
}

function buildSearchParams(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}
