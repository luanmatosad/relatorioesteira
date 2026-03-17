"use client";

import { useQuery } from "@tanstack/react-query";
import { ReportFilters, ReportItemsResponse } from "@/features/executive-report/types/report.types";

export function useReportItems(
  filters: ReportFilters,
  initialData?: ReportItemsResponse,
) {
  return useQuery({
    queryKey: ["report-items", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/report/items?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("items_request_failed");
      }

      return response.json() as Promise<ReportItemsResponse>;
    },
    initialData,
  });
}
