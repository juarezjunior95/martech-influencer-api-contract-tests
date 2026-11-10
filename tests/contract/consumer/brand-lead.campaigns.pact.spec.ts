/**
 * MARTGNM-5955 — GET /v1/campaigns/brand-lead
 * Zephyr: MARTGNM-T2723, T2725, T2726 (happy path + 401) | Ciclo: MARTGNM-R250
 */
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import {
  CampaignApiError,
  listBrandLeadCampaigns,
  listBrandLeadCampaignsUnauthenticated,
} from "../helpers/campaign-client";
import {
  bearerAuthHeader,
  brandLeadPaginatedBody,
} from "../helpers/matchers";
import brandLeadFilters from "../fixtures/brand-lead-filters.json";

describe("PACT: GET /v1/campaigns/brand-lead (MARTGNM-5955)", () => {
  const provider = createPact("brand-lead");

  it("MARTGNM-T2723 — 200 paginated envelope with group=in_progress", async () => {
    await provider
      .addInteraction()
      .given("campaigns exist for brand-lead group in_progress")
      .uponReceiving("a request for brand-lead campaigns with group=in_progress")
      .withRequest("GET", "/v1/campaigns/brand-lead", (b) => {
        b.query({ group: "in_progress", page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandLeadPaginatedBody);
      })
      .executeTest(async (mockServer) => {
        const result = await listBrandLeadCampaigns(mockServer.url, "test-token", {
          group: "in_progress",
          page: 1,
          pageSize: 25,
        });

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
  });

  it("MARTGNM-T2725 — 200 with marketId and brandId filters", async () => {
    const { marketId, brandId } = brandLeadFilters;

    await provider
      .addInteraction()
      .given("campaigns exist for brand-lead with market and brand filters")
      .uponReceiving("a request for brand-lead campaigns filtered by marketId and brandId")
      .withRequest("GET", "/v1/campaigns/brand-lead", (b) => {
        b.query({
          group: "draft",
          marketId,
          brandId,
          page: "1",
          pageSize: "25",
        });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandLeadPaginatedBody);
      })
      .executeTest(async (mockServer) => {
        const result = await listBrandLeadCampaigns(mockServer.url, "test-token", {
          group: "draft",
          page: 1,
          pageSize: 25,
          marketId,
          brandId,
        });

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
      });
  });

  it("MARTGNM-T2726 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request for brand-lead campaigns without Authorization")
      .withRequest("GET", "/v1/campaigns/brand-lead", (b) => {
        b.query({ group: "in_progress", page: "1", pageSize: "25" });
        b.headers({ Accept: "application/json" });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", Buffer.from("RBAC: access denied"));
      })
      .executeTest(async (mockServer) => {
        await expect(
          listBrandLeadCampaignsUnauthenticated(mockServer.url, {
            group: "in_progress",
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
