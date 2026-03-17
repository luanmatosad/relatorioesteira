# Skill: React Native

Esta skill define o padrão mobile do projeto.

---

## Stack

- React Native
- TypeScript
- Expo (quando possível)
- React Navigation
- TanStack Query
- React Hook Form
- Zod

---

## Estrutura recomendada

src/

features/

navigation/

components/

hooks/

services/

theme/

types/

---

## Convenções

Componentes
UserCard.tsx
ProfileHeader.tsx
Hooks
useUser.ts
Serviços
user.service.ts

---

## Regras importantes

Não usar:

Ant Design web

em React Native.

Mobile tem padrões próprios.

---

## Boas práticas

Sempre considerar:

- safe area
- teclado
- diferentes tamanhos de tela
- performance

---

## Estados obrigatórios

Toda tela deve tratar:

- loading
- erro
- vazio
