import { useEnvService } from 'admin-portal-shared-services';

const sit_urls = { home: 'https://one.martech.uat.bees-platform.dev' };
const uat_urls = { home: 'https://one.martech.uat.bees-platform.dev' };
const prod_urls = { home: 'https://one.martech.mybees-platform.com' };

const envUrls = { QA: sit_urls, SIT: sit_urls, UAT: uat_urls, PROD: prod_urls };

const useHomeUrl = () => {
  const env = useEnvService().getEnv();
  return envUrls[env]?.home || uat_urls.home;
};

export { prod_urls, sit_urls, uat_urls, useHomeUrl };
