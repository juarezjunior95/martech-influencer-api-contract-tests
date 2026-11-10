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
 * - Necessidade: PortfolioBrandHome solicita portfolio-brand_home_home e
 *   renderiza increase-brand-power, portfolio-strategy e target-audiences.
 * - Evidências: PortfolioBrandHome acessa os três IDs; IncreaseBrandPower lê
 *   title, period, bigNumberData e chartLineData; os demais cards leem title,
 *   period e bigNumberData. BigNumber lê os campos aninhados da métrica.
 * - Excluídos: view e compressed não são acessados pelo consumer.
 * - Matchers: títulos, labels e IDs têm domínio estrutural/fechado; métricas,
 *   períodos, medidas e séries são variáveis ou formatadas por tipo.
 * - Arrays: components é heterogêneo e usa arrayContaining; bigNumberData e
 *   chartLineData são grupos homogêneos e usam eachLike com mínimo 1.
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

const view = 'portfolio-brand_home_home';
const requestParams = {
  viewtype: 'global',
  dt_ini: '2026-01-01',
  dt_end: '2026-06-01',
  timeframe: 'YTD',
  timeperiod: 'YTD',
  zone: 'ABI',
  country: 'ABI',
  period_type: 'YTD',
  page_filter: 'All',
};

const countryRequestParams = {
  ...requestParams,
  viewtype: 'country',
  zone: 'SAZ',
  country: 'BRA',
};

const unknownCountryRequestParams = {
  ...countryRequestParams,
  country: 'XYZ',
};

const query = Object.fromEntries(
  Object.entries(requestParams).map(([key, value]) => [
    `filter[${key}]`,
    value,
  ]),
);

const countryQuery = Object.fromEntries(
  Object.entries(countryRequestParams).map(([key, value]) => [
    `filter[${key}]`,
    value,
  ]),
);

const unknownCountryQuery = Object.fromEntries(
  Object.entries(unknownCountryRequestParams).map(([key, value]) => [
    `filter[${key}]`,
    value,
  ]),
);

const numericString = (example: string) =>
  regex(/^(?:-|[-+]?\d+(?:\.\d+)?)$/, example);

const period = (example: string) =>
  regex(/^Q[1-4]'\d{2} (?:YTD|MTD|R12M)$/, example);

const trend = regex(/^(?:positive|negative)$/, 'positive');

const bigNumberMatcher = (
  value: string,
  measure: string,
  secondaryLabel: string,
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
    label: like(secondaryLabel),
    value: numericString(secondaryValue),
  },
});

const responseMatcher = {
  components: arrayContaining(
    {
      id: 'increase-brand-power',
      data: {
        title: 'ABI Brand Power',
        period: period("Q2'26 YTD"),
        bigNumberData: eachLike(
          bigNumberMatcher('0.4', 'pp', '[ % ]', '53.8'),
          1,
        ),
        chartLineData: eachLike(like(0), 1),
      },
    },
    {
      id: 'portfolio-strategy',
      data: eachLike(
        {
          title: like('Megabrands Volume'),
          period: period("Q3'26 YTD"),
          bigNumberData: eachLike(
            bigNumberMatcher('2.3', '%', '[ k hl ]', '198887.8'),
            1,
          ),
        },
        1,
      ),
    },
    {
      id: 'target-audiences',
      data: {
        title: 'Brands Superior',
        period: period("Q2'26 MTD"),
        bigNumberData: eachLike(
          bigNumberMatcher('10.0', 'pp', '[ % ]', '57.5'),
          1,
        ),
      },
    },
  ),
};

const countryResponseMatcher = {
  components: arrayContaining(
    {
      id: 'increase-brand-power',
      data: {
        title: 'ABI Brand Power',
        period: period("Q2'26 YTD"),
        bigNumberData: eachLike(
          bigNumberMatcher('0.4', 'pp', '[ % ]', '61.1'),
          1,
        ),
        chartLineData: eachLike(like(0), 1),
      },
    },
    {
      id: 'portfolio-strategy',
      data: eachLike(
        {
          title: like('Megabrands Volume'),
          period: period("Q3'26 YTD"),
          bigNumberData: eachLike(
            bigNumberMatcher('1.5', '%', '[ k hl ]', '30535.1'),
            1,
          ),
        },
        1,
      ),
    },
    {
      id: 'target-audiences',
      data: {
        title: 'Brands Superior',
        period: period("Q2'26 MTD"),
        bigNumberData: eachLike(
          bigNumberMatcher('0.0', 'pp', '[ % ]', '66.7'),
          1,
        ),
      },
    },
  ),
};

const unknownCountryResponseMatcher = {
  components: arrayContaining(
    { id: 'increase-brand-power', data: {} },
    { id: 'portfolio-strategy', data: {} },
    { id: 'target-audiences', data: {} },
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

const resetBffService = () => {
  (BffService as unknown as { instance?: BffService }).instance = undefined;
};

describe('MFE → BFF | GET /v1/views/{view} (Portfolio Brand Home)', () => {
  it('retorna os cards da home de Portfolio Brand', async () => {
    await provider
      .given('portfolio brand home data exists for ABI')
      .uponReceiving('GET /v1/views portfolio brand home')
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
        resetBffService();
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
            'increase-brand-power',
            'portfolio-strategy',
            'target-audiences',
          ]),
        );

        const increaseBrandPower = normalizedData['increase-brand-power'];
        const portfolioStrategy = normalizedData['portfolio-strategy'];
        const targetAudiences = normalizedData['target-audiences'];

        expect(increaseBrandPower.title).toBeDefined();
        expect(increaseBrandPower.period).toBeDefined();
        expect(increaseBrandPower.bigNumberData.length).toBeGreaterThan(0);
        expect(increaseBrandPower.chartLineData.length).toBeGreaterThan(0);
        expect(portfolioStrategy.length).toBeGreaterThan(0);
        expect(portfolioStrategy[0].title).toBeDefined();
        expect(portfolioStrategy[0].period).toBeDefined();
        expect(portfolioStrategy[0].bigNumberData.length).toBeGreaterThan(0);
        expect(targetAudiences.title).toBeDefined();
        expect(targetAudiences.period).toBeDefined();
        expect(targetAudiences.bigNumberData.length).toBeGreaterThan(0);
      });
  });

  it('retorna os cards da home de Portfolio Brand para país BRA na zona SAZ', async () => {
    await provider
      .given('portfolio brand home data exists for SAZ/BRA')
      .uponReceiving('GET /v1/views portfolio brand home for country BRA')
      .withRequest({
        method: 'GET',
        path: `/v1/views/${view}`,
        query: countryQuery,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: countryResponseMatcher,
      })
      .executeTest(async (mockServer) => {
        installLocalStorage();
        resetBffService();
        localStorage.setItem('bffUrl', `${mockServer.url}/v1`);

        const response = await BffService.getInstance().getData({
          endpoint: `/views/${view}`,
          params: countryRequestParams,
        });

        const { data, status } = response;
        const normalizedData = BffService.normalizeResponse(data);

        expect(status).toBe(200);
        expect(Object.keys(normalizedData)).toEqual(
          expect.arrayContaining([
            'increase-brand-power',
            'portfolio-strategy',
            'target-audiences',
          ]),
        );
        expect(
          normalizedData['increase-brand-power'].bigNumberData.length,
        ).toBeGreaterThan(0);
        expect(
          normalizedData['increase-brand-power'].chartLineData.length,
        ).toBeGreaterThan(0);
        expect(normalizedData['portfolio-strategy'].length).toBeGreaterThan(0);
        expect(
          normalizedData['target-audiences'].bigNumberData.length,
        ).toBeGreaterThan(0);
      });
  });

  it('retorna componentes vazios para país inexistente XYZ na zona SAZ', async () => {
    await provider
      .given('portfolio brand home has no data for country XYZ')
      .uponReceiving('GET /v1/views portfolio brand home for unknown country')
      .withRequest({
        method: 'GET',
        path: `/v1/views/${view}`,
        query: unknownCountryQuery,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: unknownCountryResponseMatcher,
      })
      .executeTest(async (mockServer) => {
        installLocalStorage();
        resetBffService();
        localStorage.setItem('bffUrl', `${mockServer.url}/v1`);

        const response = await BffService.getInstance().getData({
          endpoint: `/views/${view}`,
          params: unknownCountryRequestParams,
        });

        const { data, status } = response;
        const normalizedData = BffService.normalizeResponse(data);

        expect(status).toBe(200);
        expect(Object.keys(normalizedData)).toEqual(
          expect.arrayContaining([
            'increase-brand-power',
            'portfolio-strategy',
            'target-audiences',
          ]),
        );
      });
  });
});
