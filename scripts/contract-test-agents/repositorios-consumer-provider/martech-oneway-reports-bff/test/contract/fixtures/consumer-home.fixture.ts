/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada derivada do response fornecido com o payload associado.
 */

export const consumerHomeResponse = {
  view: "consumer_home",
  components: [
    {
      id: "increase-participation",
      data: {
        chartTitle: "P4W Participation",
        chartPeriod: "Q2'26 - R12M",
        bigNumberData: [
          {
            bigNumber: { value: "-0.6", measure: "pp", trend: "negative" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "43.4" },
          },
        ],
        chartLineData: [44.4, 44.1, 43.9, 43.4, 43.5, 43.2, 43.2, 43.7],
      },
    },
    {
      id: "increase-abi-lovers",
      data: {
        chartTitle: "P7D Participation",
        chartPeriod: "Q2'26 - R12M",
        bigNumberData: [
          {
            bigNumber: { value: "2.6", measure: "pp", trend: "positive" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "30.1" },
          },
        ],
        chartLineData: [28.2, 27.9, 26.9, 27, 27.2, 27, 32.5, 33.2],
      },
    },
    {
      id: "target-audiences",
      data: {
        title: "Participation index",
        description: "Core Audience vs Total",
        period: "Q2'26 - R12M",
        bigNumberData: [
          {
            bigNumber: { value: "138.7", measure: "", trend: "positive" },
            comparison: { label: "vs", value: "Jan'26" },
            secondaryInfo: { label: "", value: "" },
          },
        ],
      },
    },
  ],
  compressed: false,
};
