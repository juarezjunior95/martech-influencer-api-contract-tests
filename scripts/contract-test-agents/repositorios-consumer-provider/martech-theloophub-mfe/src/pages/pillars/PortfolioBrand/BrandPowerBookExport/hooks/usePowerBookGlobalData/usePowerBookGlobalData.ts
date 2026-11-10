import { useEffect, useMemo, useRef, useState } from 'react';

import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useStableBffResponse } from '../../utils';
import { useCategoryData } from '../useCategoryData/useCategoryData';

const useTopCountryContribution = (
  subFilters: Record<string, string>,
  enabled: boolean,
) =>
  useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.TOP_COUNTRY_CONTRIBUTION,
      kpiGroup: 'power',
      subFilters,
      skipRequest: !enabled,
    }),
  );

const useTrendPowerEvolution = (
  subFilters: Record<string, string>,
  enabled: boolean,
) =>
  useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.TREND_POWER_EVOLUTION,
      kpiGroup: 'power',
      subFilters,
      skipRequest: !enabled,
    }),
  );

const anyLoading = (
  enabled: boolean,
  responses: { loading: boolean }[],
): boolean => enabled && responses.some((r) => r.loading);

const firstError = (responses: { error: Error | null }[]): Error | null =>
  responses.map((r) => r.error).find(Boolean) ?? null;

export const usePowerBookGlobalData = () => {
  const [wave, setWave] = useState<1 | 2 | 3>(1);

  const wave1Enabled = wave >= 1;
  const wave2Enabled = wave >= 2;
  const wave3Enabled = wave >= 3;

  const dataGlobal = useCategoryData('All', wave1Enabled);
  const dataMegabrands = useCategoryData('Megabrands', wave1Enabled);

  const dataMainstream = useCategoryData('Mainstream', wave2Enabled);
  const dataCore = useCategoryData('Core+', wave2Enabled);
  const dataPremiumization = useCategoryData('Premiumization', wave2Enabled);
  const dataExpansion = useCategoryData('Expansion', wave2Enabled);
  const dataSustain = useCategoryData('Sustain', wave2Enabled);
  const dataTail = useCategoryData('Tail', wave2Enabled);

  const dataGlobalBrands = useCategoryData('All Global Brands', wave3Enabled);
  const dataCorona = useCategoryData('Corona', wave3Enabled);
  const dataBudweiser = useCategoryData('Budweiser', wave3Enabled);
  const dataMichelobUltra = useCategoryData('Michelob Ultra', wave3Enabled);
  const dataStellaArtois = useCategoryData('Stella Artois', wave3Enabled);
  const dataHeineken = useCategoryData('Heineken', wave3Enabled);

  const topCountryContributionDataGlobal = useTopCountryContribution(
    { page_filter: 'All' },
    wave1Enabled,
  );
  const topCountryContributionDataMegabrands = useTopCountryContribution(
    { page_filter: 'Megabrands', scope: 'Megabrands' },
    wave1Enabled,
  );

  const trendPowerEvolutionDataGlobal = useTrendPowerEvolution(
    { page_filter: 'All' },
    wave1Enabled,
  );
  const trendPowerEvolutionDataMegabrands = useTrendPowerEvolution(
    { page_filter: 'Megabrands', scope: 'Megabrands' },
    wave1Enabled,
  );

  const wave1Responses = [
    dataGlobal,
    dataMegabrands,
    topCountryContributionDataGlobal,
    topCountryContributionDataMegabrands,
    trendPowerEvolutionDataGlobal,
    trendPowerEvolutionDataMegabrands,
  ];
  const wave2Responses = [
    dataMainstream,
    dataCore,
    dataPremiumization,
    dataExpansion,
    dataSustain,
    dataTail,
  ];
  const wave3Responses = [
    dataGlobalBrands,
    dataCorona,
    dataBudweiser,
    dataMichelobUltra,
    dataStellaArtois,
    dataHeineken,
  ];

  const wave1Loading = anyLoading(wave1Enabled, wave1Responses);
  const wave2Loading = anyLoading(wave2Enabled, wave2Responses);
  const wave3Loading = anyLoading(wave3Enabled, wave3Responses);

  useEffect(() => {
    if (wave === 1 && !wave1Loading) {
      setWave(2);
    }
  }, [wave, wave1Loading]);

  useEffect(() => {
    if (wave === 2 && !wave2Loading) {
      setWave(3);
    }
  }, [wave, wave2Loading]);

  const contribution = useMemo(
    () => ({
      megabrands: topCountryContributionDataMegabrands,
      global: topCountryContributionDataGlobal,
    }),
    [topCountryContributionDataMegabrands, topCountryContributionDataGlobal],
  );

  const trendPowerEvolution = useMemo(
    () => ({
      global: trendPowerEvolutionDataGlobal,
      megabrands: trendPowerEvolutionDataMegabrands,
    }),
    [trendPowerEvolutionDataGlobal, trendPowerEvolutionDataMegabrands],
  );

  const globalData = useMemo(
    () => ({
      global: dataGlobal,
      megabrands: dataMegabrands,
      mainstream: dataMainstream,
      core: dataCore,
      premiumization: dataPremiumization,
      expansion: dataExpansion,
      sustain: dataSustain,
      tail: dataTail,
      globalBrands: dataGlobalBrands,
      corona: dataCorona,
      budweiser: dataBudweiser,
      michelobUltra: dataMichelobUltra,
      stellaArtois: dataStellaArtois,
      heineken: dataHeineken,
      contribution: contribution,
      trendPowerEvolutionData: trendPowerEvolution,
    }),
    [
      dataGlobal,
      dataMegabrands,
      dataMainstream,
      dataCore,
      dataPremiumization,
      dataExpansion,
      dataSustain,
      dataTail,
      dataGlobalBrands,
      dataCorona,
      dataBudweiser,
      dataMichelobUltra,
      dataStellaArtois,
      dataHeineken,
      contribution,
      trendPowerEvolution,
    ],
  );

  const loading = wave1Loading || wave2Loading || wave3Loading;

  const error = firstError([
    ...wave1Responses,
    ...wave2Responses,
    ...wave3Responses,
  ]);

  const startTimeRef = useRef<number>(performance.now());
  const wave1EndRef = useRef<number | null>(null);
  const wave2EndRef = useRef<number | null>(null);
  const totalEndRef = useRef<number | null>(null);

  const [loadDurationMs, setLoadDurationMs] = useState<number | null>(null);

  useEffect(() => {
    if (!wave1Loading && wave1EndRef.current === null) {
      wave1EndRef.current = performance.now();
    }
  }, [wave1Loading]);

  useEffect(() => {
    if (
      wave2Enabled &&
      !wave2Loading &&
      wave1EndRef.current !== null &&
      wave2EndRef.current === null
    ) {
      wave2EndRef.current = performance.now();
    }
  }, [wave2Enabled, wave2Loading]);

  useEffect(() => {
    if (!loading && totalEndRef.current === null) {
      totalEndRef.current = performance.now();
      const total = totalEndRef.current - startTimeRef.current;

      setLoadDurationMs(total);
    }
  }, [loading]);

  return {
    globalData,
    loading,
    error,
    loadDurationMs,
  };
};
