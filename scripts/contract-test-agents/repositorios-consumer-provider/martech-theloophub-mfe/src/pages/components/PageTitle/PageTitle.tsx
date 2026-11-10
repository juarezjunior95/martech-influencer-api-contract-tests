import React from 'react';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { StyledTitle } from 'shared/Styles';

import {
  StyledInfoIconWrapper,
  StyledPageDescription,
  StyledPageTitleContainer,
  StyledPageTitleContent,
  StyledPageTitleRightContent,
  StyledPageTitleRow,
} from './PageTitle.styles';

export interface PageTitleProps {
  title: string;
  description?: string;
  tooltip?: React.ReactNode;
  tooltipIconSize?: 'large' | 'medium' | 'small';
  rightContent?: React.ReactNode;
  dataTestId?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  tooltip,
  tooltipIconSize = 'large',
  rightContent,
  dataTestId,
}) => {
  return (
    <StyledPageTitleContainer data-testid={dataTestId}>
      <StyledPageTitleRow>
        <StyledPageTitleContent>
          <StyledTitle
            size="H2"
            data-testid={dataTestId ? `page-title-${dataTestId}` : undefined}
          >
            {title}
          </StyledTitle>

          {tooltip && (
            <CustomTooltip
              content={tooltip}
              label={title}
              dataTestId={
                dataTestId ? `page-title-tooltip-${dataTestId}` : undefined
              }
            >
              <StyledInfoIconWrapper size={tooltipIconSize}>
                <Icon
                  icon={Info}
                  data-testid={
                    dataTestId
                      ? `page-title-tooltip-icon-${dataTestId}`
                      : undefined
                  }
                />
              </StyledInfoIconWrapper>
            </CustomTooltip>
          )}
        </StyledPageTitleContent>

        {description && (
          <StyledPageDescription
            data-testid={
              dataTestId ? `page-title-description-${dataTestId}` : undefined
            }
          >
            {description}
          </StyledPageDescription>
        )}
      </StyledPageTitleRow>

      {rightContent && (
        <StyledPageTitleRightContent>
          {rightContent}
        </StyledPageTitleRightContent>
      )}
    </StyledPageTitleContainer>
  );
};
