import {
  getAllGenderTuples,
  tuplesWithoutAll,
} from "@domain/config/presets/cohorts/demographic-options.model";

describe("demographic-options.model", () => {
  describe("tuplesWithoutAll", () => {
    it("drops the first row", () => {
      const rest = tuplesWithoutAll(getAllGenderTuples());
      expect(rest.map((r) => r.value)).toEqual(["Male", "Female"]);
    });

    it("returns empty for empty input", () => {
      expect(tuplesWithoutAll([])).toEqual([]);
    });
  });
});
