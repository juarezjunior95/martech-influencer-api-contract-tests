import React from 'react';

import { render, screen } from '@testing-library/react';

import type { UseVolumePprVolumeSlidesDataResult } from '../../../hooks';
import { VolumePprVolumeExportSections } from './VolumePprVolumeExportSections';

const mockSlideContentSpy = jest.fn();

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('pages/components/ValueCreation', () => ({
  SlideContent: (props: { tableOrder: string[] }) => {
    mockSlideContentSpy(props);
    return <div data-testid="slide-content" />;
  },
  TopBottomWaterfallSlideContent: () => (
    <div data-testid="waterfall-slide-content" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const volumeStub = {
  volumeSlideRequest: { data: null, loading: false, error: null },
  volumeSlideContentData: {
    bigNumbersKpiData: [],
    lineChartKpiData: {},
    portfolioTableKpiData: { header: [], rows: [] },
    prioritiesTableKpiData: { header: [], rows: [] },
    marketsTableKpiData: { header: [], rows: [] },
    topWaterfallKpiData: {},
    bottomWaterfallKpiData: {},
  },
  sectionLoading: false,
} as UseVolumePprVolumeSlidesDataResult;

const renderSubject = (isGlobalZone: boolean) =>
  render(
    <VolumePprVolumeExportSections
      period="Q1'25"
      countryId="BR"
      countryLabel="Brazil"
      dataTestId="ppr"
      isGlobalZone={isGlobalZone}
      getPageByName={() => undefined}
      volume={volumeStub}
    />,
  );

describe('VolumePprVolumeExportSections', () => {
  it('renders volume export template titles', () => {
    renderSubject(false);

    expect(screen.getByTestId('template-Brazil Volume')).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Brazil Volume Brands Breakdown'),
    ).toBeInTheDocument();
  });

  it('passes country tableOrder when isGlobalZone is false', () => {
    renderSubject(false);

    expect(mockSlideContentSpy).toHaveBeenCalledWith(
      expect.objectContaining({ tableOrder: ['portfolio', 'priorities'] }),
    );
  });

  it('passes global tableOrder including markets when isGlobalZone is true', () => {
    renderSubject(true);

    expect(mockSlideContentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tableOrder: ['portfolio', 'priorities', 'markets'],
      }),
    );
  });
});
