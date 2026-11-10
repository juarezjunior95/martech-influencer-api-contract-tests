import { PresetConfig } from "@domain/entities/preset.entity";
import { CountryFilterItem } from "@domain/config/presets/country/country.types";
declare const countryPreset: {
    country: CountryFilterItem;
};
declare const config: PresetConfig<typeof countryPreset>;
export default config;
