import { Paragraph } from '@hexa-ui/components';
import { ColDef } from 'ag-grid-community';
import { TextDynamicTruncation } from 'components';

import {
  BrandImgBox,
  LeftImage,
  LeftImgBox,
  LeftImgComponent,
  TruncatedText,
} from './ImgWithLabel.styles';

interface ImgWithLabelProps {
  dataTestId?: string;
  value: string | number;
  img: string;
  variant?: 'country' | 'brand';
  colDef?: ColDef;
}

export const ImgWithLabel: React.FC<ImgWithLabelProps> = ({
  dataTestId,
  value,
  img,
  variant = 'country',
  colDef,
}) => {
  const stringValue = String(value);
  const isBrandColumn = colDef?.field === 'brand';
  const ImgContainer = variant === 'brand' ? BrandImgBox : LeftImgBox;

  return (
    <LeftImgComponent
      data-testid={dataTestId ? `img-with-label-${dataTestId}` : undefined}
    >
      <ImgContainer>
        <LeftImage
          data-testid={
            dataTestId ? `img-with-label-img-${dataTestId}` : undefined
          }
          src={img}
          alt={
            variant === 'brand' ? `${stringValue} logo` : `Flag ${stringValue}`
          }
          variant={variant}
        />
      </ImgContainer>

      <TextDynamicTruncation
        dataTestId={
          dataTestId
            ? `${dataTestId}-img-with-label-text-dynamic-truncation`
            : undefined
        }
        size="small"
        shouldTruncate={isBrandColumn}
        Component={isBrandColumn ? TruncatedText : Paragraph}
      >
        {stringValue}
      </TextDynamicTruncation>
    </LeftImgComponent>
  );
};
