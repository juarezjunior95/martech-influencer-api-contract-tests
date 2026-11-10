import { NoResutStateConfigsTab } from './NoResultState.styles.config';

describe('NoResutStateConfigsTab', () => {
  describe('strategicInnovationPillars', () => {
    it('should have correct container config', () => {
      expect(
        NoResutStateConfigsTab.strategicInnovationPillars.container,
      ).toEqual({
        border: 'none',
        shadow: 'none',
        borderRadius: 'none',
      });
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.strategicInnovationPillars.wrapper).toEqual(
        {
          dataId: 'no-available-data',
          height: '100%',
        },
      );
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.strategicInnovationPillars.image).toEqual({
        alt: 'Updated Data Coming Soon',
      });
    });

    it('should have correct paragraph config', () => {
      expect(
        NoResutStateConfigsTab.strategicInnovationPillars.paragraph,
      ).toEqual({
        width: '30rem',
      });
    });
  });

  describe('investmentBreakdown', () => {
    it('should have correct container config', () => {
      expect(NoResutStateConfigsTab.investmentBreakdown.container).toEqual({
        border: 'none',
        shadow: 'none',
        borderRadius: 'none',
        height: '100%',
      });
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.investmentBreakdown.wrapper).toEqual({
        dataId: 'no-country-selected',
        height: '47rem',
      });
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.investmentBreakdown.image).toEqual({
        alt: 'No Country Selected',
      });
    });

    it('should have correct paragraph config', () => {
      const paragraph = NoResutStateConfigsTab.investmentBreakdown.paragraph;
      expect(paragraph.width).toBe('30rem');
    });
  });

  describe('brandPower', () => {
    it('should have correct container config', () => {
      expect(NoResutStateConfigsTab.brandPower.container).toEqual({
        border: 'small',
        shadow: 'large',
        borderRadius: 'large',
        height: '100%',
      });
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.brandPower.wrapper).toEqual({
        dataId: 'no-brand-selected',
        height: '26.5rem',
      });
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.brandPower.image).toEqual({
        alt: 'No brand Selected',
      });
    });

    it('should have correct paragraph config', () => {
      const paragraph = NoResutStateConfigsTab.brandPower.paragraph;
      expect(paragraph.width).toBe('35rem');
    });
  });

  describe('brandPnl', () => {
    it('should have correct container config', () => {
      expect(NoResutStateConfigsTab.brandPnl.container).toEqual({
        border: 'none',
        shadow: 'none',
        borderRadius: 'none',
        height: '100%',
      });
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.brandPnl.wrapper).toEqual({
        dataId: 'no-country-selected',
        height: '47rem',
      });
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.brandPnl.image).toEqual({
        alt: 'No Country Selected',
      });
    });

    it('should have correct paragraph config', () => {
      const paragraph = NoResutStateConfigsTab.brandPnl.paragraph;
      expect(paragraph.width).toBe('30rem');
    });
  });

  describe('structure', () => {
    it('should have 5 types', () => {
      expect(Object.keys(NoResutStateConfigsTab)).toHaveLength(5);
    });
    it('should contain all expected types', () => {
      expect(NoResutStateConfigsTab).toHaveProperty(
        'strategicInnovationPillars',
      );
      expect(NoResutStateConfigsTab).toHaveProperty('investmentBreakdown');
      expect(NoResutStateConfigsTab).toHaveProperty('brandPower');
      expect(NoResutStateConfigsTab).toHaveProperty('brandPnl');
      expect(NoResutStateConfigsTab).toHaveProperty('audienceTargeting');
    });
  });

  describe('strategicInnovationPillars', () => {
    it('should have correct container config', () => {
      const container =
        NoResutStateConfigsTab.strategicInnovationPillars.container;
      expect(container.border).toBe('none');
      expect(container.shadow).toBe('none');
      expect(container.borderRadius).toBe('none');
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.strategicInnovationPillars.wrapper).toEqual(
        {
          dataId: 'no-available-data',
          height: '100%',
        },
      );
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.strategicInnovationPillars.image).toEqual({
        alt: 'Updated Data Coming Soon',
      });
    });

    it('should have correct paragraph config', () => {
      expect(
        NoResutStateConfigsTab.strategicInnovationPillars.paragraph.width,
      ).toBe('30rem');
    });
  });

  describe('audienceTargeting', () => {
    it('should have correct container config', () => {
      const container = NoResutStateConfigsTab.audienceTargeting.container;
      expect(container.border).toBe('small');
      expect(container.shadow).toBe('large');
      expect(container.borderRadius).toBe('large');
    });

    it('should have correct wrapper config', () => {
      expect(NoResutStateConfigsTab.audienceTargeting.wrapper).toEqual({
        dataId: 'no-audience-data',
        height: '30rem',
      });
    });

    it('should have correct image config', () => {
      expect(NoResutStateConfigsTab.audienceTargeting.image).toEqual({
        alt: 'No Audience Data Available',
      });
    });

    it('should have correct paragraph config', () => {
      expect(NoResutStateConfigsTab.audienceTargeting.paragraph.width).toBe(
        '35rem',
      );
    });
  });
});
