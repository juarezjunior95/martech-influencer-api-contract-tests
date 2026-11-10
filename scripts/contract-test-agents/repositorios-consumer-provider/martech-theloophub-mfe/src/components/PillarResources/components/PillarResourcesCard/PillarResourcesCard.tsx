import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@hexa-ui/components2';
import { DocumentSigned, StarFilled, StarUnfilled } from '@hexa-ui/icons2';

import {
  StyledCardBody,
  StyledCardFooter,
  StyledCardHeader,
  StyledCardLink,
  StyledDescription,
  StyledFavoriteButton,
  StyledHeaderLeft,
  StyledIconContainer,
  StyledPillarLabel,
  StyledPillarResourcesCard,
  StyledTagsWrapper,
  StyledTitleContainer,
  StyledToolTitle,
  TagContainer,
} from './PillarResourcesCard.styles';
import { PillarResourcesCardProps } from './types';

const TAG_COLORS = [
  'black',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'mint',
  'cyan',
  'purple',
  'blue',
  'pink',
  'magenta',
  'brown',
] as const;

const icons = {
  'Learning Material': <Icon icon={DocumentSigned} size="large" />,
  SharePoint: <Icon icon={DocumentSigned} size="large" />,
};

type TagColor = (typeof TAG_COLORS)[number];

function isValidTagColor(hexaColor: string): hexaColor is TagColor {
  return (TAG_COLORS as readonly string[]).includes(hexaColor);
}

export const PillarResourcesCard = ({
  resource,
  pillar,
  icon,
  platformResourceTypes = [],
  onFavoriteClick,
}: PillarResourcesCardProps) => {
  const navigate = useNavigate();
  const {
    name,
    summary,
    mfeUrl,
    comingSoon,
    isUserFavorite,
    typesIds,
    openInNewTab,
    downloadUrl,
    downloadFileName,
  } = resource;

  const isDownload = Boolean(downloadUrl);

  const isExternalLink =
    !isDownload &&
    (mfeUrl.startsWith('http://') ||
      mfeUrl.startsWith('https://') ||
      mfeUrl.startsWith('//'));

  const shouldOpenInNewTab =
    !isDownload && (isExternalLink || Boolean(openInNewTab));

  const href = useMemo(() => {
    if (downloadUrl) return downloadUrl;
    if (isExternalLink) return mfeUrl;
    return mfeUrl.startsWith('/reports') || mfeUrl.startsWith('reports')
      ? mfeUrl.replace(/^\/?reports/, '')
      : mfeUrl;
  }, [mfeUrl, isExternalLink, downloadUrl]);

  const resourceTypeTags = platformResourceTypes.filter((type) =>
    typesIds.includes(type.id),
  );
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!comingSoon && onFavoriteClick) {
      onFavoriteClick(resource);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDownload) return;
    if (!shouldOpenInNewTab) {
      e.preventDefault();
      navigate(href);
    }
  };

  const cardElement = (
    <StyledPillarResourcesCard
      border="medium"
      elevated="minimal"
      disabled={comingSoon}
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      className="resource-card"
    >
      <StyledCardHeader>
        <StyledHeaderLeft>
          <StyledIconContainer
            highlighted={isHighlighted}
            data-testid="icon-container"
          >
            {icon && <Icon icon={icon} size="medium" />}
          </StyledIconContainer>
          <StyledTitleContainer>
            {pillar && (
              <StyledPillarLabel
                highlighted={isHighlighted}
                data-testid="pillar-label"
              >
                {pillar}
              </StyledPillarLabel>
            )}
            <StyledToolTitle size="H5" data-testid="tool-title">
              {name}
            </StyledToolTitle>
          </StyledTitleContainer>
        </StyledHeaderLeft>
        <StyledFavoriteButton
          onClick={handleFavoriteToggle}
          disabled={comingSoon}
          isFavorite={isUserFavorite}
          aria-label={
            isUserFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
          data-testid="favorite-button"
        >
          {isUserFavorite ? <StarFilled /> : <StarUnfilled />}
        </StyledFavoriteButton>
      </StyledCardHeader>

      <StyledCardBody>
        <StyledDescription data-testid="description">
          {summary}
        </StyledDescription>
      </StyledCardBody>

      <StyledCardFooter>
        <StyledTagsWrapper>
          {comingSoon && (
            <TagContainer
              color="brown"
              density="default"
              data-testid="coming-soon-tag"
            >
              Coming Soon
            </TagContainer>
          )}
          {resourceTypeTags.map((type) => {
            const color = isValidTagColor(type.hexaColor)
              ? type.hexaColor
              : 'black';
            const icon = icons[type.name];
            return (
              <TagContainer
                key={type.id}
                color={comingSoon ? 'brown' : color}
                density="default"
                data-testid={`resource-type-tag-${type.id}`}
                onColor={(!comingSoon && isHighlighted) || isHighlighted}
                clickable={false}
              >
                {icon} {type.name}
              </TagContainer>
            );
          })}
        </StyledTagsWrapper>
      </StyledCardFooter>
    </StyledPillarResourcesCard>
  );

  if (comingSoon) return cardElement;

  return (
    <StyledCardLink
      href={href}
      target={shouldOpenInNewTab ? '_blank' : undefined}
      rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
      download={isDownload ? (downloadFileName ?? '') : undefined}
      onClick={handleLinkClick}
    >
      {cardElement}
    </StyledCardLink>
  );
};
