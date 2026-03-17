"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { refreshReport } from "@/features/executive-report/services/refreshReport";

export function useRefreshReport() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: refreshReport,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["report-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["report-items"] }),
      ]);

      message.success("Relatório atualizado com sucesso.");
    },
    onError: () => {
      message.error("Não foi possível atualizar o relatório.");
    },
  });
}
