# contract-test-agents

Pipeline de agentes para gerar testes de contrato Pact (consumer +
provider) automaticamente a partir de um Swagger/OpenAPI, com regras de
segurança embutidas.

## Como rodar em cada ferramenta

### Claude Code
Coloque esta pasta na raiz do monorepo (ou como submódulo referenciado
pelos dois repositórios). `CLAUDE.md` aponta para `AGENTS.md`. Comece a
conversa pedindo: "siga o pipeline em AGENTS.md, agente 00 primeiro".

### Codex CLI
Lê `AGENTS.md` nativamente na raiz do projeto. Basta rodar `codex` dentro
desta pasta (ou apontando pra ela) e pedir para seguir o pipeline.

### Cursor
Cursor reconhece `AGENTS.md` nativamente em versões recentes. Para cobrir
também versões mais antigas, o projeto já inclui:
- `.cursor/rules/contract-tests.mdc` — regra `alwaysApply` que redireciona
  pro `AGENTS.md`
- `.cursorrules` — fallback em texto puro para versões bem antigas

Nenhum dos dois duplica as regras de verdade; ambos só apontam para
`AGENTS.md` + `skills/*/SKILL.md`, que continuam sendo a fonte única.

## Passo a passo de uso

1. Para preparar um novo par de projetos, acione o agente `onboarding`; ele
   pergunta os nomes do Consumer e Provider dentro de
   `repositorios-consumer-provider`, compara ambos com o setup atual e cria
   somente a infraestrutura Pact necessária.
2. Confira `config/projects.json`, que já contém os paths reais dos repos,
   runners, diretórios Pact e versões/API da lib Pact.
3. Forneça o arquivo do Swagger.
4. O Agente 00 valida/sanitiza; se aprovar, o Agente 01 lista os endpoints
   e pergunta qual você quer.
5. Forneça o response (já sem dados sensíveis reais, ou deixe o Agente 00
   sinalizar o que precisa mascarar).
6. Acompanhe as perguntas dos Agentes 02–04 sobre decisões não-triviais de
   matcher.
7. O Agente 05 roda os testes localmente e abre PR — merge é sempre manual.

## Por que essa estrutura

- Cada agente é um `SKILL.md` isolado e pequeno — mais fácil de auditar e
  ajustar do que um prompt monolítico.
- `AGENTS.md` como entrada única evita duplicar instruções entre
  Cursor/Codex/Claude Code (Claude Code só redireciona via `CLAUDE.md`).
- Segurança é um agente com poder de veto (00), não uma nota de rodapé.

## Não é escopo (ainda)
- Publicação automática no Pact Broker.
- Busca de swagger via URL remota.

## Layout atual dos repositórios

O consumer está em `repositorios-consumer-provider/martech-theloophub-mfe` e
usa Jest com `PactV3`/`MatchersV3`. Seus testes Pact ficam em múltiplas pastas
de serviços, atualmente `src/services/BffService/__tests__` e
`src/services/ImageService/__tests__`, com suporte compartilhado em `src/pact`.

O provider está em `repositorios-consumer-provider/martech-oneway-reports-bff`
e verifica contratos em `test/contract/provider`, reaproveitando as pastas
`fixtures`, `states` e `helpers`. A verificação local lê o pact gerado em
`martech-theloophub-mfe/pacts`; esse arquivo não precisa existir antes do teste
consumer.

As correções pendentes específicas dos repositórios alvo estão registradas em
[`docs/required-target-changes.md`](docs/required-target-changes.md). Elas não
devem ser misturadas à resolução dos lockfiles em conflito do MFE.
- Merge automático de PR.
