import { BadRequestException } from "@nestjs/common";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { getKpisForGroup } from "@domain/config/presets/kpis/kpis.model";
import type {
  KpisPresetConfig,
  KpisPresetValue,
  KpiTuple,
} from "@domain/config/presets/kpis/kpis.types";

class KpisPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const kpisConfig = preset.kpis as KpisPresetConfig | undefined;
    const kpiGroups = this.normalizeKpiGroups(kpisConfig?.kpiGroups);

    if (kpiGroups.length === 0) {
      throw new BadRequestException('The parameter "kpi_groups" is mandatory.');
    }

    const values: KpiTuple[] = [];
    for (const group of kpiGroups) {
      values.push(...getKpisForGroup(group));
    }

    const defaultTuple: KpisPresetValue["default"] =
      values.length === 0 ? {} : this.pickDefaultKpi(values);

    const kpisValue: KpisPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, kpis: kpisValue };
  }

  /**
   * First row that is not explicitly `isDisabled: true`; empty object if none.
   */
  private pickDefaultKpi(values: KpiTuple[]): KpiTuple | Record<string, never> {
    const first = values.find((v) => v.isDisabled !== true);
    return first ? { ...first } : {};
  }

  /**
   * Accept `string[]` from BFF config, a single string from a scalar
   * query override, or CSV already expanded to `string[]` by
   * {@link coerceQueryValue}.
   */
  private normalizeKpiGroups(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw.map((g) => String(g).trim()).filter((g) => g.length > 0);
    }
    if (typeof raw === "string" && raw.trim().length > 0) {
      return [raw.trim()];
    }
    return [];
  }
}

export const kpisHandler = new KpisPresetHandler();
