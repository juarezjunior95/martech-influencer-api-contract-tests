import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "cores-composition",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/performance-tool/drill-down/finance/cores/composition",
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
      name: "dt_end",
      required: true,
    },
    {
      name: "page_filter",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
    {
      name: "growth_lever",
      required: true,
    },
    {
      name: "brand",
      required: true,
    },
    {
      name: "period_type",
      required: true,
    },
  ],
};

export default config;
