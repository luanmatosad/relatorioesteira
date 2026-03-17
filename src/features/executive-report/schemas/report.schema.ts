import { z } from "zod";

export const rawSheetRowSchema = z.object({
  "Tipo de item": z.string().optional(),
  Chave: z.string().optional(),
  Resumo: z.string().optional(),
  "Responsável": z.string().optional(),
  Responsavel: z.string().optional(),
  Status: z.string().optional(),
  Criado: z.string().optional(),
  "Atualizado(a)": z.string().optional(),
  "Data limite": z.string().optional(),
  Categorias: z.string().optional(),
});

export const deliveryItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  itemType: z.string(),
  summary: z.string(),
  owner: z.string().nullable(),
  originalStatus: z.string(),
  groupedStatus: z.enum([
    "not_started",
    "in_progress",
    "ready_for_release",
    "production",
    "unknown",
  ]),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  dueAt: z.string().nullable(),
  categories: z.array(z.string()),
  agingDays: z.number().nullable(),
});
