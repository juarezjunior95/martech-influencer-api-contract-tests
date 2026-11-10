import React, { Fragment } from 'react';

import { Heading, Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { useIsInExportPage } from 'hooks';
import {
  StyledNoDataYet,
  StyledRefreshLabel,
  StyledTooltip,
} from 'shared/Styles';

import noDataYetIcon from '../../assets/NoDataYet.svg';
import {
  StyledCard,
  StyledHeader,
  StyledHeadline,
  StyledImage,
  StyledMainContent,
} from './CategoryOverview.styles';
import { GridHolderComponent } from './components';

type Direction = 'up' | 'down';

export interface CategoryOverviewKpiInterface {
  header: {
    id: string;
    title: string;
  }[];
  rows: {
    label: string;
    mix: {
      value: number;
      unitOfMeasure: string;
    };
    vsLy: {
      value: number;
      unitOfMeasure: string;
      direction: Direction;
    };
  }[];
}

export interface CategoryOverviewInterface {
  title: string;
  versus: string;
  dateRefresh?: string;
  footerInfo?: string;
  kpi?: CategoryOverviewKpiInterface;
  tooltip?: string;
  empty?: boolean;
}

interface Props {
  data: CategoryOverviewInterface;
  dataTestId?: string;
}

function parseTitle(title: string) {
  return title.replace(' ', '');
}

export const CategoryOverview: React.FC<Props> = ({ data, dataTestId }) => {
  const isExportPage = useIsInExportPage();

  return (
    <StyledCard
      data-testid={dataTestId}
      border="small"
      elevated="medium"
      width={isExportPage ? 311 : 243}
    >
      {data && (
        <Fragment>
          <StyledHeadline
            data-testid={dataTestId ? `${dataTestId}-headline` : undefined}
          >
            <StyledHeader
              data-testid={dataTestId ? `${dataTestId}-header` : undefined}
            >
              <Heading
                style={{ lineHeight: '20px' }}
                size="H5"
                alignment="left"
                data-testid={dataTestId ? `${dataTestId}-title` : undefined}
              >
                {data.title}
              </Heading>

              {data.tooltip && (
                <CustomTooltip
                  content={
                    <StyledTooltip size="small">{data.tooltip}</StyledTooltip>
                  }
                  dataTestId={dataTestId ? `${dataTestId}-tooltip` : undefined}
                >
                  <Icon
                    data-testid={
                      dataTestId ? `${dataTestId}-tooltip-icon` : undefined
                    }
                    icon={Info}
                    size="small"
                  />
                </CustomTooltip>
              )}
            </StyledHeader>

            {data.dateRefresh && (
              <StyledRefreshLabel
                data-testid={
                  dataTestId ? `${dataTestId}-refresh-label` : undefined
                }
              >
                {data.dateRefresh}
              </StyledRefreshLabel>
            )}
            {data.versus && (
              <Paragraph
                style={{ marginBottom: '12px', lineHeight: '16px' }}
                alignment="left"
                colortype="secondary"
                size="xsmall"
                data-testid={dataTestId ? `${dataTestId}-versus` : undefined}
              >
                {data.versus}
              </Paragraph>
            )}
          </StyledHeadline>
          {!data.empty && (
            <StyledMainContent
              data-testid={
                dataTestId ? `${dataTestId}-main-content` : undefined
              }
            >
              <StyledImage
                data-testid={
                  dataTestId ? `${dataTestId}-background-image` : undefined
                }
                backgroundImage={parseTitle(data.title) as any}
              />
              <GridHolderComponent
                data={data}
                dataTestId={
                  dataTestId ? `${dataTestId}-grid-holder` : undefined
                }
              />
            </StyledMainContent>
          )}

          {data.empty && (
            <StyledNoDataYet
              style={{ marginTop: '1.875rem' }}
              data-testid={dataTestId ? `empty-state-${dataTestId}` : undefined}
            >
              <img
                src={noDataYetIcon}
                alt="no data yet"
                data-testid={
                  dataTestId ? `empty-state-${dataTestId}-icon` : undefined
                }
              />
              <Paragraph
                data-testid={
                  dataTestId ? `empty-state-${dataTestId}-text` : undefined
                }
              >
                {' '}
                Data not available
              </Paragraph>
            </StyledNoDataYet>
          )}
        </Fragment>
      )}
    </StyledCard>
  );
};
