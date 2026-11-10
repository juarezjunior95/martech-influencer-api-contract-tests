import { PageInfo } from 'pages/types';

export interface GlobalMovesSectionProps {
  getPageByName: (name: string) => PageInfo | undefined;
  dataTestId?: string;
  dt_end: string | null | undefined;
  period: string;
}
