import { PortfolioData } from 'pages/components';

export interface PortfolioPerformanceVolumePagesSlideProps {
  data: PortfolioData | { empty: boolean };
  error: Error | null;
  loading: boolean;
  dataTestId: string;
}
