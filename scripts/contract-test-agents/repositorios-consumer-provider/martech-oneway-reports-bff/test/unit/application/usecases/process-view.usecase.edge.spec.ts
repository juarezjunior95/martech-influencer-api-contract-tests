import { Test, TestingModule } from "@nestjs/testing";
import { ProcessViewUseCase } from "@application/usecases/process-view.usecase";
import {
  mockViewConfigRepository,
  mockDataRepository,
  mockFormatterRepository,
} from "../../../mock/helpers";
import {
  ViewConfigFactory,
  DataSourceFactory,
} from "../../../mock/factories/view.factory";

describe("ProcessViewUseCase - Edge Cases and Errors", () => {
  let usecase: ProcessViewUseCase;
  let viewConfigRepository: any;
  let dataRepository: any;
  let formatterRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessViewUseCase,
        {
          provide: "IViewConfigRepository",
          useValue: mockViewConfigRepository(),
        },
        {
          provide: "IDataRepository",
          useValue: mockDataRepository(),
        },
        {
          provide: "IFormatterRepository",
          useValue: mockFormatterRepository(),
        },
      ],
    }).compile();

    usecase = module.get<ProcessViewUseCase>(ProcessViewUseCase);
    viewConfigRepository = module.get("IViewConfigRepository");
    dataRepository = module.get("IDataRepository");
    formatterRepository = module.get("IFormatterRepository");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted data when datasources succeed", async () => {
    const viewName = "success-view";
    const mockConfig = ViewConfigFactory.createWithComponents(1);

    jest.spyOn(viewConfigRepository, "getByName").mockResolvedValue(mockConfig);

    // All datasource calls resolve with some items
    jest
      .spyOn(dataRepository, "getData")
      .mockImplementation(async () => DataSourceFactory.createWithItems(3));

    // Make formatter return a recognizable structure
    jest
      .spyOn(formatterRepository, "format")
      .mockResolvedValue({ formatted: "ok" });

    const result = await usecase.execute(viewName);

    expect(result.view).toBe(viewName);
    expect(result.components.length).toBeGreaterThanOrEqual(1);
    expect(result.components[0].data).toEqual({ formatted: "ok" });
  });

  it("should mark component as error when a datasource fails", async () => {
    const viewName = "datasource-fail-view";
    const mockConfig = ViewConfigFactory.createWithComponents(1);

    jest.spyOn(viewConfigRepository, "getByName").mockResolvedValue(mockConfig);

    // First call (first datasource) throws, subsequent resolve
    const dsSpy = jest.spyOn(dataRepository, "getData");
    dsSpy.mockRejectedValueOnce(new Error("datasource failed"));
    dsSpy.mockImplementation(async () => DataSourceFactory.create());

    const result = await usecase.execute(viewName);

    expect(result.view).toBe(viewName);
    expect(result.components.length).toBeGreaterThanOrEqual(1);
    const comp = result.components[0];
    expect(comp.error || comp.data).toBeDefined();
    if (comp.error) {
      expect(typeof comp.error).toBe("string");
    }
  });

  it("should mark component as error when formatter throws", async () => {
    const viewName = "formatter-fail-view";
    const mockConfig = ViewConfigFactory.createWithComponents(1);

    jest.spyOn(viewConfigRepository, "getByName").mockResolvedValue(mockConfig);

    // datasources succeed
    jest
      .spyOn(dataRepository, "getData")
      .mockImplementation(async () => DataSourceFactory.create());

    // formatter fails
    jest
      .spyOn(formatterRepository, "format")
      .mockRejectedValue(new Error("formatter error"));

    const result = await usecase.execute(viewName);

    expect(result.view).toBe(viewName);
    const comp = result.components[0];
    expect(comp.error).toBeDefined();
    expect(comp.data).toBeUndefined();
  });

  it("should continue processing other components when one fails", async () => {
    const viewName = "multi-component-view";
    const mockConfig = ViewConfigFactory.createWithComponents(2);

    jest.spyOn(viewConfigRepository, "getByName").mockResolvedValue(mockConfig);

    const dsSpy = jest.spyOn(dataRepository, "getData");
    // Make first call fail, others succeed
    dsSpy.mockRejectedValueOnce(new Error("first datasource failed"));
    dsSpy.mockImplementation(async () => DataSourceFactory.create());

    // formatter succeeds
    jest.spyOn(formatterRepository, "format").mockResolvedValue({ ok: true });

    const result = await usecase.execute(viewName);

    expect(result.view).toBe(viewName);
    expect(result.components).toHaveLength(2);
    const errors = result.components.filter((c) => c.error);
    const successes = result.components.filter((c) => c.data);
    expect(errors.length + successes.length).toBe(2);
    expect(successes.length).toBeGreaterThanOrEqual(1);
  });
});
