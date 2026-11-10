import { PresetConfig } from "@domain/entities/preset.entity";
import {
  CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
  posToolDrilldownHandler,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.handler";
import { CountryFilterItem } from "@domain/config/presets/country/country.types";

const countryScopeDefaults: CountryFilterItem = {
  type: "country",
  page: CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
  hideGlobalForKpi: "pos",
};

const posToolDrilldownPreset = {
  "pos-tool-drilldown": {},
  [CATEGORY_POS_TOOL_DRILLDOWN_PAGE]: countryScopeDefaults,
};

const config: PresetConfig<typeof posToolDrilldownPreset> = {
  version: "1.0.0",
  handler: posToolDrilldownHandler,
  preset: posToolDrilldownPreset,
};

export default config;
