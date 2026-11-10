# Mudanças pendentes nos repositórios alvo

Este documento registra mudanças necessárias identificadas durante a análise.
Elas ficam separadas da resolução dos lockfiles em conflito do MFE.

## MFE: resolver o helper `pact`

Os testes consumer existentes importam:

```ts
import { createPact, eachLike, like, regex } from 'pact';
```

O MFE possui `src/pact/index.ts`, mas o alias `pact` não está configurado no
Jest Pact nem no TypeScript de testes. Registrar o alias `^pact$` apontando para
`<rootDir>/src/pact/index.ts` no `jest.pact.config.js` e no tipo de resolução
usado pelos testes, ou substituir os imports pelo caminho local equivalente.

Manter uma única convenção e continuar usando `PactV3`/`MatchersV3`.

## MFE/BFF: alinhar `brand_family`

O BFF declara `brand_family` no DTO e no controller. Os cenários consumer
existentes usam `brandFamily` em pelo menos uma interação. Alinhar o client e o
teste consumer ao nome público `brand_family`, ou obter uma decisão explícita
do time para alterar o contrato do BFF.

Não mascarar essa divergência com um matcher mais permissivo: o nome do query
parameter faz parte do contrato.

## MFE: lockfiles

`yarn.lock` e `package-lock.json` estão com marcadores de merge não resolvidos.
Resolver isso em uma alteração separada, preservando as mudanças existentes,
antes de executar instalação limpa ou validar o pipeline no CI.

## BFF

Não criar uma nova pasta Pact. Reutilizar:

- `test/contract/provider`
- `test/contract/fixtures`
- `test/contract/states`
- `test/contract/helpers`

O resolvedor de pact local existente é compatível com o layout deste workspace.

## Swagger/OpenAPI

Não há um arquivo OpenAPI versionado neste workspace. Fornecer um JSON/YAML
local sanitizado antes do Agente 01. O pipeline não deve buscar Swagger em URL
remota nem inferir silenciosamente o documento a partir dos decorators NestJS.
