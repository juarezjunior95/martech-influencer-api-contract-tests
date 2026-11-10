import { PresetConfig } from "@domain/entities/preset.entity";
import { PortfolioPresetConfig } from "@domain/config/presets/portfolio/portfolio.handler";
declare const portfolioPreset: {
    portfolio: PortfolioPresetConfig;
};
declare const config: PresetConfig<typeof portfolioPreset>;
export default config;
