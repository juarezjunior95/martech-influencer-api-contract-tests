/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : arquivo OpenAPI local não versionado (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 04 (provider-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { VersioningType } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Verifier, VerifierOptions } from "@pact-foundation/pact";

import { ViewController } from "@infrastructure/controllers/view.controller";
import { ProcessViewUseCase } from "@application/usecases/process-view.usecase";
import { FormatterRepository } from "@infrastructure/repositories/formatter.repository";
import { IDataRepository } from "@domain/repositories/datasource.repository.interface";
import { IViewConfigRepository } from "@domain/repositories/view-config.repository.interface";
import { DataSource } from "@domain/entities/view.entity";
import overviewViewConfig from "@domain/config/views/value-creation/portfolio-performance/overview/overview.view";

import {
  PORTFOLIO_BRANDS_DS,
  PORTFOLIO_PERFORMANCE_DS,
  PORTFOLIO_VIEW_NAME,
} from "../constants";
import {
  PactScenario,
  SCENARIO_FIXTURES,
} from "../fixtures/portfolio-performance.fixtures";
import { PactCompressedResponseInterceptor } from "../helpers/pact-compressed-response.interceptor";
import { buildVerifierOptions } from "../helpers/verifier-options";
import { createPortfolioPerformanceStateHandlers } from "../states/portfolio-performance.states";

describe("BFF Provider — verifica contrato do MFE (portfolio performance)", () => {
  let app: NestExpressApplication;

  let activeScenario: PactScenario = "full";

  const dataRepositoryMock: jest.Mocked<Pick<IDataRepository, "getData">> = {
    getData: jest.fn(),
  };

  const resolveFixtures = (datasource: string): unknown[] => {
    const fixtures = SCENARIO_FIXTURES[activeScenario];

    if (datasource === PORTFOLIO_PERFORMANCE_DS) return fixtures.performance;
    if (datasource === PORTFOLIO_BRANDS_DS) return fixtures.brands;
    return [];
  };

  const wireDataRepositoryMock = (): void => {
    dataRepositoryMock.getData.mockImplementation(
      async (datasource: string): Promise<DataSource> => ({
        name: datasource,
        data: resolveFixtures(datasource) as DataSource["data"],
      }),
    );
  };

  const tearDownScenario = async (): Promise<void> => {
    dataRepositoryMock.getData.mockReset();
    activeScenario = "full";
    wireDataRepositoryMock();
  };

  const setActiveScenario = (scenario: PactScenario): void => {
    activeScenario = scenario;
  };

  beforeAll(async () => {
    delete process.env.PACT_DESCRIPTION;
    process.env.PACT_PROVIDER_STATE = "portfolio performance";

    wireDataRepositoryMock();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ViewController],
      providers: [
        ProcessViewUseCase,
        FormatterRepository,
        {
          provide: "ICachedProcessViewUseCase",
          useExisting: ProcessViewUseCase,
        },
        {
          provide: "IProcessViewUseCase",
          useExisting: ProcessViewUseCase,
        },
        {
          provide: "IDataRepository",
          useValue: dataRepositoryMock,
        },
        {
          provide: "IViewConfigRepository",
          useValue: {
            getByName: jest.fn(async (view: string) =>
              view === PORTFOLIO_VIEW_NAME ? overviewViewConfig : null,
            ),
          } satisfies IViewConfigRepository,
        },
        {
          provide: "IFormatterRepository",
          useExisting: FormatterRepository,
        },
        {
          provide: "IEnvironmentConfigService",
          useValue: {
            env: "test",
            viewCache: { enabled: false },
          },
        },
        {
          provide: "ClearCacheUseCase",
          useValue: { execute: jest.fn() },
        },
        {
          provide: "IHeaderContextService",
          useValue: {
            setHeaderContext: jest.fn(),
            getHeaderContext: jest.fn().mockReturnValue(null),
            getPropagatedHeaders: jest.fn().mockImplementation((h) => h),
            getRequestTraceId: jest.fn(),
            getCountry: jest.fn(),
          },
        },
        PactCompressedResponseInterceptor,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.set("query parser", "extended");
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
      prefix: "v",
    });

    app.useGlobalInterceptors(app.get(PactCompressedResponseInterceptor));

    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    delete process.env.PACT_PROVIDER_STATE;
    await app?.close();
  });

  it("valida todos os cenários de portfolio performance do pact gerado pelo MFE", async () => {
    const { port } = app.getHttpServer().address() as { port: number };

    await new Verifier({
      ...buildVerifierOptions(port),
      afterEach: tearDownScenario,
      stateHandlers: createPortfolioPerformanceStateHandlers({
        setActiveScenario,
        tearDownScenario,
        wireDataRepositoryMock,
      }),
    } as unknown as VerifierOptions).verifyProvider();
  });
});
