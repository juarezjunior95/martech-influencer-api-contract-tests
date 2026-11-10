import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("ai-summary formatter", () => {
  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/ai-summary/ai-summary.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    return jsonata(expression);
  };

  const evaluate = async (data: object[]) => {
    const compiled = await getCompiledExpression();
    return compiled.evaluate({
      datasources: { "ai-summary_ai-summary": data },
    });
  };

  const completeRecord = {
    cohort: "All",
    country: "ARG",
    dt_end: "2026-01-01",
    full_key: "1. Category; POS Book; Lead the Category;ARG;QTD",
    insight_see_more:
      "• Participation P4W for Total ABI in Argentina declined versus last year.\n• Only Brahma (+0.4 p.p.) and Corona (+0.8 p.p.) delivered gains.",
    insight_wo_see_more:
      "Total ABI participation in Argentina fell, with only Brahma and Corona showing slight growth.",
    page: "1. Category; POS Book; Lead the Category",
    price_segment: "All",
    timeperiod: "QTD",
    trend: "NEGATIVE",
    scope: null,
    viewtype: null,
  };

  const incompleteRecord = {
    cohort: "All",
    country: "ARG",
    dt_end: "2026-01-01",
    full_key: "1. Category; POS Book; Lead the Category;ARG;QTD",
    insight_see_more: null,
    insight_wo_see_more:
      "Total ABI participation in Argentina fell, with only Brahma and Corona showing slight growth.",
    page: "1. Category; POS Book; Lead the Category",
    price_segment: "All",
    timeperiod: "QTD",
    trend: "NEUTRAL",
    scope: null,
    viewtype: null,
  };

  describe("basic functionality", () => {
    it("should return complete record with resume, seeMore and trend", async () => {
      const result: any = await evaluate([completeRecord]);

      expect(result).toHaveProperty("resume");
      expect(result).toHaveProperty("seeMore");
      expect(result).toHaveProperty("trend");

      expect(result.resume).toBe(completeRecord.insight_wo_see_more);
      expect(result.seeMore).toBe(completeRecord.insight_see_more);
      expect(result.trend).toBe("negative");
    });

    it("should return empty state for empty datasource", async () => {
      const result: any = await evaluate([]);

      expect(result).toEqual({ empty: true });
    });
  });

  describe("trend mapping", () => {
    it("should map POSITIVE trend to lowercase positive", async () => {
      const positiveRecord = { ...completeRecord, trend: "POSITIVE" };
      const result: any = await evaluate([positiveRecord]);

      expect(result.trend).toBe("positive");
    });

    it("should map NEGATIVE trend to lowercase negative", async () => {
      const negativeRecord = { ...completeRecord, trend: "NEGATIVE" };
      const result: any = await evaluate([negativeRecord]);

      expect(result.trend).toBe("negative");
    });

    it("should map NEUTRAL trend to lowercase neutral", async () => {
      const neutralRecord = { ...completeRecord, trend: "NEUTRAL" };
      const result: any = await evaluate([neutralRecord]);

      expect(result.trend).toBe("neutral");
    });

    it("should default to neutral for unknown trend", async () => {
      const unknownTrendRecord = { ...completeRecord, trend: "UNKNOWN" };
      const result: any = await evaluate([unknownTrendRecord]);

      expect(result.trend).toBe("neutral");
    });

    it("should default to neutral for null trend", async () => {
      const nullTrendRecord = { ...completeRecord, trend: null };
      const result: any = await evaluate([nullTrendRecord]);

      expect(result.trend).toBe("neutral");
    });
  });

  describe("record prioritization", () => {
    it("should prioritize complete record over incomplete when both exist", async () => {
      const result: any = await evaluate([incompleteRecord, completeRecord]);

      expect(result.seeMore).toBe(completeRecord.insight_see_more);
      expect(result.trend).toBe("negative");
    });

    it("should prioritize complete record regardless of order", async () => {
      const result: any = await evaluate([completeRecord, incompleteRecord]);

      expect(result.seeMore).toBe(completeRecord.insight_see_more);
      expect(result.trend).toBe("negative");
    });

    it("should fallback to first record when no complete record exists", async () => {
      const result: any = await evaluate([incompleteRecord]);

      expect(result.resume).toBe(incompleteRecord.insight_wo_see_more);
      expect(result.seeMore).toBeUndefined();
      expect(result.trend).toBe("neutral");
    });
  });

  describe("null handling", () => {
    it("should return undefined for seeMore when insight_see_more is null", async () => {
      const result: any = await evaluate([incompleteRecord]);

      expect(result.seeMore).toBeUndefined();
    });

    it("should return empty string for resume when insight_wo_see_more is null", async () => {
      const recordWithNullResume = {
        ...completeRecord,
        insight_wo_see_more: null,
      };
      const result: any = await evaluate([recordWithNullResume]);

      expect(result.resume).toBe("");
    });

    it("should handle record with both insights as null", async () => {
      const recordWithBothNull = {
        ...completeRecord,
        insight_wo_see_more: null,
        insight_see_more: null,
      };
      const result: any = await evaluate([recordWithBothNull]);

      expect(result.resume).toBe("");
      expect(result.seeMore).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle multiple complete records and use the first one", async () => {
      const anotherCompleteRecord = {
        ...completeRecord,
        insight_wo_see_more: "Another summary content",
        trend: "POSITIVE",
      };

      const result: any = await evaluate([
        completeRecord,
        anotherCompleteRecord,
      ]);

      expect(result.resume).toBe(completeRecord.insight_wo_see_more);
      expect(result.trend).toBe("negative");
    });

    it("should handle case-insensitive trend values", async () => {
      const lowercaseTrendRecord = { ...completeRecord, trend: "positive" };
      const result: any = await evaluate([lowercaseTrendRecord]);

      expect(result.trend).toBe("positive");
    });

    it("should handle mixed case trend values", async () => {
      const mixedCaseTrendRecord = { ...completeRecord, trend: "Negative" };
      const result: any = await evaluate([mixedCaseTrendRecord]);

      expect(result.trend).toBe("negative");
    });
  });
});
