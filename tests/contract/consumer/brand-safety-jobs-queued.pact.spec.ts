/**
 * MARTGNM-5959 — GET /v1/partners/brand-safety/jobs/queued
 * Zephyr: C1–C7 | Ciclo: brand safety M2M pact
 */
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import {
  BrandSafetyApiError,
  listBrandSafetyJobsWrongPath,
  listQueuedBrandSafetyJobs,
  listQueuedBrandSafetyJobsUnauthenticated,
} from "../helpers/brand-safety-client";
import {
  brandSafetyQueuedBody,
  rbacDeniedBody,
} from "../helpers/matchers";
import {
  PACT_M2M_READ_TOKEN,
  PACT_WRONG_SCOPE_TOKEN,
} from "../helpers/pact-tokens";

describe("PACT: GET /v1/partners/brand-safety/jobs/queued (MARTGNM-5959)", () => {
  const provider = createPact("brand-safety-queued");

  it("INT-01 / C1 — 200 queued brand-safety jobs for M2M poll", async () => {
    await provider
      .addInteraction()
      .given("queued brand-safety jobs exist")
      .uponReceiving("a request to list queued brand-safety jobs")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_M2M_READ_TOKEN}`,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandSafetyQueuedBody(1, 25));
      })
      .executeTest(async (mockServer) => {
        const result = await listQueuedBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_READ_TOKEN,
          { page: 1, pageSize: 25 },
        );

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
  });

  it("INT-02 / C2 — 200 empty queue", async () => {
    await provider
      .addInteraction()
      .given("no queued brand-safety jobs")
      .uponReceiving("a request to list queued brand-safety jobs when queue is empty")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_M2M_READ_TOKEN}`,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandSafetyQueuedBody(1, 25));
      })
      .executeTest(async (mockServer) => {
        const result = await listQueuedBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_READ_TOKEN,
          { page: 1, pageSize: 25 },
        );

        expect(result.items).toEqual([]);
        expect(result.total).toBe(0);
      });
  });

  it("INT-03 / C3 — 200 pagination with page=2 and pageSize=5", async () => {
    await provider
      .addInteraction()
      .given("queued brand-safety jobs exist for pagination")
      .uponReceiving("a paginated request to list queued brand-safety jobs")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ page: "2", pageSize: "5" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_M2M_READ_TOKEN}`,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandSafetyQueuedBody(2, 5));
      })
      .executeTest(async (mockServer) => {
        const result = await listQueuedBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_READ_TOKEN,
          { page: 2, pageSize: 5 },
        );

        expect(result.page).toBe(2);
        expect(result.pageSize).toBe(5);
        expect(result.items.length).toBeLessThanOrEqual(5);
      });
  });

  it("INT-04 / C4 — 200 with since and until filters", async () => {
    const since = "2026-01-01T00:00:00Z";
    const until = "2026-12-31T23:59:59Z";

    await provider
      .addInteraction()
      .given("queued brand-safety jobs exist with date filter")
      .uponReceiving("a request to list queued brand-safety jobs filtered by date range")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ since, until, page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_M2M_READ_TOKEN}`,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandSafetyQueuedBody(1, 25));
      })
      .executeTest(async (mockServer) => {
        const result = await listQueuedBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_READ_TOKEN,
          { since, until, page: 1, pageSize: 25 },
        );

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(25);
      });
  });

  it("INT-05 / C5 — 404 for wrong path without /queued", async () => {
    await provider
      .addInteraction()
      .given("brand-safety jobs list path is not exposed")
      .uponReceiving("a request to the wrong brand-safety jobs path")
      .withRequest("GET", "/v1/partners/brand-safety/jobs", (b) => {
        b.query({ page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_M2M_READ_TOKEN}`,
        });
      })
      .willRespondWith(404, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody({ message: "Not Found" });
      })
      .executeTest(async (mockServer) => {
        await expect(
          listBrandSafetyJobsWrongPath(mockServer.url, PACT_M2M_READ_TOKEN, {
            page: 1,
            pageSize: 25,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(BrandSafetyApiError);
          expect((err as BrandSafetyApiError).status).toBe(404);
          return true;
        });
      });
  });

  it("INT-06 / C6 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request to list queued brand-safety jobs without Authorization")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ page: "1", pageSize: "25" });
        b.headers({ Accept: "application/json" });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          listQueuedBrandSafetyJobsUnauthenticated(mockServer.url, {
            page: 1,
            pageSize: 25,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(BrandSafetyApiError);
          const apiErr = err as BrandSafetyApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });

  it("INT-07 / C7 — 403 with token missing brand-safety Read scope", async () => {
    await provider
      .addInteraction()
      .given("token lacks brand-safety read scope")
      .uponReceiving("a request to list queued brand-safety jobs with insufficient scope")
      .withRequest("GET", "/v1/partners/brand-safety/jobs/queued", (b) => {
        b.query({ page: "1", pageSize: "25" });
        b.headers({
          Accept: "application/json",
          Authorization: `Bearer ${PACT_WRONG_SCOPE_TOKEN}`,
        });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          listQueuedBrandSafetyJobs(mockServer.url, PACT_WRONG_SCOPE_TOKEN, {
            page: 1,
            pageSize: 25,
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(BrandSafetyApiError);
          const apiErr = err as BrandSafetyApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });
});
