/**
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — pipeline de contract testing (Pact)
 *
 * Origem do swagger : arquivo OpenAPI local não versionado (versão: 3.0.0)
 * Endpoint coberto   : GET /v1/images/brand e GET /v1/images/country
 * Gerado em          : 2026-09-09
 * Gerado por         : agente 03 (consumer-generator)
 *
 * REQUER REVISÃO HUMANA antes do merge.
 */

import { createPact, eachLike, like } from 'pact';
import { getPactBrandImage, getPactCountryImage } from 'pact/test-client';

// ─── Mock server Pact ────────────────────────────────────────────────────────
// Consumer = MFE  |  Provider = BFF

const provider = createPact();

// ─── Tipos espelhados do BFF ──────────────────────────────────────────────────

// ─── Helper: chama o BFF via ImagesService apontando para o mock server ───────

function bffClient(mockUrl: string) {
  return {
    getBrand: (params: {
      name: string;
      format?: string;
      brandFamily?: string;
    }) => getPactBrandImage(mockUrl, params),

    getCountry: (params: { name: string; format?: string }) =>
      getPactCountryImage(mockUrl, params),
  };
}

// ─── GET /v1/images/brand ─────────────────────────────────────────────────────

describe('MFE → BFF | GET /v1/images/brand', () => {
  it('retorna url, matched e image_variants para marca conhecida (format=square)', async () => {
    await provider
      .given('a brand image exists for "corona"')
      .uponReceiving('GET /v1/images/brand?name=corona&format=square')
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: { type: 'brand', name: 'corona', format: 'square' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/brands/corona/square.png'),
          matched: eachLike('corona'),
          image_variants: {
            square: like('https://cdn.example.com/brands/corona/square.png'),
            table: like('https://cdn.example.com/brands/corona/table.png'),
          },
        },
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(mockServer.url).getBrand({
          name: 'corona',
          format: 'square',
        });

        expect(status).toBe(200);
        expect(typeof data.url).toBe('string');
        expect(data.url).toMatch(/^https?:\/\//);
        expect(Array.isArray(data.matched)).toBe(true);
        expect(data.matched.length).toBeGreaterThan(0);
        expect(data.image_variants).toHaveProperty('square');
        expect(data.image_variants).toHaveProperty('table');
      });
  });

  it('retorna url, matched e image_variants para marca com format=table', async () => {
    await provider
      .given('a brand image exists for "corona"')
      .uponReceiving('GET /v1/images/brand?name=corona&format=table')
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: { type: 'brand', name: 'corona', format: 'table' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/brands/corona/table.png'),
          matched: eachLike('corona'),
          image_variants: {
            square: like('https://cdn.example.com/brands/corona/square.png'),
            table: like('https://cdn.example.com/brands/corona/table.png'),
          },
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getBrand({
          name: 'corona',
          format: 'table',
        });
        expect(data.url).toMatch(/^https?:\/\//);
        expect(data.image_variants).toHaveProperty('square');
      });
  });

  it('retorna URL da brand com underscore no slug (sem hífen)', async () => {
    await provider
      .given('a brand image exists for "michelob ultra"')
      .uponReceiving('GET /v1/images/brand?name=michelob ultra&format=table')
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: { type: 'brand', name: 'michelob ultra', format: 'table' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like(
            'https://assets-martech-uat.mybees-platform.dev/brands/michelob_ultra/table.png',
          ),

          matched: eachLike('michelob ultra'),
          image_variants: {
            square: like(
              'https://assets-martech-uat.mybees-platform.dev/brands/michelob_ultra/square.png',
            ),
            table: like(
              'https://assets-martech-uat.mybees-platform.dev/brands/michelob_ultra/table.png',
            ),
          },
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getBrand({
          name: 'michelob ultra',
          format: 'table',
        });

        expect(data.url).toContain('/brands/michelob_ultra/');
        expect(data.url).not.toContain('/brands/michelob-ultra/');
        expect(data.image_variants.table).toContain('/brands/michelob_ultra/');
        expect(data.image_variants.square).toContain('/brands/michelob_ultra/');
      });
  });

  it('retorna placeholder quando marca não existe (matched=[])', async () => {
    await provider
      .given('no brand image exists for "unknown-brand-xyz"')
      .uponReceiving('GET /v1/images/brand?name=unknown-brand-xyz')
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: { type: 'brand', name: 'unknown-brand-xyz', format: 'square' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/brands/placeholder/square.png'),
          matched: [],
          image_variants: {},
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getBrand({
          name: 'unknown-brand-xyz',
          format: 'square',
        });
        expect(data.matched).toHaveLength(0);
        expect(data.url).toMatch(/^https?:\/\//);
      });
  });

  /**
   * O campo interno do MFE continua sendo brandFamily por compatibilidade com
   * os componentes, mas o parâmetro público enviado ao BFF é brand_family.
   */
  it('aceita brand_family como parâmetro opcional', async () => {
    await provider
      .given('a brand image exists for family "all"')
      .uponReceiving('GET /v1/images/brand com brand_family=stella_artois')
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: {
          type: 'brand',
          name: 'all',
          format: 'square',
          brand_family: 'stella_artois',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/brands/premium/square.png'),
          matched: eachLike('stella artois'),
          image_variants: {
            square: like('https://cdn.example.com/brands/premium/square.png'),
            table: like('https://cdn.example.com/brands/premium/table.png'),
          },
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getBrand({
          name: 'all',
          format: 'square',
          brandFamily: 'stella_artois',
        });
        expect(data.url).toMatch(/^https?:\/\//);
      });
  });
  it('resolve alias "corona extra" para corona (params reais do ImageService)', async () => {
    await provider
      .given('a brand alias "corona extra" resolves to "corona"')
      .uponReceiving(
        'GET /v1/images/brand?name=corona extra&format=square&type=brand',
      )
      .withRequest({
        method: 'GET',
        path: '/v1/images/brand',
        query: { type: 'brand', name: 'corona extra', format: 'square' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/brands/corona/square.png'),
          matched: eachLike('corona'),
          image_variants: {
            square: like('https://cdn.example.com/brands/corona/square.png'),
            table: like('https://cdn.example.com/brands/corona/table.png'),
          },
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getBrand({
          name: 'corona extra',
          format: 'square',
        });
        expect(data.url).toMatch(/\/brands\/corona\/square\.png/);
        expect(data.matched).toContain('corona');
      });
  });
});

// ─── GET /v1/images/country ───────────────────────────────────────────────────

describe('MFE → BFF | GET /v1/images/country', () => {
  it('retorna url e matched para país conhecido com format=icon', async () => {
    await provider
      .given('a country image exists for "BR"')
      .uponReceiving('GET /v1/images/country?name=BR&format=icon')
      .withRequest({
        method: 'GET',
        path: '/v1/images/country',
        query: { type: 'country', name: 'BR', format: 'icon' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/countries/rounded_flags/BR.png'),
          matched: eachLike('BR'),
        },
      })
      .executeTest(async (mockServer) => {
        const { data, status } = await bffClient(mockServer.url).getCountry({
          name: 'BR',
          format: 'icon',
        });
        expect(status).toBe(200);
        expect(data.url).toMatch(/^https?:\/\//);
        expect(data.matched.length).toBeGreaterThan(0);
      });
  });

  it('retorna url com caminho waving para format=waving', async () => {
    await provider
      .given('a country image exists for "AR"')
      .uponReceiving('GET /v1/images/country?name=AR&format=waving')
      .withRequest({
        method: 'GET',
        path: '/v1/images/country',
        query: { type: 'country', name: 'AR', format: 'waving' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/countries/waving/AR.png'),
          matched: eachLike('AR'),
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getCountry({
          name: 'AR',
          format: 'waving',
        });
        expect(data.url).toMatch(/^https?:\/\//);
        expect(Array.isArray(data.matched)).toBe(true);
      });
  });

  it('retorna placeholder quando país não existe (matched=[])', async () => {
    await provider
      .given('no country image exists for "XX"')
      .uponReceiving('GET /v1/images/country?name=XX — país inexistente')
      .withRequest({
        method: 'GET',
        path: '/v1/images/country',
        query: { type: 'country', name: 'XX', format: 'icon' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/countries/placeholder/icon.png'),
          matched: [],
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getCountry({
          name: 'XX',
          format: 'icon',
        });
        expect(data.matched).toHaveLength(0);
        expect(data.url).toMatch(/^https?:\/\//);
      });
  });

  it('resolve alias BRAZIL para BR (params reais do ImageService)', async () => {
    await provider
      .given('a country alias "BRAZIL" resolves to "BR"')
      .uponReceiving(
        'GET /v1/images/country?name=BRAZIL&format=icon&type=country',
      )
      .withRequest({
        method: 'GET',
        path: '/v1/images/country',
        query: { type: 'country', name: 'BRAZIL', format: 'icon' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          url: like('https://cdn.example.com/countries/rounded_flags/BR.png'),
          matched: eachLike('BR'),
        },
      })
      .executeTest(async (mockServer) => {
        const { data } = await bffClient(mockServer.url).getCountry({
          name: 'BRAZIL',
          format: 'icon',
        });
        expect(data.url).toMatch(/rounded_flags\/BR\.png/);
        expect(data.matched[0]).toBe('BR');
      });
  });
});
