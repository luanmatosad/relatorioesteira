"use client";

import { Input, Select, Space } from "antd";
import { IdeasResponse, IdeaStatus } from "@/features/feature-requests/types/feature-requests.types";

type IdeaFiltersProps = {
  filters: {
    status?: IdeaStatus | "";
    category?: string;
    search?: string;
    sort?: "recent" | "votes" | "updated";
  };
  meta: IdeasResponse["meta"];
  onChange: (nextFilters: {
    status?: IdeaStatus | "";
    category?: string;
    search?: string;
    sort?: "recent" | "votes" | "updated";
  }) => void;
};

export function IdeaFilters({ filters, meta, onChange }: IdeaFiltersProps) {
  return (
    <Space size={[12, 12]} wrap style={{ width: "100%" }}>
      <Input.Search
        allowClear
        defaultValue={filters.search}
        onSearch={(value) => onChange({ ...filters, search: value || undefined })}
        placeholder="Buscar por titulo, contexto ou categoria"
        style={{ minWidth: 280 }}
      />
      <Select
        allowClear
        options={meta.availableStatuses.map((status) => ({ label: statusLabel(status), value: status }))}
        placeholder="Status"
        style={{ minWidth: 200 }}
        value={filters.status || undefined}
        onChange={(value) => onChange({ ...filters, status: value })}
      />
      <Select
        allowClear
        options={meta.availableCategories.map((category) => ({ label: category, value: category }))}
        placeholder="Categoria"
        style={{ minWidth: 180 }}
        value={filters.category}
        onChange={(value) => onChange({ ...filters, category: value })}
      />
      <Select
        options={[
          { label: "Mais votadas", value: "votes" },
          { label: "Mais recentes", value: "recent" },
          { label: "Atualizadas recentemente", value: "updated" },
        ]}
        placeholder="Ordenação"
        style={{ minWidth: 220 }}
        value={filters.sort}
        onChange={(value) => onChange({ ...filters, sort: value })}
      />
    </Space>
  );
}

function statusLabel(status: IdeaStatus) {
  return {
    new: "Nova",
    under_review: "Em análise",
    planned: "Planejada",
    in_progress: "Em desenvolvimento",
    released: "Entregue",
    not_prioritized: "Não priorizada",
  }[status];
}
