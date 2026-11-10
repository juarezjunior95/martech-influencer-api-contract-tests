/**
 * MARTGNM-5962 — POST /v1/partners/{partnerId}/deck/brand-safety
 * Sprint 204 — Zephyr C1–C3
 */
import { Matchers } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import {
  BrandSafetyApiError,
  enqueuePartnerDeckBrandSafety,
  enqueuePartnerDeckBrandSafetyUnauthenticated,
} from "../helpers/brand-safety-client";
import { createPact } from "../helpers/pact-config";
import {
  bearerAuthHeaderFor,
  createdResourceBody,
  deckBrandSafetyVariantMatcher,
  rbacDeniedBody,
  unprocessableEntityBody,
} from "../helpers/matchers";
import { STUB_PARTNER_ID } from "../helpers/pact-stub-ids";
import { PACT_SUBMITTER_TOKEN } from "../helpers/pact-tokens";

const { like, string } = Matchers;
const deckPath = `/v1/partners/${STUB_PARTNER_ID}/deck/brand-safety`;

describe("PACT: POST /v1/partners/{partnerId}/deck/brand-safety (MARTGNM-5962)", () => {
  const provider = createPact("5962-deck-brand-safety");
  const submitterAuth = bearerAuthHeaderFor(PACT_SUBMITTER_TOKEN);

  it("INT-5962-01 / C1 — 201 enqueue public variant", async () => {
    await provider
      .addInteraction()
      .given("partner deck brand-safety enqueue succeeds")
      .uponReceiving("enqueue brand-safety for partner deck")
      .withRequest("POST", deckPath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(like({ variant: deckBrandSafetyVariantMatcher }));
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await enqueuePartnerDeckBrandSafety(
          mockServer.url,
          STUB_PARTNER_ID,
          PACT_SUBMITTER_TOKEN,
          { variant: "public" },
        );
        expect(result.id).toBeDefined();
      });
  });

  it("INT-5962-02 / C2 — 422 invalid variant", async () => {
    await provider
      .addInteraction()
      .given("partner deck brand-safety enqueue succeeds")
      .uponReceiving("enqueue brand-safety with invalid variant")
      .withRequest("POST", deckPath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: submitterAuth,
        });
        b.jsonBody(like({ variant: string("invalid") }));
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          enqueuePartnerDeckBrandSafety(
            mockServer.url,
            STUB_PARTNER_ID,
            PACT_SUBMITTER_TOKEN,
            { variant: "invalid" as "public" },
          ),
        ).rejects.toBeInstanceOf(BrandSafetyApiError);
      });
  });

  it("INT-5962-03 / C3 — 403 without Authorization (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("enqueue brand-safety without Authorization")
      .withRequest("POST", deckPath, (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        });
        b.jsonBody(like({ variant: deckBrandSafetyVariantMatcher }));
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          enqueuePartnerDeckBrandSafetyUnauthenticated(
            mockServer.url,
            STUB_PARTNER_ID,
            { variant: "public" },
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
