import React from 'react';

import { render, screen } from '@testing-library/react';
import type { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import type { UseVolumePprPnlBrandsSlidesDataResult } from '../../../hooks';
import { VolumePprPnlExportSections } from './VolumePprPnlExportSections';

jest.mock('components', () => {
  const {
    TemplateSlideMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { TemplateSlide: TemplateSlideMock };
});

jest.mock('../../Slides', () => ({
  PnlBrandsVolumePagesSlide: () => <div data-testid="pnl-brands-slide" />,
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

const emptyTable = { header: [], rows: [] };

const basePnl = {
  pnlBrandsRequest: idleBff,
  sectionLoading: false,
} as UseVolumePprPnlBrandsSlidesDataResult;

describe('VolumePprPnlExportSections', () => {
  it('renders nothing when isGlobalZone is true', () => {
    const { container } = render(
      <VolumePprPnlExportSections
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        isGlobalZone
        pageFilterPageName="All"
        getPageByName={() => undefined}
        pnl={
          {
            ...basePnl,
            pnlBrandsDataVolumePpr: {
              first: emptyTable,
              second: emptyTable,
            },
          } as UseVolumePprPnlBrandsSlidesDataResult
        }
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders a single P&L slide when second table has no header', () => {
    render(
      <VolumePprPnlExportSections
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        isGlobalZone={false}
        pageFilterPageName="All"
        getPageByName={() => undefined}
        pnl={
          {
            ...basePnl,
            pnlBrandsDataVolumePpr: {
              first: emptyTable,
              second: emptyTable,
            },
          } as UseVolumePprPnlBrandsSlidesDataResult
        }
      />,
    );

    expect(screen.getAllByTestId('template-P&L')).toHaveLength(1);
  });

  it('renders two P&L slides when second table has a header', () => {
    render(
      <VolumePprPnlExportSections
        period="Q1'25"
        countryId="BR"
        dataTestId="ppr"
        isGlobalZone={false}
        pageFilterPageName="All"
        getPageByName={() => undefined}
        pnl={
          {
            ...basePnl,
            pnlBrandsDataVolumePpr: {
              first: emptyTable,
              second: { header: [{ id: 'h' }], rows: [] },
            },
          } as UseVolumePprPnlBrandsSlidesDataResult
        }
      />,
    );

    expect(screen.getAllByTestId('template-P&L')).toHaveLength(2);
  });
});
