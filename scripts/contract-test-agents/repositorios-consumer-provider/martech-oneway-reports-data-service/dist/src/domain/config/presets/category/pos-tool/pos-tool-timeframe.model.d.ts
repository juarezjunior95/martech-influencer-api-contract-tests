import { Dataset } from "@domain/entities/common/base-config.entity";
import { PosPeriodPresetValue, PosPeriodTuple } from "@domain/config/presets/pos-periods/pos-periods.handler";
export interface PosToolTimeframeConfig {
    valueField: "value" | "label";
    order?: Array<"QTD" | "R12M">;
}
export declare function getPosToolTimeframeTuples(config: PosToolTimeframeConfig, datasets?: Dataset[]): PosPeriodTuple[];
export declare function getPosToolOverviewPeriods(datasets?: Dataset[]): PosPeriodPresetValue;
export declare function getPosToolDrilldownTimeframeTuples(datasets?: Dataset[]): PosPeriodTuple[];
