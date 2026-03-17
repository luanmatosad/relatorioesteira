"use client";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeliveryItem, ReportItemsResponse } from "@/features/executive-report/types/report.types";
import { StatusTag } from "@/shared/components/StatusTag";

dayjs.locale("pt-br");

type DeliveryTableProps = {
  itemsResponse: ReportItemsResponse;
  loading?: boolean;
  onInspectItem?: (item: DeliveryItem) => void;
  onPageChange: (page: number, pageSize: number) => void;
};

export function DeliveryTable({
  itemsResponse,
  loading,
  onInspectItem,
  onPageChange,
}: DeliveryTableProps) {
  const columns: ColumnsType<DeliveryItem> = [
    {
      title: "Chave",
      dataIndex: "key",
      key: "key",
      width: 120,
      render: (value: string) => <Typography.Text code>{value}</Typography.Text>,
    },
    {
      title: "Resumo",
      dataIndex: "summary",
      key: "summary",
      render: (value: string, record) => (
        <Space direction="vertical" size={4}>
          <Typography.Text strong>{value}</Typography.Text>
          <Space size={[8, 8]} wrap>
            {record.categories.map((category) => (
              <Tag key={category} bordered={false} color="cyan">
                {category}
              </Tag>
            ))}
          </Space>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "groupedStatus",
      key: "groupedStatus",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <StatusTag status={record.groupedStatus} />
          <Tooltip title="Status original da planilha">
            <Typography.Text type="secondary">{record.originalStatus}</Typography.Text>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Responsavel",
      dataIndex: "owner",
      key: "owner",
      width: 160,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "Tipo",
      dataIndex: "itemType",
      key: "itemType",
      width: 140,
    },
    {
      title: "Atualizado",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (value: string | null) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Aging",
      dataIndex: "agingDays",
      key: "agingDays",
      width: 120,
      render: (value: number | null) => (value !== null ? `${value} dias` : "-"),
    },
    {
      title: "Detalhe",
      key: "detail",
      width: 140,
      render: (_, record) => (
        <Button onClick={() => onInspectItem?.(record)} type="link">
          Abrir
        </Button>
      ),
    },
  ];

  return (
    <Table<DeliveryItem>
      columns={columns}
      dataSource={itemsResponse.data}
      loading={loading}
      pagination={{
        current: itemsResponse.meta.page,
        pageSize: itemsResponse.meta.pageSize,
        total: itemsResponse.meta.total,
        onChange: onPageChange,
        showSizeChanger: true,
      }}
      onRow={(record) => ({
        onClick: () => onInspectItem?.(record),
        style: { cursor: onInspectItem ? "pointer" : "default" },
      })}
      rowKey="id"
      scroll={{ x: 1080 }}
    />
  );
}
