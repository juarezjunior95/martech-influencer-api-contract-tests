import { PresetFilterDtoMapper } from "@infrastructure/mappers/preset-filter-dto.mapper";
import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";

describe("PresetFilterDtoMapper", () => {
  it("returns an empty array for an empty/undefined DTO", () => {
    expect(PresetFilterDtoMapper.toFilters({} as PresetFilterDto)).toEqual([]);
    expect(PresetFilterDtoMapper.toFilters(undefined)).toEqual([]);
  });

  it("preserves the legacy single-namespace shape under `filter`", () => {
    const dto: PresetFilterDto = {
      filter: { country: "BRA", brand: "Corona" },
    };

    const result = PresetFilterDtoMapper.toFilters(dto);

    expect(result).toEqual(
      expect.arrayContaining([
        { namespace: "filter", name: "country", value: "BRA" },
        { namespace: "filter", name: "brand", value: "Corona" },
      ]),
    );
    expect(result).toHaveLength(2);
  });

  it("emits one filter per nested key under each namespace", () => {
    const dto: PresetFilterDto = {
      years: { no_default: "true" },
      brand: { include_global: "false", countries: "BRA,ARG" },
    };

    const result = PresetFilterDtoMapper.toFilters(dto);

    expect(result).toEqual(
      expect.arrayContaining([
        { namespace: "years", name: "no_default", value: "true" },
        { namespace: "brand", name: "include_global", value: "false" },
        { namespace: "brand", name: "countries", value: "BRA,ARG" },
      ]),
    );
    expect(result).toHaveLength(3);
  });

  it("ignores unknown top-level keys whose value is not an object", () => {
    const dto = {
      stray: "ignored",
      brand: { include_global: "true" },
    } as PresetFilterDto;

    const result = PresetFilterDtoMapper.toFilters(dto);

    expect(result).toEqual([
      { namespace: "brand", name: "include_global", value: "true" },
    ]);
  });

  it("skips null/undefined leaf values", () => {
    const dto = {
      brand: { include_global: null as unknown as string, countries: "BRA" },
    } as PresetFilterDto;

    const result = PresetFilterDtoMapper.toFilters(dto);

    expect(result).toEqual([
      { namespace: "brand", name: "countries", value: "BRA" },
    ]);
  });
});
