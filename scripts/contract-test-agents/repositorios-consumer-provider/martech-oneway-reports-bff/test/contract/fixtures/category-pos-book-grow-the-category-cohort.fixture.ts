/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-21
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada derivada do response fornecido pelo usuário.
 * REQUER REVISÃO HUMANA antes do merge.
 */

type CohortCell = {
  chartData: {
    data: string[];
    backgroundColor: string[];
    chartUnitMeasure: string;
  };
  variation: string;
  variationMeasure: string;
  chartScaleMax: number;
};

const colors = {
  alcohol: "#C9D1D6",
  beer: "#F0DF78",
  beyond_beer: "#EEC879",
  spirits: "#A1CFF4",
  wine: "#F6B7D0",
};

function cell(color: string): CohortCell {
  return {
    chartData: {
      data: ["68.2"],
      backgroundColor: [color],
      chartUnitMeasure: "%",
    },
    variation: "-0.7",
    variationMeasure: "pp",
    chartScaleMax: 78.4,
  };
}

function row(value: string) {
  return {
    label: { noChart: true, merge: true, value },
    alcohol: cell(colors.alcohol),
    beer: cell(colors.beer),
    beyond_beer: cell(colors.beyond_beer),
    spirits: cell(colors.spirits),
    wine: cell(colors.wine),
  };
}

export const categoryPosBookGrowTheCategoryCohortResponse = {
  view: "category_pos-book_grow-the-category_cohort",
  components: [
    {
      id: "country",
      data: {
        header: [
          {
            title: "Label",
            children: [{ title: "Label", id: "label" }],
          },
          { title: "Alcohol", id: "alcohol" },
          { title: "Beer", id: "beer" },
          { title: "Beyond Beer", id: "beyond_beer" },
          { title: "Spirits", id: "spirits" },
          { title: "Wine", id: "wine" },
        ],
        rows: [
          [row("Global")],
          [row("Male"), row("Female")],
          [
            row("LDA - 24"),
            row("25 - 34"),
            row("35 - 44"),
            row("45 - 54"),
            row("55+"),
          ],
          [row("High Income"), row("Medium Income"), row("Low Income")],
        ],
      },
    },
  ],
  compressed: false,
};
