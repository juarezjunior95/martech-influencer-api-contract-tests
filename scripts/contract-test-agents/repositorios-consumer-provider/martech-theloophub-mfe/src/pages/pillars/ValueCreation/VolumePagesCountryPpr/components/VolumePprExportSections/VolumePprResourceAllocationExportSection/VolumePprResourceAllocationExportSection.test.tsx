import React from 'react';

import { render, screen } from '@testing-library/react';

import type { UseVolumePprResourceAllocationOverviewResult } from '../../../hooks';
import { VolumePprResourceAllocationExportSection } from './VolumePprResourceAllocationExportSection';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('../../Slides', () => ({
  ResourceAllocationMediaSlideContent: () => (
    <div data-testid="resource-allocation-content" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const mockFormatMessage = (({ id }: { id?: string }) => id ?? '') as never;

const resourceAllocationStub = {
  overviewData: null,
  overviewLoading: false,
  overviewError: null,
  rankingKpiData: null,
  rankingLoading: false,
  rankingError: null,
  activeRankingSubfilter: 'media_spend',
} as UseVolumePprResourceAllocationOverviewResult;

describe('VolumePprResourceAllocationExportSection', () => {
  it('renders resource allocation export template title', () => {
    render(
      <VolumePprResourceAllocationExportSection
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
        getPageByName={() => undefined}
        resourceAllocation={resourceAllocationStub}
      />,
    );

    expect(
      screen.getByTestId('template-Resource Allocation'),
    ).toBeInTheDocument();
  });
});
