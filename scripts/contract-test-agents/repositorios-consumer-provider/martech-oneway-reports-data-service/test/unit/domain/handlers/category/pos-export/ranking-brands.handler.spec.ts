import rankingBrandsHandler from "@domain/handlers/category/pos-export/ranking-brands.handler";
import { Dataset } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";

describe("RankingBrandsHandler", () => {
  const row = {
    kpi: "participation_p4w",
    country: "BRA",
    country_label: "BRA",
    maturity: "M2",
    lever_ord: 1,
    lever: "Core Co",
    brand: "BRAHMA",
    ac: 12.3,
  };

  const datasetOf = (data: unknown[]) =>
    ({ id: "slide20-brands-growth-lever-global", data }) as unknown as Dataset;

  it("should expose brand and country under the names the entity reads", async () => {
    const [result] = await rankingBrandsHandler.handle([datasetOf([row])]);

    expect(result.raw_brand).toBe("BRAHMA");
    expect(result.image_key).toBe("BRA");
  });

  it("should keep the plain values so the formatter can still group by them", async () => {
    const [result] = await rankingBrandsHandler.handle([datasetOf([row])]);

    expect(result.brand_label).toBe("BRAHMA");
    expect(result.country_code).toBe("BRA");
  });

  it("should let the entity build both images from the renamed columns", async () => {
    const [result] = await rankingBrandsHandler.handle([datasetOf([row])]);
    const entity = new KpiEntity(result);

    expect(entity.brand).toEqual(
      expect.objectContaining({
        imageSquare: expect.stringContaining("brahma"),
      }),
    );
    expect(entity.country).toEqual(
      expect.objectContaining({ imageIcon: expect.stringContaining("BRA") }),
    );
  });

  it("should omit the renamed columns when the source has no value", async () => {
    const [result] = await rankingBrandsHandler.handle([
      datasetOf([{ kpi: "participation_p4w", lever: "Core Co" }]),
    ]);

    expect(result).not.toHaveProperty("raw_brand");
    expect(result).not.toHaveProperty("image_key");
  });

  it("should return an empty list when the dataset has no rows", async () => {
    expect(await rankingBrandsHandler.handle([datasetOf([])])).toEqual([]);
  });
});
