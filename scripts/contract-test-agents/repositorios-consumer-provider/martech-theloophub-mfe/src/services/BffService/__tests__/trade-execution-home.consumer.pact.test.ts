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
 * CDC
 * - Necessidade: TradeExecutionHome usa a view trade-execution_home_home para
 *   montar os cards de distribuição total e de megabrands.
 * - Evidência: useTradeExecutionHome solicita a view; TradeExecutionHome lê os
 *   IDs dos dois componentes; BigNumberSparkLineCard e seus filhos leem os
 *   campos de título, período, big number, comparação, informação secundária
 *   e série do spark line incluídos abaixo.
 * - Excluídos: view e compressed não são acessados pelo fluxo consumer.
 * - Matchers: métricas e datas são variáveis; trend tem domínio fechado; os
 *   dois IDs obrigatórios usam arrayContaining para não contratar a ordem.
 * - Formatter: trade-execution/home/home possui títulos e labels fechados,
 *   período formatado e métricas variáveis.
 */

import { arrayContaining, createPact, eachLike, like, regex } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

interface BigNumberValue {
  value: string;
  measure: string;
  trend: 'positive' | 'negative';
}

interface BigNumberComparison {
  label: string;
  value: string;
}

interface BigNumberSecondaryInfo {
  label: string;
  value: string;
}

interface BigNumberData {
  bigNumber: BigNumberValue;
  comparison: BigNumberComparison;
  secondaryInfo: BigNumberSecondaryInfo;
}

interface DistributionCardData {
  chartTitle: string;
  chartPeriod: string;
  bigNumberData: BigNumberData[];
  chartLineData: string[];
}

interface ViewComponent {
  id: 'total-distribution' | 'total-megabrands-distribution';
  data: DistributionCardData;
}

const view = 'trade-execution_home_home';
const query = {
  'filter[viewtype]': 'global',
  'filter[dt_end]': '2026-07-01',
  'filter[zone]': 'ABI',
  'filter[country]': 'ABI',
  'filter[period_type]': 'YTD',
};
const requestHeaders = { country: 'ABI' };

function bffClient(mockUrl: string) {
  return {
    getTradeExecutionHome: async () =>
      getPactView(mockUrl, view, query, requestHeaders),
  };
}

const numericStringMatcher = (example: string) =>
  regex(/^(?:-|[-+]?\d+(?:\.\d+)?)$/, example);

const bigNumberMatcher = (value: string, secondaryValue: string) => ({
  bigNumber: {
    value: numericStringMatcher(value),
    measure: like('%'),
    trend: regex(/^(?:positive|negative)$/, 'positive'),
  },
  comparison: {
    label: 'vs',
    value: 'LY',
  },
  secondaryInfo: {
    label: '[ Mio ]',
    value: numericStringMatcher(secondaryValue),
  },
});

const distributionCardMatcher = (
  id: ViewComponent['id'],
  chartTitle: string,
  value: string,
  secondaryValue: string,
  chartLineExample: string,
) => ({
  id,
  data: {
    chartTitle,
    chartPeriod: regex(/^[A-Z][a-z]{2}'\d{2} - YTD$/, "Jul'26 - YTD"),
    bigNumberData: eachLike(bigNumberMatcher(value, secondaryValue), 1),
    chartLineData: eachLike(numericStringMatcher(chartLineExample), 1),
  },
});

const responseMatcher = {
  components: arrayContaining(
    distributionCardMatcher(
      'total-distribution',
      'Total Distribution',
      '5.0',
      '27.2',
      '29.4',
    ),
    distributionCardMatcher(
      'total-megabrands-distribution',
      'Total Megabrands Distribution',
      '4.5',
      '9.5',
      '10.3',
    ),
  ),
};

describe('MFE → BFF | GET /v1/views/{view} (Trade Execution Home)', () => {
  it('retorna os cards de distribuição total e de megabrands', async () => {
    await provider
      .given('trade execution home distribution data exists for ABI')
      .uponReceiving('GET /v1/views trade execution home distribution cards')
      .withRequest({
        method: 'GET',
        path: `/v1/views/${view}`,
        query,
        headers: requestHeaders,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: responseMatcher,
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(
          mockServer.url,
        ).getTradeExecutionHome();

        expect(status).toBe(200);
        expect(data.components.map(({ id }) => id)).toEqual(
          expect.arrayContaining([
            'total-distribution',
            'total-megabrands-distribution',
          ]),
        );
      });
  });
});
