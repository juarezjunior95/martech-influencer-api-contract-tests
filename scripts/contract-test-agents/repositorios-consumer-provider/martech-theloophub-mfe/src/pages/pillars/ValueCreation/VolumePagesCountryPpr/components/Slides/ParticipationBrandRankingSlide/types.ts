import type { RankedContainerData } from 'pages/components/BrandRanking/types';

export interface ParticipationBrandRankingSlideProps {
  loading: boolean;
  error: Error | null;
  empty?: boolean;
  ranking: RankedContainerData | undefined;
  dataTestId?: string;
  getBarColors?: (source: string[]) => string[];
  isExport?: boolean;
  barThickness?: number;
}
