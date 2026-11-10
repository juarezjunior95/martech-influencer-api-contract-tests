import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberBrandVolume } from '../BigNumberBrandVolume';
import { StyledBigNumberComparisonContainer } from '../BigNumberContent/BigNumberContent.styles';
import {
  StyledAudienceDemographicsHorizontal,
  StyledAudienceLabel,
  StyledAudienceRow,
  StyledAudienceValue,
  StyledAudienceWithBrandVolumeWrapper,
} from './BigNumberAudienceTargeting.style';
import { AudienceValue } from './components';
import { AUDIENCE_LABELS } from './utils/constants';

interface BigNumberAudienceTargetingProps {
  item: BigNumberData;
  dataTestId?: string;
  audienceType?: 'core' | 'halo';
}

export const BigNumberAudienceTargeting = ({
  item,
  dataTestId,
  audienceType,
}: BigNumberAudienceTargetingProps) => {
  if (!item.audience) return null;

  const audienceEntries = Object.entries(item.audience);
  const hasBrandVolume = !!item.brandVolume;

  const audienceRows = audienceEntries.map(([key, value]) => (
    <StyledAudienceRow key={key}>
      <StyledAudienceLabel>{AUDIENCE_LABELS[key] || key}</StyledAudienceLabel>
      <StyledAudienceValue>
        <AudienceValue
          fieldKey={key}
          value={value}
          dataTestId={dataTestId ? `${dataTestId}-value` : undefined}
        />
      </StyledAudienceValue>
    </StyledAudienceRow>
  ));

  if (hasBrandVolume) {
    return (
      <StyledAudienceWithBrandVolumeWrapper data-testid={dataTestId}>
        <StyledAudienceDemographicsHorizontal>
          {audienceRows}
        </StyledAudienceDemographicsHorizontal>
        <BigNumberBrandVolume
          item={item}
          dataTestId={dataTestId}
          audienceType={audienceType}
        />
      </StyledAudienceWithBrandVolumeWrapper>
    );
  }

  return (
    <StyledBigNumberComparisonContainer data-testid={dataTestId}>
      {audienceRows}
    </StyledBigNumberComparisonContainer>
  );
};
