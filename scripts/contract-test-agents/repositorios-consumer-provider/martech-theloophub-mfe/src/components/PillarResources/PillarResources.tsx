import { FormEvent, useMemo, useState } from 'react';

import { Chip } from '@hexa-ui/components';
import { Check, StarUnfilled } from '@hexa-ui/icons2';
import ArrowDown from 'assets/icons/arrow-down.svg';
import FilterIcon from 'assets/icons/filters.svg';
import { BasicContainer } from 'components/BasicContainer';
import { Skeleton } from 'components/Skeleton';
import { useMediaQuery, useMultiplesFeatureToggles } from 'hooks';

import { PillarResourcesCard } from './components/PillarResourcesCard';
import {
  type OrderByOption,
  PillarResourcesFilterModal,
} from './components/PillarResourcesFilterModal';
import {
  PLATFORM_RESOURCE_TYPE_NAMES,
  REPORT_VISIBILITY_TOGGLE_KEYS,
  RESOURCE_ID_TO_TOGGLE_KEY,
} from './config/platformResourcesData';
import { useFavoriteIds, usePlatformResources } from './hooks';
import { platformResourceIcons } from './icons';
import * as S from './PillarResources.styles';
import { PillarResourcesProps, PlatformResource } from './types';

export const PillarResources = ({ pillar }: PillarResourcesProps) => {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFavoritesSelected, setIsFavoritesSelected] = useState(false);
  const [orderBy, setOrderBy] = useState<OrderByOption>('a-z');
  const { favoriteIds, toggle } = useFavoriteIds();
  const { data } = usePlatformResources(favoriteIds);
  const { featuresListByToggleName, togglesReady } = useMultiplesFeatureToggles(
    REPORT_VISIBILITY_TOGGLE_KEYS,
  );

  const { resources, icon, platformResourceTypes, hasGatedReports } =
    useMemo(() => {
      const { platformPillars, platformResources, platformResourceTypes } =
        data;

      const currentPillar = platformPillars.find(
        (p) => p.name.toLowerCase().trim() === pillar.toLowerCase().trim(),
      );

      if (!currentPillar) {
        return {
          resources: [],
          icon: undefined,
          platformResourceTypes,
          hasGatedReports: false,
        };
      }

      const reportTypeId = platformResourceTypes.find(
        (type) => type.name === PLATFORM_RESOURCE_TYPE_NAMES.report,
      )?.id;

      const pillarResources = platformResources.filter((resource) =>
        resource.pillarsIds.includes(currentPillar.id),
      );

      const hasGatedReports = pillarResources.some((resource) => {
        const toggleKey = RESOURCE_ID_TO_TOGGLE_KEY[resource.id];
        return (
          reportTypeId !== undefined &&
          resource.typesIds.includes(reportTypeId) &&
          Boolean(toggleKey)
        );
      });

      const filtered = pillarResources.filter((resource) => {
        const toggleKey = RESOURCE_ID_TO_TOGGLE_KEY[resource.id];
        const isReport =
          reportTypeId !== undefined &&
          resource.typesIds.includes(reportTypeId);
        if (!isReport || !toggleKey) return true;
        return Boolean(featuresListByToggleName[toggleKey]);
      });

      const pillarIcon = platformResourceIcons.find(
        (iconItem) => iconItem.id === currentPillar.hexaIcon,
      )?.icon;

      return {
        resources: filtered,
        icon: pillarIcon,
        platformResourceTypes,
        hasGatedReports,
      };
    }, [data, pillar, featuresListByToggleName]);

  const isLoading = hasGatedReports && !togglesReady;

  const displayedResources = useMemo(
    () =>
      isFavoritesSelected
        ? resources.filter((resource) => resource.isUserFavorite)
        : resources,
    [resources, isFavoritesSelected],
  );

  const searchFilteredResources = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return displayedResources;
    return displayedResources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(term) ||
        String(resource.id).includes(searchValue.trim()),
    );
  }, [displayedResources, searchValue]);

  const orderedResources = useMemo(() => {
    const list = [...searchFilteredResources];
    list.sort((a, b) => {
      const aComingSoon = a.comingSoon ? 1 : 0;
      const bComingSoon = b.comingSoon ? 1 : 0;
      if (aComingSoon !== bComingSoon) return aComingSoon - bComingSoon;
      if (orderBy === 'a-z') {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      }
      return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
    });
    return list;
  }, [searchFilteredResources, orderBy]);

  const showNoFavoritesFound =
    !isLoading && isFavoritesSelected && displayedResources.length === 0;

  const showNoResultsFound =
    !isLoading && !showNoFavoritesFound && orderedResources.length === 0;

  const handleSearch = (event: FormEvent<HTMLInputElement>) => {
    setSearchValue((event.target as HTMLInputElement).value);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleSetFilter = (newOrderBy: OrderByOption) => {
    setOrderBy(newOrderBy);
    setIsFilterOpen(false);
  };

  const handleFavoriteToggle = (resource: PlatformResource) => {
    toggle(resource.id, resource.isUserFavorite);
  };

  let skeletonWidth = '248px';
  if (isDesktopLarge) skeletonWidth = '288px';
  if (isDesktopXLarge) skeletonWidth = '335px';

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <Skeleton
        hasContainer={false}
        height="164px"
        width={skeletonWidth}
        length={4}
        borderRadius="large"
      />
    );
  } else if (showNoFavoritesFound) {
    content = (
      <S.StyledNoFavoritesFound size="H3" data-testid="no-favorites-found">
        No favorites found
      </S.StyledNoFavoritesFound>
    );
  } else if (showNoResultsFound) {
    content = (
      <S.StyledNoResultsFound size="H3" data-testid="no-results-found">
        No results found
      </S.StyledNoResultsFound>
    );
  } else {
    content = orderedResources.map((resource) => (
      <PillarResourcesCard
        key={resource.id}
        resource={resource}
        pillar={pillar}
        icon={icon}
        platformResourceTypes={platformResourceTypes}
        onFavoriteClick={handleFavoriteToggle}
      />
    ));
  }

  const renderChipIcon = () => {
    return isFavoritesSelected ? <Check /> : <StarUnfilled />;
  };

  return (
    <BasicContainer
      header={{
        title: 'Pillar Resources',
        titleSize: isDesktopLarge ? 'H2' : 'H3',
      }}
      layout={{ bodyPadding: false, background: '#fafafa', border: 'gray' }}
    >
      <S.StyledPillarResourcesContainer>
        <S.StyledPillarResourcesActions>
          <S.StyledPillarResourcesSearch
            placeholder="Search"
            size="medium"
            onChange={handleSearch}
            onClear={handleClear}
            value={searchValue}
          />

          <S.PillarResourcesFilterButton
            selected={isFilterOpen}
            onClick={handleFilterOpen}
          >
            <S.PillarResourcesFilterLabel size="basis">
              <img src={FilterIcon} alt="Filter" />
              {' Filter '}
              <img src={ArrowDown} alt="Down Chevron" />
            </S.PillarResourcesFilterLabel>
          </S.PillarResourcesFilterButton>

          <S.PillarResourcesFilterButton
            selected={isFavoritesSelected}
            onClick={() => setIsFavoritesSelected((state) => !state)}
          >
            <Chip.Icon icon={renderChipIcon} />
            <S.PillarResourcesFilterLabel size="basis">
              Favorites
            </S.PillarResourcesFilterLabel>
          </S.PillarResourcesFilterButton>
        </S.StyledPillarResourcesActions>

        <S.StyledPillarResourcesContent>
          {content}
        </S.StyledPillarResourcesContent>
      </S.StyledPillarResourcesContainer>

      <PillarResourcesFilterModal
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        orderBy={orderBy}
        onSetFilter={handleSetFilter}
      />
    </BasicContainer>
  );
};
