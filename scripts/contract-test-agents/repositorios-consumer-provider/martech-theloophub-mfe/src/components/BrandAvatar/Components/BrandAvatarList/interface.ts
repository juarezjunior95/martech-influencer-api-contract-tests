import { BrandAvatarItemProps } from '../BrandAvatarItem/interface';

export interface BrandAvatarListProps {
  data: BrandAvatarItemProps[];
  length: number;
  borderConfig?: {
    marginLeft?: number;
    marginRight?: number;
  };
  gridConfig?: {
    paddingLeft?: number;
    paddingRight?: number;
  };
  maxWidth?: string;
  dataTestId?: string;
}
