import { PageInfo } from 'pages/types';

export interface KeyMarketsSectionProps {
  dataTestId?: string;
  getPageByName: (name: string) => PageInfo | undefined;
}
