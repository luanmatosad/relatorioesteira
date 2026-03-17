# Portal Interativo para Clientes

## 1. Visao do produto

Construir um portal B2B de relacionamento com clientes que una transparencia de entrega, alinhamento estrategico e participacao ativa na evolucao do produto.

O portal tera dois modulos principais:

1. Relatorio Executivo
2. Comunidade de Sugestoes e Votacao de Melhorias

Objetivo central:

- reduzir retrabalho em alinhamentos recorrentes
- aumentar percepcao de valor e confianca do cliente
- dar visibilidade do roadmap e da esteira de entregas
- criar um canal estruturado de escuta e priorizacao

---

## 2. Perfis de usuario

### 2.1 Stakeholder executivo do cliente

Busca:

- visao consolidada
- status rapido
- indicadores de valor
- previsibilidade

Necessidades:

- entender o que foi entregue, o que esta em andamento e o que vem a seguir
- visualizar riscos e bloqueios sem excesso de detalhe tecnico
- perceber evolucao continua da conta

### 2.2 Gestor operacional do cliente

Busca:

- acompanhamento mais detalhado
- dependencia entre entregas
- historico e proximos passos

Necessidades:

- filtrar por periodo, squad, tema, prioridade e status
- acessar evidencias, links, datas e responsaveis

### 2.3 Usuario engajado na melhoria do produto

Busca:

- sugerir melhorias
- votar em ideias existentes
- acompanhar andamento das sugestoes

Necessidades:

- evitar duplicidade
- ver transparencia sobre decisao e prioridade
- receber retorno claro sobre status das ideias

---

## 3. Proposta de valor por modulo

### 3.1 Modulo 1: Relatorio Executivo

Funciona como a principal area de acompanhamento da conta.

Entrega valor ao permitir:

- leitura executiva em poucos minutos
- profundidade sob demanda
- rastreabilidade de entregas
- conexao entre estrategia, roadmap e execucao

### 3.2 Modulo 2: Comunidade de Sugestoes

Funciona como um canal continuo de voz do cliente.

Entrega valor ao permitir:

- captura estruturada de melhorias
- validacao por interesse coletivo
- transparencia no processo de priorizacao
- fortalecimento da sensacao de co-criacao

---

## 4. Arquitetura da informacao

### Navegacao principal

- Home
- Relatorio Executivo
- Roadmap
- Esteira de Entregas
- Sugestoes e Votacao
- Comunicados e Atualizacoes
- Conta e Preferencias

### Home do portal

A home deve funcionar como cockpit do cliente.

Blocos recomendados:

- resumo do periodo
- principais entregas concluidas
- iniciativas em andamento
- proximos marcos
- top sugestoes em votacao
- alertas e comunicados

---

## 5. Modulo 1: Relatorio Executivo

### 5.0 Fonte de dados oficial

O Relatorio Executivo deve ser alimentado continuamente pela planilha Google Sheets informada como fonte oficial de operacao.

Fonte:

- Google Sheets: `1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA`

Estrutura atual das colunas:

- Tipo de item
- Chave
- Resumo
- Responsavel
- Status
- Criado
- Atualizado(a)
- Categorias

Implicacoes de produto:

- a planilha passa a ser o source of truth do modulo de relatorio
- qualquer alteracao na planilha precisa refletir no portal sem depender de atualizacao manual adicional
- o portal deve traduzir a planilha em uma experiencia executiva, sem perder rastreabilidade ao dado original

### 5.1 Estrutura da experiencia

#### A. Header executivo

- nome da conta
- periodo selecionado
- ultimo update
- CTA para exportar PDF
- CTA para compartilhar

#### B. Cards-resumo

- entregas concluidas no periodo
- entregas em andamento
- entregas planejadas
- risco ou dependencia critica
- satisfacao ou health score da conta

#### C. Timeline / roadmap visual

Visao horizontal por trimestre ou mes com:

- planejado
- em desenvolvimento
- entregue
- adiado

#### D. Esteira de entregas

Tabela ou lista expandivel com:

- tipo de item
- chave
- resumo
- categoria
- status
- responsavel
- data de criacao
- data da ultima atualizacao
- tempo em aberto
- links de apoio

#### E. Bloco de valor gerado

Secao orientada a CX, com leitura menos tecnica e mais orientada a resultado:

- ganhos operacionais
- melhoria de experiencia
- eficiencia
- reducao de friccao
- marcos relevantes

#### F. Riscos, dependencias e proximos passos

Secao curta e direta:

- risco identificado
- impacto
- acao de mitigacao
- owner
- proximo checkpoint

### 5.2 Mapeamento da planilha para a interface

#### Campos da planilha para campos do portal

- `Tipo de item` -> tipo de entrega
- `Chave` -> identificador e link de rastreabilidade
- `Resumo` -> titulo principal da entrega
- `Responsavel` -> owner da entrega
- `Status` -> status operacional e status agrupado da UI
- `Criado` -> data de entrada
- `Atualizado(a)` -> ultimo movimento
- `Categorias` -> tag funcional, trilha ou modulo de negocio

#### Agrupamentos de status para leitura executiva

Status operacionais da planilha:

- Tarefas pendentes
- Em andamento
- AGUARDANDO REVISAO
- Concluido - Em Espera
- SUBIR PARA PRODUCAO
- PRODUCTION

Status consolidados na UI:

- `Nao iniciado`: Tarefas pendentes
- `Em execucao`: Em andamento, AGUARDANDO REVISAO
- `Pronto para publicacao`: Concluido - Em Espera, SUBIR PARA PRODUCAO
- `Entregue em producao`: PRODUCTION

Essa camada de agrupamento e importante porque:

- simplifica a leitura para executivos
- preserva o status original para usuarios operacionais
- permite que cards, graficos e filtros trabalhem com menos ruido

### 5.3 Como o relatorio deve ser calculado

Com base na planilha, o portal deve gerar automaticamente:

- total de itens por status consolidado
- total de itens por categoria
- total de itens por responsavel
- itens atualizados no periodo selecionado
- itens concluidos no periodo selecionado
- aging por item com base em `Criado` e `Atualizado(a)`

KPIs recomendados no topo:

- itens em producao
- itens em execucao
- itens aguardando publicacao
- itens sem atualizacao recente

### 5.4 Regras especificas de UX para esse dataset

- exibir o `Status` original da planilha em tooltip ou detalhe expandido
- permitir filtro por `Categorias`, pois elas representam o recorte de negocio mais util ao cliente
- destacar `Atualizado(a)` para reforcar confianca no dado
- mostrar vazio orientado quando um filtro nao retornar itens
- priorizar leitura de resumo e categoria antes do detalhe operacional

### 5.2 Filtros essenciais

- periodo
- status
- categoria
- squad ou time
- prioridade
- tipo de entrega

Para esta primeira versao baseada na planilha, os filtros prioritarios devem ser:

- periodo por `Atualizado(a)` ou `Criado`
- status consolidado
- status original
- categoria
- responsavel
- tipo de item

### 5.3 Recursos de UX recomendados

- alternancia entre visao executiva e visao detalhada
- tooltips explicando termos
- drill-down sem perder contexto
- empty states instrutivos
- exportacao em PDF
- historico por periodo

Como o dataset vem de planilha, acrescentar:

- indicador de `ultima sincronizacao`
- CTA para `atualizar agora`, quando tecnicamente viavel
- aviso visual quando houver atraso de sincronizacao

---

## 6. Modulo 2: Comunidade de Sugestoes e Votacao

### 6.1 Estrutura da experiencia

#### A. Pagina principal de ideias

Com:

- busca global
- filtros por status, tema e popularidade
- ranking por votos
- ordenacao por recentes, mais votadas e em analise

#### B. Card de sugestao

Cada sugestao deve exibir:

- titulo
- descricao curta
- autor
- data
- quantidade de votos
- quantidade de comentarios
- status
- tag de categoria

#### C. Pagina de detalhe da sugestao

Com:

- descricao completa
- problema que resolve
- beneficio esperado
- comentarios
- historico de status
- resposta do time de produto
- CTA de voto

#### D. Fluxo de nova sugestao

Campos recomendados:

- titulo
- contexto do problema
- impacto no negocio
- frequencia da dor
- sugestao de solucao
- categoria

Antes de publicar:

- mostrar sugestoes similares
- incentivar voto em item existente
- reduzir duplicidade

### 6.2 Status recomendados para as ideias

- nova
- em analise
- planejada
- em desenvolvimento
- entregue
- nao priorizada

### 6.3 Regras de CX

- toda ideia precisa de feedback visivel
- toda mudanca de status deve ter justificativa curta
- sugestoes entregues devem apontar para release ou evidencia
- usuarios podem acompanhar suas sugestoes favoritas

---

## 7. Jornada ideal do usuario

### Jornada 1: Executivo

1. Acessa a home
2. Ve resumo do periodo e principais marcos
3. Entra no Relatorio Executivo
4. Exporta ou compartilha com outras liderancas

### Jornada 2: Gestor operacional

1. Acessa a Esteira de Entregas
2. Filtra por status e periodo
3. Abre uma entrega para ver detalhes
4. Acompanha proximos passos e dependencias

### Jornada 3: Cliente com sugestao

1. Acessa Sugestoes e Votacao
2. Pesquisa se a ideia ja existe
3. Vota em uma ideia existente ou cria nova
4. Recebe retorno e acompanha o status

---

## 8. Priorizacao funcional por MVP

### MVP fase 1

- autenticacao e escopo por cliente
- home com resumo executivo
- relatorio executivo com filtros basicos
- sincronizacao com Google Sheets
- roadmap visual derivado dos dados disponiveis
- esteira de entregas em tabela
- listagem de sugestoes
- criacao de nova sugestao
- votacao
- comentarios basicos
- status das sugestoes

### Fase 2

- notificacoes in-app e por e-mail
- exportacao PDF com layout executivo
- dashboard de valor gerado
- favoritos e acompanhamento de sugestoes
- moderacao e merge de duplicadas

### Fase 3

- analytics de engajamento
- segmentacao por perfil de usuario
- IA para resumir periodo e agrupar sugestoes similares
- recomendacoes automaticas de ideias relacionadas

---

## 9. Requisitos de UX e interface

### Principios

- clareza executiva primeiro
- profundidade sob demanda
- transparencia em cada status
- linguagem simples e orientada a negocio
- consistencia visual entre os dois modulos

### Padroes de interface

- cards para resumo
- tabs para alternar visoes
- timeline para roadmap
- table com filtros para esteira
- listagem em cards para sugestoes
- drawer ou modal para detalhes rapidos

### Estados obrigatorios

- loading
- vazio
- erro
- sucesso

### Acessibilidade

- contraste adequado
- navegacao por teclado
- labels claros
- feedback de acao nao dependente apenas de cor

---

## 10. Arquitetura frontend recomendada

Considerando as diretrizes do repositorio:

- Next.js com App Router
- TypeScript
- Ant Design
- React Query
- React Hook Form
- Zod

### 10.1 Arquitetura de integracao de dados

Como a origem do relatorio e uma Google Sheet, a arquitetura recomendada e:

1. Camada de ingestao

- leitura da planilha por Google Sheets API
- autenticacao por service account ou credencial server-side
- endpoint backend para normalizar o retorno

2. Camada de normalizacao

- padronizar nomes de campos
- converter datas
- tratar colunas vazias
- quebrar `Categorias` em lista quando houver multiplos valores
- mapear status operacional para status consolidado

3. Camada de exposicao para frontend

- endpoint interno como `/api/report/items`
- endpoint interno como `/api/report/summary`
- cache controlado com revalidacao curta

4. Camada de apresentacao

- React Query para busca e refresh
- filtros no client sobre dataset tratado ou por query params
- badge visivel com horario da ultima sincronizacao

### 10.2 Estrategia de atualizacao

Requisito essencial:

- quando a planilha for atualizada, o portal deve refletir a mudanca no sistema

Abordagem recomendada para MVP:

- sincronizacao automatica a cada poucos minutos no backend
- refresh manual pelo usuario no frontend
- revalidacao da pagina ao voltar para foco

Abordagem ideal em fase seguinte:

- webhook ou rotina agendada com polling curto
- persistencia local para historico e performance
- trilha de auditoria de mudancas por item

### 10.3 Observacao importante sobre roadmap

Com as colunas atualmente informadas pela planilha, o sistema consegue montar muito bem:

- esteira de entregas
- relatorio operacional
- resumo executivo por status, categoria e responsavel

Ja um roadmap estrategico por trimestre ou macro-iniciativa nao nasce de forma completa apenas com essas colunas.

Para um roadmap mais fiel, recomendo uma destas abordagens:

- usar `Categorias` como eixo tematico e agrupar por periodo de atualizacao
- adicionar no futuro colunas como `Previsao`, `Macrotema`, `Objetivo` e `Versao`

Enquanto essas colunas nao existirem, o componente de roadmap deve ser apresentado como `timeline de evolucao da esteira`, e nao como roadmap estrategico puro.

### Estrutura sugerida

```txt
src/
  app/
    (portal)/
      page.tsx
      relatorio-executivo/page.tsx
      roadmap/page.tsx
      esteira/page.tsx
      sugestoes/page.tsx
      sugestoes/[id]/page.tsx
  features/
    executive-report/
      components/
      hooks/
      services/
      types/
    roadmap/
      components/
      hooks/
      services/
      types/
    delivery-pipeline/
      components/
      hooks/
      services/
      types/
    feature-requests/
      components/
      hooks/
      services/
      schemas/
      types/
  shared/
    components/
    layouts/
    lib/
    hooks/
    utils/
  services/
  types/
```

### Componentes-chave

#### Shared

- `PortalShell`
- `PageHeader`
- `MetricCard`
- `StatusTag`
- `EmptyState`
- `ErrorState`
- `FilterBar`

#### Executive Report

- `ExecutiveSummaryCards`
- `RoadmapTimeline`
- `DeliveryTable`
- `ValueHighlights`
- `RisksAndNextSteps`

#### Feature Requests

- `IdeaList`
- `IdeaCard`
- `IdeaFilters`
- `IdeaDetail`
- `NewIdeaForm`
- `VoteButton`
- `StatusHistory`

### Modelo de dados inicial

#### Entrega

- id
- chave
- tipoItem
- titulo
- categoria
- statusOriginal
- statusConsolidado
- dataCriacao
- dataAtualizacao
- owner
- agingDias
- links

#### RoadmapItem

- id
- titulo
- periodo
- status
- objetivo
- dependencias

#### FeatureRequest

- id
- titulo
- descricao
- categoria
- status
- votos
- comentarios
- autor
- createdAt
- updatedAt

---

## 11. Regras de negocio recomendadas

- usuarios so visualizam dados do proprio cliente
- votos devem ser unicos por usuario por ideia
- sugestoes duplicadas podem ser mescladas pela administracao
- atualizacoes de status devem ficar auditaveis
- uma entrega pode aparecer no relatorio e no roadmap com representacoes diferentes
- a planilha Google Sheets e a fonte oficial do modulo de relatorio
- registros sem `Resumo` ou `Status` devem ser tratados como inconsistencias de origem
- `Chave` deve ser unica por item para evitar duplicidade na sincronizacao
- a sincronizacao deve armazenar o horario do ultimo processamento bem-sucedido

---

## 12. Metricas de sucesso

### Produto

- acessos mensais ao portal
- percentual de clientes ativos
- uso do modulo executivo
- taxa de conversao de visita para voto ou sugestao

### CX

- tempo medio para encontrar uma informacao
- reducao de alinhamentos operacionais repetitivos
- percepcao de transparencia
- satisfacao com o acompanhamento das entregas

### Inovacao

- numero de sugestoes criadas
- votos por cliente
- percentual de ideias respondidas
- percentual de ideias evoluidas para planejamento

---

## 13. Recomendacao de telas para desenhar primeiro

1. Home do portal
2. Relatorio Executivo
3. Esteira de Entregas
4. Lista de Sugestoes
5. Detalhe da Sugestao
6. Nova Sugestao

---

## 14. Recomendacao estrategica

Para ganhar adesao rapidamente, o portal deve nascer com forte foco em confianca e legibilidade executiva.

Ou seja:

- menos volume de informacao na primeira dobra
- mais contexto de negocio
- status claros e confiaveis
- retorno visivel para cada interacao do cliente

A combinacao dos dois modulos e forte porque equilibra:

- transparencia do que esta sendo entregue
- participacao no que pode ser melhorado

Isso transforma o portal de uma vitrine estatica em um canal continuo de relacionamento.
