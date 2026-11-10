import {
  Alert,
  AlertProps,
  BasicContainer,
  BigNumberWithContent,
  ChartHeader,
  NoDataYet,
  Skeleton,
  SparkLine,
} from 'components';
import { useMediaQuery } from 'hooks';
import { StyledSectionContent } from 'shared/Styles/layout.styles';

import type { BigNumberSparkLineCardData } from './types';

const CHART_COLOR_BY_TREND = {
  positive: '#007800',
  negative: '#B91C1C',
} as const;

const DEFAULT_CHART_COLOR = '#5C5C5C';

const getChartColorFromTrend = (
  trend: 'positive' | 'negative' | undefined,
): string => (trend ? CHART_COLOR_BY_TREND[trend] : DEFAULT_CHART_COLOR);

export interface BigNumberSparkLineCardProps {
  containerTitle: string;
  loading?: boolean;
  error?: Error | null;
  data: BigNumberSparkLineCardData;
  alert?: AlertProps;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const BigNumberSparkLineCard = ({
  containerTitle,
  loading,
  error,
  data,
  alert,
  onClick,
  children,
}: BigNumberSparkLineCardProps) => {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const trend = data?.bigNumberData[0]?.bigNumber?.trend;
  const chartColor = getChartColorFromTrend(trend);

  const isEmpty = !data || data?.bigNumberData.length === 0;

  if (loading) {
    return <Skeleton length={1} width="100%" height="340px" />;
  }

  if (error) {
    return (
      <BasicContainer
        header={{ title: containerTitle, titleSize: 'H3' }}
        layout={{ bodyPadding: false }}
      >
        <StyledSectionContent>
          <NoDataYet />
        </StyledSectionContent>
      </BasicContainer>
    );
  }

  if (isEmpty) {
    return (
      <BasicContainer
        header={{ title: containerTitle, titleSize: 'H3' }}
        layout={{ bodyPadding: false, background: '#fafafa', border: 'gray' }}
      >
        <StyledSectionContent>
          <BigNumberWithContent
            onClick={onClick}
            size={isDesktopLarge ? 'large' : 'medium'}
            header={
              <ChartHeader
                title={data?.chartTitle}
                config={{ inline: 'horizontal', type: 'large' }}
              />
            }
            data={[]}
            fullWidth
            emptyStateMessage="No data available for the selected filters"
            emptyStateConfig={{
              imageSize: {
                width: '100px',
                height: '100px',
              },
            }}
          />
        </StyledSectionContent>
      </BasicContainer>
    );
  }

  return (
    <BasicContainer
      header={{ title: containerTitle, titleSize: 'H3' }}
      layout={{ bodyPadding: false, background: '#fafafa', border: 'gray' }}
    >
      <StyledSectionContent>
        <BigNumberWithContent
          onClick={onClick}
          size={isDesktopLarge ? 'large' : 'medium'}
          header={
            <ChartHeader
              title={data?.chartTitle}
              period={data?.chartPeriod}
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={data?.bigNumberData}
          fullWidth
        >
          {data?.chartLineData && (
            <SparkLine
              labels={data?.chartLineData.map((_, index) => index.toString())}
              datasets={[
                { label: 'spark line dataset', data: data?.chartLineData },
              ]}
              color={chartColor}
            />
          )}
        </BigNumberWithContent>

        {alert && <Alert {...alert} />}
        {children}
      </StyledSectionContent>
    </BasicContainer>
  );
};
