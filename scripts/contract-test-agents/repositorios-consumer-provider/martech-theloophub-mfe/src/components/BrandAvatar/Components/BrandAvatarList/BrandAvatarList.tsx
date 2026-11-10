import { BrandAvatarItem } from '../BrandAvatarItem';
import { StyledBrandListContainer } from './BrandAvatarList.tsx.styles';
import { BrandAvatarListProps } from './interface';

export const BrandAvatarList = ({
  data,
  length,
  borderConfig,
  gridConfig,
  dataTestId,
}: BrandAvatarListProps) => {
  const defaultBorderConfig = {
    marginLeft: 0,
    marginRight: 0,
  };

  const defaultGridConfig = {
    paddingLeft: 8,
    paddingRight: 8,
  };

  const appliedBorderConfig = { ...defaultBorderConfig, ...borderConfig };
  const appliedGridConfig = { ...defaultGridConfig, ...gridConfig };

  return (
    <StyledBrandListContainer
      data-testid={dataTestId ? `brand-avatar-list-${dataTestId}` : undefined}
      style={{
        gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))`,
        ...appliedBorderConfig,
        ...appliedGridConfig,
      }}
    >
      {data.map((item, index) => (
        <BrandAvatarItem
          key={`${item.title}_${index}`}
          {...item}
          dataTestId={dataTestId ? `${dataTestId}-item-${index}` : undefined}
        />
      ))}
    </StyledBrandListContainer>
  );
};
