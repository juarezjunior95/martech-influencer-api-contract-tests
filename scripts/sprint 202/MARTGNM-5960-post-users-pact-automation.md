# PACT automation brief — MARTGNM-5960

**Jira:** [MARTGNM-5960](https://ab-inbev.atlassian.net/browse/MARTGNM-5960)  
**Epic:** [MARTGNM-5655](https://ab-inbev.atlassian.net/browse/MARTGNM-5655)  
**Endpoint:** `POST /v1/users`  
**Priority:** P0  
**Zephyr XML:** `sprints/SPRINT 202/testes-de-contrato/MARTGNM-5960-post-users-pact-test-scenarios.xml`

## Goal

Implement **consumer-driven contract tests** with `@pact-foundation/pact` (pact-js) for user provisioning used in Submitter/Brand Lead test setup flows.

## Provider / consumer

| Role | Name |
|------|------|
| Provider | `martech-connect-influencer-service` |
| Consumer | `connect-influencer-web` (confirm with team if BFF name differs) |

## References

- OpenAPI UAT: https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service/v1/docs#/
- Confluence critical APIs: https://ab-inbev.atlassian.net/wiki/spaces/ONEWAY/pages/6339723454
- Manual Postman: `sprints/SPRINT 199/collections-influencers/collections/MARTGNM-5716-5717-5718-campaign-listing-apis.postman_collection.json` (POST /v1/users setup)
- Related story: [MARTGNM-5251](https://ab-inbev.atlassian.net/browse/MARTGNM-5251)

## Suggested repo layout

```
tests/contract/
  post-users.pact.spec.ts
  helpers/
    pact-config.ts
    matchers.ts
  fixtures/
    post-users-201.json
    post-users-422.json
pacts/
```

## Environment variables

```bash
PACT_BROKER_BASE_URL=
PACT_BROKER_TOKEN=
PACT_PUBLISH=true
GIT_SHA=
# Manual smoke only:
ADMIN_JWT=
```

In pact interactions use stub token: `Authorization: Bearer pact-admin-token`.

## Interactions to implement

Map 1:1 to Zephyr scenarios C1–C5 (C6 is cross-contract doc; C7–C8 are Broker/CI).

### INT-01 — Happy path (Zephyr C1)

```
POST /v1/users
Authorization: Bearer <admin token>
Body: { email, roleTitleId, marketIds[], brandIds[], zoneIds[] }
→ 201
```

**Response matchers:**

```json
{
  "id": "<uuid>"
}
```

**Provider state:** `reference UUIDs exist for user creation`

### INT-02 — Invalid UUID references (Zephyr C2)

```
POST /v1/users with invalid marketIds or roleTitleId
→ 422
```

Match stable validation error body (`code`, `message`, or `errors[]` per service standard).

**Provider state:** `invalid UUID references in user body`

### INT-03 — Missing required email (Zephyr C3)

```
POST /v1/users without email field
→ 422
```

**Provider state:** `missing required user fields`

### INT-04 — Duplicate email (Zephyr C4, optional)

```
POST /v1/users with email already registered
→ 409
```

Confirm OpenAPI before locking — skip if service returns 422 instead.

**Provider state:** `user with email already exists`

### INT-05 — Missing auth (Zephyr C5)

```
POST /v1/users (no Authorization)
→ 401 or 403
```

## Consumer test skeleton (pact-js v12+)

```typescript
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const { like, uuid } = MatchersV3;

const provider = new PactV3({
  consumer: 'connect-influencer-web',
  provider: 'martech-connect-influencer-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('POST /v1/users — MARTGNM-5960', () => {
  it('creates user with valid body', async () => {
    provider
      .given('reference UUIDs exist for user creation')
      .uponReceiving('a request to create a user')
      .withRequest({
        method: 'POST',
        path: '/v1/users',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer pact-admin-token',
        },
        body: {
          email: like('submitter@pact.test'),
          roleTitleId: uuid(),
          marketIds: [uuid()],
          brandIds: [uuid()],
          zoneIds: [uuid()],
        },
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { id: uuid() },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/v1/users`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer pact-admin-token',
        },
        body: JSON.stringify({
          email: 'submitter@pact.test',
          roleTitleId: '00000000-0000-4000-8000-000000000001',
          marketIds: ['00000000-0000-4000-8000-000000000002'],
          brandIds: ['00000000-0000-4000-8000-000000000003'],
          zoneIds: ['00000000-0000-4000-8000-000000000004'],
        }),
      });
      expect(res.status).toBe(201);
    });
  });
});
```

Repeat pattern for INT-02 … INT-05.

Document scope alignment in provider states for MARTGNM-5961 (Zephyr C6).

## CI / Broker (Zephyr C7–C8)

1. `npm test -- tests/contract/post-users.pact.spec.ts`
2. Publish: `pact-broker publish ./pacts --consumer-app-version=$GIT_SHA`
3. Provider verify job against SIT stub or dedicated verify env.

## Acceptance criteria checklist

- [ ] Pact contract for `POST /v1/users` published
- [ ] 201 happy path covered (INT-01)
- [ ] 422 validation covered (INT-02)
- [ ] CI green + provider verification green
- [ ] Confluence IATC tracking updated

## Out of scope

- User update/delete if not in OpenAPI
- UI tests

## Agent instructions

1. Read OpenAPI for exact request/response schema and 409 vs 422 on duplicate email.
2. Reuse reference UUID fixtures from MARTGNM-5957 pact tests if available.
3. Implement INT-01 … INT-05; add npm script `test:contract:post-users`.
4. Link PR to MARTGNM-5960.
