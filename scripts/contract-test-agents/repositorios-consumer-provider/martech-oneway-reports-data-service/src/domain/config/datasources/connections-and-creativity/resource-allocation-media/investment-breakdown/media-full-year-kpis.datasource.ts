import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const DATASET_ID = "owr_connections_creativity_investment_breakdown_fy_fn";
const PROCEDURE =
  "5_connections_creativity_media-campaing_investment-breakdown_fy";

const config: DatasourceConfig = {
  datasets: [
    {
      id: DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: PROCEDURE,
        parameters: ["country", "dt_ini", "dt_end"],
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "dt_ini",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "viewtype",
      required: true,
    },
  ],
};

export default config;
