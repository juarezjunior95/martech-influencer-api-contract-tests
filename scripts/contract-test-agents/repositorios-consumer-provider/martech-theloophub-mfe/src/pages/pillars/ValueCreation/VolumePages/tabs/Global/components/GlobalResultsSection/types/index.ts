import { PageInfo } from 'pages/types';

export interface GlobalResultsSectionProps {
  globalCoverLink: string;
  getPageByName: (name: string) => PageInfo | undefined;
  dataTestId?: string;
  monthYear: string;
  period: string;
}
