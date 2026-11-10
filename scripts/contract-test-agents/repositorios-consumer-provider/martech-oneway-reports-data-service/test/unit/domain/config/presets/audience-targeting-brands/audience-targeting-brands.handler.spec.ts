import { audienceTargetingBrandsHandler } from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.handler";
import type { AudienceTargetingBrandsPresetValue } from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.types";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

describe("audienceTargetingBrandsHandler", () => {
  it("returns country-keyed values and default equal to the first country list", () => {
    const preset: PresetDefinition = { "audience-targeting-brands": {} };
    const result = audienceTargetingBrandsHandler.handle(preset);
    const block = result[
      "audience-targeting-brands"
    ] as AudienceTargetingBrandsPresetValue;

    expect(block.enabled).toBe(true);
    expect(Object.keys(block.values)[0]).toBe("ARG");
    expect(block.default).toEqual(block.values.ARG);
    expect(block.default[0]?.value).toBe("Andes Origen");
  });

  it("omits is_sub_brand on competitors where the source row has no flag", () => {
    const preset: PresetDefinition = { "audience-targeting-brands": {} };
    const result = audienceTargetingBrandsHandler.handle(preset);
    const block = result[
      "audience-targeting-brands"
    ] as AudienceTargetingBrandsPresetValue;

    const coronaBra = block.values.BRA?.find((r) => r.value === "Corona");
    expect(coronaBra?.competitor[0]).toEqual({
      value: "Heineken",
      label: "Heineken",
      ...getBrandImageFields("Heineken"),
    });
  });

  it("trims countries by user access and moves default to the first visible country", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: ["BR"],
    });
    const preset: PresetDefinition = { "audience-targeting-brands": {} };
    const result = audienceTargetingBrandsHandler.handle(
      preset,
      undefined,
      user,
    );
    const block = result[
      "audience-targeting-brands"
    ] as AudienceTargetingBrandsPresetValue;

    expect(Object.keys(block.values)).toEqual(["BRA"]);
    expect(block.default).toEqual(block.values.BRA);
  });
});
