/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-16
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada derivada do response fornecido pelo usuário.
 * REQUER REVISÃO HUMANA antes do merge.
 */

export const connectionsCreativityHomeResponse = {
  view: "connections-and-creativity_home_home",
  components: [
    {
      id: "connections-and-creativity-home-big-numbers-trend",
      data: [
        {
          chartTitle: "Media Spend",
          chartPeriod: "Jul'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "25.5", measure: "%", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ # ]", value: "800.5" },
            },
          ],
        },
        {
          chartTitle: "Non-Working Money",
          chartPeriod: "Jul'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "-3.1", measure: "%", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ # ]", value: "16.1" },
            },
          ],
        },
      ],
    },
    {
      id: "connections-and-creativity-home-resource-allocation",
      data: {
        megabrandsQwoaBigNumber: {
          title: "Megabrands QWOA",
          period: "Dec'26",
          bigNumberData: [
            {
              bigNumber: { value: "73.5", measure: "pp", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "73.5" },
            },
          ],
        },
        campaignsQwoaBigNumber: {
          title: "Campaigns QWOA",
          period: "Dec'26",
          bigNumberData: [
            {
              bigNumber: { value: "41.4", measure: "pp", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "41.4" },
            },
          ],
        },
      },
    },
  ],
  compressed: false,
};
