import { z } from "zod";

export const createIdeaSchema = z.object({
  title: z.string().min(6, "Informe um título mais descritivo."),
  summary: z.string().min(10, "Adicione um resumo curto da sugestão."),
  problem: z.string().min(20, "Explique o problema com mais contexto."),
  businessImpact: z.string().min(10, "Descreva o impacto no negócio."),
  proposedSolution: z.string().min(10, "Descreva a solução sugerida."),
  category: z.string().min(2, "Informe a categoria."),
  author: z.string().min(2, "Informe o nome do autor."),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
