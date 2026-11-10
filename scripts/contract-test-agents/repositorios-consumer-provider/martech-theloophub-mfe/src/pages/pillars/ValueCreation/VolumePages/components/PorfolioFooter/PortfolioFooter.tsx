import { Paragraph } from '@hexa-ui/components';
import { PortfolioPerformanceFooter } from 'pages/pillars/ValueCreation/VolumePages/types/portfolioPerformance';

import {
  StyledCard,
  StyledComparisonContainer,
  StyledComparisonText,
  StyledPortfolioFooterContainer,
  StyledSubtitle,
  StyledValue,
} from './PortfolioFooter.styles';

interface PortfolioFooterProps {
  data: PortfolioPerformanceFooter[];
  dataTestId?: string;
}

export const PortfolioFooter = ({ data, dataTestId }: PortfolioFooterProps) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((item, index) => (
        <StyledPortfolioFooterContainer
          key={`${item.portfolio.title}-${item.portfolio.subtitle ?? ''}-${item.month.value}-${item.l3m.value}-${item.ytd.value}`}
          data-testid={
            dataTestId
              ? `portfolio-footer-container-${index}-${dataTestId}`
              : undefined
          }
        >
          <StyledCard
            type="portfolio"
            darkBg={index === 1}
            data-testid={
              dataTestId
                ? `portfolio-footer-card-portfolio-${index}-${dataTestId}`
                : undefined
            }
          >
            <Paragraph
              size="basis"
              weight="medium"
              data-testid={
                dataTestId
                  ? `portfolio-footer-card-portfolio-title-${index}-${dataTestId}`
                  : undefined
              }
            >
              {item.portfolio.title}
            </Paragraph>
            {item.portfolio.subtitle && (
              <StyledSubtitle
                weight="medium"
                data-testid={
                  dataTestId
                    ? `portfolio-footer-card-portfolio-subtitle-${index}-${dataTestId}`
                    : undefined
                }
              >
                {item.portfolio.subtitle}
              </StyledSubtitle>
            )}
          </StyledCard>

          <StyledCard
            type="data"
            darkBg={index === 1}
            data-testid={
              dataTestId
                ? `portfolio-footer-card-data-${index}-${dataTestId}`
                : undefined
            }
          >
            <StyledValue
              data-testid={
                dataTestId
                  ? `portfolio-footer-card-data-month-${index}-${dataTestId}`
                  : undefined
              }
              weight="medium"
              style={{ color: item.month.variationDirection }}
            >
              {`${item.month.value}${item.month.measure}`}
            </StyledValue>
            <StyledComparisonContainer>
              <StyledComparisonText
                weight="medium"
                data-testid={
                  dataTestId
                    ? `portfolio-footer-card-data-month-comparison-${index}-${dataTestId}`
                    : undefined
                }
              >
                {item.month.comparison}
              </StyledComparisonText>
            </StyledComparisonContainer>
          </StyledCard>

          <StyledCard
            data-testid={
              dataTestId
                ? `portfolio-footer-card-data-l3m-${index}-${dataTestId}`
                : undefined
            }
            type="data"
            darkBg={index === 1}
          >
            <StyledValue
              data-testid={
                dataTestId
                  ? `portfolio-footer-card-data-l3m-value-${index}-${dataTestId}`
                  : undefined
              }
              weight="medium"
              style={{ color: item.l3m.variationDirection }}
            >
              {`${item.l3m.value}${item.l3m.measure}`}
            </StyledValue>
            <StyledComparisonContainer>
              <StyledComparisonText
                weight="medium"
                data-testid={
                  dataTestId
                    ? `portfolio-footer-card-data-l3m-comparison-${index}-${dataTestId}`
                    : undefined
                }
              >
                {item.l3m.comparison}
              </StyledComparisonText>
            </StyledComparisonContainer>
          </StyledCard>

          <StyledCard
            data-testid={
              dataTestId
                ? `portfolio-footer-card-data-ytd-${index}-${dataTestId}`
                : undefined
            }
            type="data"
            darkBg={index === 1}
          >
            <StyledValue
              data-testid={
                dataTestId
                  ? `portfolio-footer-card-data-ytd-value-${index}-${dataTestId}`
                  : undefined
              }
              weight="medium"
              style={{ color: item.ytd.variationDirection }}
            >
              {`${item.ytd.value}${item.ytd.measure}`}
            </StyledValue>
            <StyledComparisonContainer>
              <StyledComparisonText
                weight="medium"
                data-testid={
                  dataTestId
                    ? `portfolio-footer-card-data-ytd-comparison-${index}-${dataTestId}`
                    : undefined
                }
              >
                {item.ytd.comparison}
              </StyledComparisonText>
            </StyledComparisonContainer>
          </StyledCard>
        </StyledPortfolioFooterContainer>
      ))}
    </>
  );
};
