import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ExploreFurther } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';

import { COMMERCIAL_RESULTS_PAGE_NAME } from '../../../constants';

export const ExploreFurtherSection = () => {
  const { formatMessage } = useIntl();
  const [performanceToolEnabled, performanceToolLoading] = useFeatureToggle(
    featureToggles.pillar.valueCreation.submenus.performanceTool.id,
  );

  const isPerformanceToolEnabled = useMemo(() => {
    return performanceToolEnabled && !performanceToolLoading;
  }, [performanceToolEnabled, performanceToolLoading]);

  const exploreFurtherCards = useMemo(() => {
    return ['financialData', 'driversDecomposition'].map((card) => {
      return {
        title: formatMessage({
          id: `ValueCreation.CommercialResults.exploreFurther.${card}.title`,
        }),
        description: formatMessage({
          id: `ValueCreation.CommercialResults.exploreFurther.${card}.description`,
        }),
        linkLabel: formatMessage({
          id: `ValueCreation.CommercialResults.exploreFurther.${card}.linkLabel`,
        }),
        linkHref: formatMessage({
          id: `ValueCreation.CommercialResults.exploreFurther.${card}.linkHref`,
        }),
        abbreviation: formatMessage({
          id: `ValueCreation.CommercialResults.exploreFurther.${card}.abbreviation`,
        }),
        enabled: card === 'financialData' ? isPerformanceToolEnabled : false,
      };
    });
  }, [formatMessage, isPerformanceToolEnabled]);

  if (!isPerformanceToolEnabled) {
    return null;
  }

  return (
    <ExploreFurther
      filterPageName={COMMERCIAL_RESULTS_PAGE_NAME}
      dataTestId={COMMERCIAL_RESULTS_PAGE_NAME}
      cards={exploreFurtherCards}
    />
  );
};
