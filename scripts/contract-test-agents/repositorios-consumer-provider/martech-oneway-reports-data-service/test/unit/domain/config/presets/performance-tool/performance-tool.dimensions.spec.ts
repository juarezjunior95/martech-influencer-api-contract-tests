import { buildStaticDimensionConfig } from "@domain/config/presets/performance-tool/performance-tool.dimensions";

describe("buildStaticDimensionConfig", () => {
  it("returns undefined when options are missing or empty", () => {
    expect(buildStaticDimensionConfig()).toBeUndefined();
    expect(buildStaticDimensionConfig([])).toBeUndefined();
  });

  it("returns values and the first option as default", () => {
    const options = [
      { label: "Budget", value: "bu" },
      { label: "Industry", value: "ind" },
    ] as const;

    expect(buildStaticDimensionConfig(options)).toEqual({
      values: [...options],
      default: options[0],
    });
  });

  it("returns a copy of the options array", () => {
    const options = [{ label: "Beer", value: "beer" }];

    const result = buildStaticDimensionConfig(options);

    expect(result?.values).not.toBe(options);
    expect(result?.values).toEqual(options);
  });
});
