import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { Dataset, DatasetConfig } from "@domain/entities/datasource.entity";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
} from "../kpi-group/kpi-group.types";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { parseDateUtc } from "@domain/config/presets/common/date-utils";

export interface BrandPowerResultsOption {
  value: string;
  label: string;
  full: string;
}

export interface BrandPowerResultsPresetValue {
  enabled: boolean;
  default: BrandPowerResultsOption | Record<string, never>;
  values: BrandPowerResultsOption[];
}

export type BrandPowerResultsPresetConfig = Record<string, never>;

const EMPTY_DEFAULT: BrandPowerResultsOption = {
  value: "",
  label: "",
  full: "",
};

function getQuarterlyTimeframes(dateEnd: Date): BrandPowerResultsOption[] {
  const month = dateEnd.getUTCMonth() + 1;
  let quarter: number;
  if (month >= 1 && month <= 3) quarter = 1;
  else if (month >= 4 && month <= 6) quarter = 2;
  else if (month >= 7 && month <= 9) quarter = 3;
  else quarter = 4;

  const yy = String(dateEnd.getUTCFullYear()).slice(2);
  const formattedDateEnd = `Q${quarter}'${yy}`;

  return [
    {
      value: "YTD",
      label: `YTD ${formattedDateEnd}`,
      full: "Year To Date (YTD)",
    },
    {
      value: "QTD",
      label: `LQ ${formattedDateEnd}`,
      full: "Last Quarter (LQ)",
    },
  ];
}

class BrandPowerResultsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: KPI_GROUP_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: KPI_GROUP_DATASET_QUERY,
        }),
      },
    ];
  }

  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const kpiGroup = datasets?.[0].data?.find(
      (kpi) => kpi.kpi_name === "power",
    );

    const refreshDate = (kpiGroup?.time_frame as string) ?? "";
    const parsedDate = parseDateUtc(refreshDate) ?? new Date();
    const values = getQuarterlyTimeframes(parsedDate);

    const defaultPeriod =
      values.find((v) => v.value === "QTD") ?? values[0] ?? EMPTY_DEFAULT;

    const brandPowerResultsValue: BrandPowerResultsPresetValue = {
      values,
      default: { ...defaultPeriod },
      enabled: true,
    };

    return {
      ...preset,
      "brand-power-results": {
        periods: brandPowerResultsValue,
      },
    };
  }
}

export const brandPowerResultsHandler = new BrandPowerResultsPresetHandler();
