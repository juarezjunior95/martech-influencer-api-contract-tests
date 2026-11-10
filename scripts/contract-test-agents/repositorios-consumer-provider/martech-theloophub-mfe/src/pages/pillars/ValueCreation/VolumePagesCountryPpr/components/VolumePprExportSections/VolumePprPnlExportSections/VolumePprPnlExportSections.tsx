import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprPnlBrandsSlidesDataResult } from '../../../hooks';
import { PnlBrandsVolumePagesSlide } from '../../Slides';

export interface VolumePprPnlExportSectionsProps {
  period: string;
  countryId: string;
  dataTestId: string;
  isGlobalZone: boolean;
  pageFilterPageName: string;
  getPageByName: (name: string) => { index: number } | undefined;
  pnl: UseVolumePprPnlBrandsSlidesDataResult;
}

const VolumePprPnlExportSectionsComponent = ({
  period,
  countryId,
  dataTestId,
  isGlobalZone,
  pageFilterPageName,
  getPageByName,
  pnl,
}: VolumePprPnlExportSectionsProps) => {
  const { pnlBrandsRequest, pnlBrandsDataVolumePpr } = pnl;

  if (isGlobalZone) {
    return null;
  }

  return (
    <>
      <StyledExportPageSection data-page-name={pageSections.pnlBrands}>
        <TemplateSlide
          title="P&L"
          period={period}
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          page={getPageByName(pageSections.pnlBrands)?.index}
          dataTestId={`${dataTestId}-pnl-brands-slide`}
        >
          <PnlBrandsVolumePagesSlide
            data={pnlBrandsDataVolumePpr.first}
            loading={pnlBrandsRequest.loading}
            pageFilterPageName={pageFilterPageName}
            dataTestId={`${dataTestId}-pnl-brands`}
          />
        </TemplateSlide>
      </StyledExportPageSection>

      {!!pnlBrandsDataVolumePpr.second.header?.length && (
        <StyledExportPageSection data-page-name={pageSections.pnlBrandsOutput}>
          <TemplateSlide
            title="P&L"
            period={period}
            footnotes=""
            countryId={countryId}
            headerDivider={false}
            page={getPageByName(pageSections.pnlBrandsOutput)?.index}
            dataTestId={`${dataTestId}-pnl-brands-output-slide`}
          >
            <PnlBrandsVolumePagesSlide
              data={pnlBrandsDataVolumePpr.second}
              loading={pnlBrandsRequest.loading}
              pageFilterPageName={pageFilterPageName}
              dataTestId={`${dataTestId}-pnl-brands-output`}
            />
          </TemplateSlide>
        </StyledExportPageSection>
      )}
    </>
  );
};

export const VolumePprPnlExportSections = memo(
  VolumePprPnlExportSectionsComponent,
);
VolumePprPnlExportSections.displayName = 'VolumePprPnlExportSections';
