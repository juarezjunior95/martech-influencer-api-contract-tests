import { DataItem, Dataset } from "@domain/entities/common/base-config.entity";
import {
  buildShowGlobalDataDatasetConfig,
  collectShowGlobalDataDatasetConfigs,
  hasGlobalDataForSubject,
  showGlobalDataFlagColumn,
} from "@domain/config/presets/show-global-data/show-global-data.datasets";
import {
  SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION,
  SHOW_GLOBAL_DATA_SUBJECTS,
  showGlobalDatasetIdForSubject,
} from "@domain/config/presets/show-global-data/show-global-data.types";

function buildDataset(subject: "pos" | "power", rows: DataItem[]): Dataset {
  return {
    id: showGlobalDatasetIdForSubject(subject),
    data: rows,
  };
}

describe("show-global-data.datasets", () => {
  describe("buildShowGlobalDataDatasetConfig", () => {
    it.each(SHOW_GLOBAL_DATA_SUBJECTS)(
      "declares procedure for subject %s",
      (subject) => {
        const ds = buildShowGlobalDataDatasetConfig(subject);
        expect(ds.id).toBe(showGlobalDatasetIdForSubject(subject));
        expect(ds.config.procedure).toContain(
          SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION,
        );
        expect(ds.config.procedure).toContain(`"subject": "${subject}"`);
      },
    );
  });

  describe("collectShowGlobalDataDatasetConfigs", () => {
    it("returns empty array for empty input", () => {
      expect(collectShowGlobalDataDatasetConfigs([])).toEqual([]);
    });

    it("dedupes subjects and orders pos before power", () => {
      const configs = collectShowGlobalDataDatasetConfigs([
        "power",
        "pos",
        "power",
      ]);
      expect(configs.map((c) => c.id)).toEqual([
        showGlobalDatasetIdForSubject("pos"),
        showGlobalDatasetIdForSubject("power"),
      ]);
    });
  });

  describe("showGlobalDataFlagColumn", () => {
    it("returns flag_uat when NODE_ENV is uat", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        expect(showGlobalDataFlagColumn()).toBe("flag_uat");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("returns flag_prd when NODE_ENV is not uat", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        expect(showGlobalDataFlagColumn()).toBe("flag_prd");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });
  });

  describe("hasGlobalDataForSubject", () => {
    it("returns false when dataset is missing or empty", () => {
      expect(hasGlobalDataForSubject(undefined, "pos")).toBe(false);
      expect(hasGlobalDataForSubject([], "pos")).toBe(false);
      expect(hasGlobalDataForSubject([buildDataset("pos", [])], "pos")).toBe(
        false,
      );
    });

    it("reads FLAG_UAT case-insensitively when that is the active column", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        expect(
          hasGlobalDataForSubject(
            [
              buildDataset("pos", [
                { Flag_Uat: "y", flag_prd: "n" } as DataItem,
              ]),
            ],
            "pos",
          ),
        ).toBe(true);
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("in uat ignores flag_prd for hasGlobalData", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        expect(
          hasGlobalDataForSubject(
            [
              buildDataset("power", [
                { flag_uat: "n", flag_prd: "y" } as DataItem,
              ]),
            ],
            "power",
          ),
        ).toBe(false);
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("in production reads flag_prd and ignores flag_uat", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        expect(
          hasGlobalDataForSubject(
            [
              buildDataset("pos", [
                { flag_uat: "y", flag_prd: "n" } as DataItem,
              ]),
            ],
            "pos",
          ),
        ).toBe(false);
        expect(
          hasGlobalDataForSubject(
            [
              buildDataset("power", [
                { flag_uat: "n", flag_prd: "y" } as DataItem,
              ]),
            ],
            "power",
          ),
        ).toBe(true);
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("uses only the dataset for the requested subject", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const datasets = [
          buildDataset("pos", [{ flag_prd: "y" } as DataItem]),
          buildDataset("power", [{ flag_prd: "n" } as DataItem]),
        ];
        expect(hasGlobalDataForSubject(datasets, "pos")).toBe(true);
        expect(hasGlobalDataForSubject(datasets, "power")).toBe(false);
      } finally {
        process.env.NODE_ENV = prev;
      }
    });
  });
});
