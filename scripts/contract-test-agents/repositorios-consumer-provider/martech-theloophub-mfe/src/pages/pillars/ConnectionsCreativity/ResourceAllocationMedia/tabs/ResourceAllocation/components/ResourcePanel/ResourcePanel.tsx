import React, { useEffect, useRef, useState } from 'react';
import { IntlFormatters } from 'react-intl';

import { Radio } from '@hexa-ui/components';
import { Legend } from 'components';
import { CaptionItem } from 'components/Chart/components/Legend/Legend';
import { Expandable } from 'components/Expandable';
import NoDataYet from 'components/NoDataYet/NoDataYet';
import { FilterOption } from 'models/Filters';

import { caption, radioOptions } from '../../constants';
import { ResourceAllocationData } from '../../types';

import { ChartsArea, MultipleSkeletonLoader, ResourceHeader } from '..';

import {
  StyledLegendRow,
  StyledPanelContainer,
  StyledPanelNoDataYet,
  StyledPanelRadios,
} from './ResourcePanel.styles';

const OVERFLOW_HEIGHT_THRESHOLD = 1100;

interface ResourcePanelProps {
  content: ResourceAllocationData;
  kpiFilters: string;
  loading: boolean;
  formatMessage: IntlFormatters['formatMessage'];
  kpiFilter: string;
  handleKpiFilterChange: (value: string) => void;
  comparisonFilter?: {
    options: FilterOption[];
    value: string[];
    onChange: (values: string[]) => void;
  };
  selectedComparisons?: string[] | null;
  hoverable?: boolean;
  isGlobalZone?: boolean;
  pinnedLabel?: string | null;
  onCountryClick?: (country: string) => void;
  dataTestId?: string;
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({
  content,
  formatMessage,
  kpiFilters,
  loading,
  kpiFilter,
  handleKpiFilterChange,
  comparisonFilter,
  selectedComparisons,
  hoverable,
  isGlobalZone,
  pinnedLabel,
  onCountryClick,
  dataTestId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollActive, setIsScrollActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsScrollActive(entry.contentRect.height >= OVERFLOW_HEIGHT_THRESHOLD);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Expandable.Item
      dataTestId={dataTestId ? `${dataTestId}-resource-panel` : undefined}
      id="mpc"
      expand="none"
      minHeaderHeight="48px"
      expandedHeaderHeight="75px"
      showBorder={false}
      border="small"
      elevated="minimal"
      headerCustomized={
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={comparisonFilter}
          dataTestId={
            dataTestId ? `${dataTestId}-resource-panel-header` : undefined
          }
        />
      }
      expandableChildren={
        <StyledPanelContainer
          ref={containerRef}
          $scrollActive={isScrollActive}
          data-testid={
            dataTestId ? `${dataTestId}-resource-panel-container` : undefined
          }
        >
          <StyledPanelRadios
            data-testid={
              dataTestId ? `${dataTestId}-resource-panel-radios` : undefined
            }
          >
            <Radio.Root
              css={{ display: 'flex', gap: '16px', width: 'max-content' }}
              defaultValue={kpiFilter}
              onValueChange={handleKpiFilterChange}
              data-testid={
                dataTestId
                  ? `${dataTestId}-resource-panel-radio-root`
                  : undefined
              }
            >
              {radioOptions.kpiFilter.values.map((option) => (
                <Radio.Item
                  key={option.value}
                  id={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Radio.Root>

            {!content?.empty && !loading && (
              <StyledLegendRow $scrollActive={isScrollActive}>
                <Legend
                  caption={caption as CaptionItem[]}
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-resource-panel-legend`
                      : undefined
                  }
                />
              </StyledLegendRow>
            )}
          </StyledPanelRadios>

          {loading && (
            <MultipleSkeletonLoader
              dataTestId={
                dataTestId ? `${dataTestId}-resource-panel-skeleton` : undefined
              }
            />
          )}
          {!loading && (
            <>
              {content && !content?.empty && (
                <ChartsArea
                  kpiFilters={kpiFilters}
                  content={content}
                  selectedComparisons={selectedComparisons}
                  hoverable={hoverable}
                  isGlobalZone={isGlobalZone}
                  pinnedLabel={pinnedLabel}
                  onCountryClick={onCountryClick}
                  isScrollActive={isScrollActive}
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-resource-panel-charts-area`
                      : undefined
                  }
                />
              )}
              {content?.empty && (
                <StyledPanelNoDataYet
                  data-testid={
                    dataTestId
                      ? `${dataTestId}-resource-panel-no-data-yet-wrapper`
                      : undefined
                  }
                >
                  <NoDataYet
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-resource-panel-no-data-yet`
                        : undefined
                    }
                  />
                </StyledPanelNoDataYet>
              )}
            </>
          )}
        </StyledPanelContainer>
      }
    />
  );
};
