import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export declare const POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID = "category-pos-tool-drilldown";
export declare const POS_TOOL_DRILLDOWN_FUNCTION_NAME = "1_category_home_filters";
export declare const CATEGORY_POS_TOOL_DRILLDOWN_PAGE = "category_pos-tool-drilldown";
declare class PosToolDrilldownPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private buildCohortDimension;
    private extractRows;
    private toDimension;
    private buildCountryDimension;
    private buildZoneDimension;
    private buildRegionDimension;
    private buildManufacturerDimension;
    private extractDistinctCategoryValues;
    private extractDistinctValues;
    private buildBrandSegmentsValues;
    private buildBrandDimension;
    private buildFilterRules;
    private buildBrandMembershipMap;
}
export declare const posToolDrilldownHandler: PosToolDrilldownPresetHandler;
export {};
