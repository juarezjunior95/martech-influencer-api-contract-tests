import { CountryConfig } from 'pages/pillars/ValueCreation/VolumePages/components';
import { PageInfo } from 'pages/types';

type SubFilterPrimitive = string | number | boolean;
type SubFilterValue = SubFilterPrimitive | Record<string, SubFilterPrimitive>;

export interface CountrySlideWrapperProps {
  getPageByName: (name: string) => PageInfo | undefined;
  countryCode: string;
  subFilters: Record<string, SubFilterValue>;
  dataTestId?: string;
  config: CountryConfig;
  period: string;
}
