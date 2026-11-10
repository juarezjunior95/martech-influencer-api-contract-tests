import { useIntl } from 'react-intl';

import { BigNumber, ChartHeader, Skeleton } from 'components';
import { useSubFilters } from 'hooks';

import { BigNumbersItem } from '../../types';
import {
  StyledBigNumberContainer,
  StyledBigNumberItem,
  StyledChartHeaderContainer,
} from './BigNumbers.styles';

interface BigNumbersProps {
  data: BigNumbersItem[];
  asCard?: boolean;
  onDeepDive?: (itemId: string) => void;
  kpiFilter?: { [key: string]: string[] };
  loading?: boolean;
  loadingLength?: number;
  periodPosition?: 'default' | 'top-right';
  orientation?: {
    header?: 'vertical' | 'horizontal';
    body?: 'vertical' | 'horizontal';
  };
  showInfo?: boolean;
  dataTestId?: string;
}

export const BigNumbers: React.FC<BigNumbersProps> = ({
  data,
  asCard = true,
  onDeepDive,
  kpiFilter,
  loading = false,
  loadingLength = 4,
  periodPosition,
  orientation = { header: 'horizontal', body: 'vertical' },
  showInfo = true,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  const { activeSubFilters } = useSubFilters();
  const filteredData = kpiFilter
    ? data.filter((item) => {
        const filtered = activeSubFilters.kpis
          ? kpiFilter[activeSubFilters.kpis]
          : null;
        return !filtered || filtered.includes(item.id);
      })
    : data;

  if (loading && kpiFilter) {
    return (
      <StyledBigNumberContainer
        loading
        data-testid={
          dataTestId ? `${dataTestId}-loading-container-kpi` : undefined
        }
      >
        <Skeleton
          height="144px"
          width="350px"
          length={2}
          gap="medium"
          borderRadius="medium"
          dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
        />
      </StyledBigNumberContainer>
    );
  }

  if (loading) {
    return (
      <StyledBigNumberContainer
        loading
        data-testid={dataTestId ? `${dataTestId}-loading-container` : undefined}
      >
        <Skeleton
          height="90px"
          width="calc(50% - 8px)"
          length={loadingLength}
          gap="medium"
          borderRadius="medium"
          dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
        />
      </StyledBigNumberContainer>
    );
  }

  return (
    <StyledBigNumberContainer
      data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      className="big-numbers-container"
    >
      {filteredData.map((item, index) => (
        <StyledBigNumberItem
          style={{
            borderLeft: item.colorIndicator
              ? `6px solid ${item.colorIndicator}`
              : 'none',
            flex: kpiFilter && 'none',
          }}
          key={`${item.id}-${index}`}
          className="big-number-item"
          data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
        >
          <BigNumber
            dataTestId={
              dataTestId ? `${dataTestId}-big-number-${index}` : undefined
            }
            header={
              <StyledChartHeaderContainer
                data-testid={
                  dataTestId
                    ? `${dataTestId}-chart-header-container-${index}`
                    : undefined
                }
              >
                <ChartHeader
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-chart-header-${index}`
                      : undefined
                  }
                  title={
                    item.id
                      ? formatMessage({
                          id: `Innovation.Innovation.Overview.TotalInnovation.BigNumbers.${item.id}.title`,
                        })
                      : null
                  }
                  measure={
                    item.id
                      ? formatMessage({
                          id: `Innovation.Innovation.Overview.TotalInnovation.BigNumbers.${item.id}.measure`,
                        })
                      : null
                  }
                  info={
                    item.id && showInfo
                      ? formatMessage({
                          id: `Innovation.Innovation.Overview.TotalInnovation.BigNumbers.${item.id}.tooltip`,
                        })
                      : null
                  }
                  period={item.period}
                  config={{
                    inline: orientation.header,
                    type: 'small',
                    periodPosition,
                    alignment:
                      orientation.header === 'horizontal' ? 'left' : 'center',
                  }}
                />
              </StyledChartHeaderContainer>
            }
            orientation={orientation.body}
            data={item.data}
            asCard={asCard}
            size="small"
            fullWidth
            onClick={
              !kpiFilter && item.hasDeepDive && onDeepDive
                ? () => onDeepDive(item.id)
                : undefined
            }
          />
        </StyledBigNumberItem>
      ))}
    </StyledBigNumberContainer>
  );
};
