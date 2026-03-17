import { FeatureIdea } from "@/features/feature-requests/types/feature-requests.types";

export const featureRequestsDemoData: FeatureIdea[] = [
  {
    id: "idea-1",
    title: "Dashboard inicial com widgets personalizaveis",
    summary: "Permitir que cada cliente organize os widgets da home conforme a rotina da operacao.",
    problem:
      "Hoje a home precisa servir perfis muito diferentes e nao entrega a mesma utilidade para lideranca, operacao e atendimento.",
    businessImpact:
      "Aumenta o uso da home como cockpit diario e reduz o tempo para encontrar indicadores prioritarios.",
    proposedSolution:
      "Criar widgets configuraveis por usuario com opcoes de ordem, visibilidade e destaque.",
    category: "Home",
    author: "David Silva",
    status: "planned",
    votes: 18,
    watchers: 7,
    createdAt: "2026-03-05T10:00:00.000Z",
    updatedAt: "2026-03-16T15:20:00.000Z",
    comments: [
      {
        id: "comment-1",
        author: "Time de Produto",
        message: "Tema ja entrou em discovery e vai para refinamento na proxima janela.",
        createdAt: "2026-03-14T13:30:00.000Z",
      },
    ],
  },
  {
    id: "idea-2",
    title: "Notificacao quando item da esteira entrar em producao",
    summary: "Avisar stakeholders quando uma entrega relevante virar PRODUCTION.",
    problem:
      "O cliente ainda precisa entrar no portal para descobrir que algo foi publicado, o que reduz a percepcao de proatividade.",
    businessImpact:
      "Melhora transparencia, reduz follow-up manual e reforca confianca na comunicacao de entrega.",
    proposedSolution:
      "Adicionar notificacao in-app e opcionalmente por e-mail para itens acompanhados.",
    category: "Notificacoes",
    author: "Marina Lopes",
    status: "under_review",
    votes: 27,
    watchers: 12,
    createdAt: "2026-03-02T09:20:00.000Z",
    updatedAt: "2026-03-15T18:00:00.000Z",
    comments: [
      {
        id: "comment-2",
        author: "CX",
        message: "Tema recorrente em contas enterprise. Alta relevancia para comunicacao de valor.",
        createdAt: "2026-03-10T11:10:00.000Z",
      },
    ],
  },
  {
    id: "idea-3",
    title: "Filtro por risco na visao executiva",
    summary: "Adicionar uma camada de risco para destacar itens com maior criticidade.",
    problem:
      "A lideranca consegue ver status, mas ainda falta uma leitura objetiva do que exige atencao imediata.",
    businessImpact:
      "Facilita reunioes executivas e reduz o tempo gasto para identificar gargalos importantes.",
    proposedSolution:
      "Criar um atributo de risco com alto, medio e baixo e refletir esse recorte nos cards e na tabela.",
    category: "Relatorio Executivo",
    author: "Luan Matos",
    status: "new",
    votes: 9,
    watchers: 4,
    createdAt: "2026-03-16T08:10:00.000Z",
    updatedAt: "2026-03-16T08:10:00.000Z",
    comments: [],
  },
];
