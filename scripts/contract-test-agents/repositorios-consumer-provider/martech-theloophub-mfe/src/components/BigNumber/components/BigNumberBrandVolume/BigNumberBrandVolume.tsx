import { BigNumberData } from 'components/BigNumber/types';
import { CustomTooltip } from 'components/CustomTooltip/CustomTooltip';

import {
  StyledBrandVolumeContainer,
  StyledBrandVolumeEmptyState,
  StyledBrandVolumeLabel,
  StyledBrandVolumeTooltipFit,
  StyledBrandVolumeValue,
  StyledDivider,
} from './BigNumberBrandVolume.styles';

interface BigNumberBrandVolumeProps {
  item: BigNumberData;
  dataTestId?: string;
  audienceType?: 'core' | 'halo';
}

export const BigNumberBrandVolume = ({
  item,
  dataTestId,
  audienceType,
}: BigNumberBrandVolumeProps) => {
  if (!item.brandVolume) return null;

  const emptyMessage = item.brandVolume.emptyStateMessage?.trim();
  const isEmptyState = Boolean(emptyMessage);

  const valueElement = isEmptyState ? (
    <StyledBrandVolumeEmptyState
      data-testid={dataTestId ? `${dataTestId}-empty-state` : undefined}
    >
      {emptyMessage}
    </StyledBrandVolumeEmptyState>
  ) : (
    <StyledBrandVolumeValue
      style={{ color: item.brandVolume.color }}
      data-testid={dataTestId ? `${dataTestId}-value` : undefined}
    >
      {item.brandVolume.value}
      {item.brandVolume.measure || '%'}
    </StyledBrandVolumeValue>
  );

  const coreTooltipContent = {
    title: 'Core Audience Brand Volume',
    subtitle:
      'Share of total brand volume (R12M) coming from the Core Audience.',
    text: 'Green = Core ≥50% (aligned)\nRed = Core <50% (off-target)\n\nStructural indicator only - not related to performance.',
  };

  const haloTooltipContent = {
    title: 'Halo Audience Brand Volume',
    subtitle:
      'Adjacent consumers 1-2 steps from the Core (Gender x Age x Income).',
    text: "Brand Volume (%) shows how much of the brand's volume comes from this adjacent audience.\n\nHalo does not receive a Health indicator or performance evaluation.",
  };

  let valueWithTooltip = valueElement;
  if (audienceType === 'core') {
    valueWithTooltip = (
      <StyledBrandVolumeTooltipFit>
        <CustomTooltip {...coreTooltipContent}>{valueElement}</CustomTooltip>
      </StyledBrandVolumeTooltipFit>
    );
  } else if (audienceType === 'halo') {
    valueWithTooltip = (
      <StyledBrandVolumeTooltipFit>
        <CustomTooltip {...haloTooltipContent}>{valueElement}</CustomTooltip>
      </StyledBrandVolumeTooltipFit>
    );
  }

  return (
    <>
      <StyledDivider
        data-testid={dataTestId ? `${dataTestId}-divider` : undefined}
      />
      <StyledBrandVolumeContainer data-testid={dataTestId}>
        {valueWithTooltip}
        {!isEmptyState && (
          <StyledBrandVolumeLabel
            data-testid={dataTestId ? `${dataTestId}-label` : undefined}
          >
            {item.brandVolume.label}
          </StyledBrandVolumeLabel>
        )}
      </StyledBrandVolumeContainer>
    </>
  );
};
