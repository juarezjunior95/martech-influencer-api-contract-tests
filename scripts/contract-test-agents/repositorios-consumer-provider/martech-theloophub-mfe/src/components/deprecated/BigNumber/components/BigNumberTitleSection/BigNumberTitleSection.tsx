import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { BigNumberData } from 'components/deprecated';
import {
  StyledBigNumberLine,
  StyledBigNumberText,
  StyledBigNumberTitle,
  StyledBigNumberTitleSection,
} from 'components/deprecated/BigNumber/BigNumber.styles';
import { HeaderContent, HeaderContentItem } from 'components/HeaderContent';
import { StyledRefreshLabel } from 'shared/Styles';

import { StyledRefreshContainer } from './BigNumberTitleSection.styles';

const TooltipIcon = ({
  title,
  tooltipContent,
}: {
  title: string;
  tooltipContent: HeaderContentItem[];
}) => (
  <CustomTooltip
    size="medium"
    label={title}
    content={<HeaderContent items={tooltipContent} />}
  >
    <Icon size="small" icon={Info} />
  </CustomTooltip>
);

interface TitleWithTooltipProps {
  title: string;
  titleSize?: BigNumberData['titleSize'];
  tooltipContent?: HeaderContentItem[];
}

const TitleWithTooltip = ({
  title,
  titleSize,
  tooltipContent,
}: TitleWithTooltipProps) => (
  <StyledBigNumberLine>
    <StyledBigNumberTitle size={titleSize || 'H5'}>
      {title}
    </StyledBigNumberTitle>

    {tooltipContent && (
      <TooltipIcon title={title} tooltipContent={tooltipContent} />
    )}
  </StyledBigNumberLine>
);

interface TitleWithMeasureProps extends TitleWithTooltipProps {
  measure?: string;
}

const TitleWithMeasure = ({
  title,
  titleSize,
  measure,
  tooltipContent,
}: TitleWithMeasureProps) => (
  <StyledBigNumberLine>
    <StyledBigNumberTitle size={titleSize || 'H5'}>
      {title}
    </StyledBigNumberTitle>

    {measure && (
      <StyledBigNumberText size="small" color="gray" weight="light">
        {measure}
      </StyledBigNumberText>
    )}

    {tooltipContent && (
      <TooltipIcon title={title} tooltipContent={tooltipContent} />
    )}
  </StyledBigNumberLine>
);

const RefreshInfo = ({ data }: { data: BigNumberData }) => {
  if (!data.dateRefresh && !data.lastEstimated) return null;

  return (
    <StyledRefreshContainer>
      {data.dateRefresh && (
        <StyledRefreshLabel>{data.dateRefresh}</StyledRefreshLabel>
      )}
      {data.lastEstimated && (
        <StyledRefreshLabel size="medium" style={{ marginLeft: 'auto' }}>
          {data.lastEstimated}
        </StyledRefreshLabel>
      )}
    </StyledRefreshContainer>
  );
};

export const BigNumberTitleSection = ({
  data,
  type,
}: {
  data: BigNumberData;
  type?: string;
}) => {
  if (!data.title) return null;

  const isCategoryHealth = type === 'categoryHealth';

  return (
    <StyledBigNumberTitleSection>
      {isCategoryHealth ? (
        <TitleWithTooltip
          title={data.title}
          titleSize={data.titleSize}
          tooltipContent={data.tooltipContent}
        />
      ) : (
        <>
          <TitleWithMeasure
            title={data.title}
            titleSize={data.titleSize}
            measure={data.measure}
            tooltipContent={data.tooltipContent}
          />
          <RefreshInfo data={data} />
        </>
      )}
    </StyledBigNumberTitleSection>
  );
};
