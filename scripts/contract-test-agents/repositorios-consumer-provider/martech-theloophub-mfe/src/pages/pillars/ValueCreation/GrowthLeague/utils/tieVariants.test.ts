import { createTieVariants } from './tieVariants';

describe('tieVariants', () => {
  const mockHeights = {
    firstTieSimple: ['10px', '20px', '30px'] as [string, string, string],
    firstTieTriple: ['15px', '25px', '35px'] as [string, string, string],
    secondTie: ['12px', '22px', '32px'] as [string, string, string],
  };

  describe('createTieVariants', () => {
    let result: ReturnType<typeof createTieVariants>;

    beforeEach(() => {
      result = createTieVariants(mockHeights);
    });

    it('returns variants and compoundVariants with expected shape', () => {
      expect(result).toHaveProperty('variants');
      expect(result).toHaveProperty('compoundVariants');
      expect(result.variants.tieScenario).toMatchObject({
        'no-tie': {},
        '1st-tie-simple': {},
        '1st-tie-triple': {},
        '2nd-tie': {},
      });
      expect(result.variants.dataIndex).toMatchObject({
        '0': {},
        '1': {},
        '2': {},
      });
    });

    it('maps compoundVariants paddingBottom for each tie scenario and index', () => {
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-simple' && v.dataIndex === 0,
        )?.css,
      ).toEqual({ paddingBottom: '10px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-simple' && v.dataIndex === 1,
        )?.css,
      ).toEqual({ paddingBottom: '20px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-simple' && v.dataIndex === 2,
        )?.css,
      ).toEqual({ paddingBottom: '30px' });

      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-triple' && v.dataIndex === 0,
        )?.css,
      ).toEqual({ paddingBottom: '15px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-triple' && v.dataIndex === 1,
        )?.css,
      ).toEqual({ paddingBottom: '25px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-triple' && v.dataIndex === 2,
        )?.css,
      ).toEqual({ paddingBottom: '35px' });

      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '2nd-tie' && v.dataIndex === 0,
        )?.css,
      ).toEqual({ paddingBottom: '12px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '2nd-tie' && v.dataIndex === 1,
        )?.css,
      ).toEqual({ paddingBottom: '22px' });
      expect(
        result.compoundVariants.find(
          (v) => v.tieScenario === '2nd-tie' && v.dataIndex === 2,
        )?.css,
      ).toEqual({ paddingBottom: '32px' });
    });

    it('has nine compound variants only for tied scenarios', () => {
      expect(result.compoundVariants).toHaveLength(9);
      expect(
        result.compoundVariants.every(
          (v) =>
            v.tieScenario === '1st-tie-simple' ||
            v.tieScenario === '1st-tie-triple' ||
            v.tieScenario === '2nd-tie',
        ),
      ).toBe(true);
    });

    it('uses custom height tuples when provided', () => {
      const customHeights = {
        firstTieSimple: ['100px', '200px', '300px'] as [string, string, string],
        firstTieTriple: ['110px', '220px', '330px'] as [string, string, string],
        secondTie: ['150px', '250px', '350px'] as [string, string, string],
      };

      const custom = createTieVariants(customHeights);

      expect(
        custom.compoundVariants.find(
          (v) => v.tieScenario === '1st-tie-simple' && v.dataIndex === 0,
        )?.css,
      ).toEqual({ paddingBottom: '100px' });
    });
  });
});
