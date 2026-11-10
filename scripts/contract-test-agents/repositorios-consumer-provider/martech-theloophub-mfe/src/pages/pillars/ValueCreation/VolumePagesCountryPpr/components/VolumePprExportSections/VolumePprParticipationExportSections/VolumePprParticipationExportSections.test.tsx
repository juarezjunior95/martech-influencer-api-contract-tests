import React from 'react';

import { render, screen } from '@testing-library/react';

import type { UseVolumePprParticipationSlidesDataResult } from '../../../hooks';
import { VolumePprParticipationExportSections } from './VolumePprParticipationExportSections';

const mockManufactureSlideSpy = jest.fn();

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

let mockBreakdownCallIndex = 0;

jest.mock('../../Slides', () => ({
  ParticipationBreakdownByCohortSlide: (props: { rowHeight?: number }) => {
    mockBreakdownCallIndex += 1;
    if (mockBreakdownCallIndex === 2) {
      mockManufactureSlideSpy(props);
    }
    return <div data-testid="participation-breakdown" />;
  },
  ParticipationBrandRankingSlide: () => (
    <div data-testid="participation-brand-ranking" />
  ),
}));

const idle = {
  data: null,
  loading: false,
  error: null,
  refetch: jest.fn(),
};

const participationStub = {
  participationBreakdownByCohortSlideData: idle,
  participationBreakdownByCohortCountryManufatureSlideData: idle,
  participationBreakdownByCohortGlobalManufatureSlideData: idle,
  brandRankingParticipationSlideData: idle,
  participationBreakdownByCohortManufatureSlideData: {
    header: [],
    rows: [],
  },
  manufactureParticipationExportTableConfig: { columnDefs: [] } as never,
  sectionLoading: false,
} as unknown as UseVolumePprParticipationSlidesDataResult;

const renderSubject = (isGlobalZone: boolean) => {
  mockBreakdownCallIndex = 0;
  return render(
    <VolumePprParticipationExportSections
      period="Q1'25"
      countryId="BR"
      dataTestId="ppr"
      isGlobalZone={isGlobalZone}
      getPageByName={() => undefined}
      participation={participationStub}
    />,
  );
};

describe('VolumePprParticipationExportSections', () => {
  it('renders the three participation export template titles', () => {
    renderSubject(false);

    expect(
      screen.getByTestId('template-Participation Breakdown by Cohort'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Participation Breakdown by Manufacturer'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Participation Brand Ranking'),
    ).toBeInTheDocument();
  });

  it('passes rowHeight 56 to the manufacturer slide when not in global zone', () => {
    renderSubject(false);
    expect(mockManufactureSlideSpy).toHaveBeenCalledWith(
      expect.objectContaining({ rowHeight: 56 }),
    );
  });

  it('passes rowHeight 47.75 to the manufacturer slide when in global zone', () => {
    renderSubject(true);
    expect(mockManufactureSlideSpy).toHaveBeenCalledWith(
      expect.objectContaining({ rowHeight: 47.75 }),
    );
  });
});
