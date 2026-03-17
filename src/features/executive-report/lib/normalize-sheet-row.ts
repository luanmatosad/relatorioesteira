import { mapStatus } from "@/features/executive-report/lib/map-status";
import { parseCategories } from "@/features/executive-report/lib/parse-categories";
import { parseDate } from "@/features/executive-report/lib/parse-date";
import { RawSheetRow, DeliveryItem } from "@/features/executive-report/types/report.types";

export function normalizeSheetRow(row: RawSheetRow): DeliveryItem | null {
  const summary = row.Resumo?.trim();
  const key = row.Chave?.trim();

  if (!summary || !key) {
    return null;
  }

  const createdAt = parseDate(row.Criado);
  const updatedAt = parseDate(row["Atualizado(a)"]);
  const dueAt = parseDate(row["Data limite"]);

  return {
    id: key,
    key,
    itemType: row["Tipo de item"]?.trim() || "Sem tipo",
    summary,
    owner: row["Responsável"]?.trim() || row.Responsavel?.trim() || null,
    originalStatus: row.Status?.trim() || "Nao informado",
    groupedStatus: mapStatus(row.Status),
    createdAt,
    updatedAt,
    dueAt,
    categories: parseCategories(row.Categorias),
    agingDays: getAgingDays(createdAt),
  };
}

function getAgingDays(createdAt: string | null) {
  if (!createdAt) {
    return null;
  }

  const start = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - start;

  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
