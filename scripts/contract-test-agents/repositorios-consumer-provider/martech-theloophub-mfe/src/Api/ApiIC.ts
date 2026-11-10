/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthenticationService } from 'admin-portal-shared-services';
import Axios, { AxiosRequestConfig } from 'axios';

export interface IRequestIC {
  url: string;
  body?: any;
  config?: AxiosRequestConfig;
}

export const initialAxiosIC = Axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
    'Content-Type': 'application/json',
  },
});

export const setApiICBaseURL = (url: string) => {
  initialAxiosIC.defaults.baseURL = url;
};

const authentication = useAuthenticationService();

const { user_country: userCountry } =
  authentication.getUserCountryAndLanguage();

authentication.enhancedAxios(
  initialAxiosIC as unknown as Parameters<
    typeof authentication.enhancedAxios
  >[0],
  {
    headers: [
      {
        country: userCountry || '',
      },
    ],
  },
);

export const ApiIC = {
  post: ({ url, body, config }: IRequestIC): Promise<any> =>
    initialAxiosIC.post(url, body, config).catch((error) => ({
      hasError: true,
      ...error,
    })),

  delete: ({ url, config }: IRequestIC): Promise<any> =>
    initialAxiosIC
      .delete(url, config)
      .catch((error) => ({ hasError: true, ...error })),

  get: ({ url, config }: IRequestIC): Promise<any> =>
    initialAxiosIC
      .get(url, config)
      .catch((error) => ({ hasError: true, ...error })),

  put: ({ url, body, config }: IRequestIC): Promise<any> =>
    initialAxiosIC.put(url, body, config).catch((error) => ({
      hasError: true,
      ...error,
    })),

  patch: ({ url, body, config }: IRequestIC): Promise<any> =>
    initialAxiosIC.patch(url, body, config).catch((error) => ({
      hasError: true,
      ...error,
    })),
};

export default ApiIC;
