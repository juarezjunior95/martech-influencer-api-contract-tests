---
name: review-and-run
description: Revisa a aplicação da heurística CDC, executa testes Pact locais e abre PRs sem publicar contratos nem fazer merge.
---

# Agente 05 — Revisão, Execução e PR

## Pré-requisito
Agentes 00–04 concluídos.

## Responsabilidades (nesta ordem)

1. **Revisão de minimalismo**
   - Percorrer os matchers gerados e confirmar que só existem campos
     com evidência de acesso no código executável do consumer. Interface,
     mock, fixture ou presença no response não bastam. Remover qualquer campo
     "por via das dúvidas".
   - Conferir a matriz CDC do Agente 02: valores de negócio
     variáveis não podem ter literais rígidos; arrays devem usar `eachLike`
     somente em grupos homogêneos; campos estruturais estáveis podem usar
     literais quando houver evidência.
   - Conferir o formatter do provider associado a cada decisão 3a/3b e bloquear
     a revisão quando o vínculo com o campo/endpoint não estiver comprovado.
   - Confirmar que interações foram agrupadas por necessidade do consumer e que
     states descrevem intenção de negócio. Status não tratados pelo consumer
     não devem ter sido inventados a partir do OpenAPI.
   - Conferir que o client e o `withRequest.path` usam a mesma rota publicada,
     incluindo o prefixo de versionamento. Se o provider harness responder
     outro path, reportar a falha como problema de configuração, não
     afrouxar o contrato.
   - Bloquear a revisão se a interação Pact usar `axios`/`fetch` diretamente
     apesar de existir um client oficial para o endpoint. Confirmar que o
     callback usa a resposta pelo mesmo caminho de normalização da aplicação.
   - Comparar os parâmetros crus montados pelo call site com a query final do
     Pact. Divergências de nome, ausência, valor ou serialização devem ser
     classificadas como falha de payload, não corrigidas apenas no matcher.

2. **Execução local**
   - Rodar o teste consumer (`jest`/`vitest` conforme configurado) e gerar
     o pact file.
   - Antes da verificação provider, inspecionar as descrições e paths de todas
     as interações do pact file recém-gerado. Se houver interação residual de
     execução anterior (por exemplo, `/views/...` quando o contrato atual usa
     `/v1/views/...`), parar, informar o arquivo stale e regenerar/limpar o
     artefato somente com autorização explícita — nunca fazer o provider
     aceitar silenciosamente os dois paths.
   - Inspecionar também método, query e quantidade de interações; rejeitar
     Pact residual, duplicado ou gerado por cenário diferente antes de rodar o
     provider.
   - Rodar a verificação provider contra esse pact file localmente (sem
     publicar no Broker). A ausência do pact antes da execução consumer é
     esperada e não deve ser tratada como falha de configuração.

3. **Interpretação de falhas**
   - Se o consumer falhar: provavelmente matcher mal formado — reportar
     linha e sugerir correção concreta (ex: "campo `totalValue` esperado
     como `number`, response trouxe `string` — ajustar matcher ou verificar
     serialização no backend").
   - Se o provider falhar: provavelmente mock não bate com o que o
     consumer espera — reportar o mismatch exato retornado pelo Pact e
     sugerir ajuste no state handler.
   - Tratar `404` causado por ausência de prefixo de versionamento no harness
     como erro de configuração do provider, não como motivo para alterar a
     rota do contrato.
   - Reportar o resultado em categorias separadas: matcher, payload,
     rota/versionamento, campos obrigatórios ausentes e interações residuais.
   - Nunca "forçar passar" afrouxando o matcher sem justificar a mudança
     ao usuário.

4. **Abrir PR (nunca push direto)**
   - Um PR por repositório afetado (consumer e/ou provider).
   - Descrição do PR deve conter: endpoint coberto, campos incluídos no
     contrato e respectivas evidências de uso, campos deliberadamente
     excluídos, decisões de matcher/formatter não triviais, necessidade de
     interação e provider state (herdados da saída do Agente 02), além de um
     lembrete de que é conteúdo gerado por IA e precisa de revisão humana
     antes do merge.
   - PR fica pendente de aprovação humana — este agente NUNCA faz merge.

## Saída esperada
Resumo final para o usuário: status dos testes, links dos PRs abertos,
lista de decisões que merecem atenção na revisão humana.
