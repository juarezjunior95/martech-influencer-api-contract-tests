import { Image } from '@hexa-ui/components';
import { TextDynamicTruncation } from 'components/TextDynamicTruncation';
import { useTruncationDetection } from 'hooks/useTruncationDetection';

import { BrandAvatarItemProps } from './interface';
import {
  StyledAvatarWrapper,
  StyledBrandAvatar,
  StyledBrandAvatarContainer,
  StyledFlagBadge,
  StyledSubtitle,
  StyledTitle,
  StyledTitleContainer,
} from './styles';

export const BrandAvatarItem = ({
  mainBrand,
  badgeFlag,
  title,
  description,
  dataTestId,
}: BrandAvatarItemProps) => {
  const { ref: titleContainerRef, isTruncated } =
    useTruncationDetection<HTMLDivElement>(title, {
      getElementToCheck: (refElement) =>
        refElement?.firstElementChild as HTMLElement,
    });

  return (
    <StyledBrandAvatarContainer
      title={isTruncated ? title : undefined}
      data-testid={dataTestId ? `brand-avatar-item-${dataTestId}` : undefined}
    >
      {mainBrand && (
        <StyledAvatarWrapper
          data-testid={
            dataTestId ? `brand-avatar-item-wrapper-${dataTestId}` : undefined
          }
        >
          <StyledBrandAvatar
            image={mainBrand.src}
            variantType="image"
            size="xlarge"
            data-testid={
              dataTestId ? `brand-avatar-item-image-${dataTestId}` : undefined
            }
          />
          {badgeFlag && (
            <StyledFlagBadge
              data-testid={
                dataTestId ? `brand-avatar-item-badge-${dataTestId}` : undefined
              }
            >
              <Image
                src={badgeFlag.src}
                alt={badgeFlag.alt}
                aspectRatio={1}
                data-testid={
                  dataTestId
                    ? `brand-avatar-item-badge-image-${dataTestId}`
                    : undefined
                }
              />
            </StyledFlagBadge>
          )}
        </StyledAvatarWrapper>
      )}
      <StyledTitleContainer
        ref={titleContainerRef}
        data-testid={
          dataTestId ? `brand-avatar-item-title-${dataTestId}` : undefined
        }
      >
        <TextDynamicTruncation
          Component={StyledTitle}
          dataTestId={dataTestId ? `${dataTestId}-title` : undefined}
        >
          {title}
        </TextDynamicTruncation>
        {description && (
          <TextDynamicTruncation
            Component={StyledSubtitle}
            dataTestId={dataTestId ? `${dataTestId}-description` : undefined}
          >
            {description}
          </TextDynamicTruncation>
        )}
      </StyledTitleContainer>
    </StyledBrandAvatarContainer>
  );
};
