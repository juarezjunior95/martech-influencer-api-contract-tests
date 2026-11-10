/**
 * MARTGNM-5958 — GET /v1/partners/search
 * Zephyr: C1–C5 | Ciclo: partners search pact
 */
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import {
  PartnersApiError,
  searchPartners,
  searchPartnersUnauthenticated,
} from "../helpers/partners-client";
import {
  bearerAuthHeader,
  partnersPaginatedBody,
  rbacDeniedBody,
  validationErrorBody,
} from "../helpers/matchers";
import { PACT_USER_TOKEN } from "../helpers/pact-tokens";

describe("PACT: GET /v1/partners/search (MARTGNM-5958)", () => {
  const provider = createPact("partners-search");

  it("INT-01 / C1 — 200 paginated partners for valid search", async () => {
    await provider
      .addInteraction()
      .given("partners exist for search term ti")
      .uponReceiving("a request to search partners with search=ti")
      .withRequest("GET", "/v1/partners/search", (b) => {
        b.query({ search: "ti", page: "1", pageSize: "20" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(partnersPaginatedBody(1, 20));
      })
      .executeTest(async (mockServer) => {
        const result = await searchPartners(mockServer.url, PACT_USER_TOKEN, {
          search: "ti",
          page: 1,
          pageSize: 20,
        });

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(20);
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
  });

  it("INT-02 / C2 — 200 empty result for nonexistent search", async () => {
    await provider
      .addInteraction()
      .given("no partners match search")
      .uponReceiving("a request to search partners with no matches")
      .withRequest("GET", "/v1/partners/search", (b) => {
        b.query({ search: "zzzznonexistent", page: "1", pageSize: "20" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(partnersPaginatedBody(1, 20));
      })
      .executeTest(async (mockServer) => {
        const result = await searchPartners(mockServer.url, PACT_USER_TOKEN, {
          search: "zzzznonexistent",
          page: 1,
          pageSize: 20,
        });

        expect(result.items).toEqual([]);
        expect(result.total).toBe(0);
      });
  });

  it("INT-03 / C3 — 200 pagination with page=2 and pageSize=5", async () => {
    await provider
      .addInteraction()
      .given("partners exist for paginated search")
      .uponReceiving("a paginated request to search partners")
      .withRequest("GET", "/v1/partners/search", (b) => {
        b.query({ search: "ti", page: "2", pageSize: "5" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(partnersPaginatedBody(2, 5));
      })
      .executeTest(async (mockServer) => {
        const result = await searchPartners(mockServer.url, PACT_USER_TOKEN, {
          search: "ti",
          page: 2,
          pageSize: 5,
        });

        expect(result.page).toBe(2);
        expect(result.pageSize).toBe(5);
        expect(result.items.length).toBeLessThanOrEqual(5);
      });
  });

  it("INT-04 / C4 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request to search partners without Authorization")
      .withRequest("GET", "/v1/partners/search", (b) => {
        b.query({ search: "ti", page: "1", pageSize: "20" });
        b.headers({ Accept: "application/json" });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          searchPartnersUnauthenticated(mockServer.url, {
            search: "ti",
            page: 1,
            pageSize: 20,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(PartnersApiError);
          const apiErr = err as PartnersApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });

  it("INT-05 / C5 — 400 for short search query", async () => {
    await provider
      .addInteraction()
      .given("search query is too short")
      .uponReceiving("a request to search partners with a single character")
      .withRequest("GET", "/v1/partners/search", (b) => {
        b.query({ search: "a", page: "1", pageSize: "20" });
        b.headers({
          Accept: "application/json",
          Authorization: bearerAuthHeader,
        });
      })
      .willRespondWith(400, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(validationErrorBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          searchPartners(mockServer.url, PACT_USER_TOKEN, {
            search: "a",
            page: 1,
            pageSize: 20,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(PartnersApiError);
          const apiErr = err as PartnersApiError;
          expect(apiErr.status).toBe(400);
          expect(apiErr.body).toMatchObject({ message: expect.any(String) });
          return true;
        });
      });
  });
});
