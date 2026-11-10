import {
  formatCompactMetricValue,
  formatLinePointTooltipItemValue,
} from './linePointTooltip.valueFormat';
import { parseMetricNumberString } from './utils/format';

describe('linePointTooltip.valueFormat', () => {
  it('formatCompactMetricValue', () => {
    expect(formatCompactMetricValue(12)).toBe('12');
    expect(formatCompactMetricValue(870.8)).toBe('870.8');
    expect(formatCompactMetricValue(1000)).toBe('1k');
    expect(formatCompactMetricValue(3200)).toBe('3.2k');
    expect(formatCompactMetricValue(2_500_000)).toBe('2.5m');
  });

  it('parseMetricNumberString', () => {
    expect(parseMetricNumberString('40.101,0')).toBe(40101);
    expect(parseMetricNumberString('3,2')).toBe(3.2);
  });

  it('formatLinePointTooltipItemValue uses raw for compact formatting', () => {
    expect(
      formatLinePointTooltipItemValue({
        raw: 462.914,
        formattedValue: '',
      }),
    ).toBe('462.9');
  });
});
