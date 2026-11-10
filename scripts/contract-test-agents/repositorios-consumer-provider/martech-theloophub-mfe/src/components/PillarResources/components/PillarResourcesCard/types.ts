import { PlatformResource, PlatformResourceTypeOption } from '../../types';

export interface PillarResourcesCardProps {
  resource: PlatformResource;
  pillar?: string;
  platformResourceTypes?: PlatformResourceTypeOption[];
  icon?: React.FunctionComponent;
  onFavoriteClick?: (resource: PlatformResource) => void;
}
