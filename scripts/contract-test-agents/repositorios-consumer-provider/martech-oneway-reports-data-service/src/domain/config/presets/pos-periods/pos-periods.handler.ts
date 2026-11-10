import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/** One selectable POS Book period row (`value` / `label` / `full`). */
export interface PosPeriodTuple {
  value: string;
  label: string;
  full: string;
}

export interface PosPeriodPresetValue {
  enabled: boolean;
  default: PosPeriodTuple;
  values: PosPeriodTuple[];
}

/** Canonical POS Book period options, in display order. */
export const POS_PERIODS: PosPeriodTuple[] = [
  { value: "QTD", label: "Quarter", full: "" },
  { value: "R12M", label: "R12M", full: "" },
];

class PosPeriodsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = POS_PERIODS.map((row) => ({ ...row }));

    const posPeriodsValue: PosPeriodPresetValue = {
      values,
      default: { ...values[0] },
      enabled: true,
    };

    return { ...preset, "pos-periods": posPeriodsValue };
  }
}

export const posPeriodsHandler = new PosPeriodsPresetHandler();
