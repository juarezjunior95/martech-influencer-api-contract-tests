/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-21
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { arrayContaining, createPact, eachLike, like } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

const view = 'trade-execution_bees-distribution_overview';
const query = {
  'filter[viewtype]': 'global',
  'filter[dt_ini]': '2026-01-01',
  'filter[dt_end]': '2026-07-01',
  'filter[zone]': 'ABI',
  'filter[country]': 'ABI',
  'filter[scope]': 'total',
};

function bffClient(mockUrl: string) {
  return {
    getBeesDistributionOverview: async () => getPactView(mockUrl, view, query),
  };
}

const comparisonDataMatcher = eachLike(
  {
    value: like('7.3'),
    measure: '%',
    color: like('#007800'),
  },
  1,
);

const comparisonLineMatcher = {
  comparisonLine: {
    data: eachLike(
      {
        title: 'vs LY',
        data: comparisonDataMatcher,
      },
      1,
    ),
  },
};

const barChartMatcher = (title: string) => ({
  datasets: eachLike(
    {
      label: title,
      // O response tem séries numéricas e séries com null. `like` preserva o
      // tipo array sem aplicar eachLike homogêneo a valores heterogêneos.
      data: arrayContaining(like(0)),
      backgroundColor: ['#EDDAB1', '#D1A33C'],
    },
    1,
  ),
  labels: eachLike(like('25 AC'), 1),
  formattedData: eachLike(like(['26.8M', '27.2M']), 1),
  ...comparisonLineMatcher,
});

const lineChartMatcher = {
  // As duas séries têm a mesma forma de objeto, mas não a mesma forma de
  // dados: a primeira é numérica e a segunda contém nulls futuros.
  datasets: [
    {
      label: like('2025'),
      data: arrayContaining(like(0)),
      borderColor: '#EDDAB1',
      pointBackgroundColor: '#EDDAB1',
    },
    {
      label: like('2026'),
      data: arrayContaining(like(0)),
      borderColor: '#D1A33C',
      pointBackgroundColor: '#D1A33C',
    },
  ],
  labels: eachLike(like('JAN'), 1),
  formattedData: eachLike(like(['25.7M', '25.6M']), 1),
  ...comparisonLineMatcher,
};

const componentDataMatcher = (title: string) => ({
  legend: eachLike(
    {
      color: 'rgba(237, 218, 177, 1)',
      pointStyle: 'roundedRectangle',
      label: like('2025 AC YTD'),
      border: 'rgba(20, 20, 20, 0.12)',
    },
    1,
  ),
  header: {
    title,
    measure: like('[ Mio ]'),
  },
  bigNumberData: eachLike(
    {
      bigNumber: {
        // Métrica de negócio variável: validar somente o tipo string.
        value: like(''),
        measure: like(''),
      },
      comparison: {
        number: {
          value: like('5.0'),
          measure: '%',
          color: like('#007800'),
        },
        label: 'vs',
        value: like("Jul'25"),
      },
    },
    1,
  ),
  barChart: barChartMatcher(title),
  lineChart: {
    ...lineChartMatcher,
    suggestedMin: like(21319864.9),
    suggestedMax: like(33825537.65),
  },
});

const componentMatcher = (id: string, title: string) => ({
  id,
  data: componentDataMatcher(title),
});

const responseMatcher = {
  view,
  // Os componentes possuem a mesma forma, mas IDs, títulos e métricas
  // diferentes; por isso são representados por posição.
  components: [
    componentMatcher('total-distribution', 'Total Distribution'),
    componentMatcher('total-buyers', 'Total Buyers'),
    componentMatcher('sku-per-poc', 'SKU per POC'),
  ],
  compressed: like(false),
};

describe('MFE → BFF | GET /v1/views/{view} (Bees Distribution Overview)', () => {
  it('retorna os componentes de distribuição para o overview', async () => {
    await provider
      .given('bees distribution overview data exists for Brazil')
      .uponReceiving('GET /v1/views trade execution bees distribution overview')
      .withRequest({
        method: 'GET',
        path: `/v1/views/${view}`,
        query,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: responseMatcher,
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(
          mockServer.url,
        ).getBeesDistributionOverview();

        expect(status).toBe(200);
        expect(data.view).toBe(view);
        expect(data.compressed).toBe(false);
        expect(data.components.length).toBeGreaterThan(0);
        expect(data.components[0].data).toHaveProperty('barChart');
        expect(data.components[0].data).toHaveProperty('lineChart');
      });
  });
});
