import { BRAND_VOLUME_COLORS, getBrandVolumeColor } from './brandVolumeColors';

jest.mock('utils/format', () => ({
  parsePercentage: (value: string) => {
    const n = parseFloat(value);
    return isNaN(n) ? NaN : n;
  },
}));

jest.mock('../../../../../../../../../theme/colors', () => ({
  colors: {
    specificProperty: {
      successText: '#28A745',
      errorText: '#DC3545',
      noDataBackground: '#F5F5F5',
    },
    txt: {
      default: '#141414',
    },
  },
}));

describe('getBrandVolumeColor', () => {
  test('should returns HALO_NEUTRAL for halo audience regardless of value', () => {
    expect(getBrandVolumeColor('60', false)).toBe(
      BRAND_VOLUME_COLORS.HALO_NEUTRAL,
    );
  });

  test('should returns HALO_NEUTRAL for core audience when value is not a valid number', () => {
    expect(getBrandVolumeColor('invalid-value', true)).toBe(
      BRAND_VOLUME_COLORS.HALO_NEUTRAL,
    );
  });

  test('should returns CORE_ALIGNED for core audience when value is exactly at the 50% threshold', () => {
    expect(getBrandVolumeColor('50', true)).toBe(
      BRAND_VOLUME_COLORS.CORE_ALIGNED,
    );
  });

  test('should returns CORE_ALIGNED for core audience when value is above threshold', () => {
    expect(getBrandVolumeColor('51.2', true)).toBe(
      BRAND_VOLUME_COLORS.CORE_ALIGNED,
    );
  });

  test('should returns CORE_OFF_TARGET for core audience when value is below threshold', () => {
    expect(getBrandVolumeColor('42.7', true)).toBe(
      BRAND_VOLUME_COLORS.CORE_OFF_TARGET,
    );
  });
});
