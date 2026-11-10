import { Matchers } from "@pact-foundation/pact";

const { like, eachLike, uuid, string, integer, regex } = Matchers;

const isoDate = regex(
  String.raw`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z`,
  "2026-06-19T12:00:00.000Z",
);

const campaignItemBase = {
  id: uuid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
  name: string("Summer Campaign"),
  status: string("DRAFT"),
  brandName: string("Brand"),
  marketNames: eachLike(string("Brazil")),
  dtStart: string("2026-01-01T00:00:00.000Z"),
  dtEnd: string("2026-12-31T23:59:59.000Z"),
};

/** Envelope 200 de GET /v1/campaigns/submitter (Swagger submitter.json) */
export const submitterPaginatedBody = like({
  items: eachLike(
    like({
      ...campaignItemBase,
      partnerBreakdowns: like({
        byStage: like({
          brandLead: integer(0),
          legal: integer(0),
          steerco: integer(0),
          reviewed: integer(0),
          activated: integer(0),
        }),
        byStatus: like({
          pending: integer(0),
          approved: integer(0),
          rejected: integer(0),
          activated: integer(0),
        }),
        total: integer(0),
      }),
    }),
    0,
  ),
  page: integer(1),
  pageSize: integer(25),
  total: integer(0),
});

/** GET /v1/campaigns/submitter?group=in_progress&partnerBreakdown=byStage (UAT: preenche byStage; byStatus null) */
export const submitterInProgressPartnerBreakdownBody = like({
  items: eachLike(
    like({
      ...campaignItemBase,
      status: regex("COMPLETED|DRAFT|IN_PROGRESS|[A-Z_]+", "COMPLETED"),
      partnerBreakdowns: like({
        byStage: like({
          brandLead: integer(0),
          legal: integer(0),
          steerco: integer(0),
          reviewed: integer(0),
          activated: integer(0),
        }),
        byStatus: null,
        total: integer(0),
      }),
    }),
    1,
  ),
  page: integer(1),
  pageSize: integer(25),
  total: integer(0),
});

/** Envelope 200 de GET /v1/campaigns/brand-lead (Swagger brand-lead.json) */
export const brandLeadPaginatedBody = like({
  items: eachLike(
    like({
      ...campaignItemBase,
      createdBy: like({
        firstName: string("Jane"),
        lastName: string("Doe"),
      }),
      updatedAt: string("2026-08-07T12:00:00.000Z"),
    }),
    0,
  ),
  page: integer(1),
  pageSize: integer(25),
  total: integer(0),
});

export const bearerAuthHeader = Matchers.regex(/^Bearer\s+.+$/, "Bearer test-token");

/** Envelope 200 de GET /v1/partners/search (Swagger SearchPartnersResponseDto) */
export function partnersPaginatedBody(page = 1, pageSize = 20) {
  return like({
    items: eachLike(
      like({
        id: uuid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
        name: string("Partner Ti"),
      }),
      0,
    ),
    page: integer(page),
    pageSize: integer(pageSize),
    total: integer(0),
  });
}

/** Erro 400 de validação (ex.: search com 1 caractere) */
export const validationErrorBody = like({
  message: string("search must be at least 2 characters"),
});

/** Envelope 200 de GET /v1/partners/brand-safety/jobs/queued */
export function brandSafetyQueuedBody(page = 1, pageSize = 25) {
  return like({
    items: eachLike(
      like({
        id: uuid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
        fullName: string("Partner Name"),
        analysisType: regex("basic|full", "basic"),
        createdAt: isoDate,
        platforms: like([]),
      }),
      0,
    ),
    page: integer(page),
    pageSize: integer(pageSize),
    total: integer(0),
  });
}

export const rbacDeniedBody = Buffer.from("RBAC: access denied");

export const createdResourceBody = like({
  id: uuid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
});

export const unprocessableEntityBody = like({
  message: string("Validation failed"),
});

export const conflictErrorBody = like({
  message: string("User with email already exists"),
});

export const brandSafetyJobAlreadyCompletedBody = like({
  message: string("Brand safety job already completed"),
});

export const expireBrandSafetyJobsBody = like({
  expiredCount: integer(0),
});

export const deckBrandSafetyVariantMatcher = regex(
  "^(public|restricted)$",
  "public",
);

export function bearerAuthHeaderFor(token: string) {
  return Matchers.regex(/^Bearer\s+.+$/, `Bearer ${token}`);
}
