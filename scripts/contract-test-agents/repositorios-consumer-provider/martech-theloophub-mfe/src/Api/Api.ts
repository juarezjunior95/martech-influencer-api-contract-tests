/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthenticationService } from 'admin-portal-shared-services';
import Axios, { AxiosRequestConfig } from 'axios';

export interface IRequest {
  url: string;
  body?: any;
  config?: AxiosRequestConfig;
}

export const initialAxios = Axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

const authentication = useAuthenticationService();

const { user_country: userCountry } =
  authentication.getUserCountryAndLanguage();

authentication.enhancedAxios(
  initialAxios as unknown as Parameters<typeof authentication.enhancedAxios>[0],
  {
    headers: [
      {
        country: userCountry || '',
      },
    ],
  },
);

export const Api = {
  post: ({ url, body }: IRequest): Promise<any> =>
    initialAxios.post(url, body).catch((error) => ({
      hasError: true,
      ...error,
    })),

  delete: ({ url }: IRequest): Promise<any> =>
    initialAxios.delete(url).catch((error) => ({ hasError: true, ...error })),

  get: ({ url, config }: IRequest): Promise<any> =>
    initialAxios
      .get(url, config)
      .catch((error) => ({ hasError: true, ...error })),

  put: ({ url, body }: IRequest): Promise<any> =>
    initialAxios.put(url, body).catch((error) => ({
      hasError: true,
      ...error,
    })),

  patch: ({ url, body }: IRequest): Promise<any> =>
    initialAxios.patch(url, body).catch((error) => ({
      hasError: true,
      ...error,
    })),
};

export default Api;
