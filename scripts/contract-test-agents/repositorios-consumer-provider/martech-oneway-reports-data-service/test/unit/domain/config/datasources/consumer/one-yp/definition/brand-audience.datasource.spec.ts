import brandAudienceDatasource from "@domain/config/datasources/consumer/one-yp/definition/brand-audience.datasource";
import { DatasourceEntity } from "@domain/entities/datasource.entity";
import { MissingRequiredFilterError } from "@domain/exceptions/missing-required-filter.error";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";

describe("consumer/one-yp/definition/brand-audience datasource", () => {
  const factory = {} as DatasetRepositoryFactory;
  const datasource = new DatasourceEntity(
    factory,
    brandAudienceDatasource,
    "consumer_one-yp_definition_brand-audience",
  );

  it("declares required filters matching brand-audience SQL", () => {
    expect(brandAudienceDatasource.filters).toEqual([
      { name: "dt_end", required: true },
      { name: "brand", required: true },
      { name: "country", required: true },
      { name: "product_type", required: true },
      { name: "age", required: false },
      { name: "gender", required: false },
      { name: "socio_economic_level", required: false },
    ]);
  });

  it("rejects fetch when product_type is missing", async () => {
    await expect(
      datasource.fetch([
        { name: "dt_end", value: "2025-06-30" },
        { name: "brand", value: "Corona" },
        { name: "country", value: "BRA" },
      ]),
    ).rejects.toThrow(MissingRequiredFilterError);
  });
});
