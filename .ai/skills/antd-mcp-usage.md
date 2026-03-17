# Skill: Ant Design MCP Usage

Esta skill garante que o agente utilize corretamente o servidor MCP do Ant Design.

---

## Objetivo

Evitar alucinação de API e props dos componentes Ant Design.

---

## MCP Server

Configuração esperada:

{
  "mcpServers": {
    "antd-components": {
      "command": "npx",
      "args": ["-y", "@jzone-mcp/antd-components-mcp"]
    }
  }
}

---

## Quando consultar MCP

Sempre que a tarefa envolver:

- Form
- Table
- Modal
- Drawer
- Layout
- Tabs
- Select
- DatePicker
- Grid

---

## O que consultar no MCP

- nome correto do componente
- props disponíveis
- exemplos oficiais
- composição recomendada

---

## Regras

Nunca:

- inventar props
- inventar componentes
- usar APIs antigas

Sempre:

- seguir documentação oficial
- priorizar padrões Ant Design
