/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-24
 * Gerado por         : agente 04 (provider-generator)
 *
 * Fixture sanitizada baseada no response real fornecido com o payload associado.
 */

export const tradeExecutionBeesDistributionResponse = {
  view: "trade-execution_bees-distribution_overview",
  components: [
    {
      id: "total-distribution",
      data: {
        legend: [
          {
            color: "rgba(237, 218, 177, 1)",
            pointStyle: "roundedRectangle",
            label: "2025 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
          {
            color: "rgba(209, 163, 60, 1)",
            pointStyle: "roundedRectangle",
            label: "2026 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
        ],
        header: { title: "Total Distribution", measure: "[ Mio ]" },
        bigNumberData: [
          {
            bigNumber: { value: "27.2M", measure: "" },
            comparison: {
              number: { value: "5.0", measure: "%", color: "#007800" },
              label: "vs",
              value: "Jul'25",
            },
          },
        ],
        barChart: {
          datasets: [
            {
              label: "Total Distribution",
              data: [26841970.9, 27238794],
              backgroundColor: ["#EDDAB1", "#D1A33C"],
            },
          ],
          labels: ["25 AC", "26 AC"],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "7.3", measure: "%", color: "#007800" },
                  { value: "5.0", measure: "%", color: "#007800" },
                ],
              },
            ],
          },
          formattedData: [["26.8M", "27.2M"]],
        },
        lineChart: {
          suggestedMin: 21319864.9,
          suggestedMax: 33825537.65,
          datasets: [
            {
              label: "2025",
              data: [
                25735359, 25640847, 26081063, 25830744, 26661799, 25082194,
                26574886, 26821991, 27703558, 28634813, 27922886, 29413511,
              ],
              borderColor: "#EDDAB1",
              pointBackgroundColor: "#EDDAB1",
            },
            {
              label: "2026",
              data: [
                27124719,
                26002305,
                27853015,
                27234719,
                27315643,
                26931130,
                28210027,
                null,
                null,
                null,
                null,
                null,
              ],
              borderColor: "#D1A33C",
              pointBackgroundColor: "#D1A33C",
            },
          ],
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
          formattedData: [
            [
              "25.7M",
              "25.6M",
              "26.1M",
              "25.8M",
              "26.7M",
              "25.1M",
              "26.6M",
              "26.8M",
              "27.7M",
              "28.6M",
              "27.9M",
              "29.4M",
            ],
            [
              "27.1M",
              "26.0M",
              "27.9M",
              "27.2M",
              "27.3M",
              "26.9M",
              "28.2M",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "5.4", measure: "%", color: "#007800" },
                  { value: "1.4", measure: "%", color: "#007800" },
                  { value: "6.8", measure: "%", color: "#007800" },
                  { value: "5.4", measure: "%", color: "#007800" },
                  { value: "2.5", measure: "%", color: "#007800" },
                  { value: "7.4", measure: "%", color: "#007800" },
                  { value: "6.2", measure: "%", color: "#007800" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                ],
              },
            ],
          },
        },
      },
    },
    {
      id: "total-buyers",
      data: {
        legend: [
          {
            color: "rgba(237, 218, 177, 1)",
            pointStyle: "roundedRectangle",
            label: "2025 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
          {
            color: "rgba(209, 163, 60, 1)",
            pointStyle: "roundedRectangle",
            label: "2026 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
        ],
        header: { title: "Total Buyers", measure: "[ Mio ]" },
        bigNumberData: [
          {
            bigNumber: { value: "2.3M", measure: "" },
            comparison: {
              number: { value: "0.3", measure: "%", color: "#007800" },
              label: "vs",
              value: "Jul'25",
            },
          },
        ],
        barChart: {
          datasets: [
            {
              label: "Total Buyers",
              data: [2345635.6, 2334850.6],
              backgroundColor: ["#EDDAB1", "#D1A33C"],
            },
          ],
          labels: ["25 AC", "26 AC"],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "3.7", measure: "%", color: "#007800" },
                  { value: "0.3", measure: "%", color: "#007800" },
                ],
              },
            ],
          },
          formattedData: [["2.3M", "2.3M"]],
        },
        lineChart: {
          suggestedMin: 1958069.3499999999,
          suggestedMax: 2744837.25,
          datasets: [
            {
              label: "2025",
              data: [
                2303611, 2319368, 2324792, 2313051, 2346492, 2331854, 2357186,
                2365587, 2373085, 2386815, 2377084, 2348702,
              ],
              borderColor: "#EDDAB1",
              pointBackgroundColor: "#EDDAB1",
            },
            {
              label: "2026",
              data: [
                2338175,
                2328593,
                2361429,
                2335015,
                2326859,
                2315219,
                2338664,
                null,
                null,
                null,
                null,
                null,
              ],
              borderColor: "#D1A33C",
              pointBackgroundColor: "#D1A33C",
            },
          ],
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
          formattedData: [
            [
              "2.3M",
              "2.3M",
              "2.3M",
              "2.3M",
              "2.3M",
              "2.3M",
              "2.4M",
              "2.4M",
              "2.4M",
              "2.4M",
              "2.4M",
              "2.3M",
            ],
            [
              "2.3M",
              "2.3M",
              "2.4M",
              "2.3M",
              "2.3M",
              "2.3M",
              "2.3M",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "1.5", measure: "%", color: "#007800" },
                  { value: "0.4", measure: "%", color: "#007800" },
                  { value: "1.6", measure: "%", color: "#007800" },
                  { value: "0.9", measure: "%", color: "#007800" },
                  { value: "-0.8", measure: "%", color: "#A20A0A" },
                  { value: "-0.7", measure: "%", color: "#A20A0A" },
                  { value: "-0.8", measure: "%", color: "#A20A0A" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                ],
              },
            ],
          },
        },
      },
    },
    {
      id: "sku-per-poc",
      data: {
        legend: [
          {
            color: "rgba(237, 218, 177, 1)",
            pointStyle: "roundedRectangle",
            label: "2025 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
          {
            color: "rgba(209, 163, 60, 1)",
            pointStyle: "roundedRectangle",
            label: "2026 AC YTD",
            border: "rgba(20, 20, 20, 0.12)",
          },
        ],
        header: { title: "SKU per POC", measure: "[ # ]" },
        bigNumberData: [
          {
            bigNumber: { value: "11.7", measure: "" },
            comparison: {
              number: { value: "4.7", measure: "%", color: "#007800" },
              label: "vs",
              value: "Jul'25",
            },
          },
        ],
        barChart: {
          datasets: [
            {
              label: "SKU per POC",
              data: [11.4, 11.7],
              backgroundColor: ["#EDDAB1", "#D1A33C"],
            },
          ],
          labels: ["25 AC", "26 AC"],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "3.5", measure: "%", color: "#007800" },
                  { value: "4.7", measure: "%", color: "#007800" },
                ],
              },
            ],
          },
          formattedData: [["11.4", "11.7"]],
        },
        lineChart: {
          suggestedMin: 9.18,
          suggestedMax: 14.374999999999998,
          datasets: [
            {
              label: "2025",
              data: [
                11.2, 11.1, 11.2, 11.2, 11.4, 10.8, 11.3, 11.3, 11.7, 12, 11.7,
                12.5,
              ],
              borderColor: "#EDDAB1",
              pointBackgroundColor: "#EDDAB1",
            },
            {
              label: "2026",
              data: [
                11.6,
                11.2,
                11.8,
                11.7,
                11.7,
                11.6,
                12.1,
                null,
                null,
                null,
                null,
                null,
              ],
              borderColor: "#D1A33C",
              pointBackgroundColor: "#D1A33C",
            },
          ],
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
          formattedData: [
            [
              "11.2",
              "11.1",
              "11.2",
              "11.2",
              "11.4",
              "10.8",
              "11.3",
              "11.3",
              "11.7",
              "12.0",
              "11.7",
              "12.5",
            ],
            [
              "11.6",
              "11.2",
              "11.8",
              "11.7",
              "11.7",
              "11.6",
              "12.1",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
          comparisonLine: {
            data: [
              {
                title: "vs LY",
                data: [
                  { value: "3.8", measure: "%", color: "#007800" },
                  { value: "1.0", measure: "%", color: "#007800" },
                  { value: "5.1", measure: "%", color: "#007800" },
                  { value: "4.4", measure: "%", color: "#007800" },
                  { value: "3.3", measure: "%", color: "#007800" },
                  { value: "8.1", measure: "%", color: "#007800" },
                  { value: "7.0", measure: "%", color: "#007800" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                  { value: "-", measure: "", color: "" },
                ],
              },
            ],
          },
        },
      },
    },
  ],
  compressed: false,
};
