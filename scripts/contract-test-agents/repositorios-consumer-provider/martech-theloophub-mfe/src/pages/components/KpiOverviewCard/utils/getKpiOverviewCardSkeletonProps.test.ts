import { getKpiOverviewCardSkeletonProps } from './getKpiOverviewCardSkeletonProps';

describe('getKpiOverviewCardSkeletonProps', () => {
  it('should return export layout when variation is export', () => {
    expect(getKpiOverviewCardSkeletonProps(false, false, 'export')).toEqual({
      height: '568px',
      width: '312px',
      length: 5,
      hasContainer: false,
    });
  });

  it('should return xlarge default layout when isDesktopXLarge and variation default', () => {
    expect(getKpiOverviewCardSkeletonProps(true, false, 'default')).toEqual({
      height: '484px',
      width: '264px',
      length: 5,
      hasContainer: false,
    });
  });

  it('should return large default layout when only isDesktopLarge', () => {
    expect(getKpiOverviewCardSkeletonProps(false, true, 'default')).toEqual({
      height: '474px',
      width: '228px',
      length: 5,
      hasContainer: false,
    });
  });

  it('should return default layout when below large breakpoint and variation default', () => {
    expect(getKpiOverviewCardSkeletonProps(false, false, 'default')).toEqual({
      height: '468px',
      width: '198px',
      length: 5,
      hasContainer: false,
    });
  });

  it('should omit third argument and behave as default', () => {
    expect(getKpiOverviewCardSkeletonProps(false, false)).toEqual({
      height: '468px',
      width: '198px',
      length: 5,
      hasContainer: false,
    });
  });

  describe('variation innovation', () => {
    it('should return innovation xlarge layout when isDesktopXLarge', () => {
      expect(
        getKpiOverviewCardSkeletonProps(true, false, 'innovation'),
      ).toEqual({
        height: '695px',
        width: '336px',
        length: 4,
        hasContainer: false,
      });
    });

    it('should return innovation width 250 when below 1920px', () => {
      expect(
        getKpiOverviewCardSkeletonProps(false, true, 'innovation'),
      ).toEqual({
        height: '695px',
        width: '250px',
        length: 4,
        hasContainer: false,
      });
      expect(
        getKpiOverviewCardSkeletonProps(false, false, 'innovation'),
      ).toEqual({
        height: '695px',
        width: '250px',
        length: 4,
        hasContainer: false,
      });
    });
  });
});
