import { Image } from '@hexa-ui/components';

import {
  CategoryTitle,
  GrowthLeversContainer,
  ImageContainer,
  LeftContainer,
  RightContainer,
  StyledCategoryGrowthLeversCard,
} from './CategoryGrowthLevers.styles';
import { GrowthLeversItem } from './Components/GrowthLeversItem';
import { CategoryGrowthLeversProps } from './types';

export const CategoryGrowthLevers = ({
  showImage,
  image,
  categoryTitle,
  items,
  dataTestId,
}: CategoryGrowthLeversProps) => {
  const getTestId = (suffix: string) =>
    dataTestId ? `${dataTestId}-${suffix}` : undefined;

  const renderLeftContainer = () => {
    if (showImage && image?.src) {
      return (
        <>
          <ImageContainer data-testid={getTestId('image-container')}>
            <Image
              data-testid={getTestId('image')}
              src={image.src}
              variant="fit"
              aspectRatio={49 / 52}
              width="80px"
              alt={image?.alt}
            />
          </ImageContainer>
          <CategoryTitle data-testid={getTestId('category-title')} size="H5">
            {categoryTitle}
          </CategoryTitle>
        </>
      );
    }

    return items.map((item, index) => (
      <GrowthLeversItem
        key={`${item?.cardTitle}_${index}`}
        cardTitle={item.cardTitle}
        dataTestId={getTestId(`item-${index}`)}
      />
    ));
  };

  const renderFiveItemsLayout = () => {
    const [first, second, third, fourth, fifth] = items;

    return (
      <>
        <GrowthLeversContainer
          data-testid={getTestId('container-0')}
          borderBottom
        >
          <GrowthLeversItem {...first} dataTestId={getTestId('item-0')} />
        </GrowthLeversContainer>
        <GrowthLeversContainer
          data-testid={getTestId('container-1')}
          borderBottom
        >
          <GrowthLeversContainer
            data-testid={getTestId('container-1-left')}
            borderRight
          >
            <GrowthLeversItem {...second} dataTestId={getTestId('item-1')} />
          </GrowthLeversContainer>
          <GrowthLeversItem {...third} dataTestId={getTestId('item-2')} />
        </GrowthLeversContainer>
        <GrowthLeversContainer data-testid={getTestId('container-2')}>
          <GrowthLeversContainer
            data-testid={getTestId('container-2-left')}
            borderRight
          >
            <GrowthLeversItem {...fourth} dataTestId={getTestId('item-3')} />
          </GrowthLeversContainer>
          <GrowthLeversItem {...fifth} dataTestId={getTestId('item-4')} />
        </GrowthLeversContainer>
      </>
    );
  };

  const renderRightContainer = () => {
    if (items.length === 5) {
      return renderFiveItemsLayout();
    }

    return items.map((item, index) => (
      <GrowthLeversItem
        key={`${item.growthLeversNumber?.value}_${index}`}
        {...item}
        dataTestId={getTestId(`item-${index}`)}
      />
    ));
  };

  return (
    <StyledCategoryGrowthLeversCard
      data-testid={dataTestId}
      border="medium"
      elevated="medium"
    >
      <LeftContainer data-testid={getTestId('left')} showImage>
        {renderLeftContainer()}
      </LeftContainer>
      <RightContainer data-testid={getTestId('right')}>
        {renderRightContainer()}
      </RightContainer>
    </StyledCategoryGrowthLeversCard>
  );
};
