import { useState } from 'react';

import { Heading, Paragraph } from '@hexa-ui/components';
import ChartSampleSVG from 'assets/ChartSample.svg';
import { BigNumber, BigNumberWithContent, ChartHeader } from 'components';

import {
  StyledContainer,
  StyledContentBoxExample,
  StyledSection,
} from '../../ComponentsPage.styles';

export const BigNumberExample = () => {
  const [selectedBigNumber, setSelectedBigNumber] = useState<boolean>(false);
  const [selectedBigNumber2, setSelectedBigNumber2] = useState<boolean>(false);
  const [selectedBigNumberWithContent, setSelectedBigNumberWithContent] =
    useState<boolean>(false);

  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Big Number</Heading>
      </StyledSection>
      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Delta small"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: 'Aug’25',
                },
              },
            },
          ]}
          asCard
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Delta medium"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: 'Aug’25',
                },
              },
            },
          ]}
          asCard
          size="medium"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Delta large"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: 'Aug’25',
                },
              },
            },
          ]}
          asCard
          size="large"
        />
        <BigNumber
          header={
            <ChartHeader
              title="spacing cozy"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          spacing="cozy"
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: 'Aug’25',
                },
              },
            },
          ]}
          asCard
        />
        <BigNumber
          header={
            <ChartHeader
              title="Default"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
            },
          ]}
        />
      </StyledSection>

      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Number small"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: 'of total value',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Number medium"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: 'of total value',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
        />
        <BigNumber
          header={
            <ChartHeader
              title="Number large"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: 'of total value',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
          size="large"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Without period"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: 'of total value',
                value: '5.1',
                measure: '%',
              },
            },
          ]}
          asCard
          size="large"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Large Centered"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: 'of total value',
                value: '5.1',
                measure: '%',
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
          alignment="center"
          size="large"
        />
      </StyledSection>

      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Without secondary value"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Without secondary info"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                color: '',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
                number: {
                  value: '9.8',
                  measure: '%',
                  color: '#B91C1C',
                },
              },
            },
          ]}
          asCard
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Only big number"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
            },
          ]}
          asCard
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Without comparison"
              measure="[ Measure ]"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '1012.1',
                measure: 'pp',
                color: '#B91C1C',
              },
              secondaryInfo: {
                label: 'Measure',
                measure: '%',
                value: '5.1',
                period: {
                  label: 'Period',
                  value: '00/0000',
                },
              },
            },
          ]}
          asCard
          size="small"
        />
      </StyledSection>

      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Multiples"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
          ]}
          asCard
          size="small"
        />

        <BigNumber
          header={
            <ChartHeader
              title="Multiples"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
          ]}
          asCard
          size="small"
        />

        <BigNumber
          header={
            <ChartHeader
              title="Clickeable"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
          ]}
          asCard
          size="small"
          onClick={() => setSelectedBigNumber((s) => !s)}
          isSelected={selectedBigNumber}
        />

        <BigNumber
          header={
            <ChartHeader
              title="Clickeable"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
          ]}
          asCard
          orientation="horizontal"
          onClick={() => setSelectedBigNumber2((s) => !s)}
          isSelected={selectedBigNumber2}
          size="small"
        />
      </StyledSection>

      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Horizontal"
              period="Jul’25 YTD"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: 'Measure',
                measure: '%',
                value: '122.2',
              },
            },
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: 'Measure',
                measure: '%',
                value: '122.2',
              },
            },
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
              secondaryInfo: {
                label: 'Measure',
                measure: '%',
                value: '122.2',
              },
            },
          ]}
          asCard
          orientation="horizontal"
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Horizontal"
              period="Jul’25 YTD"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '10.1',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: 'Jul’25',
              },
            },
          ]}
          asCard
          orientation="horizontal"
          size="small"
        />
      </StyledSection>

      <StyledSection>
        <BigNumber
          header={
            <ChartHeader
              title="Vertical no data"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[]}
          asCard
          orientation="vertical"
          size="small"
        />
        <BigNumber
          header={
            <ChartHeader
              title="Horizontal no data"
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={[]}
          asCard
          orientation="horizontal"
          size="small"
        />
      </StyledSection>

      <StyledSection>
        <Heading>Big Number With Content</Heading>
      </StyledSection>

      <StyledSection>
        <BigNumberWithContent
          fullWidth
          header={
            <ChartHeader
              title="Big Number With Content"
              measure="[ Measure ]"
              period="Jul'25 YTD"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
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
                value: 'Jul’25',
                number: {
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '1,234.5',
                measure: '%',
              },
            },
          ]}
          onClick={() => setSelectedBigNumberWithContent((s) => !s)}
          isSelected={selectedBigNumberWithContent}
        >
          <StyledContentBoxExample>
            <Paragraph size="basis" color="text-primary">
              Content Area Clickable
            </Paragraph>
          </StyledContentBoxExample>
        </BigNumberWithContent>
      </StyledSection>
      <StyledSection>
        <BigNumberWithContent
          header={
            <ChartHeader
              title="Big Number With Content"
              measure="[ Measure ]"
              period="Jul'25 YTD"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
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
                value: 'Jul’25',
                number: {
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: '[ Measure ]',
                value: '1,234.5',
                measure: '%',
              },
            },
          ]}
        >
          <StyledContentBoxExample>
            <Paragraph size="basis" color="text-primary">
              Content Area Not Clickable
            </Paragraph>
          </StyledContentBoxExample>
        </BigNumberWithContent>
        <BigNumberWithContent
          header={
            <ChartHeader
              title="Big Number With Content"
              measure="[ Measure ]"
              period="Nov'25 YTD"
              info="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"
              config={{ inline: 'horizontal', type: 'large' }}
            />
          }
          data={[
            {
              bigNumber: {
                value: '-11.9',
                measure: '%',
                color: '#B91C1C',
              },
              comparison: {
                label: 'vs',
                value: 'LY',
                number: {
                  measure: '%',
                  color: '#B91C1C',
                },
              },
              secondaryInfo: {
                label: '[ KhL  ]',
                value: '45,626.4',
                measure: '%',
              },
            },
          ]}
        >
          <img src={ChartSampleSVG} alt="Chart Sample" />
        </BigNumberWithContent>
      </StyledSection>
    </StyledContainer>
  );
};
