import { useIntl } from 'react-intl';

import { Grid } from '@hexa-ui/components';
import { StickyScrollWithFilters } from 'components';
import { StyledGridContainer } from 'shared/Styles';

import { Overview } from './tabs';

export const PERFORMANCE_PAGE_NAME = 'portfolio-brand_portfolio-performance';

interface PerformanceProps {
  dataTestId?: string;
}

export const Performance: React.FC<PerformanceProps> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <StickyScrollWithFilters
        dataTestId={dataTestId ?? 'performance'}
        filter={{
          pageName: PERFORMANCE_PAGE_NAME,
          visibleFields: ['zone', 'country', 'ytd-month', 'time_frame'],
        }}
        breadcrumbs={{
          showIcon: true,
          pageList: [
            {
              pageName: formatMessage({
                id: 'Pillars.pageName.portfolioBrand',
              }),
              href: '/portfolio-brand',
            },
            {
              href: '/portfolio-brand/portfolio-performance',
              pageName: formatMessage({ id: 'Sidebar.portfolioPerformance' }),
            },
          ],
        }}
      />
      <StyledGridContainer>
        <Grid.Item
          xs={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 0,
          }}
        >
          <Overview dataTestId="tabpanel-overview" />
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};

export default Performance;
