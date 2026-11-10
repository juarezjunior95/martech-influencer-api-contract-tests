/**
 * MARTGNM-5961 — POST /v1/campaigns
 * Zephyr: C1–C8
 */
import { Matchers } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import campaignRefs from "../fixtures/post-campaign-references.json";
import {
  bearerAuthHeaderFor,
  createdResourceBody,
  rbacDeniedBody,
  unprocessableEntityBody,
} from "../helpers/matchers";
import { PACT_SUBMITTER_TOKEN } from "../helpers/pact-tokens";
import {
  CampaignCreateApiError,
  createCampaign,
  createCampaignUnauthenticated,
  type CreateCampaignBody,
} from "../helpers/campaigns-create-client";

const { like, uuid, string, eachLike } = Matchers;

describe("PACT: POST /v1/campaigns (MARTGNM-5961)", () => {
  const provider = createPact("post-campaigns");
  const submitterAuth = bearerAuthHeaderFor(PACT_SUBMITTER_TOKEN);

  const draftBody: CreateCampaignBody = {
    status: "DRAFT",
    name: "[Pact] Draft campaign",
  };

  const fullPartners = [
    {
      partnerId: campaignRefs.partnerId,
      partnerTypeId: campaignRefs.partnerTypeId,
      contractType: "PAID" as const,
      activationIntentionIds: [campaignRefs.activationIntentionId],
    },
  ];

  const underReviewBase = (): CreateCampaignBody => ({
    status: "UNDER_REVIEW",
    name: "[Pact] Under Review campaign",
    brandId: campaignRefs.brandId,
    megaplatformId: campaignRefs.megaplatformId,
    marketIds: [campaignRefs.marketId],
    platformIds: [campaignRefs.platformId],
    dtStart: "2026-07-01T00:00:00Z",
    dtEnd: "2026-12-31T00:00:00Z",
    objective: "Brand awareness",
    promotionalPartnerCampaignRole: "STANDARD",
  });

  const underReviewBodyMatcher = (
    partnersMatcher: ReturnType<typeof eachLike> | undefined,
  ) => {
    const base = {
      status: string("UNDER_REVIEW"),
      name: string("[Pact] Under Review campaign"),
      brandId: uuid(campaignRefs.brandId),
      megaplatformId: uuid(campaignRefs.megaplatformId),
      marketIds: eachLike(uuid(campaignRefs.marketId)),
      platformIds: eachLike(uuid(campaignRefs.platformId)),
      dtStart: string("2026-07-01T00:00:00Z"),
      dtEnd: string("2026-12-31T00:00:00Z"),
      objective: string("Brand awareness"),
      promotionalPartnerCampaignRole: string("STANDARD"),
    };
    if (partnersMatcher) {
      return like({ ...base, partners: partnersMatcher });
    }
    return like(base);
  };

  it("INT-01 / C1 — 201 creates DRAFT campaign", async () => {
    await provider
      .addInteraction()
      .given("submitter can create draft campaign")
      .uponReceiving("a request to create a draft campaign")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          like({
            status: string("DRAFT"),
            name: string("[Pact] Draft campaign"),
          }),
        );
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await createCampaign(
          mockServer.url,
          PACT_SUBMITTER_TOKEN,
          draftBody,
        );
        expect(result.id).toBeDefined();
      });
  });

  it("INT-02 / C2 — 201 UNDER_REVIEW with full partners", async () => {
    const body = { ...underReviewBase(), partners: fullPartners };

    await provider
      .addInteraction()
      .given("valid partnerId exists for under review campaign")
      .uponReceiving("a request to create an under review campaign with full partners")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          underReviewBodyMatcher(
            eachLike(
              like({
                partnerId: uuid(campaignRefs.partnerId),
                partnerTypeId: uuid(campaignRefs.partnerTypeId),
                contractType: string("PAID"),
                activationIntentionIds: eachLike(
                  uuid(campaignRefs.activationIntentionId),
                ),
              }),
            ),
          ),
        );
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await createCampaign(
          mockServer.url,
          PACT_SUBMITTER_TOKEN,
          body,
        );
        expect(result.id).toBeDefined();
      });
  });

  it("INT-03 / C3 — 201 UNDER_REVIEW with minimal partners", async () => {
    const body = {
      ...underReviewBase(),
      partners: [
        {
          partnerId: campaignRefs.partnerId,
          contractType: "PAID" as const,
        },
      ],
    };

    await provider
      .addInteraction()
      .given("valid partnerId exists for minimal under review campaign")
      .uponReceiving("a request to create under review campaign with minimal partners")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          underReviewBodyMatcher(
            eachLike(
              like({
                partnerId: uuid(campaignRefs.partnerId),
                contractType: string("PAID"),
              }),
            ),
          ),
        );
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await createCampaign(
          mockServer.url,
          PACT_SUBMITTER_TOKEN,
          body,
        );
        expect(result.id).toBeDefined();
      });
  });

  it("INT-04 / C4 — 422 UNDER_REVIEW without partners", async () => {
    const body = underReviewBase();

    await provider
      .addInteraction()
      .given("under review requires partners")
      .uponReceiving("a request to create under review campaign without partners")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(underReviewBodyMatcher(undefined));
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createCampaign(mockServer.url, PACT_SUBMITTER_TOKEN, body),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignCreateApiError);
          expect((err as CampaignCreateApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-05 / C5 — 422 invalid partnerId", async () => {
    const body = {
      ...underReviewBase(),
      partners: [
        {
          partnerId: campaignRefs.invalidPartnerId,
          partnerTypeId: campaignRefs.partnerTypeId,
          contractType: "PAID" as const,
          activationIntentionIds: [campaignRefs.activationIntentionId],
        },
      ],
    };

    await provider
      .addInteraction()
      .given("partnerId does not exist for campaign creation")
      .uponReceiving("a request to create under review campaign with invalid partnerId")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          underReviewBodyMatcher(
            eachLike(
              like({
                partnerId: uuid(campaignRefs.invalidPartnerId),
                partnerTypeId: uuid(campaignRefs.partnerTypeId),
                contractType: string("PAID"),
                activationIntentionIds: eachLike(
                  uuid(campaignRefs.activationIntentionId),
                ),
              }),
            ),
          ),
        );
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(
          like({
            message: string("Selected partner does not exist"),
          }),
        );
      })
      .executeTest(async (mockServer) => {
        await expect(
          createCampaign(mockServer.url, PACT_SUBMITTER_TOKEN, body),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignCreateApiError);
          expect((err as CampaignCreateApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-06 / C6 — 422 brand/market outside submitter scope", async () => {
    const body: CreateCampaignBody = {
      status: "DRAFT",
      name: "[Pact] Out of scope draft",
      brandId: campaignRefs.outOfScopeBrandId,
      marketIds: [campaignRefs.outOfScopeMarketId],
    };

    await provider
      .addInteraction()
      .given("submitter scope excludes brand and market")
      .uponReceiving("a request to create draft campaign with out of scope brand and market")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          like({
            status: string("DRAFT"),
            name: string("[Pact] Out of scope draft"),
            brandId: uuid(campaignRefs.outOfScopeBrandId),
            marketIds: eachLike(uuid(campaignRefs.outOfScopeMarketId)),
          }),
        );
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createCampaign(mockServer.url, PACT_SUBMITTER_TOKEN, body),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignCreateApiError);
          expect((err as CampaignCreateApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-07 / C7 — 422 invalid activationIntentionIds", async () => {
    const body = {
      ...underReviewBase(),
      partners: [
        {
          partnerId: campaignRefs.partnerId,
          partnerTypeId: campaignRefs.partnerTypeId,
          contractType: "PAID" as const,
          activationIntentionIds: [campaignRefs.invalidActivationIntentionId],
        },
      ],
    };

    await provider
      .addInteraction()
      .given("activation intention ids are invalid for partner")
      .uponReceiving("a request to create under review campaign with invalid activationIntentionIds")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(
          underReviewBodyMatcher(
            eachLike(
              like({
                partnerId: uuid(campaignRefs.partnerId),
                partnerTypeId: uuid(campaignRefs.partnerTypeId),
                contractType: string("PAID"),
                activationIntentionIds: eachLike(
                  uuid(campaignRefs.invalidActivationIntentionId),
                ),
              }),
            ),
          ),
        );
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createCampaign(mockServer.url, PACT_SUBMITTER_TOKEN, body),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignCreateApiError);
          expect((err as CampaignCreateApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-08 / C8 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request to create a campaign without Authorization")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        });
        b.jsonBody(
          like({
            status: string("DRAFT"),
            name: string("[Pact] Draft campaign"),
          }),
        );
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createCampaignUnauthenticated(mockServer.url, draftBody),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignCreateApiError);
          const apiErr = err as CampaignCreateApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });
});
