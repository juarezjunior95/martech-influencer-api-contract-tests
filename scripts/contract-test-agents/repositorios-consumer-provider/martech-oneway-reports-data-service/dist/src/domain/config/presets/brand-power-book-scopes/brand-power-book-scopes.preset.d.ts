import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandPowerBookScopesPresetConfig } from "@domain/config/presets/brand-power-book-scopes/brand-power-book-scopes.handler";
declare const brandPowerBookScopesPreset: {
    "brand-power-book-scopes": BrandPowerBookScopesPresetConfig;
};
declare const config: PresetConfig<typeof brandPowerBookScopesPreset>;
export default config;
