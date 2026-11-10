# PACT automation brief — MARTGNM-5959

**Jira:** [MARTGNM-5959](https://ab-inbev.atlassian.net/browse/MARTGNM-5959)  
**Epic:** [MARTGNM-5655](https://ab-inbev.atlassian.net/browse/MARTGNM-5655)  
**Endpoint:** `GET /v1/partners/brand-safety/jobs/queued`  
**Priority:** P0  
**Zephyr XML:** `MARTGNM-5959-brand-safety-jobs-queued-pact-test-scenarios.xml`

## Goal

Implement **consumer-driven contract tests** with `@pact-foundation/pact` (pact-js) for M2M polling of queued brand-safety jobs.

## Provider / consumer

| Role | Name |
|------|------|
| Provider | `martech-connect-influencer-service` |
| Consumer | `connect-influencer-web` or M2M integrator name (confirm with team) |

## References

- OpenAPI UAT: https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service/v1/docs#/
- Confluence critical APIs: https://ab-inbev.atlassian.net/wiki/spaces/ONEWAY/pages/6339723454
- Manual Postman: `sprints/SPRINT 199/collections-influencers/collections/MARTGNM-5799-5800-5738-brand-safety-api.postman_collection.json` (BS-M2M-01, BS-M2M-02, BS-M2M-03)
- Validations JSON: `sprints/SPRINT 199/collections-influencers/validations/MARTGNM-5799-5800-brand-safety-api-test-validations.json`
- Related story: [MARTGNM-5738](https://ab-inbev.atlassian.net/browse/MARTGNM-5738)

## Critical path rule

**Must use:** `/v1/partners/brand-safety/jobs/queued`  
**Do not use:** `/v1/partners/brand-safety/jobs` (returns 404 — see Zephyr C5)

## Suggested repo layout

```
tests/contract/
  brand-safety-jobs-queued.pact.spec.ts
  helpers/
    pact-config.ts
    matchers.ts
  fixtures/
    jobs-queued-200.json
    jobs-queued-empty.json
pacts/
```

## Environment variables

```bash
PACT_BROKER_BASE_URL=
PACT_BROKER_TOKEN=
PACT_PUBLISH=true
GIT_SHA=
# Manual smoke only (not embedded in pact file):
M2M_TOKEN_BRAND_SAFETY_READ=    # scope ConnectInfluencer.PartnerBrandSafety.Read
```

In pact interactions use stub token: `Authorization: Bearer pact-m2m-read-token`.

## Interactions to implement

Map 1:1 to Zephyr scenarios C1–C7.

### INT-01 — Happy path (Zephyr C1)

```
GET /v1/partners/brand-safety/jobs/queued?page=1&pageSize=25
Authorization: Bearer <M2M Read token>
→ 200
```

**Response matchers:**

```json
{
  "items": [
    {
      "id": "<uuid>",
      "fullName": "<string>",
      "analysisType": "basic|full",
      "createdAt": "<iso8601>",
      "platforms": []
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": "<integer>"
}
```

**Provider state:** `queued brand-safety jobs exist`

Use deterministic stub data in provider state (queue may be empty in SIT — do not rely on live data for pact).

### INT-02 — Empty queue (Zephyr C2)

```
GET /v1/partners/brand-safety/jobs/queued?page=1&pageSize=25
→ 200
```

```json
{
  "items": [],
  "page": 1,
  "pageSize": 25,
  "total": 0
}
```

**Provider state:** `no queued brand-safety jobs`

### INT-03 — Pagination (Zephyr C3)

```
GET /v1/partners/brand-safety/jobs/queued?page=2&pageSize=5
→ 200
```

Assert `page: 2`, `pageSize: 5`.

### INT-04 — since / until filters (Zephyr C4)

```
GET /v1/partners/brand-safety/jobs/queued?since=2026-01-01T00:00:00Z&until=2026-12-31T23:59:59Z&page=1&pageSize=25
→ 200
```

Match `createdAt` on items with regex ISO-8601; provider state documents filtered set.

### INT-05 — Wrong path 404 (Zephyr C5)

```
GET /v1/partners/brand-safety/jobs?page=1&pageSize=25
Authorization: Bearer <M2M Read token>
→ 404
```

### INT-06 — Missing auth (Zephyr C6)

```
GET /v1/partners/brand-safety/jobs/queued?page=1&pageSize=25
(no Authorization)
→ 401 or 403
```

### INT-07 — Wrong scope (Zephyr C7)

```
GET /v1/partners/brand-safety/jobs/queued?page=1&pageSize=25
Authorization: Bearer <submitter token without Read scope>
→ 401 or 403
```

## Consumer test skeleton (pact-js v12+)

```typescript
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const { like, eachLike, uuid, integer, regex } = MatchersV3;

const isoDate = regex(
  '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z',
  '2026-06-19T12:00:00Z'
);

const provider = new PactV3({
  consumer: 'connect-influencer-web',
  provider: 'martech-connect-influencer-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('GET /v1/partners/brand-safety/jobs/queued — MARTGNM-5959', () => {
  it('returns queued jobs for M2M poll', async () => {
    provider
      .given('queued brand-safety jobs exist')
      .uponReceiving('a request to list queued brand-safety jobs')
      .withRequest({
        method: 'GET',
        path: '/v1/partners/brand-safety/jobs/queued',
        query: { page: '1', pageSize: '25' },
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer pact-m2m-read-token',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          items: eachLike({
            id: uuid(),
            fullName: like('Partner Name'),
            analysisType: regex('basic|full', 'basic'),
            createdAt: isoDate,
            platforms: like([]),
          }),
          page: integer(1),
          pageSize: integer(25),
          total: integer(1),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(
        `${mockServer.url}/v1/partners/brand-safety/jobs/queued?page=1&pageSize=25`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer pact-m2m-read-token',
          },
        }
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.items[0].id).toBeDefined();
    });
  });
});
```

Repeat pattern for INT-02 … INT-07.

## CI / Broker (Zephyr C8–C9)

1. `npm test -- tests/contract/brand-safety-jobs-queued.pact.spec.ts`
2. Publish pact to Broker with consumer version = `GIT_SHA`
3. Provider verification in provider pipeline

## Acceptance criteria checklist

- [ ] Pact contract for `GET .../jobs/queued` published
- [ ] 200 happy path covered (INT-01)
- [ ] Auth error covered (INT-06)
- [ ] Wrong path 404 covered (INT-05)
- [ ] CI + provider verification green
- [ ] Confluence IATC tracking updated

## Out of scope

- POST complete / expire / enqueue (MARTGNM-5962, 5963, 5965)
- UI tests
- GET on `deck/brand-safety` (no GET on that path)

## Agent instructions

1. Confirm item schema in OpenAPI (`platforms` shape, `total` vs `totalItems`).
2. Use **provider stubs** for deterministic `items` — never depend on SIT queue having jobs.
3. Implement INT-01 … INT-07; add npm script `test:contract:brand-safety-queued`.
4. Add separate spec file from partners-search (5958) — one pact file per endpoint.
5. Link PR to MARTGNM-5959.
