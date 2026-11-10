import { Heading } from '@hexa-ui/components';
import {
  Bar,
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  ComparisonLineData,
} from 'components';
import { StyledMultiChartContainer } from 'shared/Styles';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const DivergingBarChartExample = () => {
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
        <Heading>Diverging Bar Chart </Heading>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Default small"
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
                <Bar
                  labels={['Highlight', 'Label', 'Label']}
                  highlightLabels={['Highlight']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [-5, 2, -4],
                      backgroundColor: ['#A20A0A', '#49764B', '#A20A0A'],
                    },
                  ]}
                  formattedData={[['-5.0', '2.0', '-4.0']]}
                  size="small"
                  labelColors={{ internal: 'white', external: '#141414' }}
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
              title="Show Divider medium + Two Axis large internal"
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
                <Bar
                  labels={['Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [-5, 2, -4],
                      backgroundColor: ['#A20A0A', '#49764B', '#A20A0A'],
                    },
                  ]}
                  formattedData={[['-5.0', '2.0', '-4.0']]}
                  showDivider
                  datalabelsPosition="internal"
                  labelColors={{ internal: 'white', external: '#141414' }}
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
                borderConfig={{ marginLeft: 40, marginRight: 0 }}
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
                <Bar
                  labelColors={{ internal: 'white', external: '#141414' }}
                  labels={[
                    'Label',
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
                      data: [-4, -3, -2, -1, 1, 2, 3, 4],
                      backgroundColor: [
                        '#A20A0A',
                        '#A20A0A',
                        '#A20A0A',
                        '#A20A0A',
                        '#49764B',
                        '#49764B',
                        '#49764B',
                        '#49764B',
                      ],
                    },
                  ]}
                  formattedData={[
                    [
                      '-4.0',
                      '-3.0',
                      '-2.0',
                      '-1.0',
                      '1.0',
                      '2.0',
                      '3.0',
                      '4.0',
                    ],
                  ]}
                  axisType="two"
                  size="large"
                />
              </div>
              <ComparisonLine
                data={comparisonLineMock.map((item) => ({
                  ...item,
                  data: Array.from({ length: 8 }, () => ({
                    value: '10.1',
                    measure: '%',
                    color: '#007800',
                  })),
                }))}
                gridColumnsLength={8}
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
              title="Show Divider and None Axis + Show Divider striped + Default responsive"
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
                <Bar
                  labelColors={{ internal: 'white', external: '#141414' }}
                  labels={['Label', 'Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [-1000, -20000, 30000, 40000],
                      backgroundColor: [
                        '#A20A0A',
                        '#A20A0A',
                        '#49764B',
                        '#49764B',
                      ],
                    },
                  ]}
                  formattedData={[['-1k', '-20k', '30k', '40k']]}
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
                borderConfig={{ marginLeft: 16, marginRight: 0 }}
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
                <Bar
                  labelColors={{ internal: 'white', external: '#141414' }}
                  labels={[
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
                      data: [-1000, -20000, -30000, 40000, 50000, 60000],
                      backgroundColor: [
                        '#A20A0A',
                        '#A20A0A',
                        '#A20A0A',
                        '#49764B',
                        '#49764B',
                        '#49764B',
                      ],
                    },
                  ]}
                  formattedData={[['-1k', '-20k', '-30k', '40k', '50k', '60k']]}
                  showDivider
                  stripedIndexes={[0, 1, 2, 3]}
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
                borderConfig={{ marginLeft: 40, marginRight: 0 }}
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
                <Bar
                  labelColors={{ internal: 'white', external: '#141414' }}
                  labels={['Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [-1, 1, 2],
                      backgroundColor: ['#A20A0A', '#49764B', '#49764B'],
                    },
                  ]}
                  formattedData={[['-1.0', '1.0', '2.0']]}
                  size="responsive"
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
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Index axis y"
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
                <Bar
                  labelColors={{ internal: 'white', external: '#141414' }}
                  labels={['Highlight', 'Label', 'Label', 'Label']}
                  highlightLabels={['Highlight']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [-2, -1, 2, 3],
                      backgroundColor: [
                        '#A20A0A',
                        '#A20A0A',
                        '#49764B',
                        '#49764B',
                      ],
                    },
                  ]}
                  formattedData={[['-2.0', '-1.0', '2.0', '3.0']]}
                  indexAxis="y"
                />
              </div>
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
      </StyledSection>
    </StyledContainer>
  );
};
