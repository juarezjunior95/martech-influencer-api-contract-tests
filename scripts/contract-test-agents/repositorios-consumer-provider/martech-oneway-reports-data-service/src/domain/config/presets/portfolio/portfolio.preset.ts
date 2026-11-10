import { PresetConfig } from "@domain/entities/preset.entity";
import {
  portfolioHandler,
  PortfolioPresetConfig,
} from "@domain/config/presets/portfolio/portfolio.handler";

/**
 * `portfolio` preset — exposes Oneway Reports portfolio options as a flat
 * selectable list (Megabrands, Expansion, Sustain, Tail, NAB).
 *
 * Endpoint: `GET /v1/presets/portfolio`.
 *
 * Behavior aligns with Drupal `Portfolio` + `Portfolios` filter plugin:
 * static tuples only; no dataset. Page-level overrides use
 * `?portfolio[name]=value`:
 *
 *   - `?portfolio[includeAll]=true`  prepend synthetic `ALL` / `All`.
 *   - `?portfolio[ignoreNab]=true`   remove the `NAB` row.
 *   - `?portfolio[noDefault]=true`   collapse `default` to empty strings.
 */
const portfolioPreset: { portfolio: PortfolioPresetConfig } = {
  portfolio: {},
};

const config: PresetConfig<typeof portfolioPreset> = {
  version: "1.0.0",
  handler: portfolioHandler,
  preset: portfolioPreset,
};

export default config;
