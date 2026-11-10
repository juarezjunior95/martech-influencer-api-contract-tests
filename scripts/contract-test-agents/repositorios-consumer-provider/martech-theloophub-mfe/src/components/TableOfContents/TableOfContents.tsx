import React from 'react';

import { createDataTestId } from 'utils/test/createDataTestId';

import {
  StyledCard,
  StyledCardHeader,
  StyledCardHeaderLeft,
  StyledCardSubItem,
  StyledCardSubItems,
  StyledContainer,
  StyledContent,
  StyledDivider,
  StyledFlag,
  StyledGrid,
  StyledIconWrapper,
  StyledItemDescription,
  StyledItemHeader,
  StyledItemPage,
  StyledItemTitle,
  StyledStacked,
  StyledStackedItem,
  StyledSubItemLabel,
  StyledTitle,
} from './TableOfContents.styles';

export interface TocSubItem {
  label: string;
  page: number;
}

export interface TocItem {
  title: string;
  description?: string;
  page: number;
  icon?: React.ReactNode;
  countryImageUrl?: string;
  countryCode?: string;
  countryName?: string;
  subItems?: TocSubItem[];
}

export type TocGroupLayout = 'stacked' | 'grid';

export interface TocGroup {
  layout?: TocGroupLayout;
  columns?: number;
  items: TocItem[];
}

export interface TableOfContentsProps {
  title?: string;
  groups: TocGroup[];
  dataTestId?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  title = 'Table of Contents',
  groups,
  dataTestId,
}) => {
  const renderFlag = (item: TocItem, idPrefix: string) => {
    const flagImageUrl = item.countryImageUrl || '';
    if (!flagImageUrl) return null;
    return (
      <StyledFlag
        src={flagImageUrl}
        alt={`${item.countryName ?? item.countryCode ?? 'Country'} flag`}
        data-testid={createDataTestId(dataTestId, `${idPrefix}-flag`)}
      />
    );
  };

  const renderIcon = (item: TocItem, idPrefix: string) => {
    if (!item.icon) return null;
    return (
      <StyledIconWrapper
        data-testid={createDataTestId(dataTestId, `${idPrefix}-icon`)}
      >
        {item.icon}
      </StyledIconWrapper>
    );
  };

  const renderStackedItem = (item: TocItem, groupIdx: number, idx: number) => {
    const idPrefix = `stacked-${groupIdx}-${idx}`;
    return (
      <StyledStackedItem
        key={idPrefix}
        data-testid={createDataTestId(dataTestId, idPrefix)}
      >
        <StyledItemHeader>
          {renderIcon(item, idPrefix)}
          {renderFlag(item, idPrefix)}
          <StyledItemTitle
            data-testid={createDataTestId(dataTestId, `${idPrefix}-title`)}
          >
            {item.title}
          </StyledItemTitle>
          {item.description && (
            <StyledItemDescription
              data-testid={createDataTestId(
                dataTestId,
                `${idPrefix}-description`,
              )}
            >
              {item.description}
            </StyledItemDescription>
          )}
        </StyledItemHeader>
        <StyledItemPage
          data-testid={createDataTestId(dataTestId, `${idPrefix}-page`)}
        >
          {item.page}
        </StyledItemPage>
      </StyledStackedItem>
    );
  };

  const renderGridCard = (item: TocItem, groupIdx: number, idx: number) => {
    const idPrefix = `card-${groupIdx}-${idx}`;
    const subItems = item.subItems ?? [];
    return (
      <StyledCard
        key={idPrefix}
        data-testid={createDataTestId(dataTestId, idPrefix)}
      >
        <StyledCardHeader>
          <StyledCardHeaderLeft>
            {renderIcon(item, idPrefix)}
            {renderFlag(item, idPrefix)}
            <StyledItemTitle
              data-testid={createDataTestId(dataTestId, `${idPrefix}-title`)}
            >
              {item.title}
            </StyledItemTitle>
          </StyledCardHeaderLeft>
          <StyledItemPage
            data-testid={createDataTestId(dataTestId, `${idPrefix}-page`)}
          >
            {item.page}
          </StyledItemPage>
        </StyledCardHeader>
        <StyledDivider />
        <StyledCardSubItems>
          {subItems.map((sub, subIdx) => {
            const subId = `${idPrefix}-sub-${subIdx}`;
            return (
              <StyledCardSubItem
                key={subId}
                data-testid={createDataTestId(dataTestId, subId)}
              >
                <StyledSubItemLabel
                  data-testid={createDataTestId(dataTestId, `${subId}-label`)}
                >
                  {sub.label}
                </StyledSubItemLabel>
                <StyledItemPage
                  data-testid={createDataTestId(dataTestId, `${subId}-page`)}
                >
                  {sub.page}
                </StyledItemPage>
              </StyledCardSubItem>
            );
          })}
        </StyledCardSubItems>
      </StyledCard>
    );
  };

  const renderGroup = (group: TocGroup, groupIdx: number) => {
    const layout: TocGroupLayout = group.layout ?? 'stacked';

    if (layout === 'grid') {
      const columns = group.columns ?? 4;
      return (
        <StyledGrid
          key={`group-${groupIdx}`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          data-testid={createDataTestId(dataTestId, `group-grid-${groupIdx}`)}
        >
          {group.items.map((item, idx) => renderGridCard(item, groupIdx, idx))}
        </StyledGrid>
      );
    }

    return (
      <StyledStacked
        key={`group-${groupIdx}`}
        data-testid={createDataTestId(dataTestId, `group-stacked-${groupIdx}`)}
      >
        {group.items.map((item, idx) => (
          <React.Fragment key={`stacked-${groupIdx}-${idx}`}>
            {renderStackedItem(item, groupIdx, idx)}
            {idx === 0 && group.items.length > 1 && <StyledDivider />}
          </React.Fragment>
        ))}
      </StyledStacked>
    );
  };

  return (
    <StyledContainer data-testid={dataTestId}>
      <StyledContent>
        <StyledTitle data-testid={createDataTestId(dataTestId, 'title')}>
          {title}
        </StyledTitle>
        {groups.map((group, groupIdx) => renderGroup(group, groupIdx))}
      </StyledContent>
    </StyledContainer>
  );
};
