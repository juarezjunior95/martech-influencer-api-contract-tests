import { Fragment } from 'react';

import {
  StyledHeaderContainerRoot,
  StyledHeaderContentBodyContainer,
  StyledHeaderContentDivider,
  StyledHeaderContentIcon,
  StyledHeaderContentSubTitle,
  StyledHeaderContentTitle,
  StyledHeaderContentTitleContainer,
} from './HeaderContent.styles';

export interface HeaderContentItem {
  iconType?: 'circle' | 'block' | 'none';
  title?: string;
  subtitle?: string;
  content?: JSX.Element[];
  titleSize?: 'H2' | 'H3';
  subtitleStyle?: {
    size: 'H3' | 'H5';
    color: 'black' | 'grey';
  };
}

interface HeaderContentProps {
  items: HeaderContentItem[];
  dataTestId?: string;
}

export const HeaderContent = ({
  items,
  dataTestId,
}: HeaderContentProps): JSX.Element => {
  return (
    <StyledHeaderContainerRoot
      data-testid={dataTestId ? `header-content-${dataTestId}` : undefined}
    >
      {items.map((item, index) => {
        const { iconType = 'circle', title, subtitle, content } = item;
        const hasHeader = Boolean(title || subtitle);
        return (
          <Fragment key={title + index}>
            {hasHeader && (
              <StyledHeaderContentTitleContainer>
                <StyledHeaderContentIcon
                  type={iconType}
                  data-testid={
                    dataTestId
                      ? `header-content-${dataTestId}-icon-${index}`
                      : undefined
                  }
                />

                {title && (
                  <StyledHeaderContentTitle size={item.titleSize || 'H2'}>
                    {title}
                  </StyledHeaderContentTitle>
                )}

                {subtitle && (
                  <StyledHeaderContentSubTitle
                    size={item?.subtitleStyle?.size || 'H3'}
                    color={item?.subtitleStyle?.color || 'black'}
                  >
                    {subtitle}
                  </StyledHeaderContentSubTitle>
                )}
              </StyledHeaderContentTitleContainer>
            )}
            {content && (
              <StyledHeaderContentBodyContainer noPadding={!hasHeader}>
                {content.map((c, index) => (
                  <Fragment key={c.key + index}>{c}</Fragment>
                ))}
              </StyledHeaderContentBodyContainer>
            )}

            {index < items.length - 1 && (
              <StyledHeaderContentDivider
                orientation="horizontal"
                data-testid={
                  dataTestId
                    ? `header-content-${dataTestId}-divider-${index}`
                    : undefined
                }
              />
            )}
          </Fragment>
        );
      })}
    </StyledHeaderContainerRoot>
  );
};
