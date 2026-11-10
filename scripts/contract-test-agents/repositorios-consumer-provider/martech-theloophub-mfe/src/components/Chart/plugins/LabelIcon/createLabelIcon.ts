import worldIcon from '../../../../assets/icons/world.png';

let cachedImage: HTMLImageElement | null = null;
let imageLoaded = false;

const preloadImage = () => {
  if (!cachedImage) {
    cachedImage = new Image();
    cachedImage.onload = () => {
      imageLoaded = true;
    };
    cachedImage.src = worldIcon;
  }
};

preloadImage();

export const createLabelIcon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size = 8,
) => {
  const radius = size;

  ctx.save();

  if (imageLoaded && cachedImage) {
    const imgSize = radius * 2;
    const imgX = x - radius;
    const imgY = y - radius;

    ctx.drawImage(cachedImage, imgX, imgY, imgSize, imgSize);
  }

  ctx.restore();
};
