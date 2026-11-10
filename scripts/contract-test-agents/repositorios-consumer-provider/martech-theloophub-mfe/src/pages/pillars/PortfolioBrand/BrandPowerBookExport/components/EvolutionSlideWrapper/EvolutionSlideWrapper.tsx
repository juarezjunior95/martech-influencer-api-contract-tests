import { useMemo } from 'react';

import { TemplateSlide } from 'components';
import { EvolutionSlide } from 'pages/components/PortfolioBrand/Slides';
import { PORTFOLIOS_TYPES } from 'pages/constants';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { StyledContent } from '../../BrandPowerBookExport.styles';
import { AI_SUMMARY_GLOBAL_IDENTIFIER } from '../../constants';
import { PowerBookPerformanceData } from '../../types';

interface EvolutionSlideWrapperProps {
  section: string;
  title: string;
  period: string;
  pageIndex?: number;
  data: PowerBookPerformanceData | undefined | null;
  loading: boolean;
  error: Error | null;
  portfolioType?: keyof typeof PORTFOLIOS_TYPES;
}

export const EvolutionSlideWrapper = ({
  section,
  title,
  period,
  pageIndex,
  data,
  loading,
  error,
  portfolioType,
}: EvolutionSlideWrapperProps) => {
  const firstWord = useMemo(() => {
    return title.split(' ')[0];
  }, [title]);

  const firstChartTitle = `TT ${firstWord} Power`;
  const secondChartTitle = `${title} Trend - 30 Countries, 96% NR`;

  const portfolioTypeValue = useMemo(() => {
    return portfolioType ? PORTFOLIOS_TYPES[portfolioType] : undefined;
  }, [portfolioType]);

  return (
    <StyledExportPageSection data-page-name={section}>
      <TemplateSlide
        title={title}
        period={period}
        footnotes={
          <>
            <b>Global Power</b> calculated on weighted average based on NR
            BU’26. countries <b>Source & Scope:</b> Power from Kantar Brand
            Guidance in 30 countries delivering 96% of NR.
            <br />
            <b>About results:</b> Results before 2022 exclude the Dominican
            Republic in the survey.
          </>
        }
        page={pageIndex}
        countryId="ABI"
        headerDivider={false}
        dataTestId={section}
      >
        <StyledContent>
          <EvolutionSlide
            evolutionSlideInfos={[
              {
                firstChartData: data?.['year-power-vs-ac'],
                secondChartData: data?.['trend-over-time'],
                firstChartTitle,
                secondChartTitle,
                evolutionSlideLoading: loading,
                evolutionSlideError: error,
                evolutionSlideEmpty: data?.empty,
                ...(portfolioTypeValue && {
                  portfolioType: portfolioTypeValue,
                }),
                aiSummary: AI_SUMMARY_GLOBAL_IDENTIFIER[section],
              },
            ]}
            alerts={[]}
            dataTestId={`slide-evolution-${section}`}
          />
        </StyledContent>
      </TemplateSlide>
    </StyledExportPageSection>
  );
};
