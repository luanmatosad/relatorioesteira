"use client";

import { Input, Select, Space } from "antd";
import { ReportItemsResponse } from "@/features/executive-report/types/report.types";

type DeliveryFiltersProps = {
  availableFilters: ReportItemsResponse["meta"]["availableFilters"];
  filters: {
    status?: string;
    originalStatus?: string;
    category?: string;
    owner?: string;
    itemType?: string;
    search?: string;
  };
  onChange: (nextFilters: {
    status?: string;
    originalStatus?: string;
    category?: string;
    owner?: string;
    itemType?: string;
    search?: string;
  }) => void;
};

const groupedStatusOptions = [
  { label: "Não iniciado", value: "not_started" },
  { label: "Em execução", value: "in_progress" },
  { label: "Pronto para publicação", value: "ready_for_release" },
  { label: "Em produção", value: "production" },
  { label: "Não mapeado", value: "unknown" },
];

export function DeliveryFilters({
  availableFilters,
  filters,
  onChange,
}: DeliveryFiltersProps) {
  return (
    <Space size={[12, 12]} wrap style={{ width: "100%" }}>
      <Input.Search
        allowClear
        onSearch={(value) => onChange({ ...filters, search: value || undefined })}
        placeholder="Buscar por chave, resumo ou categoria"
        style={{ minWidth: 280 }}
        defaultValue={filters.search}
      />
      <Select
        allowClear
        placeholder="Status executivo"
        options={groupedStatusOptions}
        style={{ minWidth: 200 }}
        value={filters.status}
        onChange={(value) => onChange({ ...filters, status: value })}
      />
      <Select
        allowClear
        placeholder="Status original"
        options={availableFilters.originalStatuses.map((status) => ({
          label: status,
          value: status,
        }))}
        style={{ minWidth: 220 }}
        value={filters.originalStatus}
        onChange={(value) => onChange({ ...filters, originalStatus: value })}
      />
      <Select
        allowClear
        placeholder="Categoria"
        options={availableFilters.categories.map((category) => ({
          label: category,
          value: category,
        }))}
        style={{ minWidth: 200 }}
        value={filters.category}
        onChange={(value) => onChange({ ...filters, category: value })}
      />
      <Select
        allowClear
        placeholder="Responsável"
        options={availableFilters.owners.map((owner) => ({
          label: owner,
          value: owner,
        }))}
        style={{ minWidth: 200 }}
        value={filters.owner}
        onChange={(value) => onChange({ ...filters, owner: value })}
      />
      <Select
        allowClear
        placeholder="Tipo de item"
        options={availableFilters.itemTypes.map((itemType) => ({
          label: itemType,
          value: itemType,
        }))}
        style={{ minWidth: 180 }}
        value={filters.itemType}
        onChange={(value) => onChange({ ...filters, itemType: value })}
      />
    </Space>
  );
}
