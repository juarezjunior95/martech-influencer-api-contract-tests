import { useCallback, useState } from 'react';

import { Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { BrandAvatarList } from 'components';
import { Waterfall } from 'components/Chart/Bar/Waterfall';
import {
  ChartLegend,
  InteractionContext,
  LegendItem,
  NavigationConfig,
  useChartNavigation,
} from 'components/Chart/InteractiveChartWrapper';

const StyledContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  padding: '24px',
});

const StyledSection = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
});

const StyledChartContainer = styled('div', {
  height: '400px',
  width: '100%',
});

const StyledInfo = styled('div', {
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
  fontFamily: "'Work Sans', sans-serif",
  fontSize: '14px',
});

const COUNTRY_FLAG_BASE_URL =
  'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/';

const mockValues = [100, 25, -10, 15, -5, 20, -8, 12, -3, 18, -7, 162];
const mockLabels = [
  'Jan25',
  'Feb25',
  'Mar25',
  'Apr25',
  'May25',
  'Jun25',
  'Jul25',
  'Aug25',
  'Sep25',
  'Oct25',
  'Nov25',
  'Dec25',
];

const mockAvatarItems: LegendItem[] = [
  {
    title: 'Jan25',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ABI.png`, alt: 'Global' },
  },
  {
    title: 'Brazil',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}BRA.png`, alt: 'Brazil Flag' },
  },
  {
    title: 'United States',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}USA.png`, alt: 'USA Flag' },
  },
  {
    title: 'Mexico',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}MEX.png`, alt: 'Mexico Flag' },
  },
  {
    title: 'Argentina',
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}ARG.png`,
      alt: 'Argentina Flag',
    },
  },
  {
    title: 'Canada',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}CAN.png`, alt: 'Canada Flag' },
  },
  {
    title: 'Nigeria',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}NGA.png`, alt: 'Nigeria Flag' },
  },
  {
    title: 'Colombia',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}COL.png`, alt: 'Colombia Flag' },
  },
  {
    title: 'Peru',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}PER.png`, alt: 'Peru Flag' },
  },
  {
    title: 'Ecuador',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ECU.png`, alt: 'Ecuador Flag' },
  },
  {
    title: 'Chile',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}CHL.png`, alt: 'Chile Flag' },
  },
  {
    title: 'Dec25',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ABI.png`, alt: 'Global' },
  },
];

const mockBrandsData = [
  {
    index: 0,
    title: 'Jan25',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ABI.png`, alt: 'Global' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 1,
    title: 'Brazil',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}BRA.png`, alt: 'Brazil Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 2,
    title: 'United States',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}USA.png`, alt: 'USA Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 3,
    title: 'Mexico',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}MEX.png`, alt: 'Mexico Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 4,
    title: 'Argentina',
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}ARG.png`,
      alt: 'Argentina Flag',
    },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 5,
    title: 'Canada',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}CAN.png`, alt: 'Canada Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 6,
    title: 'Nigeria',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}NGA.png`, alt: 'Nigeria Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 7,
    title: 'Colombia',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}COL.png`, alt: 'Colombia Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 8,
    title: 'Peru',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}PER.png`, alt: 'Peru Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 9,
    title: 'Ecuador',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ECU.png`, alt: 'Ecuador Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 10,
    title: 'Chile',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}CHL.png`, alt: 'Chile Flag' },
  },
  {
    badgeFlag: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI',
    },
    index: 11,
    title: 'Dec25',
    mainBrand: { src: `${COUNTRY_FLAG_BASE_URL}ABI.png`, alt: 'Global' },
  },
];

const mockColors = {
  first: '#C9D1D6',
  last: '#4C5965',
  negative: '#D62222',
  positive: '#009900',
};

export const InteractiveChartsExample = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleBarSelect = useCallback((index: number | null) => {
    setSelectedIndex(index);
  }, []);

  const navigationConfig: NavigationConfig = {
    1: { type: 'route', destination: '/development/components/bar-chart' },
    2: { type: 'route', destination: '/development/components/line-chart' },
    3: { type: 'scroll', destination: 'top' },
    4: { type: 'scroll', destination: '#navigation-section' },
    5: { type: 'external', destination: 'https://www.ab-inbev.com' },
    6: {
      type: 'action',
      handler: () =>
        setActionMessage(
          'Action executed! This could open a modal, change state, etc.',
        ),
    },
  };

  const { handleNavigation } = useChartNavigation({
    config: navigationConfig,
  });

  const legendItems = mockAvatarItems;

  const renderLegend = useCallback(
    ({ getItemHoverState }: InteractionContext) => {
      const gridStyle: React.CSSProperties = {
        gridTemplateColumns: `repeat(${mockLabels.length}, minmax(0, 1fr))`,
        paddingLeft: '16px',
        paddingRight: '16px',
      };

      return (
        <ChartLegend
          items={legendItems}
          gridStyle={gridStyle}
          getItemHoverState={getItemHoverState}
        />
      );
    },
    [legendItems],
  );

  const renderBrandLegend = useCallback(() => {
    return (
      <div style={{ marginTop: 0, marginBottom: 8 }}>
        <BrandAvatarList
          data={mockBrandsData}
          length={mockValues.length}
          borderConfig={{ marginLeft: 16, marginRight: 16 }}
          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
        />
      </div>
    );
  }, []);

  return (
    <StyledContainer>
      <Heading size="H3">Interactive Charts</Heading>

      <StyledSection>
        <Heading size="H4">Waterfall without Interactivity</Heading>

        <StyledInfo>
          This chart has no interactive features. It serves as a baseline
          comparison.
        </StyledInfo>

        <StyledChartContainer>
          <Waterfall
            values={mockValues}
            labels={mockLabels}
            colors={mockColors}
            options={{
              layout: {
                padding: { left: 16, top: 40, bottom: 8, right: 16 },
              },
            }}
          />
        </StyledChartContainer>
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Waterfall with Legend & Full Interactivity</Heading>

        <StyledInfo>
          Click on any bar or legend item to select. Hover to see the dimming
          effect.
        </StyledInfo>

        <StyledInfo>
          <strong>Item Selecionado:</strong>{' '}
          {selectedIndex !== null
            ? `${mockLabels[selectedIndex]} - ${mockAvatarItems[selectedIndex]?.title || mockLabels[selectedIndex]} (index: ${selectedIndex})`
            : 'Nenhum'}
        </StyledInfo>

        <StyledChartContainer>
          <Waterfall
            values={mockValues}
            labels={mockLabels}
            colors={mockColors}
            options={{
              animation: false,
              layout: {
                padding: { left: 16, top: 40, bottom: 8, right: 16 },
              },
            }}
            interactiveConfig={{
              onBarSelect: handleBarSelect,
              renderLegend,
              fillHeight: true,
              clickability: { enabled: true },
            }}
          />
        </StyledChartContainer>
      </StyledSection>

      <StyledSection>
        <Heading size="H4">
          Waterfall with Granular Clickability Control
        </Heading>

        <StyledInfo>
          Only middle bars (indexes 1-10) are clickable. First and last bars are
          disabled.
        </StyledInfo>

        <StyledInfo>
          <strong>Item Selecionado:</strong>{' '}
          {selectedIndex !== null
            ? `${mockLabels[selectedIndex]} - ${mockAvatarItems[selectedIndex]?.title || mockLabels[selectedIndex]} (index: ${selectedIndex})`
            : 'Nenhum'}
        </StyledInfo>

        <StyledChartContainer>
          <Waterfall
            values={mockValues}
            labels={mockLabels}
            colors={mockColors}
            options={{
              animation: false,
              layout: {
                padding: { left: 16, top: 40, bottom: 8, right: 16 },
              },
            }}
            interactiveConfig={{
              onBarSelect: handleBarSelect,
              renderLegend: renderBrandLegend,
              fillHeight: true,
              clickability: {
                clickableIndexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              },
            }}
          />
        </StyledChartContainer>
      </StyledSection>

      <StyledSection id="navigation-section">
        <Heading size="H4">Waterfall with Navigation Actions</Heading>

        <StyledInfo>
          Navigation types: <strong>route</strong> (1-2),{' '}
          <strong>scroll</strong> (3-4), <strong>external</strong> (5),{' '}
          <strong>action</strong> (6)
        </StyledInfo>

        {actionMessage && (
          <StyledInfo
            style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7' }}
          >
            <strong>Action Result:</strong> {actionMessage}
          </StyledInfo>
        )}

        <StyledChartContainer>
          <Waterfall
            values={mockValues}
            labels={mockLabels}
            colors={mockColors}
            options={{
              animation: false,
              layout: {
                padding: { left: 16, top: 40, bottom: 8, right: 16 },
              },
            }}
            interactiveConfig={{
              onBarSelect: handleNavigation,
              renderLegend,
              fillHeight: true,
              clickability: { clickableIndexes: [1, 2, 3, 4, 5, 6] },
            }}
          />
        </StyledChartContainer>
      </StyledSection>

      <StyledSection>
        <Heading size="H4">Horizontal Waterfall with Interactivity</Heading>

        <StyledInfo>
          Waterfall chart with horizontal orientation (indexAxis: y). Click on
          any bar to select.
        </StyledInfo>

        <StyledInfo>
          <strong>Item Selecionado:</strong>{' '}
          {selectedIndex !== null
            ? `${mockLabels[selectedIndex]} (index: ${selectedIndex})`
            : 'Nenhum'}
        </StyledInfo>

        <StyledChartContainer style={{ height: '700px' }}>
          <Waterfall
            values={mockValues}
            labels={mockLabels}
            colors={mockColors}
            indexAxis="y"
            options={{
              animation: false,
              layout: {
                padding: { left: 80, top: 16, bottom: 16, right: 40 },
              },
            }}
            interactiveConfig={{
              onBarSelect: handleBarSelect,
              fillHeight: true,
              clickability: { enabled: true },
            }}
          />
        </StyledChartContainer>
      </StyledSection>
    </StyledContainer>
  );
};
