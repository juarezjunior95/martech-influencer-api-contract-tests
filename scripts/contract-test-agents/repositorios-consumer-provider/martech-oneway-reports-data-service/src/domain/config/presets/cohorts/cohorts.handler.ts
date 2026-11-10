import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  getAllAgeGroupTuples,
  getAllGenderTuples,
  getAllIncomeGroupTuples,
  tuplesWithoutAll,
  type DemographicTuple,
} from "./demographic-options.model";

/** One cohort dimension: display group name plus its selectable tuples. */
export interface CohortGroupBlock {
  group: string;
  values: DemographicTuple[];
}

/**
 * Cohort filter payload: `values` holds grouped dimensions; `default` is
 * empty until the client chooses a slice.
 */
export interface CohortsPresetValue {
  enabled: boolean;
  default: DemographicTuple[];
  values: CohortGroupBlock[];
}

/** Canonical cohort dimension order (Gender, then Age, then Income). */
const COHORT_GROUPS = ["Gender", "Age", "Income"] as const;

/**
 * Builds grouped cohort options from the same registries as the flat
 * demographic filters, omitting the synthetic `All` row per group.
 */
class CohortsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values: CohortGroupBlock[] = COHORT_GROUPS.map((groupName) => ({
      group: groupName,
      values: tuplesWithoutAll(this.tuplesForGroup(groupName)),
    }));

    const cohortsValue: CohortsPresetValue = {
      values,
      default: [],
      enabled: true,
    };

    return { ...preset, cohorts: cohortsValue };
  }

  private tuplesForGroup(groupName: string): DemographicTuple[] {
    switch (groupName) {
      case "Gender":
        return getAllGenderTuples().map((t) => ({ ...t }));
      case "Age":
        return getAllAgeGroupTuples().map((t) => ({ ...t }));
      case "Income":
        return getAllIncomeGroupTuples().map((t) => ({ ...t }));
      default:
        return [];
    }
  }
}

export const cohortsHandler = new CohortsPresetHandler();
