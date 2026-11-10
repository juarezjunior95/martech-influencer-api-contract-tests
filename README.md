# Testes de contrato (Pact) — Martech Connect Influencer

Este repositório contém **testes de consumer** com [Pact](https://docs.pact.io/) para a Martech Connect Influencer. Os contratos misturam duas fontes:

- **OpenAPI exportado no Swagger UI** (`Swagger UI_files/swagger-ui-init.js`): usado para `POST /v1/campaigns` (schemas `CreateCampaignRequestDto` / `CreateCampaignResponseDto`).
- **Collection Postman** `MARTGNM-Campaign-APIs.postman_collection.json`: usada para `GET /v1/campaigns/{id}/overview`, porque esse path **não** consta no OpenAPI embutido nesse export (a própria collection avisa que pode estar fora do Swagger).

## O que é Pact?

- **Consumer** (ex.: portal BFF, app) define o que **espera** do provedor: método, path, headers relevantes e formato do JSON.
- O Pact sobe um **mock** que valida se o seu cliente faz exatamente o request acordado e gera um arquivo JSON em `pacts/`.
- O **provider** (serviço real) pode **verificar** esse arquivo contra a implementação (local, UAT, etc.), garantindo que não quebrou o contrato.

Fluxo típico em time: publicar pacts no **Pact Broker** → CI do provider roda verificação → versionamento de contratos.

## Requisitos

- Node.js **20+** (exigência do `@pact-foundation/pact`).
- **Docker** (opcional, recomendado para visibilidade do time via Pact Broker).

## Comandos

```bash
npm install
npm test                    # todos os testes (inclui consumer Pact)
npm run test:pact:consumer  # só pasta tests/consumer
```

Após `npm test`, o contrato gerado fica em:

`pacts/influencer-portal-martech-connect-influencer-service.json`

Ajuste os nomes `consumer` / `provider` no teste se o seu time usar outros pacticipants.

## Visibilidade para o time (Docker + Pact Broker)

O **Pact Broker** é a UI web onde o time vê contratos, versões, branches e resultados de verificação — equivalente ao “dashboard” de contract testing.

### 1. Subir o Broker (uma vez por máquina/servidor)

```bash
npm run docker:broker:up
```

Abra no browser: **http://localhost:9292**  
(leitura pública em dev; publicar contratos usa usuário `pact` / senha `pact` — veja `.env.example`)

### 2. Fluxo local: testar + publicar no Broker

```bash
cp .env.example .env   # opcional: ajustar versão/branch
npm run pact:flow
```

Isso sobe o Broker, roda os testes consumer e publica os JSON em `pacts/` no Broker.

Ou passo a passo:

```bash
npm run docker:broker:up
npm run test:pact:consumer
npm run pact:publish
```

### 3. Tudo em Docker (CI ou quem não tem Node local)

```bash
PACT_CONSUMER_VERSION=$(git rev-parse HEAD) PACT_BRANCH=$(git branch --show-current) \
  npm run docker:test:publish
```

Roda testes no container, publica no Broker e o time consulta **http://localhost:9292**.

### O que o time vê no Broker

- **Consumer** `influencer-portal` ↔ **Provider** `martech-connect-influencer-service`
- Interações (`POST /v1/campaigns`, `GET .../overview`)
- Histórico por versão (`PACT_CONSUMER_VERSION`) e branch (`PACT_BRANCH`)
- Status de verificação do provider (quando o time do serviço configurar `pact:verify-provider` no CI)

Parar os containers:

```bash
npm run docker:broker:down
```

## Onde editar

| Caminho | Função |
|--------|--------|
| `src/clients/influencerCampaignClient.ts` | Cliente HTTP usado pelo app/testes (base URL + paths). |
| `tests/consumer/campaign-overview.pact.spec.ts` | Interação Pact de exemplo (`GET .../overview`). |

Alinhe o corpo esperado (`Matchers.like`, `eachLike`, etc.) ao **Swagger** ou a exemplos reais de UAT. A collection descreve o overview com campos como `brand`, `megaplatform`, `markets`, `platforms`, `keywords`, `dtStart`, `dtEnd`, `objective`, `budget`, etc.

## Próximos passos (provider)

1. **Estados do provider** (`providerStates` / webhooks): para cada `.given('...')` no consumer, o serviço precisa preparar dados (ex.: “campanha X existe”).
2. **Verifier no CI**: use `Verifier` de `@pact-foundation/pact` ou o [Pact CLI](https://github.com/pact-foundation/pact-ruby-standalone/releases) com `pact-provider-verifier`, apontando para o JSON em `pacts/` ou para o Broker.
3. **Autenticação**: chamadas reais costumam precisar de `Authorization: Bearer ...` — configure headers customizados na verificação e **nunca** commite tokens.

## Publicar no Pact Broker

Local (Docker): use `npm run pact:publish` após `docker:broker:up`.  
Em CI: defina `PACT_CONSUMER_VERSION` (ex.: SHA do commit) e `PACT_BRANCH`; o Broker centraliza a visibilidade para consumer e provider.
