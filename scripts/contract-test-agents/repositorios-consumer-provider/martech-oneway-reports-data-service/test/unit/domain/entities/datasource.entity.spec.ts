import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import {
  DatasourceConfig,
  DatasourceEntity,
} from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { marketShareWaterfallTableHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.handler";

describe("DatasourceEntity entityClassAfterHandler", () => {
  it("maps KpiEntity after the handler when entityClassAfterHandler is true", async () => {
    const fetchData = jest
      .fn()
      .mockResolvedValue([{ raw_brand: "Corona ABI", ac: 10 }]);
    const repositoryFactory = {
      resolveRepository: jest.fn().mockReturnValue({ fetchData }),
    } as unknown as DatasetRepositoryFactory;

    const config: DatasourceConfig = {
      entityClass: KpiEntity,
      entityClassAfterHandler: true,
      handler: marketShareWaterfallTableHandler,
      datasets: [
        {
          id: "dataset",
          config: { type: "deltalake", query: "mock-query" },
        },
      ],
    };

    const datasource = new DatasourceEntity(
      repositoryFactory,
      config,
      "waterfall-table",
    );

    const result = await datasource.fetch([]);

    expect(fetchData).toHaveBeenCalledWith(
      config.datasets[0].config,
      [],
      undefined,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(KpiEntity);
    expect(result[0].raw_brand).toBe("Corona");
    expect(result[0].brand).toBeDefined();
  });
});
