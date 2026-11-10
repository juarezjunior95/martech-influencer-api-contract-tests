interface ImageItem {
  src: string;
  alt: string;
}

interface GroupedImagesProps {
  images: ImageItem[];
  size?: number;
  dataTestId?: string;
}

export type { GroupedImagesProps, ImageItem };
