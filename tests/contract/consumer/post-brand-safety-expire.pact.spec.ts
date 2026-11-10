/**
 * MARTGNM-5965 — POST /v1/partners/brand-safety/jobs/expire
 * Sprint 204 — Zephyr C1–C3 (OpenAPI: 200 + ExpirePartnerBrandSafetyJobsResponseDto)
 */
import { describe, expect, it } from "vitest";
import {
  BrandSafetyApiError,
  expireBrandSafetyJobs,
  expireBrandSafetyJobsUnauthenticated,
} from "../helpers/brand-safety-client";
import { createPact } from "../helpers/pact-config";
import {
  bearerAuthHeaderFor,
  expireBrandSafetyJobsBody,
  rbacDeniedBody,
} from "../helpers/matchers";
import { PACT_M2M_WRITE_TOKEN } from "../helpers/pact-tokens";

const expirePath = "/v1/partners/brand-safety/jobs/expire";

describe("PACT: POST /v1/partners/brand-safety/jobs/expire (MARTGNM-5965)", () => {
  const provider = createPact("5965-brand-safety-expire");
  const m2mAuth = bearerAuthHeaderFor(PACT_M2M_WRITE_TOKEN);

  it("INT-5965-01 / C1 — 200 expire queued jobs", async () => {
    await provider
      .addInteraction()
      .given("brand-safety jobs can expire")
      .uponReceiving("expire obsolete brand-safety jobs")
      .withRequest("POST", expirePath, (b) => {
        b.headers({
          Accept: "application/json",
          Authorization: m2mAuth,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(expireBrandSafetyJobsBody);
      })
      .executeTest(async (mockServer) => {
        const result = await expireBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_WRITE_TOKEN,
        );
        expect(result.expiredCount).toBeGreaterThanOrEqual(0);
      });
  });

  it("INT-5965-02 / C2 — 200 idempotent second expire", async () => {
    await provider
      .addInteraction()
      .given("expire already applied")
      .uponReceiving("expire brand-safety jobs when expire already applied")
      .withRequest("POST", expirePath, (b) => {
        b.headers({
          Accept: "application/json",
          Authorization: m2mAuth,
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(expireBrandSafetyJobsBody);
      })
      .executeTest(async (mockServer) => {
        const result = await expireBrandSafetyJobs(
          mockServer.url,
          PACT_M2M_WRITE_TOKEN,
        );
        expect(result.expiredCount).toBeGreaterThanOrEqual(0);
      });
  });

  it("INT-5965-03 / C3 — 403 without Authorization (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("expire brand-safety jobs without Authorization")
      .withRequest("POST", expirePath, (b) => {
        b.headers({ Accept: "application/json" });
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          expireBrandSafetyJobsUnauthenticated(mockServer.url),
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
