import { TooltipImage } from 'components';

export const ImgRenderer: React.FC<{
  src: string;
  name: string;
  dataTestId?: string;
}> = ({ src, name, dataTestId }) => {
  return (
    <TooltipImage
      src={src}
      name={name}
      width="auto"
      height="100%"
      dataTestId={dataTestId}
    />
  );
};
