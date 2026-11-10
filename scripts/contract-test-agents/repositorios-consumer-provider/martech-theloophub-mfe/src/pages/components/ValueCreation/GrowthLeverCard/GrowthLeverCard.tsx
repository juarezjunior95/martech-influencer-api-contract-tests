import noDataAvailable from 'assets/NoDataAvailable.svg';
import { BigNumber, ChartHeader } from 'components';
import { useMediaQuery } from 'hooks';
import { StyledParagraph } from 'shared/Styles';

import {
  StyledGrowthLeverCard,
  StyledGrowthLeverCardContent,
  StyledGrowthLeverCardHeader,
  StyledGrowthLeverCardImage,
  StyledGrowthLeverCardRow,
  StyledNoDataYetIcon,
  StyledNoticeMessageContainer,
} from './GrowthLeverCard.styles';
import type { GrowthLeverCardProps } from './types';

export const GrowthLeverCard = ({
  image,
  tooltip,
  data,
  active = false,
  isExportPage = false,
}: GrowthLeverCardProps) => {
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');

  if (!data || data?.noticeMessage) {
    return (
      <StyledGrowthLeverCard isExportPage={isExportPage}>
        <StyledGrowthLeverCardHeader isExportPage={isExportPage}>
          <StyledGrowthLeverCardImage src={image} alt={data?.title} />
          <ChartHeader
            title={data?.title}
            config={{
              inline: 'horizontal',
              type: isDesktopLarge ? 'small' : 'xxsmall',
              alignment: 'center',
              tooltipPosition: 'float',
            }}
          />
        </StyledGrowthLeverCardHeader>
        <StyledNoticeMessageContainer>
          <StyledNoDataYetIcon src={noDataAvailable} alt="no data yet" />
          <StyledParagraph
            size={isDesktopLarge ? 'small' : 'xsmall'}
            color="secondary"
          >
            {data?.noticeMessage}
          </StyledParagraph>
        </StyledNoticeMessageContainer>
      </StyledGrowthLeverCard>
    );
  }

  return (
    <StyledGrowthLeverCard active={active} isExportPage={isExportPage}>
      <StyledGrowthLeverCardHeader isExportPage={isExportPage}>
        <StyledGrowthLeverCardImage src={image} alt={data?.title} />
        <ChartHeader
          title={data?.title}
          info={tooltip}
          config={{
            inline: 'horizontal',
            type: isDesktopLarge ? 'small' : 'xxsmall',
            alignment: 'center',
            tooltipPosition: 'float',
          }}
        />
      </StyledGrowthLeverCardHeader>
      <StyledGrowthLeverCardContent>
        {data?.rows.map((row, index) => (
          <StyledGrowthLeverCardRow
            key={`${row.label}-${index}`}
            hasBorderBottom={index < data?.rows.length - 1}
            isExportPage={isExportPage}
          >
            <StyledParagraph
              size={isDesktopLarge ? 'small' : 'xsmall'}
              color="secondary"
              overflow
            >
              {row.label}
            </StyledParagraph>
            <BigNumber
              data={row.bigNumberData}
              size={isDesktopXLarge ? 'xsmall' : 'xxsmall'}
              asCard={false}
              orientation="none"
              enableTruncation
            />
          </StyledGrowthLeverCardRow>
        ))}
      </StyledGrowthLeverCardContent>
    </StyledGrowthLeverCard>
  );
};
