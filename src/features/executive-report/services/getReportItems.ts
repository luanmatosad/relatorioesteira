import { normalizeSheetRow } from "@/features/executive-report/lib/normalize-sheet-row";
import {
  DeliveryItem,
  DeliveryStatusGroup,
  ReportFilters,
  ReportItemsResponse,
} from "@/features/executive-report/types/report.types";
import { getSheetRows } from "@/services/google/sheets";

export async function getReportItems(
  filters: ReportFilters = {},
): Promise<ReportItemsResponse> {
  const { connected, lastSyncAt, message, rows, source } = await getSheetRows();

  const normalizedRows = rows
    .map((row) => normalizeSheetRow(row))
    .filter((row): row is DeliveryItem => Boolean(row));

  const filteredRows = normalizedRows.filter((item) => matchesFilters(item, filters));
  const sortedRows = filteredRows.sort(sortRows);

  const page = Number(filters.page ?? 1);
  const pageSize = Number(filters.pageSize ?? 10);
  const start = (page - 1) * pageSize;
  const paginatedRows = sortedRows.slice(start, start + pageSize);

  return {
    data: paginatedRows,
    meta: {
      page,
      pageSize,
      total: sortedRows.length,
      lastSyncAt,
      dataSource: {
        connected,
        message,
        mode: source,
      },
      availableFilters: {
        categories: uniqueValues(normalizedRows.flatMap((item) => item.categories)),
        groupedStatuses: uniqueValues(
          normalizedRows.map((item) => item.groupedStatus),
        ) as DeliveryStatusGroup[],
        itemTypes: uniqueValues(normalizedRows.map((item) => item.itemType)),
        originalStatuses: uniqueValues(normalizedRows.map((item) => item.originalStatus)),
        owners: uniqueValues(
          normalizedRows
            .map((item) => item.owner)
            .filter((owner): owner is string => Boolean(owner)),
        ),
      },
    },
  };
}

function matchesFilters(item: DeliveryItem, filters: ReportFilters) {
  const search = filters.search?.trim().toLowerCase();

  if (filters.status && item.groupedStatus !== filters.status) {
    return false;
  }

  if (filters.originalStatus && item.originalStatus !== filters.originalStatus) {
    return false;
  }

  if (filters.category && !item.categories.includes(filters.category)) {
    return false;
  }

  if (filters.owner && item.owner !== filters.owner) {
    return false;
  }

  if (filters.itemType && item.itemType !== filters.itemType) {
    return false;
  }

  if (
    search &&
    !`${item.key} ${item.summary} ${item.categories.join(" ")}`.toLowerCase().includes(search)
  ) {
    return false;
  }

  return true;
}

function sortRows(a: DeliveryItem, b: DeliveryItem) {
  const statusOrder: Record<DeliveryStatusGroup, number> = {
    in_progress: 0,
    ready_for_release: 1,
    not_started: 2,
    production: 3,
    unknown: 4,
  };

  const statusDiff = statusOrder[a.groupedStatus] - statusOrder[b.groupedStatus];

  if (statusDiff !== 0) {
    return statusDiff;
  }

  return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
}

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values)).sort();
}
