import { Heading, Paragraph } from '@hexa-ui/components';
import { ComparisonLine } from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

function generateComparisonLineData(
  count: number,
  color = '#007800',
  measure = '%',
  value = '10.1',
) {
  return Array.from({ length: count }, () => ({ value, measure, color }));
}

export const ComparisonLineExamples = () => {
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Comparison Line</Heading>
      </StyledSection>
      <StyledSection>
        <div style={{ width: '500px' }}>
          <Paragraph style={{ marginBottom: '10px' }}>
            8 spaces, 8 items, size medium
          </Paragraph>
          <ComparisonLine
            size="medium"
            data={[
              {
                title: 'vs LY',
                data: generateComparisonLineData(8, '#007800', '%', '10.1'),
              },
            ]}
            gridConfig={{ paddingLeft: 20, paddingRight: 20 }}
            borderConfig={{ marginLeft: 10, marginRight: 10 }}
            gridColumnsLength={8}
          />
        </div>
        <div style={{ width: '500px' }}>
          <Paragraph style={{ marginBottom: '10px' }}>
            6 spaces, 6 items
          </Paragraph>
          <ComparisonLine
            data={[
              {
                title: 'vs LY',
                data: generateComparisonLineData(6, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY1',
                data: generateComparisonLineData(6, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY2',
                data: generateComparisonLineData(6, '#007800', '%', '10.1'),
              },
            ]}
            gridColumnsLength={6}
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div style={{ width: '500px' }}>
          <Paragraph style={{ marginBottom: '10px' }}>5 spaces</Paragraph>
          <ComparisonLine
            data={[
              {
                title: 'vs LY',
                data: generateComparisonLineData(5, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY1',
                data: generateComparisonLineData(4, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY2',
                data: generateComparisonLineData(2, '#007800', '', '10.1'),
              },
              {
                title: 'vs LY3',
                data: generateComparisonLineData(5, '#B91C1C', '%', '10.1'),
              },
            ]}
            gridColumnsLength={5}
          />
        </div>
        <div style={{ width: '500px' }}>
          <Paragraph style={{ marginBottom: '10px' }}>
            2 spaces, 2 items
          </Paragraph>
          <ComparisonLine
            data={[
              {
                title: 'vs LY',
                data: generateComparisonLineData(2, '#B91C1C', '%', '10.1'),
              },
              {
                title: 'vs LY1',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY2',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY3',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY4',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },

              {
                title: 'vs LY5',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },
              {
                title: 'vs LY6',
                data: generateComparisonLineData(2, '#007800', '%', '10.1'),
              },
            ]}
            gridColumnsLength={2}
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div style={{ width: '900px' }}>
          <Paragraph style={{ marginBottom: '10px' }}>
            20 spaces, 20 items, size default
          </Paragraph>
          <ComparisonLine
            data={[
              {
                title: 'vs LY',
                data: generateComparisonLineData(20, '#007800', '%', '10.1'),
              },
            ]}
            gridColumnsLength={20}
          />
        </div>
      </StyledSection>
    </StyledContainer>
  );
};
