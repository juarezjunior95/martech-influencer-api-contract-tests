/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-27
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada baseada no response real fornecido com o payload associado.
 */

export const tradeExecutionHomeResponse = {
  view: "trade-execution_home_home",
  components: [
    {
      id: "total-distribution",
      data: {
        chartTitle: "Total Distribution",
        chartPeriod: "Jul'26 - YTD",
        bigNumberData: [
          {
            bigNumber: {
              value: "5.0",
              measure: "%",
              trend: "positive",
            },
            comparison: {
              label: "vs",
              value: "LY",
            },
            secondaryInfo: {
              label: "[ Mio ]",
              value: "27.2",
            },
          },
        ],
        chartLineData: [
          "29.4",
          "27.1",
          "26.0",
          "27.9",
          "27.2",
          "27.3",
          "26.9",
          "28.2",
          "27.2",
        ],
      },
    },
    {
      id: "total-megabrands-distribution",
      data: {
        chartTitle: "Total Megabrands Distribution",
        chartPeriod: "Jul'26 - YTD",
        bigNumberData: [
          {
            bigNumber: {
              value: "4.5",
              measure: "%",
              trend: "positive",
            },
            comparison: {
              label: "vs",
              value: "LY",
            },
            secondaryInfo: {
              label: "[ Mio ]",
              value: "9.5",
            },
          },
        ],
        chartLineData: [
          "10.3",
          "9.4",
          "9.2",
          "9.8",
          "9.6",
          "9.7",
          "9.5",
          "9.7",
          "9.5",
        ],
      },
    },
  ],
  compressed: false,
};
