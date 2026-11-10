import { DataStateHandler } from 'components';
import { TableDataType } from 'components/Table/types';
import { PortfolioPerformanceFooter } from 'pages/pillars/ValueCreation/VolumePages/types/portfolioPerformance';
import { WithEmpty } from 'utils/dataEmpty';

import { PortfolioFooter } from '../../PorfolioFooter';
import { PortfolioTable } from '../../PortfolioTable';
import {
  StyledMainContainer,
  StyledPortfolioPerformanceSliderGrid,
} from './PortfolioPerformanceSlideContent.styles';

interface PortfolioPerformanceSlideContentProps {
  data: {
    portfolioTableKpiData: {
      kpiData: WithEmpty<{
        table: TableDataType;
        footer: PortfolioPerformanceFooter[];
      }>;
      loading: boolean;
      error: Error | null;
    };
  };
  dataTestId?: string;
}

export const PortfolioPerformanceSlideContent = ({
  data,
  dataTestId,
}: PortfolioPerformanceSlideContentProps) => {
  const { portfolioTableKpiData } = data || {};

  return (
    <StyledMainContainer
      data-testid={
        dataTestId
          ? `portfolio-performance-slide-content-${dataTestId}`
          : undefined
      }
    >
      <StyledPortfolioPerformanceSliderGrid>
        <DataStateHandler
          dataTestId={
            dataTestId
              ? `portfolio-performance-slide-content-portfolio-table-${dataTestId}`
              : undefined
          }
          loading={portfolioTableKpiData.loading}
          error={portfolioTableKpiData.error}
          empty={portfolioTableKpiData.kpiData.empty}
          skeletonProps={{
            height: '560px',
            width: '1349px',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          <PortfolioTable
            dataTestId={
              dataTestId
                ? `portfolio-performance-slide-content-portfolio-table-${dataTestId}`
                : undefined
            }
            data={portfolioTableKpiData?.kpiData?.table}
          />
        </DataStateHandler>
      </StyledPortfolioPerformanceSliderGrid>
      <StyledPortfolioPerformanceSliderGrid>
        <DataStateHandler
          dataTestId={
            dataTestId
              ? `portfolio-performance-slide-content-portfolio-table-${dataTestId}`
              : undefined
          }
          loading={portfolioTableKpiData.loading}
          error={portfolioTableKpiData.error}
          empty={portfolioTableKpiData.kpiData.empty}
          skeletonProps={{
            height: '160px',
            width: '1349px',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          <PortfolioFooter
            dataTestId={
              dataTestId
                ? `portfolio-performance-slide-content-${dataTestId}`
                : undefined
            }
            data={portfolioTableKpiData?.kpiData?.footer}
          />
        </DataStateHandler>
      </StyledPortfolioPerformanceSliderGrid>
    </StyledMainContainer>
  );
};
