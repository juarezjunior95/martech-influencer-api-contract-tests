# AGENTS.md — Pipeline de Geração Automática de Testes de Contrato (Pact)

> Lido por Codex CLI e Cursor. Para Claude Code, ver `CLAUDE.md` (aponta pra cá).

## Objetivo

A partir de um Swagger/OpenAPI e de um response real (sanitizado), gerar
automaticamente testes de contrato Pact (consumer + provider) em TypeScript,
reaproveitando a estrutura já existente nos repositórios:

- **Consumer**: `martech-theloophub-mfe`
- **Provider**: `martech-oneway-reports-bff`

O pipeline é uma sequência de agentes (`skills/NN-nome/SKILL.md`), executados
NESTA ORDEM. Nenhum agente pode pular o Agente 00 (segurança).

Para preparar um novo par Consumer/Provider antes de gerar contratos, existe o
agente opcional `skills/onboarding/SKILL.md`. Ele configura somente a
infraestrutura Pact; a primeira interação real continua obrigatoriamente no
Agente 00 e segue a ordem abaixo.

## Ordem de execução

```
00-security-gatekeeper   → valida/sanitiza input (BLOQUEIA se falhar)
01-endpoint-mapper       → lê swagger, lista endpoints, pergunta qual usar
02-response-analyzer     → lê response, decide matchers Pact
03-consumer-generator    → gera *.pact.spec.ts (consumer)
04-provider-generator    → gera *.pact.verify.spec.ts (provider)
05-review-and-run        → valida campos mínimos, roda testes, abre PR
```

## Onboarding de novos projetos

Acione o agente `onboarding` quando o usuário quiser preparar do zero um par de
repositórios dentro de `repositorios-consumer-provider`. Ele deve perguntar
explicitamente qual é o Consumer e qual é o Provider, validar os dois paths e
comparar sua estrutura com o par de referência de `config/projects.json` antes
de alterar qualquer arquivo. O onboarding não publica contratos e não substitui
nenhuma etapa 00–05.

## Regras globais (valem para TODOS os agentes)

1. **Nunca** ler arquivos de segredo: `.env*`, `appsettings*.json`,
   `**/secrets/**`, variáveis de ambiente de CI. Se precisar de auth,
   reutilizar o padrão de mock existente (`loginOneWayReports` com
   `cy.session()`), nunca token/credencial literal.
2. **Nunca** publicar automaticamente no Pact Broker. Geração é sempre local;
   publish/`can-i-deploy` ficam no pipeline de CI existente, disparado só
   após merge humano.
3. **Nunca** dar push direto em branch protegida (`main`/`master`/`develop`).
   O Agente 05 sempre abre PR.
4. Todo arquivo `.ts` gerado recebe o cabeçalho de auditoria definido em
   `templates/_header.ts.template`.
5. Reaproveitar SEMPRE a estrutura de teste já existente no repo alvo
   (nomes de pastas, convenção de `describe`, setup de `PactV3`/`Pact`,
   provider states já cadastrados) — nunca criar convenção nova sem
   perguntar ao usuário.
6. Se qualquer agente encontrar ambiguidade (ex: campo pode ser `like` ou
   `eachLike`, versão do Pact spec não está clara), ele PARA e pergunta —
   nunca assume silenciosamente.
7. O Agente 02 deve aplicar a heurística CDC documentada em
   `docs/cdc-consumer-driven-contract-heuristic.md`: primeiro comprovar no
   código do consumer quais campos são acessados, excluir os demais e só então
   classificar os campos contratados como estrutural-estável, enum-estável,
   negócio-variável ou indeterminado. Um único response não prova estabilidade
   de valor de negócio; esses campos usam `like`/`eachLike(like(...))` por
   padrão. Métricas como `27.2M`, `2.3M`, `11.7`, percentuais, datas, totais,
   variações e valores de gráficos nunca devem ser passadas como literais só
   porque apareceram no response fornecido.
8. Para arrays aninhados, `eachLike` só pode ser aplicado a grupos
   homogêneos. Grupos com formas ou cardinalidades diferentes devem ser
   representados por posição, e o segundo argumento de `eachLike` é sempre
   mínimo, não exato.
9. A rota do OpenAPI deve ser conferida contra o controller, o versionamento
   da aplicação e o harness do provider. Divergência de prefixo como `/v1`
   deve ser reportada e decidida explicitamente, nunca corrigida por
   inferência silenciosa.
10. Ao solicitar um response real, o Agente 02 deve solicitar junto o payload
    completo que o originou: método, rota, query params (incluindo chaves
    aninhadas como `filter[dt_ini]`), headers relevantes e request body quando
    houver. O payload e o response devem permanecer associados ao mesmo
    cenário e ser reproduzidos no `withRequest`; nunca misturar response de um
    payload com a query de outro cenário.
11. Todo teste de contrato criado deve ser derivado da heurística CDC. Antes de
    gerar o `describe`, o agente deve registrar: necessidade de interação do
    consumer, evidências de acesso/destructuring para cada campo contratado,
    classificação de sensibilidade, decisão de matcher, homogeneidade dos
    arrays, formatter relevante do provider e intenção de negócio do provider
    state. O `describe` deve identificar claramente método, rota e contexto do
    consumer. Interações de erro só entram quando o código consumidor trata o
    status correspondente; carga, latência e outras propriedades que não sejam
    expectativas funcionais do consumer ficam fora do Pact.

## Stack

- TypeScript
- `@pact-foundation/pact` (verificar versão já usada no repo antes de gerar
  código — não assumir V2 vs V3)
- Consumer runner: Jest/Vitest (o que já estiver configurado no MFE)
- Provider runner: Jest (padrão do NestJS BFF)

## Config de projetos

Ver `config/projects.json` para os paths relativos à raiz deste workspace e
metadados de onde já existe setup de Pact. O consumer possui múltiplas pastas
de testes; nunca presumir uma única pasta `src/tests/pact`.

Os paths configurados atualmente são:

- Consumer: `repositorios-consumer-provider/martech-theloophub-mfe`
- Provider: `repositorios-consumer-provider/martech-oneway-reports-bff`
- Pact local: `repositorios-consumer-provider/martech-theloophub-mfe/pacts`

O provider reutiliza `test/contract/provider`, `fixtures`, `states` e
`helpers`. A ausência do arquivo Pact antes da primeira execução do consumer é
normal; o provider só pode ser executado depois que o consumer gerar o pact.

Não há Swagger/OpenAPI versionado neste workspace. O Agente 00/01 deve
bloquear a execução se o usuário não fornecer um arquivo JSON/YAML local.
