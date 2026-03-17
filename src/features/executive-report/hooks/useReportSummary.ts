"use client";

import { useQuery } from "@tanstack/react-query";
import { ReportSummary } from "@/features/executive-report/types/report.types";

export function useReportSummary(initialData?: ReportSummary) {
  return useQuery({
    queryKey: ["report-summary"],
    queryFn: async () => {
      const response = await fetch("/api/report/summary", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("summary_request_failed");
      }

      const result = (await response.json()) as { data: ReportSummary };

      return result.data;
    },
    initialData,
  });
}
