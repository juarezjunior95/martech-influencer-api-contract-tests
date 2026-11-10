import { Heading } from '@hexa-ui/components';
import {
  Bar,
  BigNumber,
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  ComparisonLineData,
} from 'components';
import { getConnectorData } from 'components/Chart/utils';
import { StyledMultiChartContainer } from 'shared/Styles';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const BarChartExample = () => {
  const comparisonLineMock: ComparisonLineData[] = [
    {
      title: 'vs LY',
      data: [
        { value: '1.1', measure: '%', color: '#007800' },
        { value: '0.1', measure: '%', color: '#007800' },
        { value: '0.5', measure: '%', color: '#5C5C5C' },
      ],
    },
  ];
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Bar </Heading>
      </StyledSection>
      <StyledSection>
        <ChartWrapper
          header={
            <ChartHeader
              title="Default small with arrow"
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
                  labels={['Highlight', 'Label1', 'Label2']}
                  highlightLabels={['Highlight']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, -3],
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[['1.0', '2.0', '-3.0']]}
                  size="small"
                  connector={getConnectorData({
                    labels: ['Highlight', 'Label1', 'Label2'],
                    roundedArrow: {
                      comparison: 3,
                      direction: 'up',
                      unit_of_measure: '%',
                    },
                  })}
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
                      data: [1, 2, 3],
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[['1.0', '2.0', '3.0']]}
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
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[
                    ['0.1', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0'],
                  ]}
                  axisType="two"
                  size="large"
                  datalabelsPosition="internal"
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
                  labels={['Label', 'Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1000, 20000, 30000, 40000],
                      backgroundColor: '#F5DC03',
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
                      data: [1000, 20000, 30000, 40000, 50000, 60000],
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[['1k', '20k', '30k', '40k', '50k', '60k']]}
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
                  labels={['Label', 'Label', 'Label']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 3],
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[['1.0', '2.0', '3.0']]}
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
                  labels={['Highlight', 'Label', 'Label', 'Label']}
                  highlightLabels={['Highlight']}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [0.1, 1, 2, 3],
                      backgroundColor: '#F5DC03',
                    },
                  ]}
                  formattedData={[['0.1', '1.0', '2.0', '3.0']]}
                  indexAxis="y"
                />
              </div>
            </div>
          </StyledMultiChartContainer>
        </ChartWrapper>
      </StyledSection>
      <StyledSection>
        <ChartWrapper onClick={() => console.log('CLICK OK!')}>
          <BigNumber
            header={
              <ChartHeader
                title="Hover and click"
                measure="[ k hl ]"
                period="Aug’25"
                info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
                config={{
                  inline: 'horizontal',
                  type: 'small',
                  alignment: 'left',
                }}
              />
            }
            data={[
              {
                bigNumber: {
                  value: '-0.7',
                  measure: '%',
                  color: '#B91C1C',
                },
                comparison: {
                  label: 'vs',
                  value: 'Aug’25',
                },
              },
              {
                bigNumber: {
                  value: '-2.0',
                  measure: '%',
                  color: '#B91C1C',
                },
                comparison: {
                  label: 'vs',
                  value: 'BU’25',
                },
              },
            ]}
            size="small"
          />

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
                  size="small"
                  stripedIndexes={[2, 3]}
                  highlightLabels={['Highlight']}
                  labels={["YTD'22", "YTD'23", "YTD'24", "YTD'BU", "YTD'25"]}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 3, 4, -5],
                      backgroundColor: '#D1A33C',
                    },
                  ]}
                  formattedData={[
                    ['41.5K', '41.3K', '42.2K', '42.8K', '-41.9K'],
                  ]}
                  connector={getConnectorData({
                    labels: ["YTD'22", "YTD'23", "YTD'24", "YTD'BU", "YTD'25"],
                    roundedArrow: {
                      comparison: 19.9,
                      direction: 'up',
                      unit_of_measure: '%',
                    },
                  })}
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
        <ChartWrapper>
          <BigNumber
            header={
              <ChartHeader
                title="Default"
                measure="[ Mio ]"
                period="Aug’25"
                config={{
                  inline: 'horizontal',
                  type: 'small',
                  alignment: 'left',
                }}
              />
            }
            data={[
              {
                bigNumber: {
                  value: '-3.6',
                  measure: '%',
                  color: '#007800',
                },
                comparison: {
                  label: 'vs',
                  value: 'Aug’25',
                },
              },
              {
                bigNumber: {
                  value: '-3.7',
                  measure: '%',
                  color: '#B91C1C',
                },
                comparison: {
                  label: 'vs',
                  value: 'BU’25',
                },
              },
            ]}
            size="small"
          />

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
                  size="small"
                  stripedIndexes={[3]}
                  highlightLabels={['Highlight']}
                  labels={["YTD'22", "YTD'23", "YTD'24", "YTD'BU", "YTD'25"]}
                  datasets={[
                    {
                      label: 'Dataset 1',
                      data: [1, 2, 3, 4, 5],
                      backgroundColor: '#D1A33C',
                    },
                  ]}
                  formattedData={[
                    ['41.5K', '41.3K', '42.2K', '42.8K', '41.9K'],
                  ]}
                  roundedArrow={{
                    comparison: 19.9,
                    direction: 'up',
                    unit_of_measure: '%',
                  }}
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
    </StyledContainer>
  );
};
