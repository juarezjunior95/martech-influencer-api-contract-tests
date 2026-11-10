jest.mock('@hexa-ui/components', () => ({
  Button: () => null,
  Heading: () => null,
  LoadingDots: () => null,
  Paragraph: () => null,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Calendar: () => null,
}));

jest.mock('components/BrandImg', () => ({
  BrandImg: () => null,
}));

jest.mock('components', () => ({
  CopyIcon: () => null,
  CustomTooltip: ({ children }: { children: unknown }) => children,
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(() => ({ currentPage: 'test-page' })),
  useBrandImage: jest.fn(() => ({ imageUrl: '' })),
  usePngCopyFeedback: jest.fn(() => ({
    copyElementAsPng: jest.fn(),
    feedbackMessage: '',
    isActionVisible: false,
    isExporting: false,
  })),
  usePageFilterData: jest.fn(() => ({ dataFilters: {} })),
}));

jest.mock('shared/Styles', () => ({
  StyledRowContainer: () => null,
}));

import * as TemplateSlideExports from './index';

describe('TemplateSlide index exports', () => {
  it('should export TemplateSlide', () => {
    expect(TemplateSlideExports.TemplateSlide).toBeDefined();
  });
});
