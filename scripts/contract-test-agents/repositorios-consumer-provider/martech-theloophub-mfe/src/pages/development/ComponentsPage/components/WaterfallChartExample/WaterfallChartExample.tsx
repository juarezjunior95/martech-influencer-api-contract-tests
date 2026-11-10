import { Heading } from '@hexa-ui/components';
import {
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  Waterfall,
} from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const WaterfallChartExample = () => {
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Waterfall</Heading>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Waterfall X"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '16px',
            }}
          >
            <div style={{ width: '1100px', height: '300px' }}>
              <Waterfall
                values={[
                  291790.9, -411.3, -1623.4, -3970.7, -1355.6, -18.5, -367.9,
                  284072.7,
                ]}
                labels={[
                  "Jul'25",
                  'Label',
                  'SAZ',
                  'APAC',
                  'NAZ',
                  'AFR',
                  'EUR',
                  "Jul'24",
                ]}
              />
            </div>
            <ComparisonLine
              data={[
                {
                  title: 'Average',
                  data: Array.from({ length: 8 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                },
              ]}
              gridColumnsLength={8}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
            />
          </div>
        </ChartWrapper>
      </StyledSection>

      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Waterfall Y"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <div style={{ width: '500px', height: '450px' }}>
            <Waterfall
              values={[
                148564.2, 441.3, 1623.4, 3970.7, -1355.6, -18, -367.9, 152858.1,
              ]}
              labels={[
                "Jul'25",
                'Label',
                'SAZ',
                'APAC',
                'NAZ',
                'AFR',
                'EUR',
                "Jul'24",
              ]}
              indexAxis="y"
            />
          </div>
        </ChartWrapper>
      </StyledSection>
    </StyledContainer>
  );
};
