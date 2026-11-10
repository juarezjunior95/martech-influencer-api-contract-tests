import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "category-health-drill-down-line-chart",
      config: createDeltalakeFetchDataConfig({
        query: "category/category-health/drill-down/line-chart-drill",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "viewtype",
      required: true,
    },
    {
      name: "category",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "kpi_name",
      required: true,
    },
  ],
};

export default config;
