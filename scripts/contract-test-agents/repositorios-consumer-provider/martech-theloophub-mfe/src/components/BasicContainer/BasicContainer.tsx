import { isValidElement, type ReactNode } from 'react';

import { HeadingProps } from '@hexa-ui/components/dist/declarations/src/lib/typography/Heading/HeadingTypes';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { Tag } from 'components/Tag';
import {
  StyledHeader,
  StyledMeasure,
  StyledRefreshLabel,
  StyledSubtitle,
  StyledTitle,
} from 'shared/Styles';
import { ContainerWithScroll } from 'utils/container';

import {
  StyledBasicContainer,
  StyledBasicContainerHeaderColumn,
  StyledBasicContainerHeaderContent,
  StyledBasicContainerHeaderRow,
  StyledBasicContainerTags,
  StyledHeaderline,
} from './BasicContainer.styles';

type Tags = Array<{
  icon: React.ElementType;
  text: string;
}>;

export type BasicContainerStructuredTooltip = {
  title?: string;
  subtitle?: string;
  text?: string;
};

export type BasicContainerHeaderTooltip =
  ReactNode | BasicContainerStructuredTooltip;

function isBasicContainerTooltipRecord(
  value: BasicContainerHeaderTooltip | undefined,
): value is BasicContainerStructuredTooltip {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  if (isValidElement(value) || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (!('title' in record || 'subtitle' in record || 'text' in record)) {
    return false;
  }
  for (const key of Object.keys(record)) {
    if (key !== 'title' && key !== 'subtitle' && key !== 'text') {
      return false;
    }
  }
  for (const k of ['title', 'subtitle', 'text'] as const) {
    const v = record[k];
    if (v != null && typeof v !== 'string') {
      return false;
    }
  }
  return true;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  tooltip?: BasicContainerHeaderTooltip;
  tooltipSize?: 'small' | 'medium' | 'large';
  titleSize?: HeadingProps['size'];
  measure?: string;
  tags?: Tags;
  rightContent?: React.ReactNode;
  refreshDateLabel?: string;
  bottomTag?: React.ReactNode;
  tooltipBackgroundTransparent?: boolean;
}

type SizeOption = 'none' | 'small' | 'medium' | 'large';

interface LayoutProps {
  border?: 'none' | 'small' | 'gray';
  borderRadius?: SizeOption;
  shadow?: SizeOption;
  headerPadding?: SizeOption;
  bodyPadding?: boolean;
  bottomSeparator?: 'none' | 'border' | 'margin';
  background?: string;
  bodyStyle?: React.CSSProperties;
}

interface BasicContainerProps {
  header?: HeaderProps;
  layout?: LayoutProps;
  children: React.ReactNode;
  fullWidth?: boolean;
  dataTestId?: string;
}

export const BasicContainer = ({
  header,
  layout,
  children,
  fullWidth = false,
  dataTestId,
}: BasicContainerProps) => {
  const baseLayout: LayoutProps = {
    border: 'small',
    borderRadius: 'large',
    headerPadding: 'medium',
    bodyPadding: true,
    shadow: 'small',
    background: 'white',
  };

  const finalLayout: LayoutProps = {
    ...baseLayout,
    ...layout,
  };

  return (
    <StyledBasicContainer
      border={finalLayout?.border}
      shadow={finalLayout?.shadow}
      borderRadius={finalLayout?.borderRadius}
      fullWidth={fullWidth}
      style={{
        background: finalLayout?.background,
        ...finalLayout?.bodyStyle,
      }}
      data-testid={dataTestId}
    >
      {header && (
        <StyledHeader
          padding={finalLayout?.headerPadding}
          borderRadius={finalLayout?.borderRadius}
          bottomSeparator={finalLayout?.bottomSeparator}
          style={{ background: finalLayout?.background }}
          data-testid={dataTestId ? `${dataTestId}-header` : undefined}
        >
          <StyledBasicContainerHeaderContent>
            <StyledBasicContainerHeaderColumn>
              <StyledBasicContainerHeaderRow>
                <StyledHeaderline>
                  <StyledBasicContainerHeaderContent>
                    <StyledTitle
                      size={header.titleSize}
                      data-testid={
                        dataTestId ? `${dataTestId}-title` : undefined
                      }
                    >
                      {header.title}
                    </StyledTitle>

                    {header.subtitle && (
                      <StyledSubtitle
                        data-testid={
                          dataTestId ? `${dataTestId}-subtitle` : undefined
                        }
                      >
                        {header.subtitle}
                      </StyledSubtitle>
                    )}

                    {header.measure && (
                      <StyledMeasure
                        size="small"
                        color="gray"
                        weight="light"
                        data-testid={
                          dataTestId ? `${dataTestId}-measure` : undefined
                        }
                      >
                        {header.measure}
                      </StyledMeasure>
                    )}

                    {header.tooltip != null && (
                      <CustomTooltip
                        {...(isBasicContainerTooltipRecord(header.tooltip)
                          ? {
                              title: header.tooltip.title,
                              subtitle: header.tooltip.subtitle,
                              text: header.tooltip.text,
                            }
                          : { content: header.tooltip })}
                        label={header.title}
                        size={header.tooltipSize ?? 'auto'}
                        backgroundStyle={
                          header.tooltipBackgroundTransparent
                            ? 'transparent'
                            : 'default'
                        }
                        dataTestId={
                          dataTestId ? `${dataTestId}-tooltip` : undefined
                        }
                        icon={{
                          icon: Info,
                          size: header.tooltipSize ?? 'large',
                        }}
                      />
                    )}
                  </StyledBasicContainerHeaderContent>
                  {header.refreshDateLabel && (
                    <StyledRefreshLabel
                      data-testid={
                        dataTestId ? `${dataTestId}-refresh-label` : undefined
                      }
                    >
                      {header.refreshDateLabel}
                    </StyledRefreshLabel>
                  )}
                </StyledHeaderline>
              </StyledBasicContainerHeaderRow>
              {header.tags && (
                <StyledBasicContainerTags
                  data-testid={dataTestId ? `${dataTestId}-tags` : undefined}
                >
                  {header.tags.map((tagItem, index) => (
                    <Tag
                      key={tagItem.text + index}
                      text={tagItem.text}
                      Icon={tagItem.icon}
                      dataTestId={
                        dataTestId ? `${dataTestId}-tag-${index}` : undefined
                      }
                    />
                  ))}
                </StyledBasicContainerTags>
              )}
              {header.bottomTag && (
                <div style={{ marginTop: 2 }}>{header.bottomTag}</div>
              )}
            </StyledBasicContainerHeaderColumn>
          </StyledBasicContainerHeaderContent>
          {header.rightContent && (
            <StyledBasicContainerHeaderContent>
              {header.rightContent}
            </StyledBasicContainerHeaderContent>
          )}
        </StyledHeader>
      )}

      <ContainerWithScroll
        background="white"
        padding={finalLayout?.bodyPadding}
        style={{
          background: finalLayout?.background,
          borderRadius: header ? '0 0 16px 16px' : '16px',
        }}
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        {children}
      </ContainerWithScroll>
    </StyledBasicContainer>
  );
};
