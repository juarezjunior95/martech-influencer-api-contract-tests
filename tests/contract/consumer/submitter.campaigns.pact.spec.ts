/**
 * MARTGNM-5948 — GET /v1/campaigns/submitter
 * Zephyr: MARTGNM-T2719, T2721 | Ciclo: MARTGNM-R249
 */
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import {
  CampaignApiError,
  listSubmitterCampaigns,
  listSubmitterCampaignsUnauthenticated,
} from "../helpers/campaign-client";
import {
  bearerAuthHeader,
  submitterInProgressPartnerBreakdownBody,
  submitterPaginatedBody,
} from "../helpers/matchers";

describe("PACT: GET /v1/campaigns/submitter (MARTGNM-5948)", () => {
  const provider = createPact("submitter");

  it("MARTGNM-T2719 — 200 paginated envelope with group=draft", async () => {
    await provider
      .addInteraction()
      .given("campaigns exist for submitter group draft")
      .uponReceiving("a request for submitter campaigns with group=draft")
      .withRequest("GET", "/v1/campaigns/submitter", (b) => {
        b.query({ group: "draft", page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(submitterPaginatedBody);
      })
      .executeTest(async (mockServer) => {
        const result = await listSubmitterCampaigns(mockServer.url, "test-token", {
          group: "draft",
          page: 1,
          pageSize: 25,
        });

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
  });

  it("MARTGNM-T2720 — 200 in_progress with partnerBreakdown=byStage", async () => {
    await provider
      .addInteraction()
      .given(
        "campaigns exist for submitter group in_progress with partner breakdown by stage",
      )
      .uponReceiving(
        "a request for submitter campaigns with group=in_progress and partnerBreakdown=byStage",
      )
      .withRequest("GET", "/v1/campaigns/submitter", (b) => {
        b.query({
          group: "in_progress",
          page: "1",
          pageSize: "25",
          partnerBreakdown: "byStage",
        });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(submitterInProgressPartnerBreakdownBody);
      })
      .executeTest(async (mockServer) => {
        const result = await listSubmitterCampaigns(mockServer.url, "test-token", {
          group: "in_progress",
          page: 1,
          pageSize: 25,
          partnerBreakdown: "byStage",
        });

        expect(result.items.length).toBeGreaterThanOrEqual(1);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
        expect(result.total).toBeGreaterThanOrEqual(0);
        const first = result.items[0] as {
          partnerBreakdowns?: { byStage?: { legal?: number } };
        };
        expect(first.partnerBreakdowns?.byStage).toBeDefined();
      });
  });

  it("MARTGNM-T2721 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request for submitter campaigns without Authorization")
      .withRequest("GET", "/v1/campaigns/submitter", (b) => {
        b.query({ group: "draft", page: "1", pageSize: "25" });
        b.headers({ Accept: "application/json" });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", Buffer.from("RBAC: access denied"));
      })
      .executeTest(async (mockServer) => {
        await expect(
          listSubmitterCampaignsUnauthenticated(mockServer.url, {
            group: "draft",
            page: 1,
            pageSize: 25,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(CampaignApiError);
          const apiErr = err as CampaignApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });
});
