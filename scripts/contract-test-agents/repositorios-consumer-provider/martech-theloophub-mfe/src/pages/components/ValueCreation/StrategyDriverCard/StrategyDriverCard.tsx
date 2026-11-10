import { useCallback } from 'react';

import { Paragraph } from '@hexa-ui/components';
import noDataAvailable from 'assets/NoDataAvailable.svg';
import { BigNumber, ChartHeader } from 'components';
import { useMediaQuery } from 'hooks';

import {
  StyledChartHeaderWrapper,
  StyledNoDataYetIcon,
  StyledNoticeMessageContainer,
  StyledStrategyDriverCard,
} from './StrategyDriverCard.styles';
import type { StrategyDriverCardProps } from './types';

export const StrategyDriverCard = ({
  data,
  tooltip,
  isExportPage = false,
}: StrategyDriverCardProps) => {
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');

  const getBigNumberSize = useCallback(() => {
    if (isExportPage) return 'small';
    if (isDesktopXLarge) return 'xsmall';
    return 'xxsmall';
  }, [isExportPage, isDesktopXLarge]);

  if (!data || data?.noticeMessage) {
    return (
      <StyledStrategyDriverCard isExportPage={isExportPage}>
        <ChartHeader
          title={data?.chartHeader.title}
          config={{
            inline: 'horizontal',
            type: isDesktopXLarge ? 'large' : 'small',
            alignment: 'center',
          }}
        />
        <StyledNoticeMessageContainer>
          <StyledNoDataYetIcon src={noDataAvailable} alt="no data yet" />
          <Paragraph>{data?.noticeMessage}</Paragraph>
        </StyledNoticeMessageContainer>
      </StyledStrategyDriverCard>
    );
  }

  return (
    <StyledStrategyDriverCard isExportPage={isExportPage}>
      <StyledChartHeaderWrapper>
        <ChartHeader
          title={data?.chartHeader.title}
          period={data?.chartHeader.period}
          info={tooltip}
          config={{
            inline: 'horizontal',
            type: isDesktopXLarge ? 'large' : 'small',
            alignment: 'center',
          }}
        />
      </StyledChartHeaderWrapper>
      <BigNumber data={data?.bigNumberData} size={getBigNumberSize()} />
    </StyledStrategyDriverCard>
  );
};
