interface TieHeights {
  firstTieSimple: [string, string, string];
  firstTieTriple: [string, string, string];
  secondTie: [string, string, string];
}

export const createTieVariants = (heights: TieHeights) => ({
  variants: {
    tieScenario: {
      'no-tie': {},
      '1st-tie-simple': {},
      '1st-tie-triple': {},
      '2nd-tie': {},
    },
    dataIndex: { 0: {}, 1: {}, 2: {} },
  },
  compoundVariants: [
    {
      tieScenario: '1st-tie-simple' as const,
      dataIndex: 0 as const,
      css: { paddingBottom: heights.firstTieSimple[0] },
    },
    {
      tieScenario: '1st-tie-simple' as const,
      dataIndex: 1 as const,
      css: { paddingBottom: heights.firstTieSimple[1] },
    },
    {
      tieScenario: '1st-tie-simple' as const,
      dataIndex: 2 as const,
      css: { paddingBottom: heights.firstTieSimple[2] },
    },

    {
      tieScenario: '1st-tie-triple' as const,
      dataIndex: 0 as const,
      css: { paddingBottom: heights.firstTieTriple[0] },
    },
    {
      tieScenario: '1st-tie-triple' as const,
      dataIndex: 1 as const,
      css: { paddingBottom: heights.firstTieTriple[1] },
    },
    {
      tieScenario: '1st-tie-triple' as const,
      dataIndex: 2 as const,
      css: { paddingBottom: heights.firstTieTriple[2] },
    },

    {
      tieScenario: '2nd-tie' as const,
      dataIndex: 0 as const,
      css: { paddingBottom: heights.secondTie[0] },
    },
    {
      tieScenario: '2nd-tie' as const,
      dataIndex: 1 as const,
      css: { paddingBottom: heights.secondTie[1] },
    },
    {
      tieScenario: '2nd-tie' as const,
      dataIndex: 2 as const,
      css: { paddingBottom: heights.secondTie[2] },
    },
  ],
});
