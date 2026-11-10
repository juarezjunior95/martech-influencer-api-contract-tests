/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-21
 * Gerado por         : agente 04 (provider-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { Test, TestingModule } from "@nestjs/testing";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Verifier, VerifierOptions } from "@pact-foundation/pact";

import { ViewController } from "@infrastructure/controllers/view.controller";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";

import { buildVerifierOptions } from "../helpers/verifier-options";
import { categoryPosBookGrowTheCategoryCohortResponse } from "../fixtures/category-pos-book-grow-the-category-cohort.fixture";

describe("BFF Provider — verifica contrato do MFE (category POS Book cohort)", () => {
  let app: NestExpressApplication;

  const processViewUseCase = {
    execute: jest
      .fn()
      .mockResolvedValue(categoryPosBookGrowTheCategoryCohortResponse),
  };

  const headerContextService = {
    setHeaderContext: jest.fn(),
    getHeaderContext: jest.fn().mockReturnValue(null),
    getPropagatedHeaders: jest.fn().mockImplementation((headers) => headers),
    getRequestTraceId: jest.fn(),
    getCountry: jest.fn(),
  };

  beforeAll(async () => {
    process.env.PACT_PROVIDER_STATE = "category POS Book cohort";

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

  it("valida o cenário de cohort do category POS Book", async () => {
    const { port } = app.getHttpServer().address() as { port: number };

    await new Verifier({
      ...buildVerifierOptions(port),
      stateHandlers: {
        "category POS Book cohort data exists for ABI": async () => ({}),
      },
    } as unknown as VerifierOptions).verifyProvider();
  });
});
