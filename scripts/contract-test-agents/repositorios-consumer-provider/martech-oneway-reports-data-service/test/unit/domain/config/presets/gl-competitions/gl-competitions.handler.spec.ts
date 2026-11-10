import { BadRequestException } from "@nestjs/common";
import { glCompetitionsHandler } from "@domain/config/presets/gl-competitions/gl-competitions.handler";
import type { GlCompetitionsPresetValue } from "@domain/config/presets/gl-competitions/gl-competitions.types";

describe("glCompetitionsHandler", () => {
  it("emits all competitions with derived values, divisions and per-cup defaults when type is omitted", () => {
    const result = glCompetitionsHandler.handle({ "gl-competitions": {} });
    const value = result["gl-competitions"] as GlCompetitionsPresetValue;

    expect(value.enabled).toBe(true);
    expect(value.values).toEqual([
      { label: "Premier League", value: "premier_league" },
      { label: "Super League", value: "super_league" },
      {
        label: "Megabrands Dashboard",
        value: "megabrands_cup",
        divisions: [
          { label: "Country", value: "country" },
          { label: "Brand", value: "brand" },
        ],
        default: { label: "Country", value: "country" },
      },
      {
        label: "KA Dashboard",
        value: "channels_cup",
        divisions: [
          { label: "League A", value: "league_a" },
          { label: "League B", value: "league_b" },
        ],
        default: { label: "League A", value: "league_a" },
      },
      {
        label: "BEES Dashboard",
        value: "bees_cup",
        divisions: [
          { label: "Acceleration Index", value: "acceleration_index" },
          { label: "Maturity Index", value: "maturity_index" },
        ],
        default: { label: "Acceleration Index", value: "acceleration_index" },
      },
      { label: "DTC Dashboard", value: "dtc_cup" },
    ]);

    expect(value.default).toEqual({
      label: "Premier League",
      value: "KA Dashboard",
    });
  });

  it("returns only league competitions and uses the first match as default", () => {
    const result = glCompetitionsHandler.handle({
      "gl-competitions": { type: "league" },
    });
    const value = result["gl-competitions"] as GlCompetitionsPresetValue;

    expect(value.values).toEqual([
      { label: "Premier League", value: "premier_league" },
      { label: "Super League", value: "super_league" },
    ]);
    expect(value.default).toEqual({
      label: "Premier League",
      value: "premier_league",
    });
  });

  it("returns only cup competitions and uses the first match as default", () => {
    const result = glCompetitionsHandler.handle({
      "gl-competitions": { type: "cup" },
    });
    const value = result["gl-competitions"] as GlCompetitionsPresetValue;

    expect(value.values.map((v) => v.value)).toEqual([
      "megabrands_cup",
      "channels_cup",
      "bees_cup",
      "dtc_cup",
    ]);
    expect(value.default).toEqual({
      label: "Megabrands Dashboard",
      value: "megabrands_cup",
    });
  });

  it("rejects unknown type values with a bad-request error", () => {
    expect(() =>
      glCompetitionsHandler.handle({
        "gl-competitions": { type: "tournament" },
      }),
    ).toThrow(BadRequestException);
  });

  it("treats whitespace-only type as omitted", () => {
    const result = glCompetitionsHandler.handle({
      "gl-competitions": { type: "  " },
    });
    const value = result["gl-competitions"] as GlCompetitionsPresetValue;

    expect(value.values).toHaveLength(6);
    expect(value.default).toEqual({
      label: "Premier League",
      value: "KA Dashboard",
    });
  });
});
