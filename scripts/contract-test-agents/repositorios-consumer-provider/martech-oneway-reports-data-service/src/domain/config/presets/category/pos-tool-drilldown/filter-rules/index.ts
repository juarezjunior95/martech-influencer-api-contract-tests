import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";
import { BrandFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/BrandFilterRulesCommand";
import { BrandSegmentsFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/BrandSegmentsFilterRulesCommand";
import { CategoryFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/CategoryFilterRulesCommand";
import { CountryFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/CountryFilterRulesCommand";
import { GrowthLeversFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/GrowthLeversFilterRulesCommand";
import { ManufacturerFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/commands/ManufacturerFilterRulesCommand";

export const getPosToolDrilldownFilterRulesCommands =
  (): PosToolDrilldownFilterRulesCommand[] => [
    new CategoryFilterRulesCommand(),
    new CountryFilterRulesCommand(),
    new ManufacturerFilterRulesCommand(),
    new BrandFilterRulesCommand(),
    new BrandSegmentsFilterRulesCommand(),
    new GrowthLeversFilterRulesCommand(),
  ];
