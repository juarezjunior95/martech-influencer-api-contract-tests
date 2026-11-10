import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  getAllAgeGroupTuples,
  getAllGenderTuples,
  getAllIncomeGroupTuples,
  type DemographicTuple,
} from "./demographic-options.model";

export interface DemographicFilterPresetValue {
  enabled: boolean;
  default: DemographicTuple | Record<string, never>;
  values: DemographicTuple[];
}

type DemographicResponseKey = "genders" | "age-groups" | "income-groups";

/**
 * Static value/label list handlers for gender, age groups, and income
 * groups — same tuple source as `cohortsHandler`.
 */
class DemographicsFilterPresetHandler implements IPresetHandler<PresetResponse> {
  constructor(
    private readonly responseKey: DemographicResponseKey,
    private readonly getTuples: () => DemographicTuple[],
  ) {}

  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = this.getTuples().map((t) => ({ ...t }));
    const defaultTuple: DemographicFilterPresetValue["default"] =
      values.length === 0 ? {} : { ...values[0] };

    const payload: DemographicFilterPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, [this.responseKey]: payload };
  }
}

export const genderFilterHandler = new DemographicsFilterPresetHandler(
  "genders",
  getAllGenderTuples,
);

export const ageGroupsFilterHandler = new DemographicsFilterPresetHandler(
  "age-groups",
  getAllAgeGroupTuples,
);

export const incomeGroupsFilterHandler = new DemographicsFilterPresetHandler(
  "income-groups",
  getAllIncomeGroupTuples,
);
