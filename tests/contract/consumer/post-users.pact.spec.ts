/**
 * MARTGNM-5960 — POST /v1/users
 * Zephyr: C1–C5
 */
import { Matchers } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { createPact } from "../helpers/pact-config";
import userRefs from "../fixtures/post-user-references.json";
import {
  conflictErrorBody,
  bearerAuthHeaderFor,
  createdResourceBody,
  rbacDeniedBody,
  unprocessableEntityBody,
} from "../helpers/matchers";
import { PACT_ADMIN_TOKEN } from "../helpers/pact-tokens";
import {
  UsersApiError,
  createUser,
  createUserUnauthenticated,
} from "../helpers/users-client";

const { like, uuid, string, eachLike } = Matchers;

describe("PACT: POST /v1/users (MARTGNM-5960)", () => {
  const provider = createPact("post-users");
  const adminAuth = bearerAuthHeaderFor(PACT_ADMIN_TOKEN);

  const validUserBody = {
    email: "submitter@pact.test",
    roleTitleId: userRefs.roleTitleId,
    marketIds: [userRefs.marketId],
    brandIds: [userRefs.brandId],
    zoneIds: [userRefs.zoneId],
  };

  const validUserRequestMatcher = like({
    email: string("submitter@pact.test"),
    roleTitleId: uuid(userRefs.roleTitleId),
    marketIds: eachLike(uuid(userRefs.marketId)),
    brandIds: eachLike(uuid(userRefs.brandId)),
    zoneIds: eachLike(uuid(userRefs.zoneId)),
  });

  it("INT-01 / C1 — 201 creates user with valid body", async () => {
    await provider
      .addInteraction()
      .given("reference UUIDs exist for user creation")
      .uponReceiving("a request to create a user")
      .withRequest("POST", "/v1/users", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: adminAuth,
        });
        b.jsonBody(validUserRequestMatcher);
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(createdResourceBody);
      })
      .executeTest(async (mockServer) => {
        const result = await createUser(
          mockServer.url,
          PACT_ADMIN_TOKEN,
          validUserBody,
        );
        expect(result.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        );
      });
  });

  it("INT-02 / C2 — 422 invalid UUID references", async () => {
    const invalidBody = {
      email: "invalid-refs@pact.test",
      roleTitleId: userRefs.invalidUuid,
      marketIds: [userRefs.invalidUuid],
      brandIds: [userRefs.brandId],
      zoneIds: [userRefs.zoneId],
    };

    await provider
      .addInteraction()
      .given("invalid UUID references in user body")
      .uponReceiving("a request to create a user with invalid UUID references")
      .withRequest("POST", "/v1/users", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: adminAuth,
        });
        b.jsonBody(
          like({
            email: string("invalid-refs@pact.test"),
            roleTitleId: string(userRefs.invalidUuid),
            marketIds: eachLike(string(userRefs.invalidUuid)),
            brandIds: eachLike(uuid(userRefs.brandId)),
            zoneIds: eachLike(uuid(userRefs.zoneId)),
          }),
        );
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createUser(mockServer.url, PACT_ADMIN_TOKEN, invalidBody),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(UsersApiError);
          expect((err as UsersApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-03 / C3 — 422 missing required email", async () => {
    const bodyWithoutEmail = {
      roleTitleId: userRefs.roleTitleId,
      marketIds: [userRefs.marketId],
      brandIds: [userRefs.brandId],
      zoneIds: [userRefs.zoneId],
    };

    await provider
      .addInteraction()
      .given("missing required user fields")
      .uponReceiving("a request to create a user without email")
      .withRequest("POST", "/v1/users", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: adminAuth,
        });
        b.jsonBody(
          like({
            roleTitleId: uuid(userRefs.roleTitleId),
            marketIds: eachLike(uuid(userRefs.marketId)),
            brandIds: eachLike(uuid(userRefs.brandId)),
            zoneIds: eachLike(uuid(userRefs.zoneId)),
          }),
        );
      })
      .willRespondWith(422, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(unprocessableEntityBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createUser(mockServer.url, PACT_ADMIN_TOKEN, bodyWithoutEmail),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(UsersApiError);
          expect((err as UsersApiError).status).toBe(422);
          return true;
        });
      });
  });

  it("INT-04 / C4 — 409 duplicate email", async () => {
    const duplicateBody = {
      ...validUserBody,
      email: userRefs.duplicateEmail,
    };

    await provider
      .addInteraction()
      .given("user with email already exists")
      .uponReceiving("a request to create a user with duplicate email")
      .withRequest("POST", "/v1/users", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: adminAuth,
        });
        b.jsonBody(
          like({
            email: string(userRefs.duplicateEmail),
            roleTitleId: uuid(userRefs.roleTitleId),
            marketIds: eachLike(uuid(userRefs.marketId)),
            brandIds: eachLike(uuid(userRefs.brandId)),
            zoneIds: eachLike(uuid(userRefs.zoneId)),
          }),
        );
      })
      .willRespondWith(409, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(conflictErrorBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createUser(mockServer.url, PACT_ADMIN_TOKEN, duplicateBody),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(UsersApiError);
          expect((err as UsersApiError).status).toBe(409);
          return true;
        });
      });
  });

  it("INT-05 / C5 — 403 without Authorization header (UAT RBAC)", async () => {
    await provider
      .addInteraction()
      .given("request is unauthenticated")
      .uponReceiving("a request to create a user without Authorization")
      .withRequest("POST", "/v1/users", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        });
        b.jsonBody(validUserRequestMatcher);
      })
      .willRespondWith(403, (b) => {
        b.headers({ "Content-Type": "text/plain" });
        b.body("text/plain", rbacDeniedBody);
      })
      .executeTest(async (mockServer) => {
        await expect(
          createUserUnauthenticated(mockServer.url, validUserBody),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(UsersApiError);
          const apiErr = err as UsersApiError;
          expect(apiErr.status).toBe(403);
          expect(apiErr.body).toBe("RBAC: access denied");
          return true;
        });
      });
  });
});
