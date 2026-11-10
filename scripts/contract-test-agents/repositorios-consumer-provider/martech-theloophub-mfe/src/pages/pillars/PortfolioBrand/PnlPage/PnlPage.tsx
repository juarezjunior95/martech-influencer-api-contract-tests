import { useIntl } from 'react-intl';

import { Grid } from '@hexa-ui/components';
import { StickyScrollWithFilters } from 'components';
import { StyledGridContainer } from 'shared/Styles';

import { PERFORMANCE_PAGE_NAME } from '../Performance/Performance';
import { Pnl } from './components';

interface PnlPageProps {
  dataTestId?: string;
}

export const PnlPage: React.FC<PnlPageProps> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <StickyScrollWithFilters
        dataTestId={dataTestId ?? 'pnl-page'}
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
              href: '/portfolio-brand/pnl',
              pageName: formatMessage({ id: 'Sidebar.pnl' }),
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
          <Pnl dataTestId="pnl-content" pageName={PERFORMANCE_PAGE_NAME} />
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};

export default PnlPage;
