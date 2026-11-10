import { UseBffDataResponse } from 'hooks/useBffData/useBffData';
import { PageInfo } from 'pages/types';

export interface CountryBrandsBreakdownSlideProps {
  getPageByName: (name: string) => PageInfo | undefined;
  countryLabel: string;
  countryCode: string;
  dataTestId?: string;
  period: string;
  data: UseBffDataResponse;
  kpiName: string;
}
