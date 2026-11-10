import { PresetFilterDtoMapper } from "@infrastructure/mappers/preset-filter-dto.mapper";
import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";

describe("PresetFilterDtoMapper (BFF)", () => {
  it("returns an empty array when DTO is empty/undefined", () => {
    expect(PresetFilterDtoMapper.toFilters({} as PresetFilterDto)).toEqual([]);
    expect(PresetFilterDtoMapper.toFilters(undefined)).toEqual([]);
  });

  it("preserves the legacy single-namespace shape", () => {
    const dto: PresetFilterDto = {
      filter: { country: "BRA" },
    };

    expect(PresetFilterDtoMapper.toFilters(dto)).toEqual([
      { namespace: "filter", name: "country", value: "BRA" },
    ]);
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

  it("ignores top-level keys that are not nested objects", () => {
    const dto = {
      stray: "ignored",
      brand: { include_global: "false" },
    } as PresetFilterDto;

    expect(PresetFilterDtoMapper.toFilters(dto)).toEqual([
      { namespace: "brand", name: "include_global", value: "false" },
    ]);
  });
});
