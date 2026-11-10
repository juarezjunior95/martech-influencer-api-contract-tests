import { Dataset, DatasetConfig, Filter } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
declare class CommercialResultsPresetHandler implements IPresetHandler<PresetDefinition> {
    get name(): string;
    filters(): Filter[];
    datasets(expanded?: PresetDefinition): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[], user?: UserEntity): PresetResponse;
    private resolvePresetConfig;
    private emptyResponse;
    private extractRows;
    private buildRegion;
    private resolvePeriodRefreshDate;
    private buildPeriods;
    private buildList;
    private buildSubBrandList;
    private buildCategory;
    private buildNonAlcBeer;
    private buildGrowthLevers;
    private buildBeerPriceSegment;
    private buildPortfolio;
    private buildSku;
}
export declare const commercialResultsHandler: CommercialResultsPresetHandler;
export {};
