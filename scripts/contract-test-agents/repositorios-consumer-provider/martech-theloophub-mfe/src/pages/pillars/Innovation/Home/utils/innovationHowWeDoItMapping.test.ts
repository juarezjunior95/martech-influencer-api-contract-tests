import type { HowWeDoItSection } from '../components/HowWeDoItCard/types';
import { howWeDoItSectionToSparkLineCardData } from './innovationHowWeDoItMapping';

describe('howWeDoItSectionToSparkLineCardData', () => {
  it('returns null when section is null', () => {
    expect(howWeDoItSectionToSparkLineCardData(null)).toBeNull();
  });

  it('returns null when bigNumberData is empty', () => {
    const section: HowWeDoItSection = {
      title: 'PHI',
      period: "May'26 YTD",
      bigNumberData: [],
    };
    expect(howWeDoItSectionToSparkLineCardData(section)).toBeNull();
  });

  it('maps section to trend card shape and passes through bigNumberData unchanged', () => {
    const section: HowWeDoItSection = {
      title: 'Pack & Price Driven Volume',
      period: "Apr'26",
      bigNumberData: [
        {
          bigNumber: { value: '33.5', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: 'LY' },
          secondaryInfo: { label: '[ k hl ]', value: '10,935.7' },
        },
      ],
    };

    const card = howWeDoItSectionToSparkLineCardData(section);
    expect(card).toEqual({
      chartTitle: 'Pack & Price Driven Volume',
      chartPeriod: "Apr'26",
      measure: undefined,
      bigNumberData: [
        {
          bigNumber: { value: '33.5', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: 'LY' },
          secondaryInfo: { label: '[ k hl ]', value: '10,935.7' },
        },
      ],
      chartLineData: [],
    });
  });

  it('passes through `measure` on the sparkline card shape', () => {
    const section: HowWeDoItSection = {
      title: 'Net Revenue',
      period: "Apr'26",
      measure: '[ $Mio ]',
      bigNumberData: [
        {
          bigNumber: { value: '39.2', measure: '%', trend: 'positive' },
        },
      ],
    };

    expect(howWeDoItSectionToSparkLineCardData(section)).toEqual({
      chartTitle: 'Net Revenue',
      chartPeriod: "Apr'26",
      measure: '[ $Mio ]',
      bigNumberData: [
        {
          bigNumber: { value: '39.2', measure: '%', trend: 'positive' },
        },
      ],
      chartLineData: [],
    });
  });

  it('passes through optional chartLineData when present', () => {
    const section: HowWeDoItSection = {
      title: 'Pack & Price Driven Volume',
      period: "Apr'26",
      measure: '[ k hl ]',
      bigNumberData: [
        {
          bigNumber: { value: '33.5', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: 'LY' },
          secondaryInfo: { label: '[ k hl ]', value: '10,935.7' },
        },
      ],
      chartLineData: [1, 2, 3],
    };

    const card = howWeDoItSectionToSparkLineCardData(section);
    expect(card).toEqual({
      chartTitle: 'Pack & Price Driven Volume',
      chartPeriod: "Apr'26",
      measure: '[ k hl ]',
      bigNumberData: [
        {
          bigNumber: { value: '33.5', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: 'LY' },
          secondaryInfo: { label: '[ k hl ]', value: '10,935.7' },
        },
      ],
      chartLineData: [1, 2, 3],
    });
  });
});
