# PACT automation brief — MARTGNM-5961

**Jira:** [MARTGNM-5961](https://ab-inbev.atlassian.net/browse/MARTGNM-5961)  
**Epic:** [MARTGNM-5655](https://ab-inbev.atlassian.net/browse/MARTGNM-5655)  
**Endpoint:** `POST /v1/campaigns`  
**Priority:** P0  
**Zephyr XML:** `sprints/SPRINT 202/testes-de-contrato/MARTGNM-5961-post-campaigns-pact-test-scenarios.xml`

## Goal

Implement **consumer-driven contract tests** with `@pact-foundation/pact` (pact-js) for campaign creation in **DRAFT** and **UNDER_REVIEW** statuses.

## Provider / consumer

| Role | Name |
|------|------|
| Provider | `martech-connect-influencer-service` |
| Consumer | `connect-influencer-web` |

## References

- OpenAPI UAT: https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service/v1/docs#/
- Confluence critical APIs: https://ab-inbev.atlassian.net/wiki/spaces/ONEWAY/pages/6339723454
- Manual Postman: `sprints/SPRINT 199/collections-influencers/collections/MARTGNM-5716-5717-5718-campaign-listing-apis.postman_collection.json` (DRAFT + UNDER_REVIEW flows)
- Related story: [MARTGNM-5249](https://ab-inbev.atlassian.net/browse/MARTGNM-5249)
- Depends on: partnerId from MARTGNM-5958 (`GET /v1/partners/search`)

## Suggested repo layout

```
tests/contract/
  post-campaigns.pact.spec.ts
  helpers/
    pact-config.ts
    matchers.ts
  fixtures/
    campaign-draft-201.json
    campaign-under-review-201.json
    campaign-422-no-partners.json
pacts/
```

## Environment variables

```bash
PACT_BROKER_BASE_URL=
PACT_BROKER_TOKEN=
PACT_PUBLISH=true
GIT_SHA=
# Manual smoke only:
SUBMITTER_JWT=
```

In pact interactions use stub token: `Authorization: Bearer pact-submitter-token`.

## Interactions to implement

Map 1:1 to Zephyr scenarios C1–C8 (C9–C10 are Broker/CI).

### INT-01 — DRAFT creation (Zephyr C1)

```
POST /v1/campaigns
Body: { status: "DRAFT", ...required fields per OpenAPI }
→ 201
```

**Response matchers:** `id` (uuid), `status: "DRAFT"`, and other stable fields per OpenAPI.

**Provider state:** `submitter can create draft campaign`

### INT-02 — UNDER_REVIEW with full partners (Zephyr C2)

```
POST /v1/campaigns
Body: { status: "UNDER_REVIEW", partners: [{ partnerId, partnerTypeId, contractType, activationIntentionIds[] }] }
→ 201
```

**Provider state:** `valid partnerId exists for under review campaign`

### INT-03 — UNDER_REVIEW minimal partners (Zephyr C3, optional)

```
POST /v1/campaigns
Body: { status: "UNDER_REVIEW", partners: [{ partnerId, contractType: "PAID" }] }
→ 201
```

Skip if OpenAPI mandates full partners object.

### INT-04 — UNDER_REVIEW without partners (Zephyr C4)

```
POST /v1/campaigns with status UNDER_REVIEW and empty/missing partners
→ 422
```

**Provider state:** `under review requires partners`

### INT-05 — Invalid partnerId (Zephyr C5)

```
POST UNDER_REVIEW with non-existent partnerId
→ 422 (*Selected partner does not exist*)
```

### INT-06 — Scope mismatch brand/market (Zephyr C6)

```
POST DRAFT with brandId/marketIds outside Submitter scope
→ 422
```

### INT-07 — Invalid activationIntentionIds (Zephyr C7)

```
POST UNDER_REVIEW with valid partnerId but wrong activationIntentionIds
→ 422
```

### INT-08 — Missing auth (Zephyr C8)

```
POST /v1/campaigns (no Authorization)
→ 401 or 403
```

## Consumer test skeleton (pact-js v12+)

```typescript
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const { like, uuid, regex } = MatchersV3;

const provider = new PactV3({
  consumer: 'connect-influencer-web',
  provider: 'martech-connect-influencer-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('POST /v1/campaigns — MARTGNM-5961', () => {
  it('creates DRAFT campaign', async () => {
    provider
      .given('submitter can create draft campaign')
      .uponReceiving('a request to create a draft campaign')
      .withRequest({
        method: 'POST',
        path: '/v1/campaigns',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer pact-submitter-token',
        },
        body: like({ status: 'DRAFT' /* add required fields from OpenAPI */ }),
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { id: uuid(), status: regex('DRAFT') },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/v1/campaigns`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer pact-submitter-token',
        },
        body: JSON.stringify({ status: 'DRAFT' }),
      });
      expect(res.status).toBe(201);
    });
  });
});
```

Repeat pattern for INT-02 … INT-08. Use `like()` matchers for large optional body fields.

## CI / Broker (Zephyr C9–C10)

1. `npm test -- tests/contract/post-campaigns.pact.spec.ts`
2. Publish to Pact Broker with `$GIT_SHA`
3. Provider verification green in CI.

## Acceptance criteria checklist

- [ ] Pact contracts for DRAFT and UNDER_REVIEW `POST /v1/campaigns` published
- [ ] 201 happy paths covered (INT-01, INT-02)
- [ ] 422 error path covered (INT-03)
- [ ] CI green + provider verification green
- [ ] Confluence IATC tracking updated

## Out of scope

- Campaign listing GET endpoints (separate PACT tasks)
- UI tests

## Agent instructions

1. Read OpenAPI for full request body schema — use flexible matchers for optional fields.
2. Reuse partnerId fixture from partners-search pact or hardcode UUID matcher.
3. Implement INT-01 … INT-08; add npm script `test:contract:post-campaigns`.
4. Link PR to MARTGNM-5961.
