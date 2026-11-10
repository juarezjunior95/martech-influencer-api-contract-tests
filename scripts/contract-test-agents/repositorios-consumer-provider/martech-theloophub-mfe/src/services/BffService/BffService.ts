import { Api } from 'Api';

export interface BffGetDataParams {
  endpoint: string;
  params: Record<string, any>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface BffComponent {
  id: string;
  type: string;
  data: Record<string, any>;
}

export interface BffResponse {
  view: string;
  components: BffComponent[];
}

export interface BffNormalizedData {
  [id: string]: Record<string, any>;
}

const DEFAULT_BFF_URL = '/api/martech-oneway-reports-bff/v1';

const getBffUrl = (): string =>
  localStorage.getItem('bffUrl') || DEFAULT_BFF_URL;

export class BffService {
  private static instance: BffService;
  private readonly apiPrefix: string;

  private constructor() {
    this.apiPrefix = getBffUrl();
  }

  protected getUrl(endpoint: string) {
    return `${this.apiPrefix}${endpoint}`;
  }

  public static getInstance(): BffService {
    if (!BffService.instance) {
      BffService.instance = new BffService();
    }
    return BffService.instance;
  }

  private normalizeParams(params: Record<string, any>) {
    return Object.entries(params).reduce(
      (acc: Record<string, any>, [key, value]) => {
        acc[`filter[${key}]`] = value;
        return acc;
      },
      {},
    );
  }

  private shouldWrapParams(endpoint: string): boolean {
    const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return !normalized.startsWith('/presets');
  }

  static normalizeResponse(response: BffResponse): BffNormalizedData {
    return response.components.reduce(
      (acc: BffNormalizedData, component: BffComponent) => {
        acc[component.id] = component.data;
        return acc;
      },
      {},
    );
  }

  async getData({ endpoint, params, signal, headers }: BffGetDataParams) {
    return Api.get({
      url: this.getUrl(endpoint),
      config: {
        params: this.shouldWrapParams(endpoint)
          ? this.normalizeParams(params)
          : params,
        signal,
        headers,
      },
    });
  }
}
