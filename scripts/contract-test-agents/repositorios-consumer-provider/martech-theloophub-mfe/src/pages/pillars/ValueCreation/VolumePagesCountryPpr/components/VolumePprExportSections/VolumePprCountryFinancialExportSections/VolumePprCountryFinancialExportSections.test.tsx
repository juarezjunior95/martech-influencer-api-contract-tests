import React from 'react';

import { render, screen } from '@testing-library/react';
import type { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import type {
  UseVolumePprMarketShareSlidesDataResult,
  UseVolumePprNetRevenueSlidesDataResult,
} from '../../../hooks';
import { VolumePprCountryFinancialExportSections } from './VolumePprCountryFinancialExportSections';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('pages/components/ValueCreation/Slides/SlidePerformanceTool', () => ({
  SlidePerformanceTool: () => <div data-testid="slide-performance-tool" />,
}));

jest.mock('pages/components/ValueCreation', () => ({
  TopBottomWaterfallSlideContent: () => (
    <div data-testid="top-bottom-waterfall" />
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

const netRevenueStub = {
  bigNumbersNetRevenueBffData: idleBff,
  overtimeNetRevenueBffData: idleBff,
  waterfallNetRevenueYTDBffData: idleBff,
  waterfallNetRevenueMTDBffData: idleBff,
  bigNumbersNetRevenueData: { 'overtime-performance': undefined },
  overtimeNetRevenueData: { 'overtime-trends': undefined },
  waterfallYTDData: { contribution: undefined },
  waterfallMTDData: { contribution: undefined },
  sectionLoading: false,
} as UseVolumePprNetRevenueSlidesDataResult;

const marketShareStub = {
  bigNumbersMarketShareBffData: idleBff,
  overtimeMarketShareBffData: idleBff,
  waterfallMarketShareYTDBffData: idleBff,
  waterfallMarketShareMTDBffData: idleBff,
  bigNumbersMarketShareData: { 'overtime-performance': undefined },
  overtimeMarketShareData: { 'overtime-trends': undefined },
  waterfallMarketShareYTDData: { contribution: undefined },
  waterfallMarketShareMTDData: { contribution: undefined },
  sectionLoading: false,
} as UseVolumePprMarketShareSlidesDataResult;

describe('VolumePprCountryFinancialExportSections', () => {
  it('renders net revenue and market share export template titles', () => {
    render(
      <VolumePprCountryFinancialExportSections
        period="Q1'25"
        countryId="BR"
        countryLabel="Brazil"
        dataTestId="ppr"
        netRevenue={netRevenueStub}
        marketShare={marketShareStub}
      />,
    );

    expect(
      screen.getByTestId('template-Brazil Net Revenue'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Brazil Net Revenue Brands'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Brazil Market Share'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Brazil Market Share Brands Breakdown'),
    ).toBeInTheDocument();
  });
});
