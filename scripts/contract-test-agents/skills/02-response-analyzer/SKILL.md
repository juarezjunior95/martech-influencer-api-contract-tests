---
name: response-analyzer
description: Aplica a heurística CDC para filtrar campos consumidos, analisar formatters e definir matchers Pact a partir de payload e response sanitizados.
---

# Agente 02 — Analisador de Response / Matchers

## Pré-requisito
Agente 00 aprovado, Agente 01 com endpoint escolhido.

## Responsabilidades

1. Solicitar ao usuário o response real do endpoint escolhido e, na mesma
   solicitação, pedir o payload completo que originou esse response: método,
   rota, query params (incluindo chaves aninhadas como `filter[dt_ini]`),
   headers relevantes e request body quando houver. O payload deve ser
   associado ao response e tratado como parte do cenário do contrato; não
   gerar matcher a partir do response sem registrar a requisição que o
   produziu. Tanto response quanto payload devem passar pelo filtro de
   sanitização do Agente 00 — se vierem direto aqui sem passar pelo 00, PARE e
   mande sanitizar antes.
2. Aplicar primeiro o **filtro de uso da heurística CDC** descrita em
   `docs/cdc-consumer-driven-contract-heuristic.md`:
   - partir dos `consumerCallSites` levantados pelo Agente 01 e seguir o dado
     até os componentes, hooks, selectors, transforms e helpers que realmente
     acessam seus campos;
   - registrar arquivo, símbolo, caminho completo do campo e tipo de uso
     (renderização, branch, transformação, iteração, indexação ou repasse);
   - quando houver repasse, continuar até o acesso efetivo;
   - não considerar declaração em interface, mock ou fixture como prova
     suficiente de consumo;
   - excluir do contrato todo campo sem acesso comprovado. Se o uso permanecer
     indeterminado, parar e solicitar revisão em vez de incluí-lo por cautela.
   - quando o endpoint é acionado por um hook/serviço existente, rastrear
     também a montagem da requisição até o client HTTP oficial. Registrar os
     parâmetros antes e depois da serialização (por exemplo, `viewtype` antes
     e `filter[viewtype]` na URL). Um teste Pact não pode ser baseado em um
     client `axios`/`fetch` criado apenas dentro do teste quando o consumer já
     possui um wrapper oficial reutilizável.
3. Confrontar somente os campos consumidos com o schema do swagger extraído no Agente 01:
   sinalizar divergências (campo no response que não está no swagger, ou
   vice-versa) e perguntar ao usuário qual fonte é a verdade.
4. Antes de escolher matchers, produzir uma **matriz CDC de campos** para
   cada campo contratado. A matriz deve registrar: caminho do campo, evidência
   de uso no consumer, tipo de uso, tipo observado, cardinalidade,
   sensibilidade, formatter do provider quando houver, evidência de
   estabilidade, classificação (`estrutural-estável`, `enum-estável`,
   `negócio-variável` ou `indeterminado`), matcher escolhido e confiança.

   Regras de evidência:

   - Um único response real **não prova** que um valor de negócio é constante.
     Sem `enum`/`const` no OpenAPI, documentação explícita ou múltiplos
     responses comparáveis, classifique o valor como `negócio-variável` e
     use matcher de tipo (`like`/`eachLike(like(...))`).
   - Chaves, casing, forma de objetos, nomes de colunas, IDs estruturais,
     unidades explicitamente estáveis e cardinalidade observada são
     candidatos a `estrutural-estável`, mas só use valor literal quando a
     estabilidade estiver documentada ou for requisito explícito do usuário.
   - Números, datas, percentuais, métricas, variações, escalas, labels de
     negócio e conteúdo de gráficos são variáveis por padrão. Não copie o
     valor do response como literal para validá-los.
   - Se a classificação depender de informação que não está disponível, pare
     e pergunte; não converta uma suposição em contrato rígido.

5. Para cada campo, decidir o matcher Pact seguindo este checklist — ele
   existe porque estes já foram bugs reais encontrados em produção:

   - **Casing**: o nome do campo no matcher deve bater exatamente com o
     casing do response real (`camelCase` vs `PascalCase` vs `snake_case`).
     Nunca assumir — comparar caractere a caractere.
   - **Arrays homogêneos vs heterogêneos**: use `eachLike(itemMatcher, n)`
     somente quando os itens daquele grupo tiverem a mesma forma. Para
     arrays aninhados, analise cada nível separadamente. Se grupos diferentes
     tiverem formas ou cardinalidades diferentes, represente-os por posição,
     por exemplo `rows: [eachLike(rowMatcher, 1), eachLike(rowMatcher, 3),
     eachLike(rowMatcher, 6)]`; não aplique `like([[rowMatcher]])` ao array
     inteiro. O segundo argumento de `eachLike` é quantidade mínima, nunca
     quantidade exata; cardinalidade exata deve ser uma asserção Jest somente
     quando for requisito do consumidor.
   - **Matchers específicos por campo estável**: se duas colunas têm valores
     estruturais diferentes (por exemplo, `backgroundColor`), crie matchers
     separados por coluna. Não reutilize um matcher com o valor da primeira
     coluna em todas as demais.
   - **Estrutura versus negócio**: use literais para estrutura estável
     comprovada (por exemplo, `title`, `id`, `children`, unidade fixa); use
     `like` para o tipo de valor variável e `eachLike(like(...), n)` para
     arrays homogêneos de valores variáveis.
   - **Semântica no consumer**: quando o valor dirige `if`, `switch`, enum ou
     outro branch, usar matcher que preserve o domínio relevante (`term` com
     regex restrita ou literal comprovado). Quando o valor só é exibido,
     transportado ou logado, preferir `like` com exemplo sanitizado.
   - **Formatter do provider**: para cada campo contratado, verificar se o
     fluxo do endpoint passa por `src/infrastructure/formatters`. Formatter de
     domínio fechado (`switch`, lookup, enum ou retornos literais finitos)
     autoriza exact/`term` compatível com o cenário; formatter de padrão fixo
     e valor variável autoriza `term` com regex do formato. Lógica complexa ou
     dependente de configuração/serviço externo é `indeterminado` e bloqueia a
     geração até revisão. A classificação comprovada do formatter tem
     prioridade sobre a inferência isolada do consumer.
   - **Versão da Pact spec**: verificar no `package.json`/setup existente
     do repo se o projeto usa Pact V2 (`Matchers.term`, `Matchers.like`,
     `Matchers.eachLike` do pacote `@pact-foundation/pact`) ou V3
     (`MatchersV3`, `PactV3`). Nunca misturar API V2 com V3 no mesmo teste.
   - **Nullable/opcional**: campos que podem vir `null` no swagger viram
     `Matchers.nullable(...)` ou equivalente V3, não simplesmente omitidos.
   - **Tipos primitivos**: `integer` → `Matchers.integer` (ou `like(number)`
     dependendo da versão), datas → `Matchers.iso8601DateTime` quando o
     swagger declarar `format: date-time`.

   - **Rota efetiva**: compare o path do OpenAPI com o controller e o
     versionamento configurado na aplicação (`/v1`, prefixo global e
     `enableVersioning`). Também verifique o harness do provider. Se a rota
     publicada e a rota do harness divergirem, registre a divergência e pare
     para decisão; nunca remova ou adicione `/v1` silenciosamente.

   - **Payload associado**: comparar o payload fornecido com o schema do
     endpoint e reproduzir exatamente método, rota, query, headers necessários
     e body no `withRequest`. Se o response foi obtido com parâmetros
     diferentes dos disponíveis, parar e solicitar confirmação; não misturar
     payload de um cenário com response de outro.
   - **Payload efetivo do consumer**: comparar os parâmetros do response
     fornecido com os produzidos pelo call site real (`useBffData`, service,
     serializer e filtros). Se houver parâmetros extras, ausentes ou nomes
     alternativos (`timeframe` vs `time_frame`, por exemplo), registrar a
     divergência e parar para revisão; não considerar os payloads equivalentes
     por inferência.

6. Depois de classificar todos os campos, agrupar por **necessidade de
   interação**: mesmo endpoint, subconjunto de campos e contexto de negócio
   podem compartilhar uma interação; subconjuntos, states ou status tratados
   de forma diferente geram interações separadas. Não criar contratos para
   status documentados no OpenAPI que o código consumer não trata.

7. Para responses tabulares ou com gráficos, aplicar adicionalmente:

   - criar tipos/interfaces para permitir asserções seguras, evitando
     `Record<string, unknown>` quando a estrutura é conhecida;
   - validar headers/colunas estáveis com a estrutura completa quando isso
     fizer parte do contrato;
   - usar matchers específicos para a primeira linha quando ela possuir
     semântica estrutural diferente das demais;
   - manter métricas, variações e escalas como matchers de tipo, nunca como
     valores exatos, salvo requisito explícito.

8. Se houver ambiguidade que o checklist não resolve, perguntar ao usuário
   — nunca "chutar" o matcher.

## Saída esperada
Uma matriz CDC de campos, o payload associado normalizado, os agrupamentos por
necessidade de interação e um mapa de campo → matcher prontos para o Agente 03.
A saída deve listar também campos excluídos por falta de uso, evidências de
acesso, formatters analisados e uma nota para cada decisão não trivial (ex.:
"array `items` é heterogêneo, usando matcher por item"; "valor classificado
como negócio-variável porque só há um response").
