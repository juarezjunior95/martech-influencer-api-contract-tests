/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-16
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 *
 * CDC
 * - Necessidade: ConnectionsCreativityHome renderiza os dois componentes da
 *   home de Connections and Creativity.
 * - Evidências: ConnectionsCreativityHome acessa os IDs dos componentes;
 *   BigNumberSparkLineCard lê chartTitle, chartPeriod e bigNumberData;
 *   BigNumber e seus filhos leem bigNumber, comparison e secondaryInfo.
 * - Excluídos: view, compressed e chartLineData não são necessários para o
 *   fluxo fornecido; nenhum deles é usado no response recebido.
 * - Divergência aprovada: o payload confirmado pelo usuário contém
 *   filter[period_type]=YTD, embora o hook atual não o produza.
 * - Matchers: títulos, labels, unidades e IDs são estruturais/fechados;
 *   períodos e métricas são variáveis e validados por formato/tipo.
 * - Arrays: components é heterogêneo e usa arrayContaining; os dois itens de
 *   bigNumberData são grupos homogêneos e usam eachLike com mínimo 1.
 */

import { arrayContaining, createPact, eachLike, like, regex } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

interface BigNumberValue {
  value: string;
  measure: string;
  trend: 'positive' | 'negative';
}

interface BigNumberData {
  bigNumber: BigNumberValue;
  comparison: { label: string; value: string };
  secondaryInfo: { label: string; value: string };
}

const view = 'connections-and-creativity_home_home';
const query = {
  'filter[viewtype]': 'global',
  'filter[dt_ini]': '2026-01-01',
  'filter[dt_end]': '2026-07-01',
  'filter[timeframe]': '2026',
  'filter[zone]': 'ABI',
  'filter[country]': 'ABI',
  'filter[period_type]': 'YTD',
};

function bffClient(mockUrl: string) {
  return {
    getConnectionsCreativityHome: async () => getPactView(mockUrl, view, query),
  };
}

const numericString = (example: string) =>
  regex(/^(?:-|[-+]?\d+(?:\.\d+)?)$/, example);

const trend = regex(/^(?:positive|negative)$/, 'positive');

const bigNumberMatcher = (
  value: string,
  measure: string,
  secondaryLabel: string,
  secondaryValue: string,
) => ({
  bigNumber: {
    value: numericString(value),
    measure,
    trend,
  },
  comparison: {
    label: 'vs',
    value: 'LY',
  },
  secondaryInfo: {
    label: secondaryLabel,
    value: numericString(secondaryValue),
  },
});

const trendComponentMatcher = {
  id: 'connections-and-creativity-home-big-numbers-trend',
  data: [
    {
      chartTitle: 'Media Spend',
      chartPeriod: regex(
        /^[A-Z][a-z]{2}'\d{2} (?:YTD|MTD|R12M)$/,
        "Jul'26 YTD",
      ),
      bigNumberData: eachLike(
        bigNumberMatcher('25.5', '%', '[ # ]', '800.5'),
        1,
      ),
    },
    {
      chartTitle: 'Non-Working Money',
      chartPeriod: regex(
        /^[A-Z][a-z]{2}'\d{2} (?:YTD|MTD|R12M)$/,
        "Jul'26 YTD",
      ),
      bigNumberData: eachLike(
        bigNumberMatcher('-3.1', '%', '[ # ]', '16.1'),
        1,
      ),
    },
  ],
};

const resourceCardMatcher = (
  title: string,
  periodExample: string,
  value: string,
  secondaryValue: string,
) => ({
  title,
  period: regex(/^[A-Z][a-z]{2}'\d{2}$/, periodExample),
  bigNumberData: eachLike(
    bigNumberMatcher(value, 'pp', '[ % ]', secondaryValue),
    1,
  ),
});

const responseMatcher = {
  components: arrayContaining(trendComponentMatcher, {
    id: 'connections-and-creativity-home-resource-allocation',
    data: {
      megabrandsQwoaBigNumber: resourceCardMatcher(
        'Megabrands QWOA',
        "Dec'26",
        '73.5',
        '73.5',
      ),
      campaignsQwoaBigNumber: resourceCardMatcher(
        'Campaigns QWOA',
        "Dec'26",
        '41.4',
        '41.4',
      ),
    },
  }),
};

describe('MFE → BFF | GET /v1/views/{view} (Connections and Creativity Home)', () => {
  it('retorna os cards da home de Connections and Creativity', async () => {
    await provider
      .given('connections and creativity home data exists for ABI')
      .uponReceiving('GET /v1/views connections and creativity home')
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
        ).getConnectionsCreativityHome();

        expect(status).toBe(200);
        expect(data.components).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: 'connections-and-creativity-home-big-numbers-trend',
            }),
            expect.objectContaining({
              id: 'connections-and-creativity-home-resource-allocation',
            }),
          ]),
        );
      });
  });
});
