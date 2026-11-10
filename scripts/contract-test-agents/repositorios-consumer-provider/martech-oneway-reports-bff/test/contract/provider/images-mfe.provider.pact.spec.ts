/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : arquivo OpenAPI local não versionado (versão: 3.0.0)
 * Endpoint coberto   : GET /images/brand e GET /images/country
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 04 (provider-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, VersioningType } from "@nestjs/common";
import { Verifier, VerifierOptions } from "@pact-foundation/pact";
import { ImagesController } from "@modules/images/images.controller";
import { ImagesProxyService } from "@modules/images/images-proxy.service";

import { IMAGES_FIXTURES, ImagesScenario } from "../fixtures/images.fixtures";
import { buildVerifierOptions } from "../helpers/verifier-options";
import { createImagesStateHandlers } from "../states/images.states";

/**
 * Provider : martech-oneway-reports-bff
 * Consumer : martech-theloophub-mfe
 *
 * O Verifier lê o pact gerado pelo MFE e reproduz cada interação
 * contra o BFF real. O ImagesProxyService é mockado para isolar
 * o BFF do Data Service.
 */
describe("BFF Provider — verifica contrato do MFE (images)", () => {
  let app: INestApplication;
  let activeScenario: ImagesScenario = "brand-corona";

  const proxyMock: jest.Mocked<
    Pick<ImagesProxyService, "proxyBrand" | "proxyCountry">
  > = {
    proxyBrand: jest.fn(),
    proxyCountry: jest.fn(),
  };

  const wireProxyMocks = (): void => {
    const fixture = IMAGES_FIXTURES[activeScenario];

    proxyMock.proxyBrand.mockResolvedValue(
      fixture.brand ?? {
        url: "",
        matched: [],
        image_variants: {},
      },
    );
    proxyMock.proxyCountry.mockResolvedValue(
      fixture.country ?? {
        url: "",
        matched: [],
      },
    );
  };

  const tearDownScenario = async (): Promise<Record<string, never>> => {
    proxyMock.proxyBrand.mockReset();
    proxyMock.proxyCountry.mockReset();
    activeScenario = "brand-corona";
    wireProxyMocks();
    return {};
  };

  const setActiveScenario = (scenario: ImagesScenario): void => {
    activeScenario = scenario;
  };

  beforeAll(async () => {
    process.env.PACT_DESCRIPTION = "/images";

    wireProxyMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        { provide: ImagesProxyService, useValue: proxyMock },
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
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
      prefix: "v",
    });
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    delete process.env.PACT_DESCRIPTION;
    await app?.close();
  });

  it("valida todos os cenários do pact gerado pelo MFE", async () => {
    const { port } = app.getHttpServer().address() as { port: number };

    await new Verifier({
      ...buildVerifierOptions(port),
      afterEach: tearDownScenario,
      stateHandlers: createImagesStateHandlers({
        setActiveScenario,
        tearDownScenario,
        wireProxyMocks,
      }),
    } as unknown as VerifierOptions).verifyProvider();
  });
});
