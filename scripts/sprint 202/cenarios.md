# Sprint 202 / 204 — cenários PACT (checklist)

> Gerado a partir do backlog automatizado no repositório. Detalhes: `SPRINT-204-PACT-AUTOMATION-GUIDE.md`, `MARTGNM-5960-*`, `MARTGNM-5961-*`.

## MARTGNM-5960 — `POST /v1/users`

| ID | Cenário | Spec |
|----|---------|------|
| INT-01 | 201 create user | `post-users.pact.spec.ts` |
| INT-02 | 422 invalid UUID references | ✅ |
| INT-03 | 422 missing email | ✅ |
| INT-04 | 409 duplicate email | ✅ |
| INT-05 | 403 missing auth | ✅ |

## MARTGNM-5961 — `POST /v1/campaigns`

| ID | Cenário | Spec |
|----|---------|------|
| INT-01 | 201 DRAFT creation | `post-campaigns.pact.spec.ts` |
| INT-02 | 201 UNDER_REVIEW full partners | ✅ |
| INT-03 | 201 UNDER_REVIEW minimal partners | ✅ |
| INT-04 | 422 UNDER_REVIEW without partners | ✅ |
| INT-05 | 422 invalid partnerId | ✅ |
| INT-06 | 422 scope mismatch brand/market | ✅ |
| INT-07 | 422 invalid activationIntentionIds | ✅ |
| INT-08 | 403 missing auth | ✅ |

## MARTGNM-5962 — `POST /v1/partners/{partnerId}/deck/brand-safety`

| ID | Cenário | Spec |
|----|---------|------|
| INT-5962-01 | 201 enqueue public variant | `post-deck-brand-safety.pact.spec.ts` |
| INT-5962-02 | 422 invalid variant | ✅ |
| INT-5962-03 | 403 without Authorization | ✅ |

## MARTGNM-5963 — `POST /v1/partners/brand-safety/jobs/{id}/complete`

| ID | Cenário | Spec |
|----|---------|------|
| INT-5963-01 | 201 complete job | `post-brand-safety-complete.pact.spec.ts` |
| INT-5963-02 | 422 missing required fields | ✅ |
| INT-5963-03 | 409 already completed | ✅ |
| INT-5963-04 | 403 without Authorization | ✅ |

## MARTGNM-5965 — `POST /v1/partners/brand-safety/jobs/expire`

| ID | Cenário | Spec |
|----|---------|------|
| INT-5965-01 | 200 expire jobs | `post-brand-safety-expire.pact.spec.ts` |
| INT-5965-02 | 200 idempotent expire | ✅ |
| INT-5965-03 | 403 without Authorization | ✅ |

## Comandos

```bash
npm run test:pact:consumer              # 41 interações (consumer + mock Pact)
npm run test:pact:consumer:sprint204    # só 5962/5963/5965
npm run pact:verify-provider:mock       # provider mock local — 41/41 sem UAT/JWT
PACT_CONSUMER_VERSION=docker-... npm run docker:test:publish
```
