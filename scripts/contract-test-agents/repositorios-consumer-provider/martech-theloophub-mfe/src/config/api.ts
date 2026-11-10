import { useEnvService } from 'admin-portal-shared-services';

export const sit_urls = {
  assets: 'https://assets-martech-uat.mybees-platform.dev',
};
export const uat_urls = {
  assets: 'https://assets-martech-uat.mybees-platform.dev',
};
export const prod_urls = {
  assets: 'https://onewaymartech-assets.mybees-platform.com',
};

export const APP_BASENAME = '/reports';

const envUrls = {
  QA: sit_urls,
  SIT: sit_urls,
  UAT: uat_urls,
  PROD: prod_urls,
};

/** Last resolved asset host in React context; used by services outside hook context. */
let assetHostSync = uat_urls.assets;

export const getAssetHostForServices = () => assetHostSync;
export const getAssetHostByEnv = (env?: string) => {
  const normalizedEnv = String(env || '') as keyof typeof envUrls;
  return envUrls[normalizedEnv]?.assets || uat_urls.assets;
};

export const useAssetHost = () => {
  const env = useEnvService().getEnv();
  const url = getAssetHostByEnv(env);
  assetHostSync = url;
  return url;
};
