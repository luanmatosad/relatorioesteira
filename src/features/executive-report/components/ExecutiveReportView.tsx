"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Col, Flex, Row, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { CategoryBreakdown } from "@/features/executive-report/components/CategoryBreakdown";
import { DataSourceAlert } from "@/features/executive-report/components/DataSourceAlert";
import { DeliveryFilters } from "@/features/executive-report/components/DeliveryFilters";
import { DeliveryItemDrawer } from "@/features/executive-report/components/DeliveryItemDrawer";
import { DeliveryTable } from "@/features/executive-report/components/DeliveryTable";
import { ExecutiveSummaryCards } from "@/features/executive-report/components/ExecutiveSummaryCards";
import { LastSyncBadge } from "@/features/executive-report/components/LastSyncBadge";
import { StatusBreakdownChart } from "@/features/executive-report/components/StatusBreakdownChart";
import { useRefreshReport } from "@/features/executive-report/hooks/useRefreshReport";
import { useReportItems } from "@/features/executive-report/hooks/useReportItems";
import { useReportSummary } from "@/features/executive-report/hooks/useReportSummary";
import {
  DeliveryItem,
  ReportItemsResponse,
  ReportSummary,
} from "@/features/executive-report/types/report.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageHeader } from "@/shared/components/PageHeader";

type ExecutiveReportViewProps = {
  initialItemsResponse: ReportItemsResponse;
  initialSummary: ReportSummary;
  initialFilters: {
    status?: string;
    originalStatus?: string;
    category?: string;
    owner?: string;
    itemType?: string;
    search?: string;
  };
};

export function ExecutiveReportView({
  initialFilters,
  initialItemsResponse,
  initialSummary,
}: ExecutiveReportViewProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [filters, setFilters] = useState({
    ...initialFilters,
    page: 1,
    pageSize: initialItemsResponse.meta.pageSize,
  });

  const itemsQuery = useReportItems(filters, initialItemsResponse);
  const summaryQuery = useReportSummary(initialSummary);
  const refreshMutation = useRefreshReport();

  const itemsResponse = itemsQuery.data ?? initialItemsResponse;
  const summary = summaryQuery.data ?? initialSummary;

  const hasActiveFilter = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) => !["page", "pageSize"].includes(key) && value !== undefined && value !== "",
      ),
    [filters],
  );

  const handleFilterChange = (nextFilters: typeof initialFilters) => {
    const mergedFilters = {
      ...filters,
      ...nextFilters,
      page: 1,
    };

    setFilters(mergedFilters);
    router.replace(`/relatorio-executivo?${buildSearchParams(mergedFilters)}`);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    const nextFilters = {
      ...filters,
      page,
      pageSize,
    };

    setFilters(nextFilters);
  };

  if (itemsQuery.isError || summaryQuery.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar os dados da planilha neste momento."
        onRetry={() => {
          itemsQuery.refetch();
          summaryQuery.refetch();
        }}
      />
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <PageHeader
        eyebrow="Conta Enterprise"
        title="Relatório Executivo"
        subtitle="Leitura consolidada da esteira de entregas, status operacionais e categorias de maior impacto."
        extraActions={
          <>
            <Button href="/esteira" type="default">
              Abrir esteira detalhada
            </Button>
            <Button href="/relatorio-executivo/pdf" target="_blank" type="default">
              Exportar PDF
            </Button>
          </>
        }
        onRefresh={() => refreshMutation.mutate()}
        refreshing={refreshMutation.isPending}
      />

      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <LastSyncBadge value={summary.lastSyncAt} />
        <Typography.Text type="secondary">
          Fonte: Google Sheets com sincronização contínua.
        </Typography.Text>
      </Flex>

      <DataSourceAlert dataSource={summary.dataSource} />

      <ExecutiveSummaryCards summary={summary} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <StatusBreakdownChart summary={summary} />
        </Col>
        <Col xs={24} xl={9}>
          <CategoryBreakdown summary={summary} />
        </Col>
      </Row>

      <div className="panel-card">
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div>
            <Typography.Title level={3}>Esteira de entregas</Typography.Title>
            <Typography.Paragraph>
              Explore a operação por status executivo, status original, categoria, responsável e tipo de item.
            </Typography.Paragraph>
          </div>

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
              title={hasActiveFilter ? "Nenhum item encontrado" : "Ainda nao ha itens"}
              description={
                hasActiveFilter
                  ? "Ajuste os filtros para ampliar o resultado ou revise os dados da planilha."
                  : "Quando a planilha receber registros válidos, a esteira será exibida aqui."
              }
            />
          )}
        </Space>
      </div>

      <Typography.Text type="secondary">
        Para análise item a item, use a{" "}
        <Link href="/esteira">Esteira Detalhada</Link>. Para compartilhamento executivo, use{" "}
        <Link href="/relatorio-executivo/pdf" target="_blank">
          Exportar PDF
        </Link>
        .
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
