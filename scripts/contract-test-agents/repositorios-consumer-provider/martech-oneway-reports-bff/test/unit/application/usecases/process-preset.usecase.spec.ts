import { Test, TestingModule } from "@nestjs/testing";
import { ProcessPresetUseCase } from "@application/usecases/process-preset.usecase";
import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { IPresetRepository } from "@domain/repositories/preset.repository.interface";
import { IPresetFormatterRepository } from "@domain/repositories/preset-formatter.repository.interface";

describe("ProcessPresetUseCase", () => {
  let usecase: ProcessPresetUseCase;
  let configRepo: jest.Mocked<IPresetConfigRepository>;
  let presetRepo: jest.Mocked<IPresetRepository>;
  let formatterRepo: jest.Mocked<IPresetFormatterRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPresetUseCase,
        {
          provide: "IPresetConfigRepository",
          useValue: { getByName: jest.fn() },
        },
        {
          provide: "IPresetRepository",
          useValue: { getPreset: jest.fn() },
        },
        {
          provide: "IPresetFormatterRepository",
          useValue: { format: jest.fn() },
        },
      ],
    }).compile();

    usecase = module.get(ProcessPresetUseCase);
    configRepo = module.get("IPresetConfigRepository");
    presetRepo = module.get("IPresetRepository");
    formatterRepo = module.get("IPresetFormatterRepository");
  });

  it("fetches preset from data-service and skips formatter when not configured", async () => {
    configRepo.getByName.mockResolvedValue({
      version: "1.0.0",
      preset: { years: {} },
    });
    const rawData = { years: { label: "Full Year list", options: [] } };
    presetRepo.getPreset.mockResolvedValue(rawData);

    const result = await usecase.execute("years");

    expect(configRepo.getByName).toHaveBeenCalledWith("years");
    expect(presetRepo.getPreset).toHaveBeenCalledWith("years", []);
    expect(formatterRepo.format).not.toHaveBeenCalled();
    expect(result).toEqual({ name: "years", data: rawData });
  });

  it("applies formatter when configured", async () => {
    configRepo.getByName.mockResolvedValue({
      version: "1.0.0",
      preset: { overview: {} },
      formatter: "presets/overview",
    });
    const raw = { a: 1 };
    const formatted = { a: 2 };
    presetRepo.getPreset.mockResolvedValue(raw);
    formatterRepo.format.mockResolvedValue(formatted);

    const result = await usecase.execute("overview", [
      { name: "country", value: "BRA" },
    ]);

    expect(presetRepo.getPreset).toHaveBeenCalledWith("overview", [
      { name: "country", value: "BRA" },
    ]);
    expect(formatterRepo.format).toHaveBeenCalledWith("presets/overview", raw);
    expect(result).toEqual({ name: "overview", data: formatted });
  });

  it("throws PresetNotFoundError when config is missing", async () => {
    configRepo.getByName.mockResolvedValue(null);
    await expect(usecase.execute("missing")).rejects.toThrow(/not found/i);
  });

  it("forwards per-ref fixed filters declared in the object form", async () => {
    configRepo.getByName.mockResolvedValue({
      version: "1.0.0",
      preset: {
        country: {},
        years: {
          filters: [{ name: "no_default", value: true }],
        },
      },
    });
    presetRepo.getPreset.mockImplementation(async (ref) => ({ [ref]: {} }));

    await usecase.execute("home");

    expect(presetRepo.getPreset).toHaveBeenCalledWith("country", []);
    expect(presetRepo.getPreset).toHaveBeenCalledWith("years", [
      { namespace: "years", name: "no_default", value: true },
    ]);
  });

  it("merges query filters with fixed filters and lets query override on collision", async () => {
    configRepo.getByName.mockResolvedValue({
      version: "1.0.0",
      preset: {
        years: {
          filters: [
            { name: "no_default", value: true },
            { name: "start_year", value: 2020 },
          ],
        },
      },
    });
    presetRepo.getPreset.mockImplementation(async (ref) => ({ [ref]: {} }));

    await usecase.execute("home", [
      { namespace: "years", name: "no_default", value: false },
    ]);

    expect(presetRepo.getPreset).toHaveBeenCalledWith("years", [
      { namespace: "years", name: "start_year", value: 2020 },
      { namespace: "years", name: "no_default", value: false },
    ]);
  });

  it("applies per-ref formatter on object preset branches", async () => {
    configRepo.getByName.mockResolvedValue({
      version: "1.0.0",
      preset: {
        zone: {},
        "time-frame": {
          formatter: "presets/filter-name-normalization",
        },
      },
    });
    presetRepo.getPreset.mockImplementation(async (ref) => ({
      [ref]: { options: [] },
    }));
    formatterRepo.format.mockResolvedValue({ time_frame: { options: [] } });

    const result = await usecase.execute("home");

    expect(formatterRepo.format).toHaveBeenCalledWith(
      "presets/filter-name-normalization",
      { "time-frame": { options: [] } },
    );
    expect(result.data).toEqual({
      zone: { options: [] },
      time_frame: { options: [] },
    });
  });
});
