/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-08-27
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 *
 * VADER
 * - Verbs: GET /v1/views/category_home; nenhum body; métodos rejeitados ficam
 *   fora deste contrato.
 * - Authorization: o endpoint declara bearer no OpenAPI; a autenticação é
 *   provida pelo harness/mock existente, sem token literal neste teste.
 * - Data: query reproduzida exatamente do response fornecido; componentes
 *   heterogêneos são representados por posição e arrays homogêneos usam
 *   eachLike com quantidade mínima 1.
 * - Errors: 400, 404, 422 e 500 estão documentados no OpenAPI; a interação
 *   deste cenário cobre apenas o sucesso 200.
 * - Responsiveness: latência, carga e concorrência permanecem cobertura de
 *   testes de performance/resiliência, não são inventadas como interações Pact.
 */

import { createPact, eachLike, like } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

const view = 'category_home';
const query = {
  'filter[viewtype]': 'global',
  'filter[dt_ini]': '2026-01-01',
  'filter[dt_end]': '2026-06-01',
  'filter[timeframe]': '2026',
  'filter[timeperiod]': 'R12M',
  'filter[zone]': 'ABI',
  'filter[country]': 'ABI',
  'filter[period_type]': 'YTD',
  'filter[pos_kpi]': 'participation',
};

function bffClient(mockUrl: string) {
  return {
    getCategoryHome: async () => getPactView(mockUrl, view, query),
  };
}

const bigNumberMatcher = {
  bigNumber: {
    value: like('0.0'),
    measure: like('pp'),
    trend: like('positive'),
  },
  comparison: {
    label: like('vs'),
    value: like('LY'),
  },
  secondaryInfo: {
    label: '[ % ]',
    value: like('0.0'),
  },
};

const consumerBehaviorMatcher = {
  id: 'consumer-behavior',
  data: eachLike(
    {
      title: like('Beer Participation'),
      period: like("Q2'26 - R12M"),
      bigNumberData: eachLike(bigNumberMatcher, 1),
    },
    1,
  ),
};

const growTheCategoryMatcher = {
  id: like('grow-the-category'),
  data: eachLike(
    {
      chartTitle: like('Beer Category Volume'),
      chartPeriod: like("25'FY"),
      bigNumberData: eachLike(bigNumberMatcher, 1),
      chartLineData: eachLike(like(0), 1),
    },
    1,
  ),
};

const leadTheCategoryMatcher = {
  id: like('lead-the-category'),
  data: eachLike(
    {
      chartTitle: like('ABI Market Share'),
      chartPeriod: like("Jun'26 YTD"),
      bigNumberData: eachLike(bigNumberMatcher, 1),
      chartLineData: eachLike(like(0), 1),
    },
    1,
  ),
};

const responseMatcher = {
  view: like(view),
  // Os três componentes têm formas de data diferentes; por isso não usamos
  // eachLike no array inteiro e preservamos a posição de cada grupo.
  components: [
    consumerBehaviorMatcher,
    growTheCategoryMatcher,
    leadTheCategoryMatcher,
  ],
  compressed: like(false),
};

describe('MFE → BFF | GET /v1/views/{view} (category_home)', () => {
  it('retorna os componentes do overview da categoria', async () => {
    await provider
      .given('category home data exists for ABI')
      .uponReceiving('GET /v1/views category home')
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
        ).getCategoryHome();

        expect(status).toBe(200);
        expect(data.view).toBe(view);
        expect(data.compressed).toBe(false);
        expect(data.components).toHaveLength(3);
        expect(data.components[0].id).toBe('consumer-behavior');
        expect(data.components[1].id).toBe('grow-the-category');
        expect(data.components[2].id).toBe('lead-the-category');
      });
  });
});
