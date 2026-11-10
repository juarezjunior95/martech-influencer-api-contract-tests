import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

export const IMAGERY_DATASET_ID = "imagery";
export const IMAGERY_DATASET_FUNCTION_NAME =
  "3_portfolio_brand_brand-power-drivers_imageries_imagery-attributes";

export interface ImageryTuple {
  value: string;
  label: string;
}

export interface ImageryPresetValue {
  values: ImageryTuple[];
  default: ImageryTuple | Record<string, never>;
  enabled: boolean;
}

export type ImageryPresetConfig = Record<string, never>;

interface ImageryRow {
  imagery?: string;
  IMAGERY?: string;
  imagery_attribute?: string;
  imagery_attributes?: string;
  IMAGERY_ATTRIBUTE?: string;
  IMAGERY_ATTRIBUTES?: string;
  level_4?: string;
  LEVEL_4?: string;
  [key: string]: unknown;
}

function pickImagery(row: ImageryRow): string {
  const value =
    row.imagery ??
    row.IMAGERY ??
    row.imagery_attribute ??
    row.imagery_attributes ??
    row.IMAGERY_ATTRIBUTE ??
    row.IMAGERY_ATTRIBUTES ??
    row.level_4 ??
    row.LEVEL_4 ??
    "";
  return typeof value === "string" ? value.trim() : "";
}

class ImageryPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Declares the imagery Databricks dataset so `PresetEntity` wires the
   * function call without authors having to add it manually.
   */
  datasets(): DatasetConfig[] {
    return [
      {
        id: IMAGERY_DATASET_ID,
        config: createDeltalakeProcedureFetchDataConfig({
          functionName: IMAGERY_DATASET_FUNCTION_NAME,
          parameters: ["country", "subbrand", "dt_end"],
        }),
      },
    ];
  }

  /**
   * Power refresh date is supplied via the `dt_end` filter, aligned with
   * the Power KPI group refresh used by Brand Analysis views.
   */
  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const tuples = this.extractTuples(datasets);

    const imageryValue: ImageryPresetValue = {
      values: tuples,
      default: tuples.length > 0 ? { ...tuples[0] } : {},
      enabled: true,
    };

    return { ...preset, imagery_questions: imageryValue };
  }

  private extractTuples(datasets?: Dataset[]): ImageryTuple[] {
    const dataset = datasets?.find((d) => d.id === IMAGERY_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const seen = new Set<string>();
    const tuples: ImageryTuple[] = [];

    for (const raw of dataset.data) {
      const imagery = pickImagery(raw as ImageryRow);
      if (!imagery || seen.has(imagery)) {
        continue;
      }
      seen.add(imagery);
      tuples.push({ value: imagery, label: imagery });
    }

    tuples.sort((a, b) => a.label.localeCompare(b.label));
    return tuples;
  }
}

export const imageryQuestionsHandler = new ImageryPresetHandler();
