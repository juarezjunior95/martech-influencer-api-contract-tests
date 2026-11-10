import { useCountrySlideData } from '../../../hooks/useCountrySlideData';
import { COUNTRIES } from '../../../tabs/Global/constants';

export type CountryConfig = (typeof COUNTRIES)[keyof typeof COUNTRIES];

export type CountryData = ReturnType<typeof useCountrySlideData>;

export interface CountrySlideProps {
  countryCode: string;
  config: CountryConfig;
  countryData: CountryData;
  period: string;
  getPageByName: (name: string) => { index: number } | undefined;
  dataTestId?: string;
}
