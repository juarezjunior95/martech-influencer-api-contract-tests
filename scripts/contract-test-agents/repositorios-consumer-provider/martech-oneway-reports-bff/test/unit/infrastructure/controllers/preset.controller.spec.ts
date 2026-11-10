import { Test, TestingModule } from "@nestjs/testing";
import { PresetController } from "@infrastructure/controllers/preset.controller";
import { IProcessPresetUseCase } from "@application/interfaces/process-preset.usecase.interface";
import { CACHED_PROCESS_PRESET_USE_CASE } from "@application/usecases/tokens";

describe("PresetController", () => {
  let controller: PresetController;
  let processPresetUseCase: IProcessPresetUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetController],
      providers: [
        {
          provide: CACHED_PROCESS_PRESET_USE_CASE,
          useValue: { execute: jest.fn() },
        },
        {
          provide: "IHeaderContextService",
          useValue: { getHeaderContext: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<PresetController>(PresetController);
    processPresetUseCase = module.get(CACHED_PROCESS_PRESET_USE_CASE);
  });

  it("returns preset data with empty filter list when none provided", async () => {
    const mock = {
      name: "brands",
      data: {
        brand: { label: "Brand", values: {}, default: [], enabled: true },
      },
    };
    jest.spyOn(processPresetUseCase, "execute").mockResolvedValue(mock);

    const result = await controller.getPreset(mock.name, {});

    expect(result).toEqual(mock);
    expect(processPresetUseCase.execute).toHaveBeenCalledWith(mock.name, []);
  });

  it("maps namespaced filter DTO to a flat filter list", async () => {
    jest
      .spyOn(processPresetUseCase, "execute")
      .mockResolvedValue({ name: "x", data: {} });

    await controller.getPreset("x", {
      years: { no_default: "true" },
      brand: { include_global: "false", countries: "BRA,ARG" },
    });

    expect(processPresetUseCase.execute).toHaveBeenCalledWith(
      "x",
      expect.arrayContaining([
        { namespace: "years", name: "no_default", value: "true" },
        { namespace: "brand", name: "include_global", value: "false" },
        { namespace: "brand", name: "countries", value: "BRA,ARG" },
      ]),
    );
  });

  it("propagates use case errors", async () => {
    jest
      .spyOn(processPresetUseCase, "execute")
      .mockRejectedValue(new Error("boom"));

    await expect(controller.getPreset("x", {})).rejects.toThrow("boom");
  });
});
