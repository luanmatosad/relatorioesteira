# Skill: Next.js + Ant Design

Esta skill define o padrão de frontend web do projeto.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Ant Design
- React Hook Form
- Zod
- React Query (TanStack Query)

---

## Objetivo

Construir interfaces web escaláveis, consistentes e fáceis de manter.

---

## Estrutura recomendada

src/

app/

features/
users/
components/
hooks/
services/
types/
schemas/
pages/

shared/
components/
lib/
utils/
hooks/

services/

types/

---

## Convenções

Componentes
UserCard.tsx
UserTable.tsx
DashboardHeader.tsx

Hooks

useUsers.ts
useCreateUser.ts
Schemas
user.schema.ts

Tipos

user.types.ts
Serviços
getUsers.ts
createUser.ts
updateUser.ts

---

## Regras para UI

Antes de criar qualquer componente customizado:

verificar se existe equivalente em:

Ant Design

Antes de aplicar personalização visual ampla:

- perguntar qual é a cor primária do tema, se o projeto ainda não tiver esse valor definido
- se a intenção for usar o tema padrão do Ant Design, manter `colorPrimary` padrão (`#1677FF`) e evitar overrides globais desnecessários
- alinhar explicitamente se o usuário quer tema padrão, tema da marca ou uma variação customizada

Exemplos comuns:

Tabela
Formulários
Form
Input
Select
DatePicker
Ações
Button
Dropdown
Popover
Layouts
Layout
Row
Col
Space
Feedback
Alert
Message
Notification
Result
Empty

---

## Formulários

Preferir:

React Hook Form + Zod

Integração com Ant Design.

---

## Boas práticas

Separar:

UI
Lógica
Serviços

Nunca fazer:
API call dentro do componente visual
Sempre tratar:

- loading
- erro
- vazio

## Regras de conteúdo e encoding

- usar UTF-8 em textos, labels, mensagens, headings e descrições
- preservar acentuação correta em português
- revisar textos visíveis para evitar palavras sem acento por simplificação manual
