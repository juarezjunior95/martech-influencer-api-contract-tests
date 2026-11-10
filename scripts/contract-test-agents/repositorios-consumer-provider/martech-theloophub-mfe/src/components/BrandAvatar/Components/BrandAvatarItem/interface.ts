type Image = {
  src: string;
  alt: string;
};

export interface BrandAvatarItemProps {
  mainBrand?: Image;
  badgeFlag?: Image;
  title: string;
  description?: string;
  dataTestId?: string;
}
