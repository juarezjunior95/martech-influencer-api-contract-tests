/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : /Users/jluccasm/Documents/crew-pact/openapi.json  (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 *
 * CDC
 * - Necessidade: ConsumerHome solicita consumer_home e renderiza os três
 *   componentes da página.
 * - Evidências: ConsumerHome acessa os IDs dos três componentes; os dois
 *   cards usam BigNumberSparkLineCard e o terceiro usa BigNumber/ChartHeader.
 *   BigNumberSparkLineCard lê chartTitle, chartPeriod, bigNumberData,
 *   bigNumber.trend e chartLineData; ConsumerHome lê title, description e
 *   period do componente target-audiences.
 * - Excluídos: view e compressed não são acessados pelo consumer.
 * - Matchers: métricas e períodos são variáveis; trends e labels têm domínio
 *   ou formato comprovado pelos formatters do provider.
 * - Arrays: components é heterogêneo e usa arrayContaining porque o consumer
 *   normaliza por ID; os arrays homogêneos usam eachLike com quantidade mínima
 *   1.
 */

import { arrayContaining, createPact, eachLike, like, regex } from 'pact';
import { BffService } from 'services/BffService/BffService';

jest.mock('admin-portal-shared-services', () => ({
  useAuthenticationService: () => ({
    getUserCountryAndLanguage: () => ({ user_country: '' }),
    enhancedAxios: jest.fn(),
  }),
}));

const provider = createPact();

const view = 'consumer_home';
const requestParams = {
  viewtype: 'global',
  dt_ini: '2026-01-01',
  dt_end: '2026-06-01',
  timeframe: '2026',
  timeperiod: 'R12M',
  zone: 'ABI',
  country: 'ABI',
  period_type: 'YTD',
};

const query = Object.fromEntries(
  Object.entries(requestParams).map(([key, value]) => [
    `filter[${key}]`,
    value,
  ]),
);

const numericString = (example: string) =>
  regex(/^(?:-|[-+]?\d+(?:\.\d+)?)$/, example);

const trend = regex(/^(?:positive|negative)$/, 'negative');

const bigNumberMatcher = (
  value: string,
  measure: string,
  secondaryValue: string,
) => ({
  bigNumber: {
    value: numericString(value),
    measure: like(measure),
    trend,
  },
  comparison: {
    label: 'vs',
    value: 'LY',
  },
  secondaryInfo: {
    label: like('[ % ]'),
    value: numericString(secondaryValue),
  },
});

const responseMatcher = {
  components: arrayContaining(
    {
      id: 'increase-participation',
      data: {
        chartTitle: 'P4W Participation',
        chartPeriod: regex(/^[A-Z][1-4]'\d{2} - R12M$/, "Q2'26 - R12M"),
        bigNumberData: eachLike(bigNumberMatcher('-0.6', 'pp', '43.4'), 1),
        chartLineData: eachLike(like(0), 1),
      },
    },
    {
      id: 'increase-abi-lovers',
      data: {
        chartTitle: 'P7D Participation',
        chartPeriod: regex(/^[A-Z][1-4]'\d{2} - R12M$/, "Q2'26 - R12M"),
        bigNumberData: eachLike(bigNumberMatcher('2.6', 'pp', '30.1'), 1),
        chartLineData: eachLike(like(0), 1),
      },
    },
    {
      id: 'target-audiences',
      data: {
        title: 'Participation index',
        description: 'Core Audience vs Total',
        period: regex(/^[A-Z][1-4]'\d{2} - R12M$/, "Q2'26 - R12M"),
        bigNumberData: eachLike(
          {
            bigNumber: {
              value: numericString('138.7'),
              measure: '',
              trend,
            },
            comparison: {
              label: 'vs',
              value: regex(/^[A-Z][a-z]{2}'\d{2}$/, "Jan'26"),
            },
            secondaryInfo: {
              label: '',
              value: '',
            },
          },
          1,
        ),
      },
    },
  ),
};

const localStorageState = new Map<string, string>();

const installLocalStorage = () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => localStorageState.get(key) ?? null,
      setItem: (key: string, value: string) =>
        localStorageState.set(key, value),
      removeItem: (key: string) => localStorageState.delete(key),
      clear: () => localStorageState.clear(),
    },
  });
};

describe('MFE → BFF | GET /v1/views/{view} (Consumer Home)', () => {
  it('retorna os cards de participação e target audiences', async () => {
    await provider
      .given('consumer home data exists for ABI')
      .uponReceiving('GET /v1/views consumer home')
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
        installLocalStorage();
        localStorage.setItem('bffUrl', `${mockServer.url}/v1`);

        const response = await BffService.getInstance().getData({
          endpoint: `/views/${view}`,
          params: requestParams,
        });

        const { data, status } = response;
        const normalizedData = BffService.normalizeResponse(data);

        expect(status).toBe(200);
        expect(Object.keys(normalizedData)).toEqual(
          expect.arrayContaining([
            'increase-participation',
            'increase-abi-lovers',
            'target-audiences',
          ]),
        );

        const participation = normalizedData['increase-participation'];
        const abiLovers = normalizedData['increase-abi-lovers'];
        const targetAudiences = normalizedData['target-audiences'];

        expect(participation.chartTitle).toBeDefined();
        expect(participation.chartPeriod).toBeDefined();
        expect(participation.bigNumberData.length).toBeGreaterThan(0);
        expect(participation.chartLineData.length).toBeGreaterThan(0);
        expect(typeof participation.chartLineData[0]).toBe('number');
        expect(typeof participation.bigNumberData[0].bigNumber.value).toBe(
          'string',
        );
        expect(participation.bigNumberData[0].bigNumber.trend).toEqual(
          expect.stringMatching(/^(?:positive|negative)$/),
        );

        expect(abiLovers.chartTitle).toBeDefined();
        expect(abiLovers.chartPeriod).toBeDefined();
        expect(abiLovers.bigNumberData.length).toBeGreaterThan(0);
        expect(abiLovers.chartLineData.length).toBeGreaterThan(0);
        expect(typeof abiLovers.chartLineData[0]).toBe('number');
        expect(typeof abiLovers.bigNumberData[0].bigNumber.value).toBe(
          'string',
        );

        expect(targetAudiences.title).toBeDefined();
        expect(targetAudiences.description).toBeDefined();
        expect(targetAudiences.period).toBeDefined();
        expect(targetAudiences.bigNumberData.length).toBeGreaterThan(0);
        expect(typeof targetAudiences.bigNumberData[0].bigNumber.value).toBe(
          'string',
        );
      });
  });
});
