import React from 'react';

import { render, screen } from '@testing-library/react';

import type { UseSustainableGrowthOverviewSlideDataResult } from '../../Slides/SustainableGrowthOverviewSlide/hooks/useSustainableGrowthOverviewSlideData';
import { VolumePprSustainableGrowthOverviewExportSection } from './VolumePprSustainableGrowthOverviewExportSection';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('../../Slides', () => ({
  SustainableGrowthOverviewSlide: () => (
    <div data-testid="sustainable-growth-overview-slide" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const overviewStub = {
  loading: false,
  error: null,
  data: {},
} as UseSustainableGrowthOverviewSlideDataResult;

describe('VolumePprSustainableGrowthOverviewExportSection', () => {
  it('renders sustainable growth overview export template title', () => {
    render(
      <VolumePprSustainableGrowthOverviewExportSection
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        getPageByName={() => undefined}
        sustainableGrowthOverview={overviewStub}
      />,
    );

    expect(
      screen.getByTestId('template-Sustainable Growth Overview'),
    ).toBeInTheDocument();
  });
});
