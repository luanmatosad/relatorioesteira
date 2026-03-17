import { DeliveryStatusGroup } from "@/features/executive-report/types/report.types";

const STATUS_MAP: Record<string, DeliveryStatusGroup> = {
  "Tarefas pendentes": "not_started",
  "Em andamento": "in_progress",
  "AGUARDANDO REVISAO": "in_progress",
  "Concluido - Em Espera": "ready_for_release",
  "SUBIR PARA PRODUCAO": "ready_for_release",
  PRODUCTION: "production",
};

export function mapStatus(status?: string | null): DeliveryStatusGroup {
  if (!status) {
    return "unknown";
  }

  return STATUS_MAP[normalizeStatusKey(status)] ?? "unknown";
}

function normalizeStatusKey(status: string) {
  return status
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
