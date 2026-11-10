# Heurística CDC (Consumer-Driven Contracts)

> Contexto: `martech-theloophub-mfe` (consumer) ↔
> `martech-oneway-reports-bff` (provider)
>
> Uso: referência obrigatória para os agentes do pipeline de geração
> automatizada de testes de contrato Pact.

## 1. Princípio central

Em Consumer-Driven Contracts, o consumer declara exatamente o que usa e espera
da API. Esse contrato passa a ser a expectativa que o provider deve satisfazer.

Neste pipeline, o contrato deve ser extraído do comportamento real do consumer
por análise estática do código — por exemplo, destructuring, acesso a
propriedades e branches condicionais. O schema completo do OpenAPI e o response
real são fontes auxiliares para conferir rota, tipos e exemplos; não autorizam
incluir automaticamente todos os campos retornados pelo provider.

## 2. Heurísticas centrais

1. **Só entra no contrato o que o consumer efetivamente acessa.** Se o
   componente lê 2 de 15 campos, o contrato expressa expectativa somente sobre
   esses 2 campos.
2. **Preferir matchers flexíveis.** Usar `like`, `eachLike` ou `term` em vez de
   valores exatos. Exact match só é apropriado quando o valor possui significado
   semântico fixo para a lógica do consumer.
3. **Nomear provider states por intenção de negócio.** Usar, por exemplo,
   `"user has active subscription"`, e não `"there is a user with id 123"`.
4. **Criar um contrato por necessidade de interação, não por endpoint.** Dois
   usos do mesmo endpoint que dependem de subconjuntos diferentes de campos
   geram interações separadas.
5. **Tratar heterogeneidade de array como sinal de alerta.** Não aplicar
   `eachLike` a itens com shapes diferentes.

## 3. Decisão de campo e matcher

| # | Condição | Subcondição | Ação | Justificativa |
| --- | --- | --- | --- | --- |
| 1 | Campo é lido pelo consumer e o AST confirma acesso/destructuring | — | Incluir no contrato | Se o consumer depende do campo, ele faz parte da expectativa |
| 2 | Campo não é lido pelo consumer | — | Excluir do contrato | Evita acoplamento a dados não usados |
| 3 | Campo incluído e primitivo | Valor direciona `if`, `switch`, enum ou outro branch | `term()` com regex restrita ou matcher/literal que preserve a semântica | A mudança pode quebrar a lógica do consumer |
| 4 | Campo incluído e primitivo | Valor só é exibido, transportado ou logado | `like(exemploDoTipo)` | Só a forma importa |
| 5 | Campo incluído e array homogêneo | Itens têm o mesmo shape | `eachLike(itemMatcher)` | O matcher representa corretamente o grupo |
| 6 | Campo incluído e array heterogêneo | A posição tem significado fixo | Array de matchers posicionais | Cada posição representa um papel diferente |
| 7 | Campo incluído e array heterogêneo | O shape varia por tipo, não por posição | União suportada pela versão Pact ou interações separadas por variante | Evita falsos positivos e negativos |
| 8 | Campo incluído e sensível | PII, token, credencial ou dado equivalente | Interromper e enviar ao Security Gatekeeper antes de persistir | Valor real sensível nunca deve entrar no contrato |
| 9 | Campo incluído e objeto aninhado | — | Aplicar recursivamente as regras 1–8 | A mesma heurística vale em profundidade |
| 10 | Projeto possui Pact V2/V3 | O teste mistura as duas APIs no mesmo body | Bloquear a geração e sinalizar erro de configuração | APIs de matcher incompatíveis não devem ser misturadas |
| 3a | Campo lido é output de formatter com domínio fechado | Enum, `switch`, lookup ou retorno literal finito | Exact match relevante ao cenário ou `term()` com união dos valores válidos | O domínio fechado é uma garantia estável do provider |
| 3b | Campo lido é output de formatter com padrão fixo e valor variável | Data, moeda, identificador formatado etc. | `term()` com regex do padrão | O formato é contrato; o valor exato não é |

### 3.1. Evidência de uso no consumer

Antes de analisar o response, localizar a chamada do endpoint e seguir o fluxo
do dado até seus consumidores. Registrar, para cada campo candidato:

- arquivo e símbolo que acessam ou fazem destructuring do campo;
- tipo de uso: renderização, transformação, branch, indexação, iteração ou
  encaminhamento para outro componente/função;
- cadeia de acesso completa, inclusive subcampos;
- contexto de negócio e status HTTP tratados pelo fluxo;
- campos apenas declarados em tipos, mocks ou fixtures, que não contam como
  prova de consumo sem um acesso no código executável.

Se o dado é encaminhado para outro componente ou helper, continuar a análise
até o ponto em que os campos são efetivamente lidos. Se não for possível provar
o uso, marcar o campo como indeterminado e solicitar revisão; não incluí-lo por
precaução.

### 3.2. Formatters do provider como segunda fonte de verdade

Campos processados por formatters de domínio fechado constituem um sinal
independente para decidir entre matcher semântico e genérico.

**Onde analisar:**
`martech-oneway-reports-bff/src/infrastructure/formatters`.

Para cada campo contratado:

1. Identificar se ele passa por um formatter antes da serialização.
2. Classificar o formatter:
   - **domínio fechado (3a):** `switch/case` finito, objeto de lookup, enum de
     TypeScript ou retorno pertencente a um conjunto literal finito;
   - **padrão fixo e valor variável (3b):** `Intl.NumberFormat`, formatação de
     datas, template literal com valor dinâmico, moeda, CPF ou telefone;
   - **indeterminado:** lógica condicional complexa, configuração externa,
     serviço externo ou qualquer implementação sem garantia clara.
3. Cruzar o formatter com o fluxo do endpoint para provar que ele produz o
   campo contratado.
4. Dar prioridade às regras 3a/3b sobre a inferência isolada do consumer,
   porque o formatter expressa a garantia que o provider mantém.
5. Encaminhar formatters indeterminados para revisão manual; não escolher
   `like()` silenciosamente.

A lista de formatters não é fixa neste documento. Ela deve ser levantada a
partir do código atual do provider em cada cenário.

## 4. Agrupamento de interações

| Condição | Ação |
| --- | --- |
| Mesmo endpoint, mesmo subconjunto de campos e mesmo contexto de negócio | Agrupar em uma interação Pact |
| Mesmo endpoint, subconjuntos diferentes entre consumers/componentes | Gerar interações separadas com descrições distintas |
| Mesmo endpoint e campos, mas provider state diferente | Gerar uma interação por state |
| Mesmo fluxo chama o endpoint com status relevantes diferentes | Gerar uma interação por status que o código consumer efetivamente trata |

Uma interação de erro só deve ser criada quando o comportamento do consumer
depende daquele status ou formato de erro. Não transformar automaticamente
todos os responses documentados no OpenAPI em contratos.

## 5. Nomeação de provider state

| Condição | Ação |
| --- | --- |
| Branch do consumer depende de uma condição de negócio | Nomear o state pela condição, por exemplo `"user has active subscription"` |
| Não há branch relevante e só é necessário um recurso válido | Usar `"a valid <resource> exists"` |
| O teste depende de ausência de dado | Usar `"no <resource> exists for <context>"` |
| States diferentes representam a mesma condição | Sinalizar duplicidade e consolidar o nome |

States não devem conter identificadores reais, valores sensíveis nem detalhes
acidentais da fixture.

## 6. Ordem obrigatória de avaliação

1. **Filtro de uso:** comprovar no consumer se cada campo entra no contrato.
2. **Sensibilidade:** executar a interceptação do Security Gatekeeper antes de
   persistir qualquer exemplo ou matcher.
3. **Semântica e variabilidade:** classificar campos primitivos e aplicar as
   regras 3, 4, 3a e 3b; formatters comprovados têm prioridade.
4. **Estruturas aninhadas:** analisar arrays e objetos recursivamente, sem usar
   `eachLike` em grupos heterogêneos.
5. **Agrupamento:** comparar necessidades e subconjuntos de campos entre os
   usos encontrados.
6. **Provider states:** nomear a condição de negócio depois que a interação
   estiver definida.

## 7. Registro CDC obrigatório por cenário

Antes de gerar ou alterar um `describe`, registrar:

- método, rota efetiva, query, headers relevantes e body;
- necessidade de interação e contexto do consumer;
- arquivos/símbolos que provam o uso de cada campo contratado;
- campos excluídos por não serem consumidos;
- classificação de sensibilidade;
- classificação de variabilidade e matcher escolhido;
- homogeneidade e semântica de posição dos arrays;
- formatter do provider relevante e sua classificação, quando existir;
- status HTTP tratado pelo fluxo;
- provider state descrito por intenção de negócio;
- versão do Pact e API de matchers usadas.

Qualquer campo, formatter, rota, versão Pact ou variante de array que permaneça
indeterminado bloqueia a geração automática até revisão do usuário.

## 8. Checklist rápido

- [ ] O Agente 00 aprovou e sanitizou todos os inputs?
- [ ] A necessidade de interação foi identificada no código do consumer?
- [ ] Cada campo incluído possui evidência de acesso em código executável?
- [ ] Campos não consumidos foram excluídos?
- [ ] Branches semânticos usam matchers compatíveis com os valores relevantes?
- [ ] Valores apenas exibidos usam matchers flexíveis?
- [ ] Formatters do provider foram analisados para os campos contratados?
- [ ] Arrays homogêneos e heterogêneos receberam tratamentos diferentes?
- [ ] Payload e response pertencem ao mesmo cenário?
- [ ] A rota foi conferida no client, OpenAPI, controller e harness?
- [ ] O provider state descreve intenção de negócio?
- [ ] Pact V2 e V3 não foram misturados?
- [ ] O `describe` identifica método, rota e contexto do consumer?
