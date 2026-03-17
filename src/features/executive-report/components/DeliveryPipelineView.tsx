"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Col, Row, Space, Statistic, Typography } from "antd";
import { useRouter } from "next/navigation";
import { DeliveryFilters } from "@/features/executive-report/components/DeliveryFilters";
import { DeliveryItemDrawer } from "@/features/executive-report/components/DeliveryItemDrawer";
import { DeliveryTable } from "@/features/executive-report/components/DeliveryTable";
import { useReportItems } from "@/features/executive-report/hooks/useReportItems";
import {
  DeliveryItem,
  ReportItemsResponse,
} from "@/features/executive-report/types/report.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageHeader } from "@/shared/components/PageHeader";

type DeliveryPipelineViewProps = {
  initialItemsResponse: ReportItemsResponse;
  initialFilters: {
    status?: string;
    originalStatus?: string;
    category?: string;
    owner?: string;
    itemType?: string;
    search?: string;
    page: number;
    pageSize: number;
  };
};

export function DeliveryPipelineView({
  initialFilters,
  initialItemsResponse,
}: DeliveryPipelineViewProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const itemsQuery = useReportItems(filters, initialItemsResponse);
  const itemsResponse = itemsQuery.data ?? initialItemsResponse;

  const pipelineStats = useMemo(
    () => ({
      total: itemsResponse.meta.total,
      uniqueOwners: itemsResponse.meta.availableFilters.owners.length,
      categories: itemsResponse.meta.availableFilters.categories.length,
      statuses: itemsResponse.meta.availableFilters.originalStatuses.length,
    }),
    [itemsResponse],
  );

  const hasActiveFilter = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) => !["page", "pageSize"].includes(key) && value !== undefined && value !== "",
      ),
    [filters],
  );

  const handleFilterChange = (
    nextFilters: Partial<typeof initialFilters>,
  ) => {
    const mergedFilters = {
      ...filters,
      ...nextFilters,
      page: 1,
    };

    setFilters(mergedFilters);
    router.replace(`/esteira?${buildSearchParams(mergedFilters)}`);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    const nextFilters = { ...filters, page, pageSize };
    setFilters(nextFilters);
    router.replace(`/esteira?${buildSearchParams(nextFilters)}`);
  };

  if (itemsQuery.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar a esteira detalhada."
        onRetry={() => itemsQuery.refetch()}
      />
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageHeader
        eyebrow="Operação detalhada"
        title="Esteira de Entregas"
        subtitle="Acompanhe o backlog operacional com filtros completos e abra cada item para leitura mais profunda."
        extraActions={
          <Button href="/relatorio-executivo" type="default">
            Voltar ao relatório
          </Button>
        }
      />

      <div className="panel-card">
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Statistic title="Itens no recorte" value={pipelineStats.total} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Responsáveis" value={pipelineStats.uniqueOwners} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Categorias" value={pipelineStats.categories} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Status originais" value={pipelineStats.statuses} />
          </Col>
        </Row>
      </div>

      <div className="panel-card">
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
            Use esta visão para inspeção operacional mais profunda. Abra um item para ver contexto, datas e leitura executiva resumida.
          </Typography.Paragraph>

          <DeliveryFilters
            availableFilters={itemsResponse.meta.availableFilters}
            filters={filters}
            onChange={handleFilterChange}
          />

          {itemsResponse.data.length ? (
            <DeliveryTable
              itemsResponse={itemsResponse}
              loading={itemsQuery.isFetching}
              onInspectItem={setSelectedItem}
              onPageChange={handlePageChange}
            />
          ) : (
            <EmptyState
              title={hasActiveFilter ? "Nenhum item encontrado" : "Sem itens para exibir"}
              description="Refine o recorte ou aguarde novas atualizações da planilha."
            />
          )}
        </Space>
      </div>

      <Typography.Text type="secondary">
        Precisa compartilhar esse recorte em formato executivo? Volte para o{" "}
        <Link href="/relatorio-executivo">Relatório Executivo</Link> e use a exportação em PDF.
      </Typography.Text>

      <DeliveryItemDrawer
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </Space>
  );
}

function buildSearchParams(filters: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  return params.toString();
}
