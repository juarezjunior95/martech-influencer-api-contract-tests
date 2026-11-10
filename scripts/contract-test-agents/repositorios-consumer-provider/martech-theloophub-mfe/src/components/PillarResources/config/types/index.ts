import {
  PlatformPillar,
  PlatformResource,
  PlatformResourceTypeOption,
} from 'components/PillarResources/types';

interface StaticPlatformResource extends PlatformResource {
  reportVisibilityToggleKey?: string;
}

interface StaticPlatformResourcesData {
  platformPillars: PlatformPillar[];
  platformResources: StaticPlatformResource[];
  platformResourceTypes: PlatformResourceTypeOption[];
}

export type { StaticPlatformResource, StaticPlatformResourcesData };
