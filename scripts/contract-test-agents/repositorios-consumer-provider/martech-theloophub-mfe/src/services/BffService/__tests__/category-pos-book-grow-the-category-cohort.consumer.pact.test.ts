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

import { createPact, eachLike, like } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

const view = 'category_pos-book_grow-the-category_cohort';
const query = {
  'filter[viewtype]': 'global',
  'filter[dt_ini]': '2026-01-01',
  'filter[dt_end]': '2026-06-01',
  'filter[timeframe]': '2026',
  'filter[timeperiod]': 'QTD',
  'filter[zone]': 'ABI',
  'filter[country]': 'ABI',
  'filter[cohort]': 'All',
  'filter[pos_kpi]': 'participation',
};

function bffClient(mockUrl: string) {
  return {
    getView: async () => getPactView(mockUrl, view, query),
  };
}

const cellMatcher = (backgroundColor: string) => ({
  chartData: {
    data: eachLike(like('68.2'), 1),
    backgroundColor: [backgroundColor],
    chartUnitMeasure: '%',
  },
  variation: like('-0.7'),
  variationMeasure: 'pp',
  chartScaleMax: like(78.4),
});

const rowMatcher = {
  label: {
    noChart: like(true),
    merge: like(true),
    value: like('Global'),
  },
  alcohol: cellMatcher('#C9D1D6'),
  beer: cellMatcher('#F0DF78'),
  beyond_beer: cellMatcher('#EEC879'),
  spirits: cellMatcher('#A1CFF4'),
  wine: cellMatcher('#F6B7D0'),
};

const responseMatcher = {
  view,
  components: eachLike(
    {
      id: 'country',
      data: {
        header: [
          {
            title: 'Label',
            children: [{ title: 'Label', id: 'label' }],
          },
          { title: 'Alcohol', id: 'alcohol' },
          { title: 'Beer', id: 'beer' },
          { title: 'Beyond Beer', id: 'beyond_beer' },
          { title: 'Spirits', id: 'spirits' },
          { title: 'Wine', id: 'wine' },
        ],
        rows: [
          eachLike(rowMatcher, 1),
          eachLike(rowMatcher, 2),
          eachLike(rowMatcher, 5),
          eachLike(rowMatcher, 3),
        ],
      },
    },
    1,
  ),
  compressed: like(false),
};

describe('MFE → BFF | GET /v1/views/{view} (Category POS Book Cohort)', () => {
  it('retorna os dados de cohort para o category POS Book', async () => {
    await provider
      .given('category POS Book cohort data exists for ABI')
      .uponReceiving('GET /v1/views category POS Book cohort')
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
        const { data, status } = await bffClient(mockServer.url).getView();

        expect(status).toBe(200);
        expect(data.view).toBe(view);
        expect(data.compressed).toBe(false);
        expect(data.components).toHaveLength(1);
        expect(data.components[0].id).toBe('country');
        expect(data.components[0].data.header).toHaveLength(6);
        expect(data.components[0].data.rows).toHaveLength(4);
        expect(
          data.components[0].data.rows.every((rows) => rows.length > 0),
        ).toBe(true);
      });
  });
});
