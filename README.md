# Relatório Esteira

Portal de clientes construído com `Next.js + Ant Design` para acompanhar a esteira de entregas e centralizar sugestões de melhoria.

## Módulos

- `Relatório Executivo`: visão consolidada da operação com KPIs, status, categorias e exportação em PDF.
- `Esteira Detalhada`: visão operacional com filtros completos e detalhe por item.
- `Sugestões e Votação`: comunidade de ideias com criação, voto e comentários.

## Stack

- `Next.js 16` com App Router
- `React 19`
- `TypeScript`
- `Ant Design`
- `React Query`
- `React Hook Form`
- `Zod`
- `Google Sheets API` / exportação pública CSV

## Fonte de dados

O módulo de relatório lê a planilha Google Sheets definida em `.env`.

Colunas esperadas hoje:

- `Tipo de item`
- `Chave`
- `Resumo`
- `Responsável`
- `Status`
- `Criado`
- `Atualizado(a)`
- `Data limite`
- `Categorias`

Se a planilha pública falhar ou não estiver acessível, o sistema cai para dados de demonstração.

## Primeiros passos

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

3. Rode o projeto:

```bash
npm run dev
```

4. Acesse:

- `http://localhost:3000/relatorio-executivo`
- `http://localhost:3000/esteira`
- `http://localhost:3000/sugestoes`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Variáveis de ambiente

Consulte também [GOOGLE_SHEETS_SETUP.md](/Users/luanmatos/Desktop/relatoriosesteira/GOOGLE_SHEETS_SETUP.md).

```env
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_RANGE=A:I
GOOGLE_SHEETS_SHEET_NAME=
GOOGLE_SHEETS_GID=0
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

## Estrutura principal

```txt
src/
  app/
    relatorio-executivo/
    esteira/
    sugestoes/
    api/
  features/
    executive-report/
    feature-requests/
  shared/
  services/
```

## Deploy

O projeto está pronto para deploy em plataformas compatíveis com Next.js, incluindo Vercel.

Checklist mínimo:

1. Configurar as variáveis de ambiente da planilha.
2. Executar `npm run build`.
3. Publicar com `Node.js 20+`.

### Vercel

- framework: `Next.js`
- install command: `npm install`
- build command: `npm run build`
- output command: padrão do framework

## Estado atual

Já implementado:

- relatório com integração à planilha
- esteira detalhada
- exportação em PDF
- módulo de sugestões e votação
- navegação base do portal

Próximas evoluções sugeridas:

- persistência real das sugestões em banco
- autenticação e escopo por cliente
- home consolidada do portal
- notificações e acompanhamento de ideias
