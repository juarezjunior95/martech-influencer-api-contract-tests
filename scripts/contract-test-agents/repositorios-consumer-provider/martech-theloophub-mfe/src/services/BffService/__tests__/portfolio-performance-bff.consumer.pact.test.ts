/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : arquivo OpenAPI local não versionado (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/views/{view}
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { createPact, eachLike, like, regex } from 'pact';
import { getPactView } from 'pact/test-client';

const provider = createPact();

function bffClient(mockUrl: string) {
  return {
    getPortfolioPerformance: async (params: {
      zone: string;
      country: string;
      dt_ini: string;
      dt_end: string;
      period: 'YTD' | 'Month';
      viewtype?: string;
    }) => {
      const normalizedParams = {
        'filter[zone]': params.zone,
        'filter[country]': params.country,
        'filter[dt_ini]': params.dt_ini,
        'filter[dt_end]': params.dt_end,
        'filter[period]': params.period,
        ...(params.viewtype ? { 'filter[viewtype]': params.viewtype } : {}),
      };

      return getPactView(
        mockUrl,
        'value-creation_portfolio-performance_overview_overview',
        normalizedParams,
      );
    },
  };
}

// ────────────────────────────────────────────────────────────────

const portfolioHeaderMatcher = {
  title: like('Portfolio'),
  id: like('portfolio'),
};

const groupHeaderMatcher = (childrenMin: number) => ({
  title: like('Volume'),
  children: eachLike(
    {
      id: like('volume_growth_contr'),
      title: like('Growth Contrib.'),
    },
    childrenMin,
  ),
});

// - Definir o padrão esperado para UMA linha de portfolio (grupo)
const portfolioRowMatcher = (portfolioName: string, brandsMin = 1) => ({
  portfolio: {
    marginBottom: like(true),
    value: regex(/^(Megabrands|Expansion|Sustain|Tail|Total)$/, portfolioName),
  },
  volume_growth_contr: {
    unitMeasure: '%',
    value: like(49.1),
  },
  volume_weight: {
    unitMeasure: '%',
    value: like(60.9),
  },
  volume_vs_ly: {
    unitMeasure: '%',
    value: like(1.3),
    variationDirection: like('up'),
  },
  net_revenue_vs_ly: {
    unitMeasure: '%',
    value: like(7.3),
    variationDirection: like('up'),
  },
  cores_vs_ly: {
    unitMeasure: '%',
    value: like(8.2),
    variationDirection: like('up'),
  },
  brand_power_vs_ly: {
    unitMeasure: 'pp',
    value: like(0.8),
    variationDirection: like('up'),
  },
  sm_of_maco: {
    unitMeasure: '%',
    value: like(13.8),
  },
  sm_weight: {
    unitMeasure: '%',
    value: like(59),
  },
  brands_vol_og_vs_ly: {
    brands: eachLike(
      {
        src: like(
          'https://onewaymartech-assets.mybees-platform.com/brands/corona/square.png',
        ),
        name: like('Corona'),
        variation: like(6),
        variationMeasure: '%',
        variationDirection: like('up'),
        country: like('ABI'),
        country_src: like(
          'https://onewaymartech-assets.mybees-platform.com/countries/rounded_flags/ABI.png',
        ),
      },
      brandsMin,
    ),
    value: '_brands',
  },
});

// A linha "Total" tem campos extras (`radiusRight`, `radiusTop`) em
// cada célula. O Pact ignora campos extras na resposta real por
// padrão, então não é obrigatório declará-los — mas fica explícito
// aqui para documentar o contrato e evitar regressão silenciosa
// caso o provider pare de mandá-los e o front dependa disso.
const totalRowMatcher = {
  ...portfolioRowMatcher('Total', 0),
  portfolio: {
    ...portfolioRowMatcher('Total', 0).portfolio,
    radiusRight: like(true),
    radiusTop: like(true),
  },
};

// - Validar TODA a resposta BFF
const portfolioPerformanceResponseMatcher = {
  view: 'value-creation_portfolio-performance_overview_overview',
  components: eachLike(
    {
      id: 'portfolioPerformance',
      data: {
        header: [
          portfolioHeaderMatcher, // Portfolio
          groupHeaderMatcher(1), // Volume (3 children reais)
          groupHeaderMatcher(1), // Net Revenue (1 child)
          groupHeaderMatcher(1), // CORES (1 child)
          groupHeaderMatcher(1), // Brand Power (1 child)
          groupHeaderMatcher(1), // S&M (2 children)
          groupHeaderMatcher(1), // Brands (1 child)
        ],

        // Exemplos distintos por linha, para o mock gerado refletir
        // de fato a diversidade de portfolios (evita que todas as
        // linhas apareçam como "Total" no corpo simulado).
        rows: [
          [
            portfolioRowMatcher('Megabrands'),
            portfolioRowMatcher('Expansion'),
            portfolioRowMatcher('Sustain'),
            portfolioRowMatcher('Tail'),
          ],
          [totalRowMatcher],
        ],

        splits: [
          ['Portfolio'],
          ['Volume'],
          ['Net Revenue', 'CORES', 'Market Share', 'Brand Power'],
          ['S&M'],
          ['Brands'],
        ],
      },
    },
    1,
  ),
  compressed: like(false),
};

describe('MFE → BFF | GET /v1/views/{view} (Portfolio Performance) - Global', () => {
  it('retorna portfolios com dados completos para zona global (ABI)', async () => {
    await provider
      .given('portfolio performance data exists for zone ABI')
      .uponReceiving(
        'GET /v1/views portfolio performance for zone ABI and country ABI',
      )
      .withRequest({
        method: 'GET',
        path: '/v1/views/value-creation_portfolio-performance_overview_overview',
        query: {
          'filter[zone]': 'ABI',
          'filter[country]': 'ABI',
          'filter[dt_ini]': '2026-01-01',
          'filter[dt_end]': '2026-06-01',
          'filter[period]': 'YTD',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: portfolioPerformanceResponseMatcher,
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(
          mockServer.url,
        ).getPortfolioPerformance({
          zone: 'ABI',
          country: 'ABI',
          dt_ini: '2026-01-01',
          dt_end: '2026-06-01',
          period: 'YTD',
        });

        // ✓ Validação 1: HTTP status correto
        expect(status).toBe(200);

        // ✓ Validação 2: View correto
        expect(data.view).toBe(
          'value-creation_portfolio-performance_overview_overview',
        );

        // ✓ Validação 3: Tem components
        expect(data.components).toHaveLength(1);
        expect(data.components[0].id).toBe('portfolioPerformance');

        // ✓ Validação 4: Dados não vazios
        const portfolioData = data.components[0].data;
        expect(portfolioData.header).not.toHaveLength(0);
        expect(portfolioData.rows).not.toHaveLength(0);

        // ✓ Validação 5: Header tem o shape correto (portfolio sem
        // children, grupos sem id no nível superior)
        expect(portfolioData.header[0].id).toBe('portfolio');
        expect(portfolioData.header[0].children).toBeUndefined();
        expect(portfolioData.header[1].id).toBeUndefined();
        expect(portfolioData.header[1].children).toBeDefined();

        // ✓ Validação 6: Tem múltiplos portfolios + linha total
        const portfolioRows = portfolioData.rows[0];
        const totalRow = portfolioData.rows[1];
        expect(portfolioRows.length).toBeGreaterThanOrEqual(4);
        expect(totalRow[0].portfolio.value).toBe('Total');

        // ✓ Validação 7: Cada portfolio tem brands
        portfolioRows.forEach((row) => {
          expect(row.brands_vol_og_vs_ly.brands).toBeDefined();
          expect(Array.isArray(row.brands_vol_og_vs_ly.brands)).toBe(true);
        });

        // ✓ Validação 8: Estrutura de splits (agora com "CORES" correto)
        expect(portfolioData.splits).toContainEqual(['Portfolio']);
        expect(portfolioData.splits).toContainEqual(['Volume']);
        expect(portfolioData.splits).toContainEqual([
          'Net Revenue',
          'CORES',
          'Market Share',
          'Brand Power',
        ]);
      });
  });

  // ────────────────────────────────────────────────────────────────
  // Escopo geográfico (SAZ/BRA)
  // ────────────────────────────────────────────────────────────────
  // Nota de QA: este teste valida que o MESMO contrato de estrutura
  // é honrado para outra combinação zone/country — não valida QUAIS
  // países aparecem nos dados (ex.: "SAZ contém ARG, BRA, CHL...").
  // Isso é regra de negócio do provider, fora do escopo de um
  // contract test consumer-driven. Regras de negócio desse tipo
  // pertencem a testes funcionais/integração do lado do BFF.
  it('retorna dados para zona SAZ com país Brasil especificado', async () => {
    await provider
      .given('portfolio performance data exists for zone SAZ and country BRA')
      .uponReceiving('GET /v1/views portfolio performance for SAZ/Brazil')
      .withRequest({
        method: 'GET',
        path: '/v1/views/value-creation_portfolio-performance_overview_overview',
        query: {
          'filter[zone]': 'SAZ',
          'filter[country]': 'BRA',
          'filter[dt_ini]': '2026-01-01',
          'filter[dt_end]': '2026-06-01',
          'filter[period]': 'YTD',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: portfolioPerformanceResponseMatcher,
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(
          mockServer.url,
        ).getPortfolioPerformance({
          zone: 'SAZ',
          country: 'BRA',
          dt_ini: '2026-01-01',
          dt_end: '2026-06-01',
          period: 'YTD',
        });

        // ✓ Validação 1: Estrutura mantém-se igual
        expect(data.components[0].id).toBe('portfolioPerformance');

        // ✓ Validação 2: Dados existem e não são vazios
        const portfolioData = data.components[0].data;
        expect(portfolioData.rows.length).toBeGreaterThan(0);

        // ✓ Validação 3: Cada portfolio traz o campo `brands`
        // preenchido (agora que `brandsMin` do matcher é 1, o mock
        // sempre gera pelo menos 1 brand por portfolio nomeado).
        const allCountries = new Set<string>();
        portfolioData.rows[0].forEach((row) => {
          row.brands_vol_og_vs_ly.brands?.forEach((brand) => {
            allCountries.add(brand.country);
          });
        });
        expect(allCountries.size).toBeGreaterThan(0);
      });
  });

  // ────────────────────────────────────────────────────────────────
  // Períodos (Month vs YTD)
  // ────────────────────────────────────────────────────────────────
  it('retorna dados para período Month (MTD) vs YTD', async () => {
    await provider
      .given('portfolio performance data exists for period Month')
      .uponReceiving('GET /v1/views portfolio performance for period Month')
      .withRequest({
        method: 'GET',
        path: '/v1/views/value-creation_portfolio-performance_overview_overview',
        query: {
          'filter[zone]': 'ABI',
          'filter[country]': 'ABI',
          'filter[dt_ini]': '2026-06-01',
          'filter[dt_end]': '2026-06-01',
          'filter[period]': 'Month',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: portfolioPerformanceResponseMatcher,
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(
          mockServer.url,
        ).getPortfolioPerformance({
          zone: 'ABI',
          country: 'ABI',
          dt_ini: '2026-06-01',
          dt_end: '2026-06-01',
          period: 'Month',
        });

        // ✓ Validação: Estrutura mantém-se igual apesar de período diferente
        const portfolioData = data.components[0].data;
        expect(portfolioData.header.length).toBeGreaterThan(0);
        expect(portfolioData.rows.length).toBeGreaterThan(0);
      });
  });

  // ────────────────────────────────────────────────────────────────
  // Edge case: sem dados para o período
  // ────────────────────────────────────────────────────────────────
  it('retorna estrutura vazia quando dados não existem para período', async () => {
    await provider
      .given('no portfolio performance data exists for future period')
      .uponReceiving('GET /v1/views portfolio performance with empty data')
      .withRequest({
        method: 'GET',
        path: '/v1/views/value-creation_portfolio-performance_overview_overview',
        query: {
          'filter[zone]': 'ABI',
          'filter[country]': 'ABI',
          'filter[dt_ini]': '2099-01-01',
          'filter[dt_end]': '2099-12-31',
          'filter[period]': 'YTD',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          view: 'value-creation_portfolio-performance_overview_overview',
          components: eachLike({
            id: 'portfolioPerformance',
            data: {
              header: [],
              rows: [],
              splits: [],
            },
          }),
        },
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(
          mockServer.url,
        ).getPortfolioPerformance({
          zone: 'ABI',
          country: 'ABI',
          dt_ini: '2099-01-01',
          dt_end: '2099-12-31',
          period: 'YTD',
        });

        // ✓ Validação 1: Não falha, retorna 200
        expect(status).toBe(200);

        // ✓ Validação 2: Estrutura existe mas vazia
        const portfolioData = data.components[0].data;
        expect(portfolioData.header).toHaveLength(0);
        expect(portfolioData.rows).toHaveLength(0);
      });
  });

  // ────────────────────────────────────────────────────────────────
  // URLs de imagens de brands
  // ────────────────────────────────────────────────────────────────
  // Nota de QA: este teste reaproveita os matchers de header/row já
  // validados contra a resposta real, apenas trocando o matcher de
  // `brands` por uma versão com `regex` nas URLs. Isso evita
  // reintroduzir o bug de shape do header (exigir `id` em todo item)
  // que já corrigimos acima, e mantém o `eachLike` com `min` numérico
  // — `{ min: 0 }` é sintaxe da API V2 antiga e não é suportada por
  // `MatchersV3.eachLike`, que só aceita um número como segundo argumento.
  it('retorna URLs válidas para brand images', async () => {
    const brandImageMatcher = {
      src: regex(
        /https:\/\/onewaymartech-assets\.mybees-platform\.com\/brands\/[\w_]+\/(square|table)\.png/,
        'https://onewaymartech-assets.mybees-platform.com/brands/corona/square.png',
      ),
      name: like('Corona'),
      variation: like(6),
      variationMeasure: '%',
      variationDirection: like('up'),
      country: like('ABI'),
      country_src: regex(
        /https:\/\/onewaymartech-assets\.mybees-platform\.com\/countries\/(rounded_flags|waving)\/[\w]+\.png/,
        'https://onewaymartech-assets.mybees-platform.com/countries/rounded_flags/ABI.png',
      ),
    };

    const megabrandsRowWithImageMatcher = {
      ...portfolioRowMatcher('Megabrands'),
      brands_vol_og_vs_ly: {
        brands: eachLike(brandImageMatcher, 1), // número, não { min: 1 }
        value: '_brands',
      },
    };

    await provider
      .given('portfolio performance data with valid brand images')
      .uponReceiving('GET /v1/views with valid brand image URLs')
      .withRequest({
        method: 'GET',
        path: '/v1/views/value-creation_portfolio-performance_overview_overview',
        query: {
          'filter[zone]': 'ABI',
          'filter[country]': 'ABI',
          'filter[dt_ini]': '2026-01-01',
          'filter[dt_end]': '2026-06-01',
          'filter[period]': 'YTD',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          view: 'value-creation_portfolio-performance_overview_overview',
          components: eachLike(
            {
              id: 'portfolioPerformance',
              data: {
                header: [
                  portfolioHeaderMatcher,
                  groupHeaderMatcher(1),
                  groupHeaderMatcher(1),
                  groupHeaderMatcher(1),
                  groupHeaderMatcher(1),
                  groupHeaderMatcher(1),
                  groupHeaderMatcher(1),
                ],
                rows: [[megabrandsRowWithImageMatcher]],
                splits: [
                  ['Portfolio'],
                  ['Volume'],
                  ['Net Revenue', 'CORES', 'Market Share', 'Brand Power'],
                  ['S&M'],
                  ['Brands'],
                ],
              },
            },
            1,
          ),
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(
          mockServer.url,
        ).getPortfolioPerformance({
          zone: 'ABI',
          country: 'ABI',
          dt_ini: '2026-01-01',
          dt_end: '2026-06-01',
          period: 'YTD',
        });

        const portfolioData = data.components[0].data;

        // ✓ Validação: Todas as URLs são válidas HTTPS
        portfolioData.rows[0].forEach((row) => {
          row.brands_vol_og_vs_ly.brands?.forEach((brand) => {
            expect(brand.src).toMatch(/^https:\/\//);
            expect(brand.country_src).toMatch(/^https:\/\//);
            expect(brand.src).toContain('/brands/');
            expect(brand.country_src).toContain('/countries/');
          });
        });
      });
  });
});
