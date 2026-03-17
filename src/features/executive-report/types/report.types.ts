export type RawSheetRow = {
  "Tipo de item"?: string;
  Chave?: string;
  Resumo?: string;
  "Responsável"?: string;
  Responsavel?: string;
  Status?: string;
  Criado?: string;
  "Atualizado(a)"?: string;
  "Data limite"?: string;
  Categorias?: string;
};

export type DeliveryStatusGroup =
  | "not_started"
  | "in_progress"
  | "ready_for_release"
  | "production"
  | "unknown";

export type DeliveryItem = {
  id: string;
  key: string;
  itemType: string;
  summary: string;
  owner: string | null;
  originalStatus: string;
  groupedStatus: DeliveryStatusGroup;
  createdAt: string | null;
  updatedAt: string | null;
  dueAt: string | null;
  categories: string[];
  agingDays: number | null;
};

export type ReportSummary = {
  totalItems: number;
  totalProduction: number;
  totalInProgress: number;
  totalReadyForRelease: number;
  totalNotStarted: number;
  totalUnknown: number;
  staleItems: number;
  lastSyncAt: string;
  groupedStatusBreakdown: Array<{
    status: DeliveryStatusGroup;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  ownerBreakdown: Array<{
    owner: string;
    count: number;
  }>;
  dataSource: {
    mode: "google-api" | "public-sheet" | "demo";
    connected: boolean;
    message: string;
  };
};

export type ReportFilters = {
  status?: string;
  originalStatus?: string;
  category?: string;
  owner?: string;
  itemType?: string;
  search?: string;
  page?: string | number;
  pageSize?: string | number;
};

export type ReportItemsResponse = {
  data: DeliveryItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    lastSyncAt: string;
    dataSource: {
      mode: "google-api" | "public-sheet" | "demo";
      connected: boolean;
      message: string;
    };
    availableFilters: {
      categories: string[];
      owners: string[];
      itemTypes: string[];
      originalStatuses: string[];
      groupedStatuses: DeliveryStatusGroup[];
    };
  };
};
