import { Divider } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { StyledTitle } from 'shared/Styles';

import * as S from './ContentHeader.styles';

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  tooltip?: React.ReactNode;
  rightContent?: React.ReactNode;
  dataTestId?: string;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  title,
  subtitle,
  tooltip,
  rightContent,
  dataTestId,
}) => {
  return (
    <>
      <S.StyledContentHeader data-testid={dataTestId}>
        <S.StyledContentHeaderContainer>
          <S.StyledContentHeaderTitleGroup>
            <StyledTitle
              size="H5"
              data-testid={dataTestId ? `${dataTestId}-title` : undefined}
            >
              {title}
            </StyledTitle>

            {tooltip && (
              <CustomTooltip
                content={tooltip}
                label={title}
                dataTestId={dataTestId ? `${dataTestId}-tooltip` : undefined}
              >
                <Icon
                  icon={Info}
                  size="medium"
                  data-testid={
                    dataTestId ? `${dataTestId}-tooltip-icon` : undefined
                  }
                />
              </CustomTooltip>
            )}
          </S.StyledContentHeaderTitleGroup>

          {subtitle && (
            <S.StyledContentHeaderSubtitle
              type="paragraph"
              data-testid={dataTestId ? `${dataTestId}-subtitle` : undefined}
            >
              {subtitle}
            </S.StyledContentHeaderSubtitle>
          )}
        </S.StyledContentHeaderContainer>
        {rightContent && (
          <S.StyledContentHeaderRightContent
            data-testid={dataTestId ? `${dataTestId}-right-content` : undefined}
          >
            {rightContent}
          </S.StyledContentHeaderRightContent>
        )}
      </S.StyledContentHeader>
      <S.StyledContentHeaderDivider>
        <Divider />
      </S.StyledContentHeaderDivider>
    </>
  );
};
