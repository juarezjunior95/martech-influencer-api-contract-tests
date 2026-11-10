import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/** One selectable POS KPI row (`value` / `label`). */
export interface PosKpiTuple {
  value: string;
  label: string;
}

export interface PosKpiPresetValue {
  enabled: boolean;
  default: PosKpiTuple;
  values: PosKpiTuple[];
}

/** Canonical POS KPI options, in display order. */
const POS_KPIS: PosKpiTuple[] = [
  { value: "participation", label: "Participation" },
  { value: "occasions", label: "Occasions" },
  { value: "servings", label: "Servings" },
];

class PosKpiPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = POS_KPIS.map((row) => ({ ...row }));

    const posKpiValue: PosKpiPresetValue = {
      values,
      default: { ...values[0] },
      enabled: true,
    };

    return { ...preset, "pos-kpi": posKpiValue };
  }
}

export const posKpiHandler = new PosKpiPresetHandler();
