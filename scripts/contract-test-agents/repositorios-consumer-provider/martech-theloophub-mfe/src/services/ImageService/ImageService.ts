import { Api } from 'Api';

const DEFAULT_BFF_URL = '/api/martech-oneway-reports-bff/v1';
const getBffUrl = (): string =>
  localStorage.getItem('bffUrl') || DEFAULT_BFF_URL;

const IMAGES_ENDPOINT = '/images/brand';
const COUNTRY_IMAGES_ENDPOINT = '/images/country';

export interface ResolveImagePayload {
  name: string;
  format?: string;
  brandFamily?: string;
}

export interface ResolvedImageResponse {
  url: string;
  matched: ResolveImagePayload[];
}

export class ImagesService {
  private static instance: ImagesService;
  private readonly apiPrefix: string;

  private constructor() {
    this.apiPrefix = getBffUrl();
  }

  public static getInstance(): ImagesService {
    if (!ImagesService.instance) {
      ImagesService.instance = new ImagesService();
    }
    return ImagesService.instance;
  }

  private getUrl(endpoint: string): string {
    return `${this.apiPrefix}${endpoint}`;
  }

  getBrand({ name, format = 'square', brandFamily }: ResolveImagePayload) {
    return Api.get({
      url: this.getUrl(IMAGES_ENDPOINT),
      config: {
        params: {
          type: 'brand',
          name,
          format,
          brand_family: brandFamily,
        },
      },
    });
  }

  getCountry({ name, format = 'icon' }: ResolveImagePayload) {
    return Api.get({
      url: this.getUrl(COUNTRY_IMAGES_ENDPOINT),
      config: {
        params: {
          type: 'country',
          name,
          format,
        },
      },
    });
  }
}
