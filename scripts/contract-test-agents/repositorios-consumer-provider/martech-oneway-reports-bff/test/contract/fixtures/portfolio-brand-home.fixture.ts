/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-16
 * Gerado por         : agente 04 (provider-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 * Fixture sanitizada derivada do response fornecido com o payload associado.
 */

export const portfolioBrandHomeResponse = {
  view: "portfolio-brand_home_home",
  components: [
    {
      id: "increase-brand-power",
      data: {
        title: "ABI Brand Power",
        period: "Q2'26 YTD",
        bigNumberData: [
          {
            bigNumber: { value: "0.4", measure: "pp", trend: "positive" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "53.8" },
          },
        ],
        chartLineData: [53.4, 53.2, 53.6, 53.3, 53.5, 53.7, 53.7, 53.9],
      },
    },
    {
      id: "portfolio-strategy",
      data: [
        {
          title: "Megabrands Volume",
          period: "Q3'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "2.3", measure: "%", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ k hl ]", value: "198887.8" },
            },
          ],
        },
        {
          title: "Megabrands Brand Power",
          period: "Q2'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "0.6", measure: "pp", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "31.4" },
            },
          ],
        },
      ],
    },
    {
      id: "target-audiences",
      data: {
        title: "Brands Superior",
        period: "Q2'26 MTD",
        bigNumberData: [
          {
            bigNumber: { value: "10.0", measure: "pp", trend: "positive" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "57.5" },
          },
        ],
      },
    },
  ],
  compressed: false,
};

export const portfolioBrandHomeCountryResponse = {
  ...portfolioBrandHomeResponse,
  components: [
    {
      id: "increase-brand-power",
      data: {
        title: "ABI Brand Power",
        period: "Q2'26 YTD",
        bigNumberData: [
          {
            bigNumber: { value: "0.4", measure: "pp", trend: "positive" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "61.1" },
          },
        ],
        chartLineData: [60.7, 60.3, 60.6, 60.9, 60.9, 61.1, 61, 61.3],
      },
    },
    {
      id: "portfolio-strategy",
      data: [
        {
          title: "Megabrands Volume",
          period: "Q3'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "1.5", measure: "%", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ k hl ]", value: "30535.1" },
            },
          ],
        },
        {
          title: "Megabrands Brand Power",
          period: "Q2'26 YTD",
          bigNumberData: [
            {
              bigNumber: { value: "0.6", measure: "pp", trend: "positive" },
              comparison: { label: "vs", value: "LY" },
              secondaryInfo: { label: "[ % ]", value: "33.5" },
            },
          ],
        },
      ],
    },
    {
      id: "target-audiences",
      data: {
        title: "Brands Superior",
        period: "Q2'26 MTD",
        bigNumberData: [
          {
            bigNumber: { value: "0.0", measure: "pp", trend: "positive" },
            comparison: { label: "vs", value: "LY" },
            secondaryInfo: { label: "[ % ]", value: "66.7" },
          },
        ],
      },
    },
  ],
};

export const portfolioBrandHomeUnknownCountryResponse = {
  view: "portfolio-brand_home_home",
  components: [
    { id: "increase-brand-power", data: { empty: true } },
    { id: "portfolio-strategy", data: { empty: true } },
    { id: "target-audiences", data: { empty: true } },
  ],
  compressed: false,
};
