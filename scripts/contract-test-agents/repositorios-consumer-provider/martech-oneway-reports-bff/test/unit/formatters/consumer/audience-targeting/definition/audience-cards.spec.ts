import fs from "fs";
import path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("Audience Cards Formatter - Definition (JSONata)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/consumer/audience-targeting/definition/audience-cards.jsonata",
  );

  const DATA_KEY = "consumer_audience-targeting_definition_brand-audience";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (rows: any[]) =>
    compiledExpression.evaluate({
      datasources: { [DATA_KEY]: rows },
    });

  it("builds Core card with audience demographics and brandVolume", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Core",
        gender: "Male;Female",
        age: "25-34;35-44",
        income: "Medium Income;High Income",
        audience_index: 51.2,
      },
    ];

    const result: any = await evaluate(rows);

    expect(result).toHaveLength(2);
    const card = result[0];

    expect(card.header).toEqual({
      title: "Core Audience",
      tooltip:
        "Primary audience that concentrates at least 50% of the brand's declared volume (POS).",
    });

    expect(card.data).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(card.data[0].audience))).toEqual({
      gender: ["Male", "Female"],
      age: ["25-34", "35-44"],
      incomeBracket: ["Medium", "High"],
    });
    expect(card.data[0].audienceType).toBe("core");
    expect(card.data[0].brandVolume).toEqual({
      value: "51.2",
      label: "of Brand Volume",
      measure: "%",
    });
    expect(result[1]).toEqual({
      header: {
        title: "Halo Audience",
        tooltip:
          "Adjacent expansion audience identified by under-indexing vs. the Brand's Core.",
        emptyMessage: "No Halo Audience",
      },
      data: [],
    });
  });

  it("builds Halo card without brandVolume when audience_index is missing", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Halo",
        gender: "Female",
        age: "LDA-24",
        income: "Low",
      },
    ];

    const result: any = await evaluate(rows);

    expect(result).toHaveLength(2);
    const card = result[1];

    expect(card.header.title).toBe("Halo Audience");
    expect(card.header.tooltip).toBe(
      "Adjacent expansion audience identified by under-indexing vs. the Brand's Core.",
    );
    expect(card.header.emptyMessage).toBeUndefined();
    expect(card.data[0].audienceType).toBe("halo");
    expect(card.data[0].audience).toEqual({
      gender: ["Female"],
      age: ["LDA - 24"],
      incomeBracket: ["Low"],
    });
    expect(card.data[0].brandVolume).toEqual({ empty: true });
    expect(result[0]).toEqual({
      header: {
        title: "Core Audience",
        tooltip:
          "Primary audience that concentrates at least 50% of the brand's declared volume (POS).",
        emptyMessage: "No R12M POS volume available",
      },
      data: [],
    });
  });

  it("builds both Core and Halo cards from combined data", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Core",
        gender: "Male",
        age: "25-34;35-44",
        income: "Medium",
        audience_index: 55.0,
      },
      {
        nm_group: "Profile",
        audience_type: "Halo",
        gender: "Female",
        age: "LDA-24",
        income: "Low",
        audience_index: 12.3,
      },
    ];

    const result: any = await evaluate(rows);

    expect(result).toHaveLength(2);
    expect(result[0].header.title).toBe("Core Audience");
    expect(result[0].data[0].audienceType).toBe("core");
    expect(result[0].data[0].brandVolume.value).toBe("55.0");
    expect(result[1].header.title).toBe("Halo Audience");
    expect(result[1].data[0].audienceType).toBe("halo");
    expect(result[1].data[0].brandVolume.value).toBe("12.3");
  });

  it("returns empty cards with emptyMessage when data is empty", async () => {
    const result: any = await evaluate([]);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      header: {
        title: "Core Audience",
        tooltip:
          "Primary audience that concentrates at least 50% of the brand's declared volume (POS).",
        emptyMessage: "No R12M POS volume available",
      },
      data: [],
    });
    expect(result[1]).toEqual({
      header: {
        title: "Halo Audience",
        tooltip:
          "Adjacent expansion audience identified by under-indexing vs. the Brand's Core.",
        emptyMessage: "No Halo Audience",
      },
      data: [],
    });
  });

  it("normalizes +55 age label to 55+", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Halo",
        gender: "Male",
        age: "45-54;+55",
        income: "High",
        audience_index: 11.8,
      },
    ];

    const result: any = await evaluate(rows);

    expect(JSON.parse(JSON.stringify(result[1].data[0].audience.age))).toEqual([
      "45-54",
      "55+",
    ]);
  });

  it("replaces N/A demographic values with '-' while preserving other values", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Halo",
        gender: "N/A",
        age: "LDA - 24",
        income: "N/A",
        audience_index: 10.1,
      },
    ];

    const result: any = await evaluate(rows);

    expect(result[1].data[0].audience).toEqual({
      gender: ["-"],
      age: ["LDA - 24"],
      incomeBracket: ["-"],
    });
  });

  it("adds emptyMessage to Core header when audience_index is missing", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Core",
        gender: "Male",
        age: "25-34",
        income: "Medium",
      },
    ];

    const result: any = await evaluate(rows);

    expect(result[0].header.emptyMessage).toBe("No R12M POS volume available");
    expect(result[0].data[0].brandVolume).toEqual({ empty: true });
  });

  it("handles empty demographic fields gracefully", async () => {
    const rows = [
      {
        nm_group: "Profile",
        audience_type: "Core",
        gender: "",
        age: "",
        income: "",
        audience_index: 60,
      },
    ];

    const result: any = await evaluate(rows);

    expect(result[0].data[0].audience).toEqual({
      gender: [],
      age: [],
      incomeBracket: [],
    });
  });
});
