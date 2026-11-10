import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { Divider } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons';
import {
  BasicContainer,
  CountryFlag,
  NoDataYet,
  NoResultsState,
  SubFilterBrandCompetitor,
} from 'components';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { useLastDataRefresh, useScopedModal } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { usePageFilterApplied } from 'hooks';
import { INDIA_COUNTRY_CODE } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import { formatDateToQuarterYear } from 'utils/format';

import { BRAND_ANALYSIS_PAGE_NAME } from '../../constants';
import { useBrandPowerRequests } from '../../hooks/brand-power/useBrandPowerRequests';
import { YearQuarter } from '../../types';
import {
  StyledBrandPowerContainer,
  StyledDividerContainer,
  StyledIndiaEmptyState,
  StyledSubFilterContainer,
} from './BrandPower.styles';
import {
  BrandPowerSection,
  ImageriesSection,
  SalienceSection,
  Section,
} from './components';
import {
  ALL_BRANDS_VALUE,
  DEFAULT_AWARENESS_OPTION,
  powerKpiConfigs,
} from './constants';

export interface BrandPowerProps {
  dataTestId?: string;
}

export const BrandPower: React.FC<BrandPowerProps> = ({ dataTestId }) => {
  useDataRefreshForTab('Brand Analysis - Brand Power');
  const { formatMessage } = useIntl();
  const { applied, isGlobalZone } = usePageFilterApplied(
    BRAND_ANALYSIS_PAGE_NAME,
  );
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const [powerAwarenessSelected, setPowerAwarenessSelected] = useState(
    DEFAULT_AWARENESS_OPTION,
  );
  const [quarterYearSelected, setQuarterYearSelected] =
    useState<YearQuarter>('quarter');
  const { open: openModal } = useScopedModal(FILTER_MODAL_NAME);

  const headerTags = useMemo(() => {
    const date = lastDataRefreshKpisDate?.power;

    if (!date) return null;

    const refreshDateLabel = formatDateToQuarterYear(new Date(date), ' - ', 0);

    return [
      {
        text: `: ${refreshDateLabel}`,
        icon: CalendarClock,
      },
    ];
  }, [lastDataRefreshKpisDate]);

  const isIndia = useMemo(() => {
    return applied?.country === INDIA_COUNTRY_CODE;
  }, [applied]);
  const visibleBrandCompetitor = useMemo(() => {
    return applied?.brands_abi !== ALL_BRANDS_VALUE && applied !== null;
  }, [applied]);
  const showBrandSelection = useMemo(() => {
    return applied?.brands_abi === ALL_BRANDS_VALUE;
  }, [applied]);
  const shouldLoadPower = !isIndia;
  const shouldLoadDetails = !isIndia && !isGlobalZone && !showBrandSelection;

  const kpiConfig = powerKpiConfigs;
  const { responses: kpiResponses } = useBrandPowerRequests({
    quarterYearSelected,
    powerAwarenessSelected,
    enabled: {
      power: shouldLoadPower,
      details: shouldLoadDetails,
    },
  });

  const getDataTestId = (suffix: string) =>
    dataTestId ? `${dataTestId}-${suffix}` : undefined;

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.BrandPower.title',
          defaultMessage: 'Brand Power',
        }),
        tooltip: (
          <StyledTooltip size="small">
            {formatMessage({
              id: 'PortfolioBrand.BrandPower.tooltip',
              defaultMessage: '',
            })}
          </StyledTooltip>
        ),
        tags: headerTags,
        titleSize: 'H2',
        rightContent: (
          <StyledSubFilterContainer>
            {visibleBrandCompetitor && (
              <>
                <SubFilterBrandCompetitor />
                <StyledDividerContainer>
                  <Divider orientation="vertical" />
                </StyledDividerContainer>
              </>
            )}
            <CountryFlag />
          </StyledSubFilterContainer>
        ),
      }}
      dataTestId={dataTestId}
    >
      <StyledBrandPowerContainer>
        {isIndia ? (
          <BasicContainer
            header={{
              title: 'Power',
              titleSize: 'H3',
              measure: `[${formatMessage({
                id: powerKpiConfigs.power.measure,
                defaultMessage: '',
              })}]`,
              tooltip: (
                <StyledTooltip size="small">
                  {formatMessage({
                    id: powerKpiConfigs.power.tooltip.content,
                    defaultMessage: '',
                  })}
                </StyledTooltip>
              ),
            }}
            layout={{
              bodyPadding: false,
              shadow: 'large',
              border: 'none',
            }}
            dataTestId={getDataTestId('power-india')}
          >
            <StyledIndiaEmptyState>
              <NoDataYet />
            </StyledIndiaEmptyState>
          </BasicContainer>
        ) : (
          <>
            <BrandPowerSection
              kpisConfig={kpiConfig}
              kpiResponse={kpiResponses.power}
              quarterYearSelected={quarterYearSelected}
              setQuarterYearSelected={setQuarterYearSelected}
              dataTestId={getDataTestId('brand-power')}
            />
            {!isGlobalZone &&
              (showBrandSelection ? (
                <NoResultsState
                  type={'brandPower'}
                  openModal={openModal}
                  headerTitleId="PortfolioBrand.BrandPower.Empty.noBrandSelectedTitle"
                  descriptionId="PortfolioBrand.BrandPower.Empty.noBrandSelectedDescription"
                  buttonTextId="PortfolioBrand.BrandPower.Empty.selectACountry"
                />
              ) : (
                <>
                  <Section
                    name="meaning"
                    mainKpi={kpiConfig.meaning}
                    secondKpi={kpiConfig.affinity}
                    thirdKpi={kpiConfig.meetNeeds}
                    mainKpiResponse={kpiResponses.meaning}
                    secondKpiResponse={kpiResponses.affinity}
                    thirdKpiResponse={kpiResponses.meetNeeds}
                    quarterYearSelected={quarterYearSelected}
                    dataTestId={getDataTestId('meaning')}
                  />

                  <Section
                    name="difference"
                    mainKpi={kpiConfig.difference}
                    secondKpi={kpiConfig.dynamic}
                    thirdKpi={kpiConfig.unique}
                    mainKpiResponse={kpiResponses.difference}
                    secondKpiResponse={kpiResponses.dynamic}
                    thirdKpiResponse={kpiResponses.unique}
                    quarterYearSelected={quarterYearSelected}
                    dataTestId={getDataTestId('difference')}
                  />

                  <SalienceSection
                    kpisConfig={kpiConfig}
                    salienceKpiResponse={kpiResponses.salience}
                    occasionKpiResponse={kpiResponses.occasion}
                    powerAwarenessKpiResponses={{
                      unaided_awareness: kpiResponses.unaided_awareness,
                      brand_clarity: kpiResponses.brand_clarity,
                    }}
                    powerAwarenessSelected={powerAwarenessSelected}
                    onPowerAwarenessChange={setPowerAwarenessSelected}
                    quarterYearSelected={quarterYearSelected}
                    dataTestId={getDataTestId('salience')}
                  />

                  <ImageriesSection
                    quarterYearSelected={quarterYearSelected}
                    kpiConfig={kpiConfig}
                    imageriesKpiResponse={kpiResponses.imageries}
                    bipKpiResponse={kpiResponses.bip}
                    dataTestId={getDataTestId('imageries')}
                  />
                </>
              ))}
          </>
        )}
      </StyledBrandPowerContainer>
    </BasicContainer>
  );
};
