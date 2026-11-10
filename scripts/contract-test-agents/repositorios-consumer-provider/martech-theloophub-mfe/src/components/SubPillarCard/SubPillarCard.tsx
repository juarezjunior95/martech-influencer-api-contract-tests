import React from 'react';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';

import {
  StyledSubPillarCard,
  StyledSubPillarCardContent,
  StyledSubPillarCardDescription,
  StyledSubPillarCardHeader,
  StyledSubPillarCardTitle,
} from './SubPillarCard.styles';

export interface SubPillarCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  tooltip?: string;
}

export const SubPillarCard: React.FC<SubPillarCardProps> = ({
  title,
  description,
  children,
  tooltip,
}) => {
  return (
    <StyledSubPillarCard data-testid="sub-pillar-card">
      <StyledSubPillarCardHeader>
        <StyledSubPillarCardTitle data-testid="sub-pillar-card-title">
          {title}
        </StyledSubPillarCardTitle>
        {tooltip && (
          <CustomTooltip size="medium" content={tooltip} label={title}>
            <Icon size="small" icon={Info} />
          </CustomTooltip>
        )}
      </StyledSubPillarCardHeader>

      <StyledSubPillarCardDescription data-testid="sub-pillar-card-description">
        {description}
      </StyledSubPillarCardDescription>

      <StyledSubPillarCardContent data-testid="sub-pillar-card-content">
        {children}
      </StyledSubPillarCardContent>
    </StyledSubPillarCard>
  );
};
