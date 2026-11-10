import React, { useRef } from 'react';

import { LoadingDots } from '@hexa-ui/components';
import { CopyIcon } from 'components';
import { usePngCopyFeedback } from 'hooks';

import { Footer, FooterProps, Header, HeaderProps } from './components';
import {
  StyledFlexContainer,
  StyledPngCopyActions,
  StyledPngCopyButton,
  StyledPngCopyFeedback,
  StyledTemplateContainer,
  StyledTemplateContent,
} from './TemplateSlide.styles';
import { getBorderPositionObj } from './utils';

export type BorderPosition = 'top' | 'bottom' | 'left' | 'right';
interface TemplateSlideProps extends Omit<HeaderProps, 'divider'>, FooterProps {
  headerDivider?: boolean;
  children: React.ReactNode;
  dataTestId?: string;
  borderPosition?: BorderPosition[];
  showFootnotes?: boolean;
  backgroundColor?: string;
  enablePngCopy?: boolean;
}

export const TemplateSlide: React.FC<TemplateSlideProps> = ({
  title,
  measure,
  headline,
  period,
  countryId,
  countryId2,
  brandId,
  headerDivider = true,
  footnotes,
  page,
  children,
  dataTestId,
  borderPosition = ['left'],
  showFootnotes = true,
  backgroundColor,
  enablePngCopy = false,
}) => {
  const borderPositionObj = getBorderPositionObj(borderPosition);
  const slideRef = useRef<HTMLDivElement>(null);
  const { copyElementAsPng, feedbackMessage, isActionVisible, isExporting } =
    usePngCopyFeedback();

  return (
    <StyledTemplateContainer
      ref={slideRef}
      data-testid={dataTestId ? `template-slide-${dataTestId}` : undefined}
      {...borderPositionObj}
      style={{ backgroundColor }}
    >
      <StyledTemplateContent>
        {enablePngCopy && (
          <StyledPngCopyActions
            data-template-slide-png-copy-action="true"
            data-visible={isActionVisible ? 'true' : undefined}
            data-testid="png-copy-actions"
          >
            <StyledPngCopyButton
              size="small"
              variant="secondary"
              elevated
              isLoading={isExporting}
              disabled={isExporting}
              aria-label="Copy slide as PNG"
              aria-busy={isExporting}
              aria-describedby={
                feedbackMessage ? 'template-slide-png-copy-feedback' : undefined
              }
              onClick={() => copyElementAsPng(slideRef.current)}
            >
              {isExporting ? (
                <LoadingDots size="medium" color="mono" />
              ) : (
                <CopyIcon width={14} height={14} />
              )}
            </StyledPngCopyButton>
            {feedbackMessage ? (
              <StyledPngCopyFeedback
                id="template-slide-png-copy-feedback"
                role="status"
                aria-live="polite"
                data-testid="template-slide-png-copy-feedback"
              >
                {feedbackMessage}
              </StyledPngCopyFeedback>
            ) : null}
          </StyledPngCopyActions>
        )}
        <Header
          title={title}
          measure={measure}
          headline={headline}
          period={period}
          countryId={countryId}
          countryId2={countryId2}
          brandId={brandId}
          divider={headerDivider}
        />
        <StyledFlexContainer>{children}</StyledFlexContainer>
        {showFootnotes && <Footer footnotes={footnotes} page={page} />}
      </StyledTemplateContent>
    </StyledTemplateContainer>
  );
};
