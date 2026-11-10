export const PNL_TAB_NAME = 'Portfolio Performance - P&L';

export const portfolioTableFilterOptions = [
  {
    group: 'Portfolio',
    values: [
      {
        value: 'megabrands_ac, megabrands_og_vs_ly',
        label: 'Megabrands',
      },
      {
        value: 'expansion_ac,expansion_og_vs_ly',
        label: 'Expansion',
      },
      {
        value: 'sustain_ac,sustain_og_vs_ly',
        label: 'Sustain',
      },
      {
        value: 'tail_ac,tail_og_vs_ly',
        label: 'Tail',
      },
    ],
  },
  {
    group: "KPI's",
    values: [
      {
        value: 'tt_abi_ac,megabrands_ac,expansion_ac,sustain_ac,tail_ac',
        label: 'AC',
      },
      {
        value:
          'tt_abi_og_vs_ly,megabrands_og_vs_ly,expansion_og_vs_ly,sustain_og_vs_ly,tail_og_vs_ly',
        label: 'OG vs LY [%]',
      },
    ],
  },
];

export const deepDiveTableFilterOptions = [
  {
    group: 'Organic Growth',
    values: [
      {
        value: 'organic_growth_vs_bu_mio',
        label: ' vs BU',
      },
      {
        value: 'organic_growth_vs_bu',
        label: ' vs BU [%]',
      },
      {
        value: 'organic_growth_vs_ly_mio',
        label: ' vs LY',
      },
      {
        value: 'organic_growth_vs_ly',
        label: 'vs LY [%]',
      },
    ],
  },
  {
    group: 'Period',
    values: [
      {
        value: 'py_ac',
        label: '2024 AC',
      },
      {
        value: 'cy_ac',
        label: '2025 AC',
      },
      {
        value: 'cy_bu',
        label: '2025 BU',
      },
    ],
  },
];
