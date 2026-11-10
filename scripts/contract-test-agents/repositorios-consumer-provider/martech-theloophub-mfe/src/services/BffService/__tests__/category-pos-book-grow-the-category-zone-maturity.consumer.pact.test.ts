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

const view = 'category_pos-book_grow-the-category_zone-maturity';
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

const categoryCellStructureMatcher = {
  chartData: {
    // Exemplos apenas para validação de tipo; não validam valores de negócio.
    data: eachLike(like('68.1'), 1),
    backgroundColor: eachLike(like('#C9D1D6'), 1),
    chartUnitMeasure: like('%'),
  },
  variation: like('-0.3'),
  variationMeasure: like('pp'),
  chartScaleMax: like(87.8),
};

const alcoholFirstRowMatcher = {
  chartData: {
    data: eachLike(like('68.1'), 1),
    backgroundColor: ['#C9D1D6'],
    chartUnitMeasure: '%',
  },
  variation: like('-0.3'),
  variationMeasure: 'pp',
  chartScaleMax: like(87.8),
};

const beerFirstRowMatcher = {
  chartData: {
    data: eachLike(like('56.6'), 1),
    backgroundColor: ['#F0DF78'],
    chartUnitMeasure: '%',
  },
  variation: like('0.3'),
  variationMeasure: 'pp',
  chartScaleMax: like(82.1),
};

const beyondBeerFirstRowMatcher = {
  chartData: {
    data: eachLike(like('26.5'), 1),
    backgroundColor: ['#EEC879'],
    chartUnitMeasure: '%',
  },
  variation: like('-0.6'),
  variationMeasure: 'pp',
  chartScaleMax: like(39.2),
};

const spiritsFirstRowMatcher = {
  chartData: {
    data: eachLike(like('32.8'), 1),
    backgroundColor: ['#A1CFF4'],
    chartUnitMeasure: '%',
  },
  variation: like('-1.5'),
  variationMeasure: 'pp',
  chartScaleMax: like(46.4),
};

const wineFirstRowMatcher = {
  chartData: {
    data: eachLike(like('32.7'), 1),
    backgroundColor: ['#F6B7D0'],
    chartUnitMeasure: '%',
  },
  variation: like('-2.4'),
  variationMeasure: 'pp',
  chartScaleMax: like(51),
};

const firstRowMatcher = {
  label: { value: ' ' },
  maturity_zone: { noChart: true, value: 'Global' },
  alcohol: alcoholFirstRowMatcher,
  beer: beerFirstRowMatcher,
  beyond_beer: beyondBeerFirstRowMatcher,
  spirits: spiritsFirstRowMatcher,
  wine: wineFirstRowMatcher,
};

const otherRowsMatcher = {
  label: { value: like('Maturity') },
  maturity_zone: { noChart: like(true), value: like('M3') },
  alcohol: categoryCellStructureMatcher,
  beer: categoryCellStructureMatcher,
  beyond_beer: categoryCellStructureMatcher,
  spirits: categoryCellStructureMatcher,
  wine: categoryCellStructureMatcher,
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
            children: [
              { title: 'Label', id: 'label' },
              { title: 'Maturity/Zone', id: 'maturity_zone' },
            ],
          },
          { title: 'Alcohol', id: 'alcohol' },
          { title: 'Beer', id: 'beer' },
          { title: 'Beyond Beer', id: 'beyond_beer' },
          { title: 'Spirits', id: 'spirits' },
          { title: 'Wine', id: 'wine' },
        ],
        rows: [
          eachLike(firstRowMatcher, 1),
          eachLike(otherRowsMatcher, 3),
          eachLike(otherRowsMatcher, 6),
        ],
      },
    },
    1,
  ),
  compressed: false,
};

describe('MFE → BFF | GET /v1/views/{view} (Category POS Book Zone Maturity)', () => {
  it('retorna os dados de maturidade por zona para o category POS Book', async () => {
    await provider
      .given('category POS Book zone maturity data exists for ABI')
      .uponReceiving('GET /v1/views category POS Book zone maturity')
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

        const component = data.components[0];
        expect(component.data.header).toHaveLength(6);
        expect(component.data.rows).toHaveLength(3);
        expect(component.data.rows[0]).toHaveLength(1);
        expect(component.data.rows[1]).toHaveLength(3);
        expect(component.data.rows[2]).toHaveLength(6);

        const firstRow = component.data.rows[0][0];
        expect(firstRow.label.value).toBe(' ');
        expect(firstRow.maturity_zone.noChart).toBe(true);
        expect(firstRow.maturity_zone.value).toBe('Global');

        expect(firstRow.alcohol.chartData.chartUnitMeasure).toBe('%');
        expect(firstRow.alcohol.variationMeasure).toBe('pp');
        expect(firstRow.alcohol.chartData.backgroundColor).toEqual(['#C9D1D6']);
        expect(firstRow.beer.chartData.chartUnitMeasure).toBe('%');
        expect(firstRow.beer.variationMeasure).toBe('pp');
        expect(firstRow.beer.chartData.backgroundColor).toEqual(['#F0DF78']);
        expect(firstRow.beyond_beer.chartData.chartUnitMeasure).toBe('%');
        expect(firstRow.beyond_beer.variationMeasure).toBe('pp');
        expect(firstRow.beyond_beer.chartData.backgroundColor).toEqual([
          '#EEC879',
        ]);
        expect(firstRow.spirits.chartData.chartUnitMeasure).toBe('%');
        expect(firstRow.spirits.variationMeasure).toBe('pp');
        expect(firstRow.spirits.chartData.backgroundColor).toEqual(['#A1CFF4']);
        expect(firstRow.wine.chartData.chartUnitMeasure).toBe('%');
        expect(firstRow.wine.variationMeasure).toBe('pp');
        expect(firstRow.wine.chartData.backgroundColor).toEqual(['#F6B7D0']);
      });
  });
});
