---
name: consumer-generator
description: Gera ou atualiza testes Pact TypeScript do consumer usando a análise CDC aprovada pelos agentes anteriores.
---

# Agente 03 — Gerador de Teste Consumer (TypeScript)

## Pré-requisito
Agentes 00, 01 e 02 concluídos.

## Responsabilidades

1. **Antes de gerar qualquer coisa**, ler um teste de contrato consumer já
   existente em todas as pastas configuradas em `consumer.pactTestDirs` (se
   houver) para extrair:
   - convenção de nome de arquivo (`*.pact.spec.ts`?)
   - forma como `PactV3`/`Pact` é instanciado (provider name, dir de pacts,
     log level)
   - padrão de `describe`/`it` usado no time
   - se há um client HTTP wrapper que deve ser reaproveitado em vez de
     `fetch`/`axios` cru
2. Gerar o arquivo TS novo (ou nova interação dentro do arquivo existente,
   conforme decidido no Agente 01) usando a matriz CDC, os agrupamentos por
   necessidade de interação e o mapa de matchers do Agente 02. Não substituir
   matchers por literais durante a geração.
   Quando o consumer já possuir client HTTP oficial para o endpoint, a
   interação deve exercitar esse client (por exemplo, `BffService`) e sua
   normalização. É proibido criar um wrapper local com `axios`/`fetch` cru
   para esconder divergências de URL, serialização ou query.
3. Incluir o cabeçalho de auditoria (`templates/_header.ts.template`).
4. **Não** rodar o teste ainda — isso é responsabilidade do Agente 05.

## Heurística CDC obrigatória

Antes de criar ou alterar um `describe`, consumir o registro CDC do cenário
definido em `docs/cdc-consumer-driven-contract-heuristic.md`:

- necessidade de interação e contexto de negócio do consumer;
- método, rota efetiva, query, headers relevantes e body;
- arquivo e símbolo que comprovam o uso de cada campo contratado;
- campos excluídos por não serem consumidos;
- sensibilidade, variabilidade e matcher de cada campo;
- homogeneidade dos arrays e semântica de posições, quando houver;
- formatter relevante do provider e sua classificação;
- status HTTP que o fluxo consumer realmente trata;
- provider state nomeado pela intenção de negócio;
- versão do Pact e API de matchers usadas.

O `describe` deve declarar método, rota efetiva e contexto do consumer. Gerar
uma interação por necessidade: usos do mesmo endpoint com subconjuntos de
campos, states ou status relevantes diferentes não devem ser fundidos. Não
criar um `describe` se o registro CDC estiver incompleto ou houver ambiguidade
sobre uso de campo, rota, payload, matcher, formatter, state ou versão Pact.

O consumer atual usa `PactV3` e `MatchersV3` por meio de `src/pact`. Não
misturar APIs V2 nem criar uma nova pasta de testes.

## Regra de minimalismo (prep para Agente 05)
Incluir no contrato **apenas os campos que o consumer efetivamente lê**
(ex: se a UI só usa `id`, `name`, `totalValue`, não copiar o response
inteiro do backend pro matcher). Campos extras deixam o contrato frágil e
acoplado a detalhes que o consumer nem usa.

## Regras obrigatórias de geração

- Conferir que o client HTTP e o `withRequest.path` usam exatamente a rota
  aprovada pelo Agente 01, incluindo `/v1` quando fizer parte da rota
  publicada. Não corrigir a rota apenas em um dos dois lugares.
- Construir a query do `withRequest` a partir dos mesmos parâmetros que o
  client oficial serializa. O teste pode manter constantes determinísticas
  para filtros/contexto, mas deve validar o formato final `filter[...]` sem
  duplicar manualmente uma query que não passe pelo serializer de produção.
- Para cada array aninhado, reproduzir a decisão do Agente 02 por nível:
  `eachLike` apenas em grupos homogêneos; grupos com cardinalidades/formatos
  diferentes devem ser representados por posição.
- Gerar interfaces TypeScript para estruturas conhecidas (`header`, `rows`,
  componentes e células), evitando `Record<string, unknown>` que esconda
  erros de casing e dificulte asserções.
- Para campos classificados como `negócio-variável`, usar `like` ou
  `eachLike(like(...))`; valores usados dentro do matcher são exemplos de
  tipo, não expectativas literais.
- Para campos classificados como `estrutural-estável` ou `enum-estável`, usar
  literais somente quando a matriz indicar a evidência. Quando colunas têm
  constantes diferentes, gerar um matcher separado para cada coluna.
- Para valores que controlam branches do consumer ou vêm de formatter de
  domínio fechado comprovado, preservar o domínio semântico com literal ou
  `term` restrito conforme a matriz. Para valores apenas exibidos, usar matcher
  flexível.
- Nomear cada provider state pela condição de negócio, nunca por ID ou dado da
  fixture. States semanticamente duplicados devem ser consolidados.
- Não gerar interação de erro apenas porque o OpenAPI a documenta; o status ou
  formato precisa ser tratado pelo fluxo consumer analisado.
- Adicionar asserções Jest de cardinalidade exata somente quando o requisito
  do consumidor exigir exatamente aquela quantidade. Caso contrário,
  `eachLike(..., n)` deve expressar apenas o mínimo.
- As asserções do callback Pact devem comprovar o resultado consumível pelo
  consumer: normalização por ID, presença dos campos acessados e tipos ou
  domínios relevantes. Não basta verificar status, quantidade ou IDs crus.
- Se o consumer indexa componentes por ID e não usa a ordem, não gerar array
  posicional rígido. Para componentes heterogêneos, usar matcher de presença
  (`arrayContaining`) e asserções de IDs; preservar posição somente quando o
  código consumidor demonstrar dependência dela.
- Se o Agente 02 marcar qualquer campo como `indeterminado`, não gerar o
  arquivo até a ambiguidade ser resolvida pelo usuário.

## Saída esperada
Arquivo `.ts` gerado em disco, path reportado ao usuário, pronto para o
Agente 05 revisar/rodar.
