# Backlog Pact — Martech Connect Influencer (UAT Swagger)

Gerado em: 2026-11-10T18:50:54.367Z

| Métrica | Valor |
|--------|-------|
| Operações no Swagger | 89 |
| Endpoints com spec consumer | 9 |
| Interações no pact | 41 |
| Operações pendentes | 80 |
| Cobertura (endpoints) | 10.1% |

Spec: [`docs/openapi/martech-connect-influencer-service-uat.openapi.json`](openapi/martech-connect-influencer-service-uat.openapi.json)

## Feito (automatizado)

| Sprint | Jira | Endpoint | Cenários | Spec |
|--------|------|----------|----------|------|
| baseline | MARTGNM-5948 | `GET /v1/campaigns/submitter` | 3 (3 interações) | `submitter.campaigns.pact.spec.ts` |
| baseline | MARTGNM-5955 | `GET /v1/campaigns/brand-lead` | 3 (3 interações) | `brand-lead.campaigns.pact.spec.ts` |
| 201 | MARTGNM-5958 | `GET /v1/partners/search` | 5 (5 interações) | `partners-search.pact.spec.ts` |
| 201 | MARTGNM-5959 | `GET /v1/partners/brand-safety/jobs/queued` | 7 (6 interações) | `brand-safety-jobs-queued.pact.spec.ts` |
| 202 | MARTGNM-5960 | `POST /v1/users` | 5 (5 interações) | `post-users.pact.spec.ts` |
| 204 | MARTGNM-5962 | `POST /v1/partners/{partnerId}/deck/brand-safety` | 3 (3 interações) | `post-deck-brand-safety.pact.spec.ts` |
| 204 | MARTGNM-5963 | `POST /v1/partners/brand-safety/jobs/{id}/complete` | 4 (4 interações) | `post-brand-safety-complete.pact.spec.ts` |
| 204 | MARTGNM-5965 | `POST /v1/partners/brand-safety/jobs/expire` | 3 (3 interações) | `post-brand-safety-expire.pact.spec.ts` |
| 202 | MARTGNM-5961 | `POST /v1/campaigns` | 8 (8 interações) | `post-campaigns.pact.spec.ts` |

### Ajustes / fora do manifest

- **1×** `GET /v1/partners/brand-safety/jobs` — Mesmo endpoint do manifest (UUID no path) ou rota extra — revisar se mantém

## Pendente (por prioridade sugerida)

> P1–P4 é sugestão para o portal consumer; ajuste conforme roadmap de produto.

### P1 — Alta — telas principais do portal (listagens/filtros usados com fluxos já automatizados)

| Tag | Operação |
|-----|----------|
| campaigns | `GET /v1/campaigns/brands` |
| campaigns | `GET /v1/campaigns/legal/partners` |
| campaigns | `GET /v1/campaigns/markets` |
| campaigns | `GET /v1/campaigns/megaplatforms` |
| campaigns | `GET /v1/campaigns/partner-activation-intentions` |
| campaigns | `GET /v1/campaigns/partner-types` |
| campaigns | `GET /v1/campaigns/platforms` |
| campaigns | `GET /v1/campaigns/steerco/partners` |
| partners | `GET /v1/partners/{partnerId}/deck` |
| users | `GET /v1/users` |
| users | `GET /v1/users/brands` |
| users | `GET /v1/users/markets` |
| users | `GET /v1/users/role-titles` |
| users | `GET /v1/users/roles` |
| users | `GET /v1/users/zones` |

### P2 — Média — fluxos de aprovação, writes adicionais, brand-safety restante

| Tag | Operação |
|-----|----------|
| campaigns | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck` |
| campaigns | `GET /v1/campaigns/{id}/brand-lead/partners` |
| campaigns | `GET /v1/campaigns/{id}/overview` |
| campaigns | `GET /v1/campaigns/{id}/overview/partners` |
| campaigns | `PATCH /v1/campaigns/{id}` |
| campaigns | `POST /v1/campaigns/{id}/activate` |
| campaigns | `POST /v1/campaigns/{id}/cancel` |
| campaigns | `POST /v1/campaigns/complete-expired` |
| partner-approval | `GET /v1/campaigns/{campaignId}/approval/board` |
| partner-approval | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/approval/additional-zone-options` |
| partner-approval | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/available-actions` |
| partner-approval | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/decision-history` |
| partner-approval | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/partner-details` |
| partner-approval | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/steerco-assignments` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/activate-partner` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/brand-lead-review` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review-retry` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review-start` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/rebuild-steerco-assignees` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/resubmit-partner-approval` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/start-partner-approval` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/steerco-assignments/cancel` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/steerco-review` |
| partner-approval | `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/withdraw` |
| partner-brand-safety | `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/brand-safety` |
| partner-brand-safety | `GET /v1/partners/{partnerId}/deck/brand-safety` |
| partner-brand-safety | `POST /v1/partners/brand-safety/consolidated-summaries` |
| users | `PATCH /v1/users/{id}` |

### P3 — Baixa — cadastros admin, sync CreatorIQ, omnichannel

| Tag | Operação |
|-----|----------|
| brands | `GET /v1/brands` |
| brands | `GET /v1/brands/creatoriq/sync/mappings` |
| brands | `PATCH /v1/brands/{id}` |
| brands | `PATCH /v1/brands/creatoriq/sync/mappings` |
| brands | `POST /v1/brands` |
| brands | `POST /v1/brands/creatoriq/sync` |
| campaigns | `GET /v1/campaigns/creatoriq/partners/sync/mappings` |
| campaigns | `GET /v1/campaigns/creatoriq/sync/mappings` |
| markets | `GET /v1/markets` |
| markets | `PATCH /v1/markets/{id}` |
| markets | `POST /v1/markets` |
| megaplatforms | `GET /v1/megaplatforms` |
| megaplatforms | `PATCH /v1/megaplatforms/{id}` |
| megaplatforms | `POST /v1/megaplatforms` |
| omnichannel | `GET /v1/omnichannel/for-you` |
| omnichannel | `GET /v1/omnichannel/influencer-management` |
| partner-activation-intentions | `GET /v1/partner-activation-intentions` |
| partner-activation-intentions | `PATCH /v1/partner-activation-intentions/{id}` |
| partner-activation-intentions | `POST /v1/partner-activation-intentions` |
| partner-types | `GET /v1/partner-types` |
| partner-types | `PATCH /v1/partner-types/{id}` |
| partner-types | `POST /v1/partner-types` |
| partners | `GET /v1/partners/creatoriq/sync/mappings` |
| partners | `GET /v1/partners/creatoriq/sync/stats` |
| partners | `POST /v1/partners/creatoriq/{externalId}/sync` |
| platforms | `GET /v1/platforms` |
| platforms | `PATCH /v1/platforms/{id}` |
| platforms | `POST /v1/platforms` |
| role-titles | `GET /v1/role-titles` |
| role-titles | `PATCH /v1/role-titles/{id}` |
| role-titles | `POST /v1/role-titles` |
| zones | `GET /v1/zones` |
| zones | `PATCH /v1/zones/{id}` |
| zones | `POST /v1/zones` |

### P4 — Opcional — health checks (geralmente fora do consumer Pact)

| Tag | Operação |
|-----|----------|
| Health | `GET /v1/actuator/health/liveness` |
| Health | `GET /v1/actuator/health/readiness` |

## Pendente (por tag Swagger)

### Health (2 pendentes)

- [ ] `GET /v1/actuator/health/liveness` (P4)
- [ ] `GET /v1/actuator/health/readiness` (P4)

### brands (6 pendentes)

- [ ] `GET /v1/brands` (P3)
- [ ] `GET /v1/brands/creatoriq/sync/mappings` (P3)
- [ ] `PATCH /v1/brands/{id}` (P3)
- [ ] `PATCH /v1/brands/creatoriq/sync/mappings` (P3)
- [ ] `POST /v1/brands` (P3)
- [ ] `POST /v1/brands/creatoriq/sync` (P3)

### campaigns (18 pendentes)

- [ ] `GET /v1/campaigns/brands` (P1)
- [ ] `GET /v1/campaigns/legal/partners` (P1)
- [ ] `GET /v1/campaigns/markets` (P1)
- [ ] `GET /v1/campaigns/megaplatforms` (P1)
- [ ] `GET /v1/campaigns/partner-activation-intentions` (P1)
- [ ] `GET /v1/campaigns/partner-types` (P1)
- [ ] `GET /v1/campaigns/platforms` (P1)
- [ ] `GET /v1/campaigns/steerco/partners` (P1)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck` (P2)
- [ ] `GET /v1/campaigns/{id}/brand-lead/partners` (P2)
- [ ] `GET /v1/campaigns/{id}/overview` (P2)
- [ ] `GET /v1/campaigns/{id}/overview/partners` (P2)
- [ ] `PATCH /v1/campaigns/{id}` (P2)
- [ ] `POST /v1/campaigns/{id}/activate` (P2)
- [ ] `POST /v1/campaigns/{id}/cancel` (P2)
- [ ] `POST /v1/campaigns/complete-expired` (P2)
- [ ] `GET /v1/campaigns/creatoriq/partners/sync/mappings` (P3)
- [ ] `GET /v1/campaigns/creatoriq/sync/mappings` (P3)

### markets (3 pendentes)

- [ ] `GET /v1/markets` (P3)
- [ ] `PATCH /v1/markets/{id}` (P3)
- [ ] `POST /v1/markets` (P3)

### megaplatforms (3 pendentes)

- [ ] `GET /v1/megaplatforms` (P3)
- [ ] `PATCH /v1/megaplatforms/{id}` (P3)
- [ ] `POST /v1/megaplatforms` (P3)

### omnichannel (2 pendentes)

- [ ] `GET /v1/omnichannel/for-you` (P3)
- [ ] `GET /v1/omnichannel/influencer-management` (P3)

### partner-activation-intentions (3 pendentes)

- [ ] `GET /v1/partner-activation-intentions` (P3)
- [ ] `PATCH /v1/partner-activation-intentions/{id}` (P3)
- [ ] `POST /v1/partner-activation-intentions` (P3)

### partner-approval (17 pendentes)

- [ ] `GET /v1/campaigns/{campaignId}/approval/board` (P2)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/approval/additional-zone-options` (P2)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/available-actions` (P2)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/decision-history` (P2)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/partner-details` (P2)
- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/approval/steerco-assignments` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/activate-partner` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/brand-lead-review` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review-retry` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/legal-review-start` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/rebuild-steerco-assignees` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/resubmit-partner-approval` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/start-partner-approval` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/steerco-assignments/cancel` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/steerco-review` (P2)
- [ ] `POST /v1/campaigns/{campaignId}/partners/{partnerId}/approval/withdraw` (P2)

### partner-brand-safety (3 pendentes)

- [ ] `GET /v1/campaigns/{campaignId}/partners/{partnerId}/deck/brand-safety` (P2)
- [ ] `GET /v1/partners/{partnerId}/deck/brand-safety` (P2)
- [ ] `POST /v1/partners/brand-safety/consolidated-summaries` (P2)

### partner-types (3 pendentes)

- [ ] `GET /v1/partner-types` (P3)
- [ ] `PATCH /v1/partner-types/{id}` (P3)
- [ ] `POST /v1/partner-types` (P3)

### partners (4 pendentes)

- [ ] `GET /v1/partners/{partnerId}/deck` (P1)
- [ ] `GET /v1/partners/creatoriq/sync/mappings` (P3)
- [ ] `GET /v1/partners/creatoriq/sync/stats` (P3)
- [ ] `POST /v1/partners/creatoriq/{externalId}/sync` (P3)

### platforms (3 pendentes)

- [ ] `GET /v1/platforms` (P3)
- [ ] `PATCH /v1/platforms/{id}` (P3)
- [ ] `POST /v1/platforms` (P3)

### role-titles (3 pendentes)

- [ ] `GET /v1/role-titles` (P3)
- [ ] `PATCH /v1/role-titles/{id}` (P3)
- [ ] `POST /v1/role-titles` (P3)

### users (7 pendentes)

- [ ] `GET /v1/users` (P1)
- [ ] `GET /v1/users/brands` (P1)
- [ ] `GET /v1/users/markets` (P1)
- [ ] `GET /v1/users/role-titles` (P1)
- [ ] `GET /v1/users/roles` (P1)
- [ ] `GET /v1/users/zones` (P1)
- [ ] `PATCH /v1/users/{id}` (P2)

### zones (3 pendentes)

- [ ] `GET /v1/zones` (P3)
- [ ] `PATCH /v1/zones/{id}` (P3)
- [ ] `POST /v1/zones` (P3)

---
Regenerar: `npm run pact:endpoint-backlog`