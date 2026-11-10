# Registro CDC dos Contratos Pact

Auditoria dos contratos entre `martech-theloophub-mfe` e
`martech-oneway-reports-bff`, realizada em 2026-09-09.

## Decisões comuns

- Pact V3 com `PactV3` e `MatchersV3`, versão `@pact-foundation/pact` 16.5.0.
- O consumer usa `BffService.getData` e `ImagesService`; os testes Pact
  reproduzem o mesmo prefixo, query parser e nomes públicos de parâmetros.
- A rota de views é `/v1/views/{view}`. O provider harness precisa ativar
  `VersioningType.URI`, versão padrão `1` e prefixo `v`.
- O campo interno `brandFamily` permanece compatível com os componentes do
  MFE, mas o parâmetro HTTP enviado é `brand_family`.
- Valores de métricas, datas, percentuais, URLs e totais são variáveis; usam
  `like`, `regex` ou `eachLike`. Literais ficam restritos a enums, ids de
  componentes, unidades e chaves estruturais comprovadas.
- Status de erro não entra nos contratos atuais porque os fluxos consumer
  cobertos não possuem branch funcional Pact para esses status.

## Matriz por cenário

| Cenário | Necessidade e evidência consumer | Campos contratados e excluídos | Arrays e matcher | Provider state e formatter |
| --- | --- | --- | --- | --- |
| Category home | `useBffData.ts` normaliza a view; componentes de home leem `id`, `data`, cards e séries. | Mantidos `view`, `components`, ids, títulos, períodos, cards e séries usados pela UI; campos extras do response ficam fora. | `components` é posicional por possuir shapes diferentes; dados repetidos usam `eachLike` mínimo 1; métricas usam `like`. | `category home data exists for ABI`; formatter de cards mantém labels/períodos e métricas variáveis. |
| POS Book cohort | `useBffData.ts` entrega a view à tabela POS Book; a configuração da tabela acessa header, rows, células e flags de label. | Mantidos header, rows, labels, células, unidade e escala usados pela tabela; metadados não acessados são excluídos. | `rows` é agrupado por posição porque cada grupo possui cardinalidade semântica; itens homogêneos usam `eachLike`. | `category POS Book cohort data exists for ABI`; valores de célula usam matchers flexíveis. |
| POS Book zone maturity | A tabela de maturidade acessa `label`, `maturity_zone`, células e headers, inclusive a linha global. | Mantidos campos usados para renderização, classes e headers; demais propriedades do response são excluídas. | Primeira linha e demais linhas têm shapes diferentes e permanecem posicionais; valores de negócio usam `like`. | `category POS Book zone maturity data exists for ABI`; cores/unidades fechadas permanecem literais quando estruturais. |
| Portfolio performance | `Overview.tsx` acessa `portfolioPerformance`; tabela usa header, rows, splits, células e imagens de marca. | Mantidos os campos lidos pela tabela e pelos componentes de imagem; payloads upstream e propriedades não acessadas são excluídos. | Grupos de header e linhas são homogêneos por posição; marcas usam `eachLike` mínimo 1; URLs usam `regex`. | States existentes por zona/período/imagem; formatter do view config gera estrutura e números formatados. |
| Trade execution bees distribution | Componentes de Bees Distribution leem datasets, labels, legend, cards e séries. | Mantidos dados para gráficos, labels, legendas e cards exibidos; métricas numéricas exatas não são exigidas. | Datasets e grupos homogêneos usam `eachLike`; arrays internos com shape próprio usam `like` para preservar posição. | `bees distribution overview data exists for Brazil`; formatter mantém labels e métricas variáveis. |
| Trade execution home | Cards de home acessam ids, títulos, período, big numbers e séries. | Mantidos ids dos dois cards, títulos, período, valores formatados e tendência; campos não lidos são excluídos. | Cards são heterogêneos por id e usam `arrayContaining`; séries homogêneas usam `eachLike`. | `trade execution home distribution data exists for ABI`; enums de tendência usam `regex`. |
| Images brand/country | `useBrandImage.ts` lê `data.url` e `matched`; `getFilterImageUrl.ts` lê `data.url` de país. | Mantidos `url`, `matched` e `image_variants` quando o fluxo de marca os consome; credenciais e dados upstream não entram. | `matched` é homogêneo e usa `eachLike`; `image_variants` é objeto estável; URLs usam `like`/regex funcional. | States nomeados por existência/ausência/alias; o parâmetro público é `brand_family`. |

## Divergências corrigidas

- O pact de portfolio usava `/views/...` enquanto o provider publica `/v1/views/...`.
- O harness de portfolio não ativava versionamento URI.
- O MFE enviava `brandFamily` na query HTTP, mas o DTO/controller do BFF exige
  `brand_family`.
- Dois consumer tests e dois provider tests não possuíam cabeçalho de
  auditoria.
- O pact local continha interações antigas sem `/v1`; ele deve ser regenerado
  pelo teste consumer, nunca corrigido manualmente.

## Limitações

Não existe arquivo OpenAPI versionado neste workspace. Os contratos foram
conferidos contra o controller, DTO, serviços do consumer, harness e fixtures
locais. A validação formal contra OpenAPI permanece pendente até a entrega de
um JSON/YAML local sanitizado.
