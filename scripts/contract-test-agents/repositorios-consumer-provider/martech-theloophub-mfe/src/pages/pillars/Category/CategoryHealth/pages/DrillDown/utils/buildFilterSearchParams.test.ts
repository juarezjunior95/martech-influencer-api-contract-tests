import { buildFilterSearchParams } from './buildFilterSearchParams';

describe('buildFilterSearchParams', () => {
  it('should set all filter params when all applied fields are present', () => {
    const params = buildFilterSearchParams({
      zone: 'ABI',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    });

    expect(params.get('filter_zone')).toBe('ABI');
    expect(params.get('filter_country')).toBe('BRA');
    expect(params.get('filter_years')).toBe('2025');
    expect(params.get('filter_segments')).toBe('Beer');
  });

  it('should skip null values', () => {
    const params = buildFilterSearchParams({
      zone: 'ABI',
      country: null,
      years: '2025',
      segments: null,
    });

    expect(params.get('filter_zone')).toBe('ABI');
    expect(params.has('filter_country')).toBe(false);
    expect(params.get('filter_years')).toBe('2025');
    expect(params.has('filter_segments')).toBe(false);
  });

  it('should return empty params when applied is empty', () => {
    const params = buildFilterSearchParams({});
    expect(params.toString()).toBe('');
  });

  it('should convert numeric values to string', () => {
    const params = buildFilterSearchParams({ years: 2025 });
    expect(params.get('filter_years')).toBe('2025');
  });

  it('should append extras params', () => {
    const params = buildFilterSearchParams(
      { zone: 'ABI' },
      { overtime_performance: 'volume' },
    );

    expect(params.get('filter_zone')).toBe('ABI');
    expect(params.get('overtime_performance')).toBe('volume');
  });

  it('should work with extras only and empty applied', () => {
    const params = buildFilterSearchParams({}, { overtime_performance: 'icl' });

    expect(params.get('overtime_performance')).toBe('icl');
    expect(params.toString()).toBe('overtime_performance=icl');
  });

  it('should not set extras when extras is undefined', () => {
    const params = buildFilterSearchParams({ zone: 'ABI' }, undefined);
    expect(params.get('filter_zone')).toBe('ABI');
    expect(params.toString()).toBe('filter_zone=ABI');
  });

  it('should ignore unrelated applied keys', () => {
    const params = buildFilterSearchParams({
      zone: 'ABI',
      kpis: 'some-kpi',
      brands: 'some-brand',
    });

    expect(params.get('filter_zone')).toBe('ABI');
    expect(params.has('kpis')).toBe(false);
    expect(params.has('brands')).toBe(false);
  });
});
