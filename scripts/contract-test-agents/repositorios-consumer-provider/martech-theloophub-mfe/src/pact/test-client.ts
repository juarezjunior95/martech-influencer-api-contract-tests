import { BffService } from 'services/BffService/BffService';
import { ImagesService } from 'services/ImageService/ImageService';

const installLocalStorage = () => {
  const state = new Map<string, string>();

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => state.get(key) ?? null,
      setItem: (key: string, value: string) => state.set(key, value),
      removeItem: (key: string) => state.delete(key),
      clear: () => state.clear(),
    },
  });
};

export const configurePactBff = (mockUrl: string) => {
  installLocalStorage();
  localStorage.setItem('bffUrl', `${mockUrl}/v1`);

  Reflect.set(BffService, 'instance', undefined);
  Reflect.set(ImagesService, 'instance', undefined);
};

const toRawParams = (query: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key.replace(/^filter\[(.*)\]$/, '$1'),
      value,
    ]),
  );

export const getPactView = async (
  mockUrl: string,
  view: string,
  query: Record<string, string>,
  headers?: Record<string, string>,
) => {
  configurePactBff(mockUrl);

  return BffService.getInstance().getData({
    endpoint: `/views/${view}`,
    params: toRawParams(query),
    headers,
  });
};

export const getPactBrandImage = async (
  mockUrl: string,
  params: { name: string; format?: string; brandFamily?: string },
) => {
  configurePactBff(mockUrl);
  return ImagesService.getInstance().getBrand(params);
};

export const getPactCountryImage = async (
  mockUrl: string,
  params: { name: string; format?: string },
) => {
  configurePactBff(mockUrl);
  return ImagesService.getInstance().getCountry(params);
};
