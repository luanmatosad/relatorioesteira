import {
  DeliveryItem,
  DeliveryStatusGroup,
  ReportSummary,
} from "@/features/executive-report/types/report.types";

type DataSourceInfo = ReportSummary["dataSource"];

export function buildSummary(
  items: DeliveryItem[],
  lastSyncAt: string,
  dataSource: DataSourceInfo,
): ReportSummary {
  const groupedCounts = new Map<DeliveryStatusGroup, number>();
  const categoryCounts = new Map<string, number>();
  const ownerCounts = new Map<string, number>();

  for (const item of items) {
    groupedCounts.set(item.groupedStatus, (groupedCounts.get(item.groupedStatus) ?? 0) + 1);

    for (const category of item.categories) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }

    const owner = item.owner ?? "Sem responsavel";
    ownerCounts.set(owner, (ownerCounts.get(owner) ?? 0) + 1);
  }

  const staleItems = items.filter((item) => {
    if (item.groupedStatus === "production" || !item.updatedAt) {
      return false;
    }

    const diff = Date.now() - new Date(item.updatedAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return days > 7;
  }).length;

  return {
    totalItems: items.length,
    totalProduction: groupedCounts.get("production") ?? 0,
    totalInProgress: groupedCounts.get("in_progress") ?? 0,
    totalReadyForRelease: groupedCounts.get("ready_for_release") ?? 0,
    totalNotStarted: groupedCounts.get("not_started") ?? 0,
    totalUnknown: groupedCounts.get("unknown") ?? 0,
    staleItems,
    lastSyncAt,
    dataSource,
    groupedStatusBreakdown: Array.from(groupedCounts.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    categoryBreakdown: toCategoryEntries(categoryCounts),
    ownerBreakdown: toOwnerEntries(ownerCounts),
  };
}

function toCategoryEntries(map: Map<string, number>) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      category: label,
      count,
    }));
}

function toOwnerEntries(map: Map<string, number>) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      owner: label,
      count,
    }));
}
