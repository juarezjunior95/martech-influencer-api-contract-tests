import { Heading } from '@hexa-ui/components';
import {
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  ComparisonLineData,
  Line,
  SparkLine,
} from 'components';
import { StyledMultiChartContainer } from 'shared/Styles';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const LineChartExample = () => {
  const comparisonLineMock: ComparisonLineData[] = [
    {
      title: 'vs LY',
      data: [
        { value: '10.1', measure: '%', color: '#007800' },
        { value: '10.1', measure: '%', color: '#007800' },
        { value: '10.1', measure: '%', color: '#5C5C5C' },
      ],
    },
  ];
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Line </Heading>
      </StyledSection>
      <StyledSection>
        <Heading>SparkLine</Heading>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="SparkLine"
              description="Line chart with gradient fill and point only on last value"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <StyledMultiChartContainer quantity={2}>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <SparkLine
                  labels={['Label', 'Label', 'Label']}
                  datasets={[{ label: 'Dataset 1', data: [1, 2, 1] }]}
                  color="#DEB333"
                />
              </div>
            </div>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <SparkLine
                  labels={[
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                  ]}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [0.1, 12, 9, 6, 5, 6, 7],
                    },
                  ]}
                  color="#9F33E0"
                  gradientOptions={{ opacityStart: 0.35, opacityEnd: 0 }}
                />
              </div>
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Line"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <StyledMultiChartContainer quantity={1}>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={['Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 1],
                      borderColor: '#DEB333',
                      pointBackgroundColor: '#DEB333',
                    },
                  ]}
                  formattedData={[['1.0', '2.0', '1.0']]}
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock}
                gridColumnsLength={3}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                borderConfig={{ marginLeft: 40, marginRight: 16 }}
              />
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
        <ChartWrapper
          header={
            <ChartHeader
              title="Line"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <StyledMultiChartContainer quantity={2}>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={['Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 1],
                      borderColor: '#DEB333',
                    },
                  ]}
                  formattedData={[['1.0', '2.0', '1.0']]}
                  showDivider
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 3 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={3}
                gridConfig={{ paddingLeft: 2, paddingRight: 2 }}
                borderConfig={{ marginLeft: 40, marginRight: 8 }}
              />
            </div>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={[
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                  ]}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [0.1, 2, 3, 4, 5, 6, 7],
                      borderColor: '#DEB333',
                    },
                  ]}
                  formattedData={[
                    ['0.1', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0'],
                  ]}
                  axisType="two"
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 7 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={7}
                gridConfig={{ paddingLeft: 2, paddingRight: 2 }}
                borderConfig={{ marginLeft: 40, marginRight: 40 }}
              />
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Line"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <StyledMultiChartContainer quantity={3}>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={['Label', 'Label', 'Label', 'Highlight']}
                  highlightLabels={['Highlight']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1000, 20000, 30000, 40000],
                      borderColor: '#DEB333',
                    },
                  ]}
                  formattedData={[['1k', '20k', '30k', '40k']]}
                  showDivider
                  axisType="none"
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 4 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={4}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                borderConfig={{ marginLeft: 16, marginRight: 8 }}
              />
            </div>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={[
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                    'Label',
                  ]}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [8000, 9000, 20000, 30000, 40000, 50000, 60000],
                      pointBackgroundColor: '#DEB333',
                    },
                    {
                      label: 'Dataset 1',
                      data: [7000, 11000, 10000, 20000, 50000, 60000, 70000],
                      pointBackgroundColor: '#EDDAB1',
                      borderColor: '#EDDAB1',
                    },
                  ]}
                  formattedData={[
                    ['8k', '9k', '20k', '30k', '40k', '50k', '60k'],
                    ['7k', '11k', '10k', '20k', '50k', '60k', '70k'],
                  ]}
                  labelColors={['#141414', '#1414148c', '#1414148c']}
                  showDivider
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 6 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={6}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                borderConfig={{ marginLeft: 40, marginRight: 8 }}
              />
            </div>
            <div style={{ paddingBottom: '16px' }}>
              <div
                style={{
                  height: '436px',
                  display: 'flex',
                  marginBottom: '8px',
                }}
              >
                <Line
                  labels={['Label', 'Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 1, 3],
                      borderColor: '#DEB333',
                    },
                  ]}
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 4 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={4}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                borderConfig={{ marginLeft: 40, marginRight: 16 }}
              />
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
      </StyledSection>

      <StyledSection>
        <div
          style={{ width: '100%' }}
          data-testid="chart-section-bicl-performance"
        >
          <ChartWrapper
            header={
              <ChartHeader
                title="Line"
                description="Line chart with highlight plugin"
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
                paddingBottom: '16px',
                width: '100%',
                borderTop: '1px solid rgba(20, 20, 20, 0.12)',
              }}
            >
              <div
                style={{
                  height: '350px',
                  width: '100%',
                  marginBottom: '8px',
                }}
                data-testid="chart-container-bicl-performance"
              >
                <Line
                  dataTestId="chart-bicl-performance"
                  labels={[
                    '2018',
                    '2019',
                    '2020',
                    '2021',
                    '2022',
                    '2023',
                    '2024',
                    '2025',
                  ]}
                  datasets={[
                    {
                      label: 'BICL',
                      data: [89.2, 91.2, 93.1, 93.3, 93.3, 92.4, 92.2, 93.0],
                      borderColor: '#DEB333',
                      pointBackgroundColor: '#DEB333',
                      borderWidth: 2,
                      pointRadius: 5,
                      pointBorderWidth: 2,
                      pointBorderColor: '#FFFFFF',
                    },
                  ]}
                  formattedData={[
                    [
                      '89.2',
                      '91.2',
                      '93.1',
                      '93.3',
                      '93.3',
                      '92.4',
                      '92.2',
                      '93.0',
                    ],
                  ]}
                  options={{
                    plugins: {
                      lineChartHighlight: { display: true, highlightIndex: 6 },
                    },
                    scales: {
                      y: {
                        suggestedMin: 80,
                        suggestedMax: 100,
                        ticks: {
                          stepSize: 5,
                        },
                      },
                    },
                  }}
                  showDivider
                />
              </div>
              <ComparisonLine
                dataTestId="comparison-line-vs-ly"
                data={[
                  {
                    title: 'vs LY',
                    data: [
                      { value: '-', measure: '', color: '#5C5C5C' },
                      { value: '2.3', measure: '%', color: '#007800' },
                      { value: '2.1', measure: '%', color: '#007800' },
                      { value: '-0.2', measure: '%', color: '#C80000' },
                      { value: '0.2', measure: '%', color: '#007800' },
                      { value: '0', measure: '%', color: '#5C5C5C' },
                      { value: '-0.3', measure: '%', color: '#C80000' },
                      { value: '0.9', measure: '%', color: '#007800' },
                    ],
                  },
                ]}
                gridColumnsLength={8}
                gridConfig={{ paddingLeft: 2, paddingRight: 2 }}
                borderConfig={{ marginLeft: 40, marginRight: 40 }}
              />
            </div>
          </ChartWrapper>
        </div>
      </StyledSection>
    </StyledContainer>
  );
};
