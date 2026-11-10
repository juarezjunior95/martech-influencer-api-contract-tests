import React from 'react';

import { Icon } from '@hexa-ui/components2';
import {
  BarChart2,
  Beer,
  BeerBottles,
  Info,
  Placeholder,
  World,
} from '@hexa-ui/icons2';
import type { IHeaderParams } from 'ag-grid-community';
import { TextDynamicTruncation } from 'components';
import { isImage } from 'utils/regex';
import { sanitizeDataTestId } from 'utils/sanitizeDataTestId';

import { ImgRenderer } from '../ImgRenderer';

interface CustomHeaderProps extends IHeaderParams {
  subtitle?: string;
  tooltip?: string;
  icon?: 'region' | 'kpi' | 'category' | 'brands' | 'empty' | 'leading';
  imgName?: string;
  shouldTruncate?: boolean;
  dataTestId?: string;
}

const ICONS_MAP = {
  kpi: BarChart2,
  region: World,
  category: BeerBottles,
  portfolio: BeerBottles,
  brands: Beer,
  empty: Placeholder,
};

export const CustomHeader: React.FC<CustomHeaderProps> = (props) => {
  const {
    column,
    displayName,
    subtitle,
    tooltip,
    icon,
    imgName,
    shouldTruncate,
    dataTestId,
  } = props;

  // Get unique identifier from AG-Grid column and sanitize it
  const columnId = sanitizeDataTestId(column?.getColId() || displayName);

  const getDisplay = () => {
    if (isImage.test(displayName)) {
      return (
        <ImgRenderer
          src={displayName}
          name={imgName}
          dataTestId={dataTestId || columnId}
        />
      );
    }

    if (shouldTruncate) {
      return <TextDynamicTruncation>{displayName}</TextDynamicTruncation>;
    }

    return displayName;
  };

  return (
    <div
      className="ag-cell-label-container"
      data-testid={
        dataTestId ? `custom-header-${dataTestId}` : `custom-header-${columnId}`
      }
    >
      <div className="ag-header-cell-label">
        <div
          className="ag-header-cell-text"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <div className="ag-header-cell-icon-text">
            {icon && <Icon className="icon" icon={ICONS_MAP[icon]}></Icon>}

            {getDisplay()}
          </div>

          {tooltip && (
            <span
              className="ag-header-cell-tooltip-icon"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon icon={Info} color="#1414148F" />
            </span>
          )}
        </div>
        {subtitle && <span className="ag-header-cell-subtext">{subtitle}</span>}
      </div>
    </div>
  );
};
