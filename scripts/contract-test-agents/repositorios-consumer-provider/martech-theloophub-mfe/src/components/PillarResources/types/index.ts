export interface PlatformResource {
  id: number;
  name: string;
  summary: string;
  mfeUrl: string;
  pillarsIds: number[];
  typesIds: number[];
  comingSoon: boolean | null;
  subPillar: string | null;
  options: unknown[];
  isUserFavorite: boolean;
  openInNewTab?: boolean;
  downloadUrl?: string;
  downloadFileName?: string;
}

export interface PlatformPillar {
  id: number;
  name: string;
  description: string;
  hexaIcon: string;
  resourcesIds: number[];
}

export interface PlatformResourceTypeOption {
  id: number;
  name: string;
  hexaColor: string;
}

export interface PlatformResourcesResponse {
  platformPillars: PlatformPillar[];
  platformResources: PlatformResource[];
  platformResourceTypes: PlatformResourceTypeOption[];
}

export interface PillarResourcesProps {
  pillar: string;
}
