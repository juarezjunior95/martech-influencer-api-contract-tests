import React from 'react';

import { render, screen } from '@testing-library/react';

import { pageSections } from '../../../constants';
import type { SustainableGrowthOverviewByGrowthLeverSlideViewModel } from '../../../hooks';
import type { SustainableGrowthOverviewSlideData } from '../../Slides/SustainableGrowthOverviewSlide/types';
import { VolumePprSustainableGrowthByLeverExportList } from './VolumePprSustainableGrowthByLeverExportList';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('../../Slides', () => ({
  SustainableGrowthOverviewSlide: () => (
    <div data-testid="sustainable-growth-slide" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const {
    StyledExportPageSectionMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { StyledExportPageSection: StyledExportPageSectionMock };
});

const buildSlide = (
  id: string,
  title: string,
  pageSection: SustainableGrowthOverviewByGrowthLeverSlideViewModel['pageSection'],
): SustainableGrowthOverviewByGrowthLeverSlideViewModel => ({
  id,
  title,
  pageSection,
  loading: false,
  error: null,
  data: {} as SustainableGrowthOverviewSlideData,
});

describe('VolumePprSustainableGrowthByLeverExportList', () => {
  it('renders a template slide per growth lever slide', () => {
    render(
      <VolumePprSustainableGrowthByLeverExportList
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        getPageByName={() => undefined}
        slides={[
          buildSlide(
            'lead-premium',
            'Sustainable Growth Overview by Lead Premium',
            pageSections.sustainableGrowthOverviewLeadPremium,
          ),
        ]}
      />,
    );

    expect(
      screen.getByTestId(
        'template-Sustainable Growth Overview by Lead Premium',
      ),
    ).toBeInTheDocument();
  });

  it('renders one TemplateSlide per item when given multiple slides', () => {
    render(
      <VolumePprSustainableGrowthByLeverExportList
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        getPageByName={() => undefined}
        slides={[
          buildSlide(
            'lead-premium',
            'Sustainable Growth Overview by Lead Premium',
            pageSections.sustainableGrowthOverviewLeadPremium,
          ),
          buildSlide(
            'beyond-beer',
            'Sustainable Growth Overview by Beyond Beer',
            pageSections.sustainableGrowthOverviewBeyondBeer,
          ),
        ]}
      />,
    );

    expect(
      screen.getByTestId(
        'template-Sustainable Growth Overview by Lead Premium',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('template-Sustainable Growth Overview by Beyond Beer'),
    ).toBeInTheDocument();
  });

  it('renders nothing when slides array is empty', () => {
    const { container } = render(
      <VolumePprSustainableGrowthByLeverExportList
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        getPageByName={() => undefined}
        slides={[]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
