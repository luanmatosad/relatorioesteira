# Google Sheets Setup

## Estado atual

Em 17 de marco de 2026, a planilha:

- `1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA`

nao responde a exportacao CSV anonima. O Google redireciona para login, entao o portal nao consegue ler a fonte real sem permissao adicional.

Hoje o sistema ja esta preparado para:

- usar Google Sheets API com service account
- tentar exportacao publica quando a planilha estiver realmente publicada
- exibir alerta visual quando cair em dados de demonstracao

## Caminho recomendado

### 1. Criar uma service account no Google Cloud

- abrir o projeto no Google Cloud Console
- ativar a API `Google Sheets API`
- criar uma `Service Account`
- gerar uma chave JSON

### 2. Compartilhar a planilha com a service account

Compartilhe a Google Sheet com o e-mail da service account com permissao de leitura.

### 3. Configurar variaveis locais

Crie um arquivo `.env.local` na raiz com:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA
GOOGLE_SHEETS_RANGE=A:I
GOOGLE_SHEETS_SHEET_NAME=
GOOGLE_SHEETS_GID=0
GOOGLE_CLIENT_EMAIL=service-account@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Observacoes sobre o dataset atual

Hoje a planilha publica expõe estas colunas:

- `Tipo de item`
- `Chave`
- `Resumo`
- `Responsável`
- `Status`
- `Criado`
- `Atualizado(a)`
- `Data limite`
- `Categorias`

O parser do portal ja foi ajustado para esse formato.

## Observacoes importantes

- `GOOGLE_SHEETS_SHEET_NAME` e opcional, mas ajuda quando a aba nao e a primeira
- `GOOGLE_SHEETS_GID` so afeta a tentativa de exportacao publica
- quando `GOOGLE_CLIENT_EMAIL` e `GOOGLE_PRIVATE_KEY` estiverem preenchidos, o sistema prioriza Google API

## Como validar

1. subir o projeto com `npm run dev`
2. abrir `/relatorio-executivo`
3. verificar se o alerta mudou de `Fonte real ainda nao conectada` para `Fonte conectada`

## Alternativa menos recomendada

Se quiser evitar credenciais server-side, voce pode publicar a planilha para acesso anonimo em CSV. Nesse caso:

- a planilha precisa estar realmente publica
- o link de exportacao nao pode redirecionar para login
- essa abordagem e mais fraca em termos de seguranca e governanca
