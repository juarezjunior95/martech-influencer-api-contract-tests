/**
 * MARTGNM-5963 — POST /v1/partners/brand-safety/jobs/{id}/complete
 * Sprint 204 — Zephyr C1–C4
 */
import { Matchers } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import completeFixture from "../fixtures/complete-201.json";
import {
  BrandSafetyApiError,
  completeBrandSafetyJob,
  completeBrandSafetyJobUnauthenticated,
  type CompleteBrandSafetyJobBody,
} from "../helpers/brand-safety-client";
import { createPact } from "../helpers/pact-config";
import {
  bearerAuthHeaderFor,
  brandSafetyJobAlreadyCompletedBody,
  createdResourceBody,
  rbacDeniedBody,
  unprocessableEntityBody,
} from "../helpers/matchers";
import { STUB_JOB_ID } from "../helpers/pact-stub-ids";
import { PACT_M2M_WRITE_TOKEN } from "../helpers/pact-tokens";

const { like, integer, string, eachLike } = Matchers;
const completePath = `/v1/partners/brand-safety/jobs/${STUB_JOB_ID}/complete`;

describe("PACT: POST /v1/partners/brand-safety/jobs/{id}/complete (MARTGNM-5963)", () => {
  const provider = createPact("5963-brand-safety-complete");
  const m2mAuth = bearerAuthHeaderFor(PACT_M2M_WRITE_TOKEN);

  const happyBody: CompleteBrandSafetyJobBody = {
    completedAt: completeFixture.completedAt,
    summary: completeFixture.summary,
    shortSummary: completeFixture.shortSummary,
    score: completeFixture.score,
    contents: completeFixture.contents,
  };

  const completeBodyMatcher = like({
    completedAt: string(completeFixture.completedAt),
    summary: string(completeFixture.summary),
    shortSummary: string(completeFixture.shortSummary),
    score: integer(completeFixture.score),
    contents: eachLike(like({}), 0),
  });

  it("INT-5963-01 / C1 — 201 complete job with score", async () => {
    await provider
      .addInteraction()
      .given("queued brand-safety job exists")
      .uponReceiving("complete queued brand-safety job")
      .withRequest("POST", completePath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: m2mAuth,
        });
        b.jsonBody(completeBodyMatcher);
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await completeBrandSafetyJob(
          mockServer.url,
          STUB_JOB_ID,
          PACT_M2M_WRITE_TOKEN,
          happyBody,
        );
        expect(result.id).toBeDefined();
      });
  });

  it("INT-5963-02 / C2 — 422 missing required fields", async () => {
    await provider
      .addInteraction()
      .given("queued brand-safety job exists")
      .uponReceiving("complete brand-safety job without score")
      .withRequest("POST", completePath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: m2mAuth,
        });
        b.jsonBody(like({}));
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          completeBrandSafetyJob(
            mockServer.url,
            STUB_JOB_ID,
            PACT_M2M_WRITE_TOKEN,
            {} as CompleteBrandSafetyJobBody,
          ),
        ).rejects.toBeInstanceOf(BrandSafetyApiError);
      });
  });

  it("INT-5963-03 / C3 — 409 job already completed", async () => {
    await provider
      .addInteraction()
      .given("brand-safety job already completed")
      .uponReceiving("complete brand-safety job that is already completed")
      .withRequest("POST", completePath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: m2mAuth,
        });
        b.jsonBody(completeBodyMatcher);
      })
      .willRespondWith(409, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(brandSafetyJobAlreadyCompletedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          completeBrandSafetyJob(
            mockServer.url,
            STUB_JOB_ID,
            PACT_M2M_WRITE_TOKEN,
            happyBody,
          ),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(BrandSafetyApiError);
          expect((err as BrandSafetyApiError).status).toBe(409);
          return true;
        });
      });
  });

  it("INT-5963-04 / C4 — 403 without Authorization (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("complete brand-safety job without Authorization")
      .withRequest("POST", completePath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        });
        b.jsonBody(completeBodyMatcher);
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          completeBrandSafetyJobUnauthenticated(
            mockServer.url,
            STUB_JOB_ID,
            happyBody,
          ),
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
