import { useState } from 'react';

import { Heading } from '@hexa-ui/components';
import { ChartHeader, ChartLegend, ChartWrapper, Line } from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const LegendExample = () => {
  const [hiddenDatasets, setHiddenDatasets] = useState([false, false, false]);
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Legend</Heading>
      </StyledSection>
      <StyledSection>
        <Heading size="H4">Circle</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'circle',
              decoration: 'none',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'circle',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'circle',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Rectangle</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'rectangle',
              decoration: 'none',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'rectangle',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'rectangle',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Thin Pill</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'thinPill',
              decoration: 'none',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'thinPill',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'thinPill',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Pill</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'pill',
              decoration: 'none',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'pill',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'pill',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Square</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'square',
              decoration: 'none',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'square',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'square',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Dash</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'rectangle',
              decoration: 'dash',
              size: 'small',
              color: '#006EDB',
            },
            {
              label: 'Medium',
              shape: 'rectangle',
              decoration: 'dash',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Large',
              shape: 'rectangle',
              decoration: 'dash',
              size: 'large',
              color: '#006EDB',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Layer</Heading>

        <ChartLegend
          items={[
            {
              label: 'Small',
              shape: 'rectangle',
              decoration: 'layer',
              layerColor: '#006EDB',
              size: 'small',
              color: '#E6F2FF',
            },
            {
              label: 'Medium',
              shape: 'rectangle',
              decoration: 'layer',
              layerColor: '#006EDB',
              size: 'medium',
              color: '#E6F2FF',
            },
            {
              label: 'Large',
              shape: 'rectangle',
              decoration: 'layer',
              layerColor: '#006EDB',
              size: 'large',
              color: '#E6F2FF',
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Vertical</Heading>

        <ChartLegend
          items={[
            {
              label: 'Example',
              shape: 'circle',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
            {
              label: 'Example2',
              shape: 'circle',
              decoration: 'none',
              size: 'medium',
              color: '#006EDB',
            },
          ]}
          orientation="vertical"
        />
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Chart Integration</Heading>

        <ChartWrapper
          header={
            <ChartHeader
              title="Line with Legend"
              description="This is a description"
              config={{
                inline: 'horizontal',
                type: 'large',
                alignment: 'left',
              }}
            />
          }
        >
          <div style={{ width: '500px', height: '300px' }}>
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
                  data: [6000, 15000, 15000, 25000, 55000, 65000, 75000],
                  pointBackgroundColor: '#006EDB',
                  borderColor: '#006edba3',
                  hidden: hiddenDatasets[0],
                },
                {
                  label: 'Dataset 2',
                  data: [7000, 11000, 10000, 20000, 50000, 60000, 70000],
                  pointBackgroundColor: '#EDDAB1',
                  borderColor: '#EDDAB1',
                  hidden: hiddenDatasets[1],
                },
                {
                  label: 'Dataset 3',
                  data: [8000, 9000, 20000, 30000, 40000, 50000, 60000],
                  pointBackgroundColor: '#F5DC03',
                  hidden: hiddenDatasets[2],
                },
              ]}
              formattedData={[
                ['6k', '15k', '15k', '25k', '55k', '65k', '75k'],
                ['7k', '11k', '10k', '20k', '50k', '60k', '70k'],
                ['8k', '9k', '20k', '30k', '40k', '50k', '60k'],
              ]}
              // labelColors={['#141414', '#1414148c', '#1414148c']}
            />
          </div>
        </ChartWrapper>
        <ChartLegend
          items={[
            {
              label: 'Dataset 1',
              shape: 'thinPill',
              decoration: 'none',
              size: 'large',
              color: '#006EDB',
              strike: hiddenDatasets[0],
              onClick: () => {
                setHiddenDatasets((prev) => {
                  const newHidden = [...prev];
                  newHidden[0] = !newHidden[0];
                  return newHidden;
                });
              },
            },
            {
              label: 'Dataset 2',
              shape: 'thinPill',
              decoration: 'none',
              size: 'large',
              color: '#EDDAB1',
              strike: hiddenDatasets[1],
              onClick: () => {
                setHiddenDatasets((prev) => {
                  const newHidden = [...prev];
                  newHidden[1] = !newHidden[1];
                  return newHidden;
                });
              },
            },
            {
              label: 'Dataset 3',
              shape: 'thinPill',
              decoration: 'none',
              size: 'large',
              color: '#F5DC03',
              strike: hiddenDatasets[2],
              onClick: () => {
                setHiddenDatasets((prev) => {
                  const newHidden = [...prev];
                  newHidden[2] = !newHidden[2];
                  return newHidden;
                });
              },
            },
          ]}
          orientation="vertical"
        />
      </StyledSection>
    </StyledContainer>
  );
};
