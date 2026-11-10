/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-27
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

import { tradeExecutionHomeResponse } from "../fixtures/trade-execution-home.fixture";
import { buildVerifierOptions } from "../helpers/verifier-options";

const providerState = "trade execution home distribution data exists for ABI";

describe("BFF Provider — verifica contrato do MFE (trade execution home)", () => {
  let app: NestExpressApplication;

  const processViewUseCase = {
    execute: jest.fn().mockResolvedValue(tradeExecutionHomeResponse),
  };

  const headerContextService = {
    setHeaderContext: jest.fn(),
    getHeaderContext: jest.fn().mockReturnValue(null),
    getPropagatedHeaders: jest.fn().mockImplementation((headers) => headers),
    getRequestTraceId: jest.fn(),
    getCountry: jest.fn().mockReturnValue("ABI"),
  };

  beforeAll(async () => {
    process.env.PACT_PROVIDER_STATE = "trade execution home";

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

  it("valida o cenário dos cards de distribuição da home", async () => {
    const { port } = app.getHttpServer().address() as { port: number };

    await new Verifier({
      ...buildVerifierOptions(port),
      stateHandlers: {
        [providerState]: async () => {
          processViewUseCase.execute.mockResolvedValue(
            tradeExecutionHomeResponse,
          );
          return {};
        },
      },
    } as unknown as VerifierOptions).verifyProvider();
  });
});
