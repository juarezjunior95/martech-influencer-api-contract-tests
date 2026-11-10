/**
 * Testes de contrato (consumer) com Pact.
 *
 * Fontes:
 * - `GET .../overview`: a collection Postman documenta o payload esperado; esse path **não** aparece no OpenAPI
 *   embutido em `Swagger UI_files/swagger-ui-init.js` (só `POST /v1/campaigns` e `PATCH /v1/campaigns/{id}` para campanhas).
 * - `POST /v1/campaigns`: corpo/resposta derivados dos schemas `CreateCampaignRequestDto` / `CreateCampaignResponseDto` do mesmo export Swagger.
 *
 * Uma única instância `Pact` acumula interações num único arquivo em `pacts/`.
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Pact, Matchers } from "@pact-foundation/pact";
import { createCampaign, getCampaignOverview } from "../../src/clients/influencerCampaignClient";

const { like, eachLike, string, uuid } = Matchers;

const pactsDir = path.resolve(process.cwd(), "pacts");

describe("Martech Connect Influencer — consumer pact", () => {
  const provider = new Pact({
    dir: pactsDir,
    consumer: "influencer-portal",
    provider: "martech-connect-influencer-service",
    logLevel: "warn",
  });

  it("POST /v1/campaigns — contrato alinhado ao OpenAPI (CreateCampaign*) do Swagger export", async () => {
    const newId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

    const requestShape = like({
      status: "DRAFT",
      name: string("Campanha Pact"),
    });

    const responseShape = like({
      id: uuid(newId),
    });

    await provider
      .addInteraction()
      .given("serviço aceita criação de campanha em rascunho")
      .uponReceiving("POST campanha com status DRAFT e name (campos obrigatórios OpenAPI)")
      .withRequest("POST", "/v1/campaigns", (b) => {
        b.headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: Matchers.regex(/^Bearer\s+.+$/, "Bearer test-token"),
        });
        b.jsonBody(requestShape);
      })
      .willRespondWith(201, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(responseShape);
      })
      .executeTest(async (mockServer) => {
        const data = await createCampaign(mockServer.url, "test-token", {
          status: "DRAFT",
          name: "Campanha Pact",
        });
        expect(data.id).toBe(newId);
      });
  });

  it("GET /v1/campaigns/{id}/overview — contrato alinhado à collection Postman (MARTGNM); path fora do Swagger export", async () => {
    const campaignId = "11111111-1111-1111-1111-111111111111";

    const overviewShape = like({
      id: uuid(campaignId),
      status: string("ACTIVE"),
      name: string("[QA] Campaign"),
      brand: like({
        id: uuid("22222222-2222-2222-2222-222222222222"),
        name: string("Brand"),
      }),
      megaplatform: like({
        id: uuid("33333333-3333-3333-3333-333333333333"),
        name: string("Megaplatform"),
      }),
      markets: eachLike({
        id: uuid("44444444-4444-4444-4444-444444444444"),
        name: string("Market"),
      }),
      platforms: eachLike({
        id: uuid("55555555-5555-5555-5555-555555555555"),
        name: string("Platform"),
      }),
      keywords: eachLike(string("influencer")),
      dtStart: string("2026-01-01T00:00:00.000Z"),
      dtEnd: string("2026-12-31T23:59:59.000Z"),
      objective: string("AWARENESS"),
      promotionalPartnerCampaignRole: string("STANDARD"),
      budget: like({ amount: 1000, currency: string("BRL") }),
    });

    await provider
      .addInteraction()
      .given("existe campanha com overview completo")
      .uponReceiving("GET overview da campanha com Authorization Bearer")
      .withRequest("GET", `/v1/campaigns/${campaignId}/overview`, (b) => {
        b.headers({
          Accept: "application/json",
          Authorization: Matchers.regex(/^Bearer\s+.+$/, "Bearer test-token"),
        });
      })
      .willRespondWith(200, (b) => {
        b.headers({ "Content-Type": "application/json" });
        b.jsonBody(overviewShape);
      })
      .executeTest(async (mockServer) => {
        const data = await getCampaignOverview(mockServer.url, campaignId, "test-token");
        expect(data.id).toBe(campaignId);
        expect(data.name).toBe("[QA] Campaign");
        expect(data.brand.name).toBe("Brand");
      });
  });
});
