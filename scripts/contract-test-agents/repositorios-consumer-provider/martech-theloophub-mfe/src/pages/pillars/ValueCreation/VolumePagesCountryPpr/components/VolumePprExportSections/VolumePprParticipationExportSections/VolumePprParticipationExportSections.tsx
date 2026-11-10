import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import type { TableDataType } from 'components/Table/types';
import type { RankedContainerData } from 'pages/components/BrandRanking/types';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprParticipationSlidesDataResult } from '../../../hooks';
import {
  ParticipationBrandRankingSlide,
  ParticipationBreakdownByCohortSlide,
} from '../../Slides';
import { cohortExportTableConfig } from '../../Slides/ParticipationBreakdownByCohortSlide/config';

export interface VolumePprParticipationExportSectionsProps {
  period: string;
  countryId: string;
  dataTestId: string;
  isGlobalZone: boolean;
  getPageByName: (name: string) => { index: number } | undefined;
  participation: UseVolumePprParticipationSlidesDataResult;
}

const VolumePprParticipationExportSectionsComponent = ({
  period,
  countryId,
  dataTestId,
  isGlobalZone,
  getPageByName,
  participation,
}: VolumePprParticipationExportSectionsProps) => {
  const {
    participationBreakdownByCohortSlideData,
    participationBreakdownByCohortCountryManufatureSlideData,
    participationBreakdownByCohortGlobalManufatureSlideData,
    brandRankingParticipationSlideData,
    participationBreakdownByCohortManufatureSlideData,
    manufactureParticipationExportTableConfig,
  } = participation;

  return (
    <>
      <StyledExportPageSection
        data-page-name={pageSections.participationBreakdownByCohort}
      >
        <TemplateSlide
          title="Participation Breakdown by Cohort"
          period={period}
          countryId={countryId}
          headerDivider={false}
          page={
            getPageByName(pageSections.participationBreakdownByCohort)?.index
          }
        >
          <ParticipationBreakdownByCohortSlide
            loading={participationBreakdownByCohortSlideData.loading}
            data={
              (participationBreakdownByCohortSlideData.data?.country ?? {
                header: [],
                rows: [],
              }) as TableDataType
            }
            config={cohortExportTableConfig}
            dataTestId={`${dataTestId}-participation-breakdown-by-cohort`}
            isExport
          />
        </TemplateSlide>
      </StyledExportPageSection>
      <StyledExportPageSection
        data-page-name={pageSections.participationBreakdownByCohortManufacture}
      >
        <TemplateSlide
          title="Participation Breakdown by Manufacturer"
          period={period}
          countryId={countryId}
          headerDivider={false}
          page={
            getPageByName(
              pageSections.participationBreakdownByCohortManufacture,
            )?.index
          }
        >
          <ParticipationBreakdownByCohortSlide
            loading={
              participationBreakdownByCohortCountryManufatureSlideData.loading ||
              participationBreakdownByCohortGlobalManufatureSlideData.loading
            }
            data={
              participationBreakdownByCohortManufatureSlideData as TableDataType
            }
            config={manufactureParticipationExportTableConfig}
            dataTestId={`${dataTestId}-participation-breakdown-by-cohort-manufacture`}
            rowHeight={isGlobalZone ? 47.75 : 56}
            isExport
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.participationBreakdownByCohortChart}
      >
        <TemplateSlide
          title="Participation Brand Ranking"
          period={period}
          countryId={countryId}
          headerDivider={false}
          page={
            getPageByName(pageSections.participationBreakdownByCohortChart)
              ?.index
          }
        >
          <ParticipationBrandRankingSlide
            loading={brandRankingParticipationSlideData.loading}
            error={brandRankingParticipationSlideData.error}
            empty={
              brandRankingParticipationSlideData.data?.['participation-ranking']
                ?.empty
            }
            ranking={
              brandRankingParticipationSlideData.data?.[
                'participation-ranking'
              ] as RankedContainerData | undefined
            }
            dataTestId={`${dataTestId}-participation-breakdown-by-cohort-chart`}
            isExport
          />
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};

export const VolumePprParticipationExportSections = memo(
  VolumePprParticipationExportSectionsComponent,
);
VolumePprParticipationExportSections.displayName =
  'VolumePprParticipationExportSections';
