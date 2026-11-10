import { Heading } from '@hexa-ui/components';
import { ChartHeader } from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';
import {
  MockCalendarTag,
  MockExpand,
  MockLabel,
  MockSegmentedControl,
} from './MockActionComponents/MockActionComponents';

export const ChartHeaderExample = () => {
  return (
    <StyledContainer style={{ padding: '20px', backgroundColor: '#F2F2F2' }}>
      {/* Chart Header Fixed Variant */}
      <>
        <Heading size="H3" style={{ marginBottom: '20px' }}>
          Chart Header Fixed Variant
        </Heading>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'none', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Small"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            description="Description"
            config={{ float: false, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            description="Description"
            config={{ float: false, inline: 'none', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            period="Jul’25 YTD"
            description="Description"
            config={{ float: false, inline: 'none' }}
          />
        </StyledSection>
      </>
      {/* Chart Header Float Variant */}
      <>
        <Heading size="H3" style={{ marginBottom: '20px' }}>
          Chart Header Float Variant
        </Heading>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: true, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: true, inline: 'none', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Small"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: true, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: true, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            description="Description"
            config={{ float: true, inline: 'none' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            description="Description"
            config={{ float: true, inline: 'none', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            period="Jul’25 YTD"
            description="Description"
            config={{ float: true, inline: 'none' }}
          />
        </StyledSection>
      </>
      {/* Chart Header Inline Horizontal Variant */}
      <>
        <Heading size="H3" style={{ marginBottom: '20px' }}>
          Chart Header Inline Horizontal Variant
        </Heading>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'horizontal' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'horizontal', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Small"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            config={{ float: false, inline: 'horizontal' }}
          />
          <ChartHeader
            title="Chart Title Large"
            description="Description"
            config={{ float: false, inline: 'horizontal', type: 'large' }}
          />
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            description="Description"
            config={{ float: false, inline: 'horizontal' }}
          />
        </StyledSection>
      </>
      {/* Chart Header Inline Vertical Variant */}
      <>
        <Heading size="H3" style={{ marginBottom: '20px' }}>
          Chart Header Inline Vertical Variant
        </Heading>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            config={{ float: false, inline: 'vertical' }}
          />
          <ChartHeader
            title="Chart Title Large"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            config={{ float: false, inline: 'vertical', type: 'large' }}
          />
        </StyledSection>
      </>
      {/* Chart Header With Actions Variant */}
      <>
        <Heading size="H3" style={{ marginBottom: '20px' }}>
          Chart Header With Actions Variant
        </Heading>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            actions={[
              <MockSegmentedControl key="segmented-control" />,
              <MockLabel key="label" />,
              <MockCalendarTag key="calendar-tag" />,
              <MockExpand key="expand" />,
            ]}
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            actions={[<MockSegmentedControl key="segmented-control" />]}
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            actions={[<MockLabel key="label" />]}
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            actions={[<MockExpand key="expand" />]}
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
        <StyledSection>
          <ChartHeader
            title="Chart Title Small"
            measure="Measure"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu tempor tortor. Nam tincidunt semper."
            description="Description"
            actions={[<MockCalendarTag key="calendar-tag" />]}
            config={{ float: false, inline: 'none', type: 'large' }}
          />
        </StyledSection>
      </>
    </StyledContainer>
  );
};
