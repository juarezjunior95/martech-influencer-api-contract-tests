import { useIntl } from 'react-intl';

import { Skeleton } from 'components';

import { StrategicInnovationData } from '../../types';
import { PORTFOLIO_HEALTH_HEADER_COLOR } from '../PortfolioHealthBigNumbers';
import { StrategicInnovationItemContent } from '../StrategicInnovationItemContent/StrategicInnovationItemContent';
import {
  StyledHeaderContainer,
  StyledStrategicInnovationContainer,
  StyledStrategicInnovationHeader,
  StyledStrategicInnovationItem,
  StyledStrategicInnovationTitle,
} from './StrategicInnovation.styles';

interface StrategicInnovationProps {
  data: StrategicInnovationData[];
  loading: boolean;
  dataTestId?: string;
}
export const StrategicInnovation: React.FC<StrategicInnovationProps> = ({
  data,
  loading,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  const getHeaderColor = (item: StrategicInnovationData): string => {
    if (item.id === 'portfolio') return PORTFOLIO_HEALTH_HEADER_COLOR;
    return item.headerColor;
  };

  return (
    <div>
      <StyledStrategicInnovationTitle
        size="H4"
        data-testid={dataTestId ? `${dataTestId}-heading` : undefined}
      >
        {formatMessage({
          id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.title',
        })}
      </StyledStrategicInnovationTitle>
      {loading ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Skeleton
            height="489px"
            width="480px"
            length={1}
            gap="medium"
            borderRadius="medium"
            dataTestId={dataTestId ? `skeleton-${dataTestId}-large` : undefined}
          />
          <Skeleton
            height="489px"
            width="248px"
            length={3}
            gap="small"
            borderRadius="medium"
            dataTestId={dataTestId ? `skeleton-${dataTestId}-small` : undefined}
          />
        </div>
      ) : (
        <StyledStrategicInnovationContainer
          data-testid={dataTestId ? `${dataTestId}-container` : undefined}
        >
          {data.map((item) => (
            <StyledStrategicInnovationItem
              id={item.id}
              key={item.id}
              variant={item.id === 'portfolio' ? 'portfolio' : 'default'}
              data-testid={
                dataTestId ? `${dataTestId}-item-${item.id}` : undefined
              }
            >
              <StyledHeaderContainer
                css={{ backgroundColor: getHeaderColor(item) }}
              >
                <StyledStrategicInnovationHeader
                  data-testid={
                    dataTestId ? `${dataTestId}-header-${item.id}` : undefined
                  }
                >
                  {formatMessage({
                    id: `Innovation.Innovation.Overview.StrategicInnovationPillars.${item.id}.title`,
                  })}
                </StyledStrategicInnovationHeader>
              </StyledHeaderContainer>
              <StrategicInnovationItemContent
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-item-content-${item.id}`
                    : undefined
                }
                item={item}
              />
            </StyledStrategicInnovationItem>
          ))}
        </StyledStrategicInnovationContainer>
      )}
    </div>
  );
};
