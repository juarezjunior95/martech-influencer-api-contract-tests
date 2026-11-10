import React from 'react';
import { useIntl } from 'react-intl';

import { CalendarClock } from '@hexa-ui/icons2';
import {
  BasicContainer,
  BigNumber,
  ChartHeader,
  Skeleton,
  Tag,
} from 'components';
import type { BigNumberData } from 'components/BigNumber/types';
import { CountryFlag } from 'components/Filter/components';
import { useCurrentPage, usePageFilterApplied } from 'hooks';

import type { KPIType, ProductType } from '../../types';
import { NoDataAvailable } from '../NoDataAvailable/NoDataAvailable';
import { WorldIcon } from '../WorldIcon/WorldIcon';
import { WorldWithMarkerIcon } from '../WorldWithMarkerIcon/WorldWithMarkerIcon';
import { TOOLTIP_KEYS } from './constants';
import {
  CardsGrid,
  Container,
  IconContainer,
} from './OvertimePerformance.styles';

export type OvertimePerformanceData = Array<{
  title: string;
  data: BigNumberData[];
  emptyStateMessage?: string;
  kpiKey: KPIType;
  dataTestId: string;
}>;

interface OvertimePerformanceProps {
  refreshDateLabel?: string;
  selectedKPI?: KPIType | null;
  onKPISelect: (kpi: string) => void;
  data?: OvertimePerformanceData;
  productType?: ProductType;
  loading?: boolean;
  dataTestId?: string;
}

export const OvertimePerformance: React.FC<OvertimePerformanceProps> = ({
  refreshDateLabel,
  selectedKPI,
  onKPISelect,
  data,
  productType = 'Beer',
  loading = false,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  if (loading && !data) {
    return (
      <Skeleton
        length={1}
        width="100%"
        height="300px"
        borderRadius="large"
        dataTestId={
          dataTestId ? `${dataTestId}-overtime-performance-skeleton` : undefined
        }
      />
    );
  }

  if (!data) {
    return <NoDataAvailable dataTestId={dataTestId} />;
  }

  return (
    <BasicContainer
      header={{
        title: 'Overtime Performance',
        titleSize: 'H2',
        bottomTag: refreshDateLabel ? (
          <Tag Icon={CalendarClock} text={`: ${refreshDateLabel}`} />
        ) : null,
        rightContent:
          applied?.zone === 'ABI' ? (
            <WorldIcon />
          ) : (
            <CountryFlag
              dataTestId={
                dataTestId ? `${dataTestId}-overtime-performance` : undefined
              }
            />
          ),
      }}
      layout={{ bodyPadding: true, background: '#F9F9F9' }}
      dataTestId={dataTestId ? `${dataTestId}-overtime-performance` : undefined}
    >
      <Container>
        <CardsGrid>
          {data.map((cardData) => (
            <BigNumber
              key={cardData.kpiKey}
              header={
                <ChartHeader
                  title={cardData.title}
                  info={formatMessage({
                    id: TOOLTIP_KEYS[cardData.kpiKey]?.[productType],
                  })}
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={cardData.data}
              emptyStateMessage={cardData.emptyStateMessage}
              emptyStateIcon={
                cardData.kpiKey === 'wmtbb' && applied.country === 'ABI' ? (
                  <IconContainer>
                    <WorldWithMarkerIcon />
                  </IconContainer>
                ) : undefined
              }
              emptyStateConfig={{
                inline: true,
                imageSize: {
                  height: '44px',
                  width: '44px',
                },
              }}
              asCard
              size="small"
              onClick={
                cardData.data.length > 0
                  ? () => onKPISelect(cardData.kpiKey)
                  : undefined
              }
              isSelected={selectedKPI === cardData.kpiKey}
              dataTestId={
                dataTestId ? `${dataTestId}-${cardData.dataTestId}` : undefined
              }
            />
          ))}
        </CardsGrid>
      </Container>
    </BasicContainer>
  );
};
