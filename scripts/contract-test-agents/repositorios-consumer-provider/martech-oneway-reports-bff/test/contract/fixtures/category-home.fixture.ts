/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-27
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada derivada do response fornecido pelo usuário.
 * REQUER REVISÃO HUMANA antes do merge.
 */

export const categoryHomeResponse = {
  view: "category_home",
  components: [
    {
      id: "consumer-behavior",
      data: [
        {
          title: "Beer Participation",
          period: "Q2'26 - R12M",
          bigNumberData: [
            {
              bigNumber: { value: "-0.5", measure: "pp", trend: "negative" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "56.4" },
            },
          ],
        },
        {
          title: "ABI Participation",
          period: "Q2'26 - R12M",
          bigNumberData: [
            {
              bigNumber: { value: "-0.6", measure: "pp", trend: "negative" },
              comparison: { label: "vs", value: "Q2'25" },
              secondaryInfo: { label: "[ % ]", value: "43.4" },
            },
          ],
        },
      ],
    },
    {
      id: "grow-the-category",
      data: [
        {
          chartTitle: "Beer Category Volume",
          chartPeriod: "25'FY",
          bigNumberData: [
            {
              bigNumber: { value: "0.6", measure: "%", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ k/hl ]", value: "1,756,743" },
            },
          ],
          chartLineData: [1739569.2, 1777423.7, 1760751.5, 1747061.9],
        },
      ],
    },
    {
      id: "lead-the-category",
      data: [
        {
          chartTitle: "ABI Market Share",
          chartPeriod: "Jun'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "0.3", measure: "pp", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "55.0" },
            },
          ],
          chartLineData: [55.4, 54.7, 55, 54.6, 55, 55],
        },
      ],
    },
  ],
  compressed: false,
};
