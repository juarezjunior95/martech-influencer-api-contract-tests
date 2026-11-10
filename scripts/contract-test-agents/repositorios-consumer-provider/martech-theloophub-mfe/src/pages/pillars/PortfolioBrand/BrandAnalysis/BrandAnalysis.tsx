import { useIntl } from 'react-intl';

import { Grid } from '@hexa-ui/components';
import { StickyScrollWithFilters } from 'components';
import { StyledGridContainer } from 'shared/Styles/layout.styles';

import { FILTER_CONFIGS_BRAND_ANALYSIS } from './constants';
import { BrandPower } from './tabs';

export const BrandAnalysis: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: FILTER_CONFIGS_BRAND_ANALYSIS.pageName,
          visibleFields: FILTER_CONFIGS_BRAND_ANALYSIS.visibleFields,
        }}
        breadcrumbs={{
          showIcon: true,
          pageList: [
            {
              pageName: 'Portfolio & Brand',
              href: '/portfolio-brand',
            },
            {
              href: '/portfolio-brand',
              pageName: formatMessage({
                id: 'PortfolioBrand.BrandPower.title',
              }),
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
          <BrandPower dataTestId="tabpanel-brand-power" />
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};
