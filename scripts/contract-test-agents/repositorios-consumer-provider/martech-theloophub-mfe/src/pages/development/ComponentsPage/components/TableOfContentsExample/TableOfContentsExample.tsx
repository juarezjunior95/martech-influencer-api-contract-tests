import { TableOfContents, TocGroup } from 'components/TableOfContents';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

const FLAG_BASE_URL =
  'https://assets-martech-uat.mybees-platform.dev/countries/rounded_flags';

const GlobalPowerBookIcon = () => (
  <span
    style={{
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 30% 30%, #F5E003 0%, #D3A238 70%, #141414 100%)',
      display: 'inline-block',
    }}
  />
);

const TOC_GROUPS: TocGroup[] = [
  {
    layout: 'stacked',
    items: [
      {
        title: 'Global Power Book',
        page: 3,
        icon: <GlobalPowerBookIcon />,
      },
      {
        title: 'Q3 2025 Results:',
        description: 'Country, Megabrands, Price Tiers and Global Brands',
        page: 9,
      },
      {
        title: 'YTD 2025 Results:',
        description: 'Country, Megabrands, Price Tiers and Global Brands',
        page: 24,
      },
    ],
  },
  {
    layout: 'grid',
    columns: 4,
    items: [
      {
        title: 'United States',
        countryImageUrl: `${FLAG_BASE_URL}/USA.png`,
        countryCode: 'USA',
        countryName: 'United States',
        page: 44,
        subItems: [
          { label: 'Q3 2025', page: 48 },
          { label: 'YTD 2025', page: 51 },
        ],
      },
      {
        title: 'China',
        countryImageUrl: `${FLAG_BASE_URL}/CHN.png`,
        countryCode: 'CHN',
        countryName: 'China',
        page: 71,
        subItems: [
          { label: 'Q3 2025', page: 75 },
          { label: 'YTD 2025', page: 78 },
        ],
      },
      {
        title: 'Peru',
        countryImageUrl: `${FLAG_BASE_URL}/PER.png`,
        countryCode: 'PER',
        countryName: 'Peru',
        page: 98,
        subItems: [
          { label: 'Q3 2025', page: 101 },
          { label: 'YTD 2025', page: 105 },
        ],
      },
      {
        title: 'S. Korea',
        countryImageUrl: `${FLAG_BASE_URL}/KOR.png`,
        countryCode: 'KOR',
        countryName: 'South Korea',
        page: 125,
        subItems: [
          { label: 'Q3 2025', page: 129 },
          { label: 'YTD 2025', page: 132 },
        ],
      },
      {
        title: 'Brazil',
        countryImageUrl: `${FLAG_BASE_URL}/BRA.png`,
        countryCode: 'BRA',
        countryName: 'Brazil',
        page: 53,
        subItems: [
          { label: 'Q3 2025', page: 57 },
          { label: 'YTD 2025', page: 60 },
        ],
      },
      {
        title: 'S. Africa',
        countryImageUrl: `${FLAG_BASE_URL}/ZAF.png`,
        countryCode: 'ZAF',
        countryName: 'South Africa',
        page: 80,
        subItems: [
          { label: 'Q3 2025', page: 84 },
          { label: 'YTD 2025', page: 89 },
        ],
      },
      {
        title: 'Argentina',
        countryImageUrl: `${FLAG_BASE_URL}/ARG.png`,
        countryCode: 'ARG',
        countryName: 'Argentina',
        page: 107,
        subItems: [
          { label: 'Q3 2025', page: 111 },
          { label: 'YTD 2025', page: 114 },
        ],
      },
      {
        title: 'United Kingdom',
        countryImageUrl: `${FLAG_BASE_URL}/GBR.png`,
        countryCode: 'GBR',
        countryName: 'United Kingdom',
        page: 134,
        subItems: [
          { label: 'Q3 2025', page: 138 },
          { label: 'YTD 2025', page: 141 },
        ],
      },
      {
        title: 'Mexico',
        countryImageUrl: `${FLAG_BASE_URL}/MEX.png`,
        countryCode: 'MEX',
        countryName: 'Mexico',
        page: 62,
        subItems: [
          { label: 'Q3 2025', page: 66 },
          { label: 'YTD 2025', page: 69 },
        ],
      },
      {
        title: 'Colombia',
        countryImageUrl: `${FLAG_BASE_URL}/COL.png`,
        countryCode: 'COL',
        countryName: 'Colombia',
        page: 90,
        subItems: [
          { label: 'Q3 2025', page: 95 },
          { label: 'YTD 2025', page: 99 },
        ],
      },
      {
        title: 'Canada',
        countryImageUrl: `${FLAG_BASE_URL}/CAN.png`,
        countryCode: 'CAN',
        countryName: 'Canada',
        page: 116,
        subItems: [
          { label: 'Q3 2025', page: 120 },
          { label: 'YTD 2025', page: 123 },
        ],
      },
      {
        title: 'Ecuador',
        countryImageUrl: `${FLAG_BASE_URL}/ECU.png`,
        countryCode: 'ECU',
        countryName: 'Ecuador',
        page: 151,
        subItems: [
          { label: 'Q3 2025', page: 154 },
          { label: 'YTD 2025', page: 157 },
        ],
      },
    ],
  },
];

export const TableOfContentsExample = () => {
  return (
    <StyledContainer
      style={{ padding: 0, border: 'none', background: 'transparent' }}
    >
      <StyledSection style={{ marginBottom: 0 }}>
        <TableOfContents
          title="Table of Contents"
          groups={TOC_GROUPS}
          dataTestId="example-toc"
        />
      </StyledSection>
    </StyledContainer>
  );
};
