import { Kpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';

export interface CountryVolumeCoverProps {
  countryCoverLink: string;
  countryLabel: string;
  countryCode: string;
  dataTestId?: string;
  monthYear: string;
  kpi: Kpi;
}
