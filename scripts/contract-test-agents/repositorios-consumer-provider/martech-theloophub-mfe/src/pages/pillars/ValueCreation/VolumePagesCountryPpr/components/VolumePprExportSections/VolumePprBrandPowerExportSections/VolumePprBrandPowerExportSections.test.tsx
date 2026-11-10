import React from 'react';

import { render, screen } from '@testing-library/react';

import type { UseVolumePprBrandPowerSlidesDataResult } from '../../../hooks';
import { VolumePprBrandPowerExportSections } from './VolumePprBrandPowerExportSections';

const mockCountrySlideSpy = jest.fn();
const mockEvolutionSlideSpy = jest.fn();

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('pages/components/PortfolioBrand/PortfolioBrand.styles', () => ({
  StyledContent: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="styled-content">{children}</div>
  ),
}));

jest.mock('pages/components/PortfolioBrand/Slides', () => ({
  EvolutionSlide: (props: { alerts: string[] }) => {
    mockEvolutionSlideSpy(props);
    return <div data-testid="evolution-slide" />;
  },
  CountrySlide: (props: { alerts: string[]; competitorView?: boolean }) => {
    mockCountrySlideSpy(props);
    return (
      <div
        data-testid={
          props.competitorView
            ? 'country-slide-competitor'
            : 'country-slide-abi'
        }
      />
    );
  },
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const brandPowerStub = {
  countryData: { loading: false, error: null, data: undefined },
  breakdownSegmentsData: { loading: false, error: null, data: undefined },
  sectionLoading: false,
} as UseVolumePprBrandPowerSlidesDataResult;

const renderSubject = () =>
  render(
    <VolumePprBrandPowerExportSections
      period="Q1'25"
      countryId="BR"
      dataTestId="ppr"
      getPageByName={() => undefined}
      brandPower={brandPowerStub}
      evolutionAlerts={['evolution-alert-1']}
      abiBrandInsights={['abi-insight-1']}
      competitorBrandInsights={['competitor-insight-1']}
    />,
  );

describe('VolumePprBrandPowerExportSections', () => {
  it('renders brand power export template titles', () => {
    renderSubject();

    expect(
      screen.getByTestId('template-Brand Power Trends'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-ABI Brand Breakdown - Performance'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Competitor Brand Breakdown - Performance'),
    ).toBeInTheDocument();
  });

  it('routes evolutionAlerts to EvolutionSlide and brand insights to the matching CountrySlide', () => {
    renderSubject();

    expect(mockEvolutionSlideSpy).toHaveBeenCalledWith(
      expect.objectContaining({ alerts: ['evolution-alert-1'] }),
    );

    const abiCall = mockCountrySlideSpy.mock.calls.find(
      (call) => call[0].competitorView !== true,
    );
    const competitorCall = mockCountrySlideSpy.mock.calls.find(
      (call) => call[0].competitorView === true,
    );

    expect(abiCall?.[0].alerts).toEqual(['abi-insight-1']);
    expect(competitorCall?.[0].alerts).toEqual(['competitor-insight-1']);
  });
});
