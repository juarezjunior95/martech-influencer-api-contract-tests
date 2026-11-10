# Sprint 204 — Guia completo de automação Pact (Brand Safety)

> **Uso:** copie este arquivo (ou a pasta `Sprint 204/testes-de-contrato/`) para o **repositório de testes de contrato** e use como prompt único para o Cursor implementar `pact-js`.  
> **Escopo:** [MARTGNM-5962](https://ab-inbev.atlassian.net/browse/MARTGNM-5962), [MARTGNM-5963](https://ab-inbev.atlassian.net/browse/MARTGNM-5963), [MARTGNM-5965](https://ab-inbev.atlassian.net/browse/MARTGNM-5965)  
> **Epic / IATC:** [MARTGNM-5655](https://ab-inbev.atlassian.net/browse/MARTGNM-5655)

---

## 1. Artefatos nesta pasta

| Jira | Endpoint | Prioridade | Zephyr (rastreio) | Brief local |
|------|----------|------------|-------------------|-------------|
| MARTGNM-5962 | `POST /v1/partners/{partnerId}/deck/brand-safety` | P0 | `MARTGNM-5962-post-deck-brand-safety-pact-test-scenarios.xml` | `MARTGNM-5962-post-deck-brand-safety-pact-automation.md` |
| MARTGNM-5963 | `POST /v1/partners/brand-safety/jobs/{id}/complete` | P0 | `MARTGNM-5963-post-brand-safety-complete-pact-test-scenarios.xml` | `MARTGNM-5963-post-brand-safety-complete-pact-automation.md` |
| MARTGNM-5965 | `POST /v1/partners/brand-safety/jobs/expire` | P1 | `MARTGNM-5965-post-brand-safety-expire-pact-test-scenarios.xml` | `MARTGNM-5965-post-brand-safety-expire-pact-automation.md` |

**Fluxo de domínio (contexto):** enqueue deck (5962) → fila M2M ([MARTGNM-5959](https://ab-inbev.atlassian.net/browse/MARTGNM-5959) GET queued) → complete (5963) → expire jobs obsoletos (5965). Nos consumer tests use **UUIDs fixos** e **provider states** — não dependa de dados reais de UAT no mock.

---

## 2. Referências técnicas

| Recurso | URL |
|---------|-----|
| OpenAPI UAT | https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service/v1/docs#/ |
| Confluence — APIs críticas Influencer v1 | https://ab-inbev.atlassian.net/wiki/spaces/ONEWAY/pages/6339723454 |
| Postman manual (brand safety) | `MARTGNM-5799-5800-5738-brand-safety-api` (histórias 5799 / 5738 / 5800) |
| Guia geral Pact (repo QA) | `docs/pact-api-contract-automation-guide.md` |

**Provider / consumer (padrão epic 5655):**

| Papel | Nome no Pact |
|-------|----------------|
| Provider | `martech-connect-influencer-service` |
| Consumer | `connect-influencer-web` (ou BFF real acordado com o time) |
| Framework | `@pact-foundation/pact` (pact-js), Node.js ≥ 18 |

**Labels Zephyr / IATC:** `pact`, `pact-js`, `contract-testing`, `automated`, `api-contract`, `influencer-api`, `brand-safety`

---

## 3. O que implementar no repo de contrato

### 3.1 Estrutura de pastas sugerida

```text
tests/contract/
├── consumer/
│   ├── post-deck-brand-safety.pact.spec.ts      # MARTGNM-5962 — C1–C3
│   ├── post-brand-safety-complete.pact.spec.ts  # MARTGNM-5963 — C1–C4
│   └── post-brand-safety-expire.pact.spec.ts    # MARTGNM-5965 — C1–C3
├── helpers/
│   ├── pact-config.ts
│   ├── matchers.ts
│   └── http-client.ts                           # função que o consumer real usa
├── fixtures/
│   ├── deck-brand-safety-201.json
│   ├── complete-201.json
│   └── validation-422.json
└── pacts/                                       # gerado — não editar manualmente
```

### 3.2 Variáveis de ambiente

```bash
# Consumer tests (local) — tokens são stubs no pact; não precisam ser JWT reais
PACT_LOG_LEVEL=warn

# CI — publicação
PACT_BROKER_BASE_URL=
PACT_BROKER_TOKEN=
PACT_PUBLISH=true
GIT_SHA=                          # ou BUILD_ID

# CI — provider verification (pipeline do backend)
PROVIDER_BASE_URL=                # ex. UAT influencer-service
CONTRACT_TEST_BEARER_TOKEN=       # M2M ou Submitter real só no verify
```

### 3.3 Scripts `package.json` (sugestão)

```json
{
  "scripts": {
    "test:contract": "jest tests/contract/consumer --runInBand",
    "pact:publish": "pact-broker publish ./tests/contract/pacts --consumer-app-version=$GIT_SHA",
    "pact:can-i-deploy": "pact-broker can-i-deploy --pacticipant connect-influencer-web --version $GIT_SHA",
    "pact:verify": "npm run test:contract && npm run pact:publish"
  }
}
```

### 3.4 Helper base (`pact-config.ts`)

```typescript
import path from 'path';
import { Pact } from '@pact-foundation/pact';

export const PROVIDER = 'martech-connect-influencer-service';
export const CONSUMER = 'connect-influencer-web';

export function createPact(suffix: string) {
  return new Pact({
    consumer: CONSUMER,
    provider: PROVIDER,
    port: 0,
    log: path.resolve(process.cwd(), 'logs', `pact-${suffix}.log`),
    dir: path.resolve(process.cwd(), 'tests/contract/pacts'),
    pactfileWriteMode: 'update',
  });
}
```

### 3.5 Tokens stub (interações consumer)

| Cenário | Header |
|---------|--------|
| Submitter / deck enqueue (5962) | `Authorization: Bearer pact-submitter-token` |
| M2M complete / expire (5963, 5965) | `Authorization: Bearer pact-m2m-write-token` |

### 3.6 UUIDs stub (path params)

```typescript
export const STUB_PARTNER_ID = '11111111-1111-4111-8111-111111111111';
export const STUB_JOB_ID = '22222222-2222-4222-8222-222222222222';
```

---

## 4. Regras Pact para o Cursor

1. **Uma interação = um status HTTP exato** — não use `401 or 403` na mesma interação; após smoke UAT, escolha **401** ou **403** e trave (ou crie duas interações nomeadas).
2. **Matchers:** `uuid()` para ids; `like()` para strings; `eachLike()` para arrays; evite mensagens de erro literais longas.
3. **Provider state:** use `given()` no `addInteraction` para C1/C3 de cada spec (nomes abaixo).
4. **Chame o client do consumer** apontando para `mockService.baseUrl`, não apenas `fetch` solto sem camada de API.
5. Cenários **C4+ (Broker / provider verify)** são **jobs de CI**, não `jest` consumer — documente no pipeline.
6. Após `provider.verify()` no `afterEach`, o pact JSON deve conter todas as interações do arquivo spec.

---

## 5. MARTGNM-5962 — POST deck/brand-safety (enqueue)

**Arquivo:** `tests/contract/consumer/post-deck-brand-safety.pact.spec.ts`  
**Auth:** Submitter JWT stub  
**Body:** `{ "variant": "public" }` ou `"restricted"` (happy path: `public`)

### Mapa Zephyr → código

| Zephyr | Automatizar em pact-js? | Descrição |
|--------|-------------------------|-----------|
| C1 | Sim | 201 + job `id` |
| C2 | Sim | 422 variant inválida |
| C3 | Sim | 401/403 sem Authorization |
| C4 | CI | Publicar no Broker |
| C5 | CI | Provider verification |

### INT-5962-01 (C1) — Happy path 201

```http
POST /v1/partners/11111111-1111-4111-8111-111111111111/deck/brand-safety
Authorization: Bearer pact-submitter-token
Content-Type: application/json

{"variant":"public"}
```

**Response:**

- Status: `201`
- `Content-Type: application/json`
- Body: `{ "id": "<uuid>" }` — matcher `uuid()` no campo `id`

**Provider state:** `partner deck brand-safety enqueue succeeds`

### INT-5962-02 (C2) — Validation 422

```http
POST .../deck/brand-safety
Authorization: Bearer pact-submitter-token

{"variant":"invalid"}
```

- Status: `422`
- Body: objeto de erro com pelo menos um de `type` | `title` | `message` (conforme OpenAPI)

### INT-5962-03 (C3) — Auth

```http
POST .../deck/brand-safety
(sin Authorization)

{"variant":"public"}
```

- Status: `401` **ou** `403` (definir um após smoke)
- Body: envelope JSON de erro

**Fora de escopo (não criar pact):** GET no mesmo path (404) — mencionado na issue, não está nos cenários Sprint 204.

---

## 6. MARTGNM-5963 — POST jobs/{id}/complete (M2M)

**Arquivo:** `tests/contract/consumer/post-brand-safety-complete.pact.spec.ts`  
**Auth:** M2M write stub

### Mapa Zephyr → código

| Zephyr | Automatizar? | Descrição |
|--------|--------------|-----------|
| C1 | Sim | 201 com `score` |
| C2 | Sim | 422 sem `score` |
| C3 | Sim | 409 job já concluído |
| C4 | Sim | 401/403 sem auth |
| C5 | CI | Broker publish |
| C6 | CI | Provider verify |

### INT-5963-01 (C1) — Complete 201

```http
POST /v1/partners/brand-safety/jobs/22222222-2222-4222-8222-222222222222/complete
Authorization: Bearer pact-m2m-write-token
Content-Type: application/json

{"score":85,"contents":[]}
```

- Status: `201`
- Body: conforme OpenAPI (mínimo: confirme presença de campos que o consumer lê; use `like` / `eachLike` para `contents`)

**Provider state:** `queued brand-safety job exists`

### INT-5963-02 (C2) — Missing score 422

```http
POST .../complete
Authorization: Bearer pact-m2m-write-token

{}
```

- Status: `422`

### INT-5963-03 (C3) — Already completed 409

**Provider state:** `brand-safety job already completed`

```http
POST .../complete
{"score":85}
```

- Status: `409`
- Body: indicar código/mensagem de job já concluído (ex. `BRAND_SAFETY_JOB_ALREADY_COMPLETED` se estiver no OpenAPI)

### INT-5963-04 (C4) — Auth

POST complete **sem** `Authorization` → `401` ou `403`

---

## 7. MARTGNM-5965 — POST jobs/expire (M2M)

**Arquivo:** `tests/contract/consumer/post-brand-safety-expire.pact.spec.ts`  
**Auth:** M2M write stub  
**Body:** vazio (sem body)

### Mapa Zephyr → código

| Zephyr | Automatizar? | Descrição |
|--------|--------------|-----------|
| C1 | Sim | 200 expire |
| C2 | Sim | Idempotência (segundo POST) |
| C3 | Sim | 401/403 sem auth |
| C4 | CI | Broker |
| C5 | CI | Provider verify |

### INT-5965-01 (C1) — Expire 200

```http
POST /v1/partners/brand-safety/jobs/expire
Authorization: Bearer pact-m2m-write-token
```

- Status: **`200`** por padrão neste guia — **validar no OpenAPI** se é `204`; se for 204, alterar **apenas** C1 e C2
- Body: `{}` ou schema OpenAPI de expire

**Provider state:** `brand-safety jobs can expire`

### INT-5965-02 (C2) — Idempotent

**Provider state:** `expire already applied`

- Mesmo request que C1
- Status: mesmo de C1 (200 ou 204)
- Sem 5xx

### INT-5965-03 (C3) — Auth

POST expire sem `Authorization` → `401` ou `403`

---

## 8. Esqueleto de spec (template para o Cursor)

```typescript
import { Matchers } from '@pact-foundation/pact';
import { createPact } from '../helpers/pact-config';

const { like, uuid } = Matchers;

describe('MARTGNM-5962 POST deck/brand-safety', () => {
  const provider = createPact('5962-deck-brand-safety');

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('C1 — 201 enqueue (Zephyr C1)', async () => {
    await provider.addInteraction({
      state: 'partner deck brand-safety enqueue succeeds',
      uponReceiving: 'enqueue brand-safety for partner deck',
      withRequest: {
        method: 'POST',
        path: '/v1/partners/11111111-1111-4111-8111-111111111111/deck/brand-safety',
        headers: {
          Authorization: 'Bearer pact-submitter-token',
          'Content-Type': 'application/json',
        },
        body: { variant: 'public' },
      },
      willRespondWith: {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { id: uuid() },
      },
    });

    // TODO: chamar seu API client contra provider.mockService.baseUrl
  });

  // C2, C3...
});
```

Repita o padrão para `5963` e `5965` com paths e bodies da seção 6 e 7.

---

## 9. CI — Broker e provider verification

### 9.1 Publicação (equivale Zephyr C4 / C5 / C4 por issue)

Após `npm run test:contract`:

```bash
pact-broker publish ./tests/contract/pacts \
  --consumer-app-version="$GIT_SHA" \
  --branch="$GIT_BRANCH" \
  --broker-base-url="$PACT_BROKER_BASE_URL" \
  --broker-token="$PACT_BROKER_TOKEN"
```

Publicar **um pact por consumer version** que pode conter interações dos 3 endpoints (ou 3 arquivos JSON se separar por spec — ambos válidos).

### 9.2 Provider verification (equivale último cenário CI de cada issue)

No pipeline do **provider** (ou job dedicado):

```bash
# Exemplo — ajustar ao CLI/versão do time
pact-broker can-i-deploy \
  --pacticipant connect-influencer-web \
  --version "$GIT_SHA" \
  --to-environment production
```

Provider deve implementar **state handlers** com os mesmos nomes:

- `partner deck brand-safety enqueue succeeds`
- `queued brand-safety job exists`
- `brand-safety job already completed`
- `brand-safety jobs can expire`
- `expire already applied`

---

## 10. Ordem de implementação recomendada

1. `helpers/pact-config.ts` + `matchers.ts`
2. **5962** (enqueue) — menos dependências
3. **5963** (complete) — depende conceitualmente de job id
4. **5965** (expire) — independente, mas mesmo pacote brand-safety
5. Job CI publish + documentar provider states para o time backend
6. Smoke UAT → fixar 401 vs 403 e 200 vs 204 onde aplicável
7. Atualizar Confluence IATC (manual) com links dos pacts publicados

---

## 11. Checklist de aceite (issues Jira)

| Critério | Evidência |
|----------|-----------|
| Pact publicado | Arquivo em `pacts/` + visível no Broker |
| Happy + erros cobertos | Specs verdes localmente (tabelas seções 5–7) |
| CI consumer verde | `test:contract` no pipeline |
| Provider verification verde | Job verify no backend |
| IATC / Confluence | Link manual às issues 5962, 5963, 5965 |

---

## 12. Prompt sugerido para colar no outro projeto (Cursor)

```text
Implement consumer-driven contract tests with @pact-foundation/pact (pact-js) for Sprint 204 Brand Safety.

Follow the single source of truth:
  SPRINT-204-PACT-AUTOMATION-GUIDE.md (sections 3–9)

Create:
  - tests/contract/helpers/pact-config.ts
  - tests/contract/consumer/post-deck-brand-safety.pact.spec.ts (MARTGNM-5962, interactions INT-5962-01..03)
  - tests/contract/consumer/post-brand-safety-complete.pact.spec.ts (MARTGNM-5963, INT-5963-01..04)
  - tests/contract/consumer/post-brand-safety-expire.pact.spec.ts (MARTGNM-5965, INT-5965-01..03)

Provider: martech-connect-influencer-service
Consumer: connect-influencer-web
Use stub tokens and UUIDs from the guide. One exact HTTP status per interaction.
Add npm scripts test:contract and pact:publish. Do not implement Zephyr XML — only pact-js.
```

---

## 13. Contagem de cenários Zephyr (rastreio)

| Issue | Total TCs | Consumer pact-js | CI apenas |
|-------|-----------|------------------|-----------|
| MARTGNM-5962 | 5 | 3 | 2 |
| MARTGNM-5963 | 6 | 4 | 2 |
| MARTGNM-5965 | 5 | 3 | 2 |
| **Total** | **16** | **10 interações** | **6** |

---

*Gerado a partir dos XML e briefs em `sprints/Sprint 204/testes-de-contrato/`. Atualize status HTTP após validação contra OpenAPI UAT antes de travar CI de produção.*
