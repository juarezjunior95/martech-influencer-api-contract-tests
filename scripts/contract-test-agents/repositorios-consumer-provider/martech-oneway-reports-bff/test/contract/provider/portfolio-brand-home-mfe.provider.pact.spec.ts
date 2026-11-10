/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-16
 * Gerado por         : agente 04 (provider-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test, TestingModule } from "@nestjs/testing";
import { Verifier, VerifierOptions } from "@pact-foundation/pact";

import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { ViewController } from "@infrastructure/controllers/view.controller";

import {
  portfolioBrandHomeCountryResponse,
  portfolioBrandHomeResponse,
  portfolioBrandHomeUnknownCountryResponse,
} from "../fixtures/portfolio-brand-home.fixture";
import { buildVerifierOptions } from "../helpers/verifier-options";

const providerState = "portfolio brand home data exists for ABI";
const countryProviderState = "portfolio brand home data exists for SAZ/BRA";
const unknownCountryProviderState =
  "portfolio brand home has no data for country XYZ";

describe("BFF Provider — verifica contrato do MFE (portfolio brand home)", () => {
  let app: NestExpressApplication;

  const processViewUseCase = {
    execute: jest.fn().mockResolvedValue(portfolioBrandHomeResponse),
  };

  const headerContextService = {
    setHeaderContext: jest.fn(),
    getHeaderContext: jest.fn().mockReturnValue(null),
    getPropagatedHeaders: jest.fn().mockImplementation((headers) => headers),
    getRequestTraceId: jest.fn(),
    getCountry: jest.fn().mockReturnValue("ABI"),
  };

  beforeAll(async () => {
    process.env.PACT_PROVIDER_STATE = providerState;

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ViewController],
      providers: [
        { provide: "ICachedProcessViewUseCase", useValue: processViewUseCase },
        { provide: "ClearCacheUseCase", useValue: { execute: jest.fn() } },
        { provide: "IHeaderContextService", useValue: headerContextService },
        HeaderContextInterceptor,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.set("query parser", "extended");
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
      prefix: "v",
    });
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    delete process.env.PACT_PROVIDER_STATE;
    await app?.close();
  });

  it("valida o cenário da home de Portfolio Brand", async () => {
    const { port } = app.getHttpServer().address() as { port: number };

    await new Verifier({
      ...buildVerifierOptions(port),
      stateHandlers: {
        [providerState]: async () => {
          processViewUseCase.execute.mockResolvedValue(
            portfolioBrandHomeResponse,
          );
          return {};
        },
        [countryProviderState]: async () => {
          processViewUseCase.execute.mockResolvedValue(
            portfolioBrandHomeCountryResponse,
          );
          return {};
        },
        [unknownCountryProviderState]: async () => {
          processViewUseCase.execute.mockResolvedValue(
            portfolioBrandHomeUnknownCountryResponse,
          );
          return {};
        },
      },
    } as unknown as VerifierOptions).verifyProvider();
  });
});
