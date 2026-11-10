import React from 'react';

import { render, screen } from '@testing-library/react';
import type { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import type { UseVolumePprPortfolioPerformanceSlideDataResult } from '../../../hooks';
import { VolumePprPortfolioPerformanceExportSection } from './VolumePprPortfolioPerformanceExportSection';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('../../Slides', () => ({
  PortfolioPerformanceVolumePagesSlide: () => (
    <div data-testid="portfolio-performance-slide" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const idleBff: UseBffDataResponse = {
  data: null,
  loading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue(undefined),
};

const portfolioStub = {
  portfolioPerformanceSlideData: idleBff,
  sectionLoading: false,
} as UseVolumePprPortfolioPerformanceSlideDataResult;

describe('VolumePprPortfolioPerformanceExportSection', () => {
  it('renders portfolio performance export template title', () => {
    render(
      <VolumePprPortfolioPerformanceExportSection
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        getPageByName={() => undefined}
        portfolioPerformance={portfolioStub}
      />,
    );

    expect(
      screen.getByTestId('template-Portfolio Performance'),
    ).toBeInTheDocument();
  });
});
