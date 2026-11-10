import { Paragraph } from '@hexa-ui/components';
import { ChartOptions, Plugin } from 'chart.js';
import {
  BrandAvatarItem,
  ComparisonLine,
  NoDataYet,
  Waterfall,
} from 'components';
import { InteractiveChartConfig } from 'components/Chart/BaseChart';

import { InnovationPerformanceData } from '../../types';
import {
  StyledBrandsGrid,
  StyledComparisonLineContainer,
  StyledWaterfallContainer,
} from './InnovationPerfomanceWaterfall.styles';

interface InnovationPerfomanceWaterfallProps {
  options: ChartOptions<'bar'>;
  data: InnovationPerformanceData;
  plugins?: Plugin<'bar'>[];
  interactiveConfig?: InteractiveChartConfig;
  dataTestId?: string;
}

export const InnovationPerfomanceWaterfall: React.FC<
  InnovationPerfomanceWaterfallProps
> = ({ options, data, plugins = [], interactiveConfig, dataTestId }) => {
  if (data.empty) {
    return (
      <NoDataYet
        data-testid={dataTestId ? `empty-state-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <>
      <StyledWaterfallContainer
        data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      >
        <Waterfall
          values={data.data}
          options={{
            ...options,
            plugins: { ...options.plugins, connector: data.connector },
            animation: false,
          }}
          labels={data.labels}
          plugins={plugins}
          specialIndexes={data.specialIndexes}
          colors={{
            first: '#C9C9C9',
            last: '#4C5965',
            retained: '#4C5965',
            positive: '#79B57B',
            negative: '#D07275',
          }}
          interactiveConfig={interactiveConfig}
          dataTestId={dataTestId ? `chart-${dataTestId}` : undefined}
        />
      </StyledWaterfallContainer>
      {data.brandsImg && (
        <StyledBrandsGrid
          style={{
            gridTemplateColumns: `repeat(${data.labels.length}, minmax(0, 1fr))`,
          }}
          data-testid={dataTestId ? `${dataTestId}-brands-grid` : undefined}
        >
          <Paragraph
            data-testid={
              dataTestId ? `${dataTestId}-brands-grid-first-label` : undefined
            }
          >
            {data.labels[0]}
          </Paragraph>
          {data.brandsImg.map((brand, index) =>
            brand.mainBrand?.src ? (
              <BrandAvatarItem
                key={`${brand.title}_${index}`}
                {...brand}
                data-testid={
                  dataTestId
                    ? `${dataTestId}-brand-avatar-item-${index}`
                    : undefined
                }
              />
            ) : (
              <Paragraph
                key={`${brand.title}_${index}`}
                data-testid={
                  dataTestId ? `${dataTestId}-brand-label-${index}` : undefined
                }
              >
                {brand.title}
              </Paragraph>
            ),
          )}
          <Paragraph
            data-testid={
              dataTestId ? `${dataTestId}-brands-grid-last-label` : undefined
            }
          >
            {data.labels.at(-1)}
          </Paragraph>
        </StyledBrandsGrid>
      )}
      <StyledComparisonLineContainer
        data-testid={
          dataTestId ? `${dataTestId}-comparison-line-container` : undefined
        }
      >
        <ComparisonLine
          data={data.comparisonLineData as any}
          gridColumnsLength={data.labels.length}
          data-testid={dataTestId ? `${dataTestId}-comparison-line` : undefined}
          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
        />
      </StyledComparisonLineContainer>
    </>
  );
};
