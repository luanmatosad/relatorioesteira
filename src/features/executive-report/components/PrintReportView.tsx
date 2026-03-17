"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Button, Divider, Space, Table, Tag, Typography } from "antd";
import { DeliveryItem, ReportSummary } from "@/features/executive-report/types/report.types";
import { StatusTag } from "@/shared/components/StatusTag";

dayjs.locale("pt-br");

type PrintReportViewProps = {
  items: DeliveryItem[];
  summary: ReportSummary;
};

export function PrintReportView({ items, summary }: PrintReportViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => window.print(), 400);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="print-report">
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div className="print-hide" style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography.Text type="secondary">
            Esta tela foi preparada para exportação em PDF.
          </Typography.Text>
          <Button onClick={() => window.print()} type="primary">
            Gerar PDF
          </Button>
        </div>

        <header>
          <Typography.Title style={{ marginBottom: 8 }}>
            Relatório Executivo
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 8 }}>
            Snapshot da esteira de entregas alimentado pela Google Sheet oficial.
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Emitido em {dayjs().format("DD/MM/YYYY HH:mm")} | Última sincronização{" "}
            {dayjs(summary.lastSyncAt).format("DD/MM/YYYY HH:mm")}
          </Typography.Text>
        </header>

        <section className="print-summary-grid">
          <div className="print-summary-card">
            <Typography.Text type="secondary">Itens totais</Typography.Text>
            <Typography.Title level={3}>{summary.totalItems}</Typography.Title>
          </div>
          <div className="print-summary-card">
            <Typography.Text type="secondary">Em produção</Typography.Text>
            <Typography.Title level={3}>{summary.totalProduction}</Typography.Title>
          </div>
          <div className="print-summary-card">
            <Typography.Text type="secondary">Em execução</Typography.Text>
            <Typography.Title level={3}>{summary.totalInProgress}</Typography.Title>
          </div>
          <div className="print-summary-card">
            <Typography.Text type="secondary">Prontos para publicar</Typography.Text>
            <Typography.Title level={3}>{summary.totalReadyForRelease}</Typography.Title>
          </div>
        </section>

        <section>
          <Typography.Title level={4}>Categorias de maior volume</Typography.Title>
          <Space size={[8, 8]} wrap>
            {summary.categoryBreakdown.slice(0, 8).map((item) => (
              <Tag key={item.category}>
                {item.category}: {item.count}
              </Tag>
            ))}
          </Space>
        </section>

        <Divider style={{ marginBlock: 0 }} />

        <section>
          <Typography.Title level={4}>Itens incluidos no relatorio</Typography.Title>
          <Table<DeliveryItem>
            columns={[
              { title: "Chave", dataIndex: "key", key: "key", width: 120 },
              { title: "Resumo", dataIndex: "summary", key: "summary" },
              {
                title: "Status",
                key: "groupedStatus",
                width: 180,
                render: (_, record) => <StatusTag status={record.groupedStatus} />,
              },
              {
                title: "Responsavel",
                dataIndex: "owner",
                key: "owner",
                width: 180,
                render: (value: string | null) => value ?? "-",
              },
              {
                title: "Atualizado",
                dataIndex: "updatedAt",
                key: "updatedAt",
                width: 140,
                render: (value: string | null) =>
                  value ? dayjs(value).format("DD/MM/YYYY") : "-",
              },
            ]}
            dataSource={items}
            pagination={false}
            rowKey="id"
            size="small"
          />
        </section>
      </Space>
    </main>
  );
}
