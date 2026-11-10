# PACT automation brief — MARTGNM-5958

**Jira:** [MARTGNM-5958](https://ab-inbev.atlassian.net/browse/MARTGNM-5958)  
**Epic:** [MARTGNM-5655](https://ab-inbev.atlassian.net/browse/MARTGNM-5655)  
**Endpoint:** `GET /v1/partners/search`  
**Priority:** P1  
**Zephyr XML:** `MARTGNM-5958-partners-search-pact-test-scenarios.xml`

## Goal

Implement **consumer-driven contract tests** with `@pact-foundation/pact` (pact-js) for partner search used in UNDER_REVIEW campaign creation (`partners[].partnerId`).

## Provider / consumer

| Role | Name |
|------|------|
| Provider | `martech-connect-influencer-service` |
| Consumer | `connect-influencer-web` (confirm with team if BFF name differs) |

## References

- OpenAPI UAT: https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service/v1/docs#/
- Confluence critical APIs: https://ab-inbev.atlassian.net/wiki/spaces/ONEWAY/pages/6339723454
- Manual Postman: `sprints/SPRINT 199/collections-influencers/collections/MARTGNM-5716-5717-5718-campaign-listing-apis.postman_collection.json` (pasta 0 — `GET /v1/partners/search`)
- Example response: `sprints/SPRINT 199/collections-influencers/reference/partners-search.example.response.json`
- Related story: [MARTGNM-5249](https://ab-inbev.atlassian.net/browse/MARTGNM-5249)

## Suggested repo layout

Create under the consumer or QA contract repo (adjust to team convention):

```
tests/contract/
  partners-search.pact.spec.ts      # consumer tests (this task)
  helpers/
    pact-config.ts                  # provider, consumer, broker, log level
    matchers.ts                     # UUID, pagination envelope
  fixtures/
    partners-search-200.json
    partners-search-empty.json
pacts/                              # generated (gitignore or commit per team policy)
```

## Environment variables

```bash
PACT_BROKER_BASE_URL=
PACT_BROKER_TOKEN=
PACT_PUBLISH=true                    # CI only
GIT_SHA=                             # consumer version tag
INFLUENCER_API_BASE_URL=             # for optional live smoke before locking matchers
```

Auth for consumer calls in pact: use a **stub Bearer token** in the interaction (`Authorization: Bearer pact-test-token`). Real JWT is only needed for manual smoke against SIT/UAT.

## Interactions to implement

Map 1:1 to Zephyr scenarios C1–C5.

### INT-01 — Happy path (Zephyr C1)

```
GET /v1/partners/search?search=ti&page=1&pageSize=20
Authorization: Bearer <token>
→ 200
```

**Response matchers (confirm field names against OpenAPI before locking):**

```json
{
  "items": [
    {
      "id": "<uuid>",
      "name": "<string>"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalItems": "<integer>"
}
```

Notes:
- OpenAPI may use `total` instead of `totalItems` — run one manual GET against UAT and align matchers.
- Item field may be `id` or `partnerId` — **confirm OpenAPI** (risk called out in Jira).
- Use `eachLike` / `uuid` matchers from `@pact-foundation/pact`; do not hardcode real partner names.

**Provider state:** `partners exist for search term ti`

### INT-02 — Empty result (Zephyr C2)

```
GET /v1/partners/search?search=zzzznonexistent&page=1&pageSize=20
→ 200
```

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0
}
```

**Provider state:** `no partners match search`

### INT-03 — Pagination (Zephyr C3)

```
GET /v1/partners/search?search=ti&page=2&pageSize=5
→ 200
```

Assert `page: 2`, `pageSize: 5`, `items` length `atMost(5)`.

### INT-04 — Missing auth (Zephyr C4)

```
GET /v1/partners/search?search=ti&page=1&pageSize=20
(no Authorization header)
→ 401 or 403
```

Use `willRespondWith({ status: 401 })` or separate interaction for 403 if provider documents both.

### INT-05 — Short search query (Zephyr C5)

```
GET /v1/partners/search?search=a&page=1&pageSize=20
Authorization: Bearer <token>
→ 400
```

Error body: match stable `code` / `message` per service standard.

## Consumer test skeleton (pact-js v12+)

```typescript
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const { like, eachLike, uuid, integer } = MatchersV3;

const provider = new PactV3({
  consumer: 'connect-influencer-web',
  provider: 'martech-connect-influencer-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('GET /v1/partners/search — MARTGNM-5958', () => {
  it('returns paginated partners for valid search', async () => {
    provider
      .given('partners exist for search term ti')
      .uponReceiving('a request to search partners')
      .withRequest({
        method: 'GET',
        path: '/v1/partners/search',
        query: { search: 'ti', page: '1', pageSize: '20' },
        headers: { Accept: 'application/json', Authorization: 'Bearer pact-test-token' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          items: eachLike({ id: uuid(), name: like('Partner Ti') }),
          page: integer(1),
          pageSize: integer(20),
          totalItems: integer(2),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(
        `${mockServer.url}/v1/partners/search?search=ti&page=1&pageSize=20`,
        { headers: { Accept: 'application/json', Authorization: 'Bearer pact-test-token' } }
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.items)).toBe(true);
    });
  });
});
```

Repeat pattern for INT-02 … INT-05.

## CI / Broker (Zephyr C6–C7)

1. `npm test -- tests/contract/partners-search.pact.spec.ts`
2. Publish: `pact-broker publish ./pacts --consumer-app-version=$GIT_SHA`
3. Provider verify job (provider repo or pipeline): `pact-verifier` against SIT stub or dedicated verify env.

## Acceptance criteria checklist

- [ ] Pact contract for `GET /v1/partners/search` published
- [ ] 200 happy path covered (INT-01)
- [ ] Auth error covered (INT-04)
- [ ] CI green + provider verification green
- [ ] Confluence IATC tracking updated

## Out of scope

- Partner deck endpoints
- UI / E2E tests
- POST /v1/campaigns (separate task MARTGNM-5961)

## Agent instructions

1. Read OpenAPI for exact response schema (`id` vs `partnerId`, `total` vs `totalItems`).
2. Run manual smoke with Postman collection (pasta 0) once before locking matchers.
3. Implement all interactions INT-01 … INT-05.
4. Add npm script `test:contract:partners-search`.
5. Do not commit secrets; use env vars for Broker.
6. Link PR to MARTGNM-5958.
