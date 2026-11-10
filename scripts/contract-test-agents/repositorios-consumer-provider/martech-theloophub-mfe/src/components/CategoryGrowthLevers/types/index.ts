import { GrowthLeversItemProps } from '../Components/GrowthLeversItem/interface';

export interface CategoryGrowthLeversProps {
  categoryTitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  showImage: boolean;
  items: Array<GrowthLeversItemProps>;
  dataTestId?: string;
}
