import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';

import { NewInnovationContent, OldInnovationContent } from './components';
import { useInnovationHomePageData } from './hooks/useInnovationHomePageData';
import { isInnovationHomeToggleOn } from './utils/innovationHomeToggleUtils';

export const InnovationHome = () => {
  const innovationHomeContentToggle = useFeatureToggle(
    featureToggles.pillar.innovation.innovation_home_content,
  );
  const innovationHomeNewPageExperienceToggle = useFeatureToggle(
    featureToggles.pillar.innovation.innovation_home_new_page_experience,
  );

  const pageDataBundle = useInnovationHomePageData();

  const isNewInnovationEnabled =
    isInnovationHomeToggleOn(innovationHomeContentToggle) &&
    isInnovationHomeToggleOn(innovationHomeNewPageExperienceToggle);

  const experienceToggles = {
    innovationHomeContentToggle,
    innovationHomeNewPageExperienceToggle,
  };

  return isNewInnovationEnabled ? (
    <NewInnovationContent
      innovationHomeContentToggle={innovationHomeContentToggle}
      {...pageDataBundle}
    />
  ) : (
    <OldInnovationContent {...experienceToggles} {...pageDataBundle} />
  );
};
