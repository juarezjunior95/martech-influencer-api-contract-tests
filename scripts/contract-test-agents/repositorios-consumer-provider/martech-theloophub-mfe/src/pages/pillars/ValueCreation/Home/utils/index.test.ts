import {
  getGrowthLeverCardSkeletonProps,
  getStrategyDriverCardSkeletonProps,
} from './index';

describe('ValueCreation Home utils skeleton props', () => {
  describe('getGrowthLeverCardSkeletonProps', () => {
    it('should return export layout when isExportPage', () => {
      expect(getGrowthLeverCardSkeletonProps(false, false, true)).toEqual({
        height: '96px',
        width: '395px',
        length: 4,
        hasContainer: false,
      });
    });

    it('should return xlarge layout when isDesktopXLarge', () => {
      expect(getGrowthLeverCardSkeletonProps(true, false, false)).toEqual({
        height: '90px',
        width: '340px',
        length: 4,
        hasContainer: false,
      });
    });

    it('should return large layout when only isDesktopLarge', () => {
      expect(getGrowthLeverCardSkeletonProps(false, true, false)).toEqual({
        height: '90px',
        width: '290px',
        length: 4,
        hasContainer: false,
      });
    });

    it('should return default layout when below large breakpoint', () => {
      expect(getGrowthLeverCardSkeletonProps(false, false, false)).toEqual({
        height: '90px',
        width: '250px',
        length: 4,
        hasContainer: false,
      });
    });
  });

  describe('getStrategyDriverCardSkeletonProps', () => {
    it('should return export layout when isExportPage', () => {
      expect(getStrategyDriverCardSkeletonProps(false, false, true)).toEqual({
        height: '90px',
        width: '512px',
        length: 3,
        hasContainer: false,
      });
    });

    it('should return xlarge layout when isDesktopXLarge', () => {
      expect(getStrategyDriverCardSkeletonProps(true, false, false)).toEqual({
        height: '78px',
        width: '452px',
        length: 3,
        hasContainer: false,
      });
    });

    it('should return large layout when only isDesktopLarge', () => {
      expect(getStrategyDriverCardSkeletonProps(false, true, false)).toEqual({
        height: '75px',
        width: '392px',
        length: 3,
        hasContainer: false,
      });
    });

    it('should return default layout when below large breakpoint', () => {
      expect(getStrategyDriverCardSkeletonProps(false, false, false)).toEqual({
        height: '75px',
        width: '338px',
        length: 3,
        hasContainer: false,
      });
    });
  });
});
