import { TemplateSlide } from 'components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { StyledContent } from '../../BrandPowerBookExport.styles';
import { PowerBookPerformanceData } from '../../types';
import { ByCountrySlide } from '../ByCountrySlide';

interface GenericPerformanceSlideProps {
  data: PowerBookPerformanceData | undefined | null;
  title: string;
  pageName: string;
  period: string;
  loading: boolean;
  error: Error | null;
  pageIndex?: number;
  footnotes?: JSX.Element | string;
  alerts?: string[];
  isCompetitor?: boolean;
}

export const GenericPerformanceSlide = ({
  pageName,
  title,
  period,
  footnotes = '',
  pageIndex,
  loading,
  error,
  data,
  alerts = [],
  isCompetitor = false,
}: GenericPerformanceSlideProps) => {
  return (
    <StyledExportPageSection data-page-name={pageName}>
      <TemplateSlide
        title={title}
        period={period}
        footnotes={footnotes}
        page={pageIndex}
        countryId="ABI"
        headerDivider={false}
        dataTestId={pageName}
      >
        <StyledContent>
          <ByCountrySlide
            loading={loading}
            error={error}
            bigNumbersKpiData={data?.bigNumbers}
            zoneKpiData={data?.zonePerformance?.zonePowerPerformance}
            maturityKpiData={
              data?.maturityPerformance?.maturityPowerPerformance
            }
            nazKpiData={data?.zonePerformanceDetails?.NAZ?.data}
            sazKpiData={data?.zonePerformanceDetails?.SAZ?.data}
            mazKpiData={data?.zonePerformanceDetails?.MAZ?.data}
            apacKpiData={data?.zonePerformanceDetails?.APAC?.data}
            afrKpiData={data?.zonePerformanceDetails?.AFR?.data}
            eurKpiData={data?.zonePerformanceDetails?.EUR?.data}
            alerts={alerts}
            isCompetitor={isCompetitor}
            section={pageName}
          />
        </StyledContent>
      </TemplateSlide>
    </StyledExportPageSection>
  );
};
