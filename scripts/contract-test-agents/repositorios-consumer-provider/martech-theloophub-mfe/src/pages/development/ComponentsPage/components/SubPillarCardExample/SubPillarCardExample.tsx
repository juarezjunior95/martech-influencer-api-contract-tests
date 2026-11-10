import { Heading } from '@hexa-ui/components';
import { BigNumber, ChartHeader, SubPillarCard } from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const SubPillarCardExample = () => {
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Sub Pillar Card</Heading>
      </StyledSection>

      <StyledSection>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <SubPillarCard
            title="1.1 - Title"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ipsum elit sitipsum dolor sit amet consectetur"
            tooltip="Card default component (Stroke 1 applies to the default state)"
          >
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
          </SubPillarCard>
        </div>
      </StyledSection>

      <StyledSection>
        <Heading>Sub Pillar Card - Content Type: KPI</Heading>
      </StyledSection>

      <StyledSection>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <SubPillarCard
            title="1.1 - Title"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ipsum elit sitipsum dolor sit amet consectetur"
            tooltip="KPI Content Type"
          >
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
          </SubPillarCard>
        </div>
      </StyledSection>

      <StyledSection>
        <Heading>Sub Pillar Card - Content Type: Image</Heading>
      </StyledSection>

      <StyledSection>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <SubPillarCard
            title="1.1 - Title"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ipsum elit sitipsum dolor sit amet consectetur"
            tooltip="Image Content Type"
          >
            <div
              style={{
                width: '100%',
                minHeight: '180px',
                backgroundColor: '#F3F4F6',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.02) 10px, rgba(0,0,0,.02) 20px)',
                color: '#9CA3AF',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Image Placeholder
            </div>
          </SubPillarCard>
        </div>
      </StyledSection>

      <StyledSection>
        <Heading>Sub Pillar Card - Show Second Big Number</Heading>
      </StyledSection>

      <StyledSection>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <SubPillarCard
            title="1.1 - Title"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ipsum elit sitipsum dolor sit amet consectetur"
            tooltip="Show one Big Number"
          >
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
          </SubPillarCard>

          <SubPillarCard
            title="1.1 - Title"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ipsum elit sitipsum dolor sit amet consectetur"
            tooltip="Show two Big Numbers"
          >
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 1"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
            <BigNumber
              header={
                <ChartHeader
                  title="Big Number"
                  measure="Measure 2"
                  config={{ inline: 'horizontal', type: 'small' }}
                />
              }
              data={[
                {
                  bigNumber: {
                    value: '1.1',
                    measure: '%',
                    color: '#007800',
                  },
                  comparison: {
                    label: 'vs',
                    value: 'Jul 25',
                  },
                  secondaryInfo: {
                    label: 'Ja 26 YTD',
                    value: '1,234.5%',
                    measure: '[Measure]',
                  },
                },
              ]}
              asCard={true}
              size="medium"
            />
          </SubPillarCard>
        </div>
      </StyledSection>
    </StyledContainer>
  );
};
