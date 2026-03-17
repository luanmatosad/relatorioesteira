# Especificacao Tecnica do Portal de Clientes

## 1. Escopo desta especificacao

Este documento traduz a proposta funcional do portal para uma base tecnica implementavel em:

- Next.js
- TypeScript
- Ant Design
- React Query
- React Hook Form
- Zod

Escopo desta fase:

- modulo de Relatorio Executivo com Google Sheets como fonte oficial
- base estrutural do modulo de Sugestoes e Votacao
- contratos de API
- modelo de dados
- backlog tecnico inicial

---

## 2. Arquitetura de alto nivel

### 2.1 Camadas

1. Frontend web

- responsavel pela experiencia do usuario
- renderiza dashboards, tabelas, filtros e detalhes
- usa React Query para consulta e refresh

2. API interna do Next.js

- protege credenciais do Google
- consome a Google Sheets API no server-side
- normaliza os dados da planilha
- expõe endpoints prontos para a UI

3. Fonte de dados

- Google Sheets
- planilha oficial de acompanhamento operacional

4. Persistencia futura

- inicialmente opcional para o modulo de relatorio
- recomendada para historico, auditoria e analytics em fases seguintes

### 2.2 Fluxo de dados

1. usuario acessa a pagina do relatorio
2. frontend chama `/api/report/summary` e `/api/report/items`
3. API server-side consulta a Google Sheet
4. dados brutos sao normalizados
5. status sao agrupados para leitura executiva
6. resposta tratada chega ao frontend
7. UI exibe cards, filtros, tabela e ultima sincronizacao

---

## 3. Fonte de dados: Google Sheets

### 3.1 Identificacao da planilha

- spreadsheetId: `1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA`

### 3.2 Colunas esperadas

- `Tipo de item`
- `Chave`
- `Resumo`
- `Responsavel`
- `Status`
- `Criado`
- `Atualizado(a)`
- `Categorias`

### 3.3 Regras de ingestao

- a primeira linha deve ser tratada como cabecalho
- linhas sem `Resumo` devem ser ignoradas ou marcadas como inconsistentes
- `Chave` deve ser usada como identificador unico de negocio
- datas devem ser convertidas para ISO internamente
- `Categorias` deve aceitar um ou mais valores

### 3.4 Estrategia de sincronizacao

MVP:

- consulta server-side sob demanda
- cache de curta duracao de 2 a 5 minutos
- botao de atualizar no frontend
- revalidacao quando a janela retomar foco

Fase seguinte:

- rotina agendada para espelhar a planilha em banco
- historico por snapshot
- alertas para falhas de sincronizacao

---

## 4. Mapeamento de status

### 4.1 Status operacionais da planilha

- `Tarefas pendentes`
- `Em andamento`
- `AGUARDANDO REVISAO`
- `Concluido - Em Espera`
- `SUBIR PARA PRODUCAO`
- `PRODUCTION`

### 4.2 Status consolidados da UI

| Status original | Status consolidado |
|---|---|
| Tarefas pendentes | not_started |
| Em andamento | in_progress |
| AGUARDANDO REVISAO | in_progress |
| Concluido - Em Espera | ready_for_release |
| SUBIR PARA PRODUCAO | ready_for_release |
| PRODUCTION | production |

### 4.3 Labels amigaveis para exibicao

| Codigo | Label UI |
|---|---|
| not_started | Nao iniciado |
| in_progress | Em execucao |
| ready_for_release | Pronto para publicacao |
| production | Entregue em producao |
| unknown | Nao mapeado |

### 4.4 Regra de resiliencia

Se um novo status aparecer na planilha:

- o sistema nao deve quebrar
- o status deve cair em `unknown`
- o item continua visivel
- o backend registra aviso de status nao mapeado

---

## 5. Modelo de dados

### 5.1 Tipos TypeScript sugeridos

```ts
export type RawSheetRow = {
  "Tipo de item"?: string;
  "Chave"?: string;
  "Resumo"?: string;
  "Responsavel"?: string;
  "Status"?: string;
  "Criado"?: string;
  "Atualizado(a)"?: string;
  "Categorias"?: string;
};

export type DeliveryStatusGroup =
  | "not_started"
  | "in_progress"
  | "ready_for_release"
  | "production"
  | "unknown";

export type DeliveryItem = {
  id: string;
  key: string;
  itemType: string;
  summary: string;
  owner: string | null;
  originalStatus: string;
  groupedStatus: DeliveryStatusGroup;
  createdAt: string | null;
  updatedAt: string | null;
  categories: string[];
  agingDays: number | null;
};

export type ReportSummary = {
  totalItems: number;
  totalProduction: number;
  totalInProgress: number;
  totalReadyForRelease: number;
  totalNotStarted: number;
  totalUnknown: number;
  staleItems: number;
  lastSyncAt: string;
  groupedStatusBreakdown: Array<{
    status: DeliveryStatusGroup;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  ownerBreakdown: Array<{
    owner: string;
    count: number;
  }>;
};
```

### 5.2 Schema Zod sugerido

```ts
import { z } from "zod";

export const rawSheetRowSchema = z.object({
  "Tipo de item": z.string().optional(),
  "Chave": z.string().optional(),
  "Resumo": z.string().optional(),
  "Responsavel": z.string().optional(),
  "Status": z.string().optional(),
  "Criado": z.string().optional(),
  "Atualizado(a)": z.string().optional(),
  "Categorias": z.string().optional(),
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
  categories: z.array(z.string()),
  agingDays: z.number().nullable(),
});
```

---

## 6. Contratos de API

### 6.1 `GET /api/report/items`

Objetivo:

- retornar a lista tratada de itens da esteira

Query params sugeridos:

- `status`
- `originalStatus`
- `category`
- `owner`
- `itemType`
- `updatedFrom`
- `updatedTo`
- `search`
- `page`
- `pageSize`
- `sortBy`
- `sortOrder`

Exemplo de resposta:

```json
{
  "data": [
    {
      "id": "ABC-123",
      "key": "ABC-123",
      "itemType": "Historia",
      "summary": "Ajustar calculo de ferias",
      "owner": "Maria",
      "originalStatus": "AGUARDANDO REVISAO",
      "groupedStatus": "in_progress",
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-15T00:00:00.000Z",
      "categories": ["Ferias"],
      "agingDays": 14
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 1,
    "lastSyncAt": "2026-03-16T21:00:00.000Z"
  }
}
```

### 6.2 `GET /api/report/summary`

Objetivo:

- retornar os KPIs e agregacoes do relatorio executivo

Exemplo de resposta:

```json
{
  "data": {
    "totalItems": 248,
    "totalProduction": 103,
    "totalInProgress": 61,
    "totalReadyForRelease": 24,
    "totalNotStarted": 56,
    "totalUnknown": 4,
    "staleItems": 18,
    "lastSyncAt": "2026-03-16T21:00:00.000Z",
    "groupedStatusBreakdown": [
      { "status": "production", "count": 103 },
      { "status": "in_progress", "count": 61 }
    ],
    "categoryBreakdown": [
      { "category": "eSocial", "count": 77 },
      { "category": "Admissao", "count": 54 }
    ],
    "ownerBreakdown": [
      { "owner": "Maria", "count": 36 },
      { "owner": "Joao", "count": 29 }
    ]
  }
}
```

### 6.3 `POST /api/report/refresh`

Objetivo:

- forcar uma nova leitura da planilha

Uso:

- opcional para MVP
- util quando existir cache server-side

Resposta:

```json
{
  "success": true,
  "lastSyncAt": "2026-03-16T21:02:00.000Z"
}
```

### 6.4 APIs futuras do modulo de sugestoes

- `GET /api/ideas`
- `POST /api/ideas`
- `GET /api/ideas/:id`
- `POST /api/ideas/:id/vote`
- `POST /api/ideas/:id/comments`

---

## 7. Estrutura frontend sugerida

```txt
src/
  app/
    (portal)/
      layout.tsx
      page.tsx
      relatorio-executivo/page.tsx
      esteira/page.tsx
      sugestoes/page.tsx
      sugestoes/[id]/page.tsx
    api/
      report/
        items/route.ts
        summary/route.ts
        refresh/route.ts
  features/
    executive-report/
      components/
        ExecutiveSummaryCards.tsx
        DeliveryFilters.tsx
        DeliveryTable.tsx
        LastSyncBadge.tsx
        StatusBreakdownChart.tsx
        CategoryBreakdown.tsx
      hooks/
        useReportItems.ts
        useReportSummary.ts
        useRefreshReport.ts
      services/
        getReportItems.ts
        getReportSummary.ts
        refreshReport.ts
      lib/
        normalize-sheet-row.ts
        map-status.ts
        parse-categories.ts
        parse-date.ts
        build-summary.ts
      schemas/
        report.schema.ts
      types/
        report.types.ts
    feature-requests/
      components/
      hooks/
      services/
      schemas/
      types/
  shared/
    components/
      PageHeader.tsx
      MetricCard.tsx
      StatusTag.tsx
      EmptyState.tsx
      ErrorState.tsx
      DataTable.tsx
    layouts/
      PortalShell.tsx
  services/
    google/
      sheets.ts
  types/
```

---

## 8. Componentes de interface

### 8.1 Tela Home

Blocos:

- cards de resumo
- itens atualizados recentemente
- distribuicao por categoria
- atalhos para relatorio e sugestoes

### 8.2 Tela Relatorio Executivo

Componentes:

- `PageHeader`
- `LastSyncBadge`
- `ExecutiveSummaryCards`
- `DeliveryFilters`
- `StatusBreakdownChart`
- `CategoryBreakdown`
- `DeliveryTable`

### 8.3 Tela Esteira de Entregas

Componentes:

- filtro expandido
- tabela com paginacao
- drawer com detalhe do item

Colunas principais:

- chave
- resumo
- tipo de item
- categoria
- responsavel
- status
- criado
- atualizado

### 8.4 Tela Sugestoes

MVP estrutural:

- lista de sugestoes
- filtros
- CTA para nova sugestao

---

## 9. Regras de negocio

### 9.1 Relatorio

- `Chave` e o identificador principal
- `Resumo` e obrigatorio para exibir o item
- `Status` original deve ser sempre preservado
- `Atualizado(a)` deve alimentar a percepcao de frescor do dado
- um item sem categoria deve cair em `Sem categoria`

### 9.2 Itens desatualizados

Regra sugerida:

- considerar stale todo item sem atualizacao ha mais de 7 dias e que nao esteja em `production`

### 9.3 Ordenacao padrao

Na esteira:

1. itens em execucao
2. itens prontos para publicacao
3. itens nao iniciados
4. itens em producao
5. mais recentemente atualizados primeiro

---

## 10. Integracao com Google Sheets

### 10.1 Credenciais

Opcoes recomendadas:

- service account do Google Cloud
- compartilhamento da planilha com o e-mail da service account

### 10.2 Variaveis de ambiente previstas

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA
GOOGLE_SHEETS_RANGE=A:H
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

### 10.3 Responsabilidades do modulo `services/google/sheets.ts`

- autenticar com Google API
- buscar linhas da planilha
- retornar array bruto
- isolar a dependencia externa do restante da aplicacao

---

## 11. Observabilidade e confianca

### 11.1 Logging

Registrar:

- falha de autenticacao
- falha de leitura da planilha
- quantidade de linhas lidas
- quantidade de linhas validas
- status nao mapeados

### 11.2 UX de confianca

A UI deve exibir:

- horario da ultima sincronizacao
- mensagem de erro amigavel se a leitura falhar
- opcao de tentar novamente

---

## 12. Backlog tecnico inicial

### Epic 1. Fundacao do projeto

1. criar projeto Next.js com TypeScript e Ant Design
2. configurar App Router
3. configurar React Query
4. criar layout base do portal

### Epic 2. Integracao com Google Sheets

1. configurar credenciais server-side
2. implementar cliente de leitura da planilha
3. criar normalizador de linhas
4. criar mapeamento de status
5. implementar endpoints `/api/report/items` e `/api/report/summary`

### Epic 3. Modulo Relatorio Executivo

1. criar pagina do relatorio
2. implementar cards de resumo
3. implementar filtro por status, categoria, responsavel e periodo
4. implementar tabela da esteira
5. implementar badge de ultima sincronizacao
6. tratar loading, vazio e erro

### Epic 4. Home do portal

1. criar home com resumo executivo
2. adicionar atalhos para modulos
3. destacar itens atualizados recentemente

### Epic 5. Base do modulo de sugestoes

1. desenhar modelo de dados de sugestoes
2. criar tela de listagem
3. criar tela de detalhe
4. preparar fluxo de criacao

---

## 13. Criterios de aceite do MVP de relatorio

- o sistema deve ler a planilha oficial sem expor credenciais no frontend
- toda atualizacao da planilha deve refletir no portal apos o ciclo de sincronizacao
- o usuario deve conseguir filtrar por status, categoria, responsavel e periodo
- os status operacionais devem aparecer agrupados em status executivos
- o relatorio deve mostrar claramente a ultima sincronizacao
- a tabela deve exibir os campos principais da planilha
- erros de leitura devem ser tratados sem quebrar a pagina

---

## 14. Recomendacao de implementacao

Ordem mais segura para iniciar:

1. estruturar projeto Next.js
2. conectar na Google Sheet
3. validar e normalizar dataset real
4. subir primeiro a esteira de entregas
5. depois montar os cards e agregacoes executivas
6. por fim iniciar o modulo de sugestoes

Essa ordem reduz risco porque garante que a camada de dados esteja confiavel antes da camada visual executiva.
