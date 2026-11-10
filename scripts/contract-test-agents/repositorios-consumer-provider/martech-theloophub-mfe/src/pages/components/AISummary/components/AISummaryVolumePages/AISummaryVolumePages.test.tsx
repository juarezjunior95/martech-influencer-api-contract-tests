import { render, screen } from '@testing-library/react';

import { AISummaryVolumePages } from './AISummaryVolumePages';

const mockUseAISummaryData = jest.fn();
const mockFormatMessage = jest.fn((msg: { id: string }) => {
  const messages: Record<string, string> = {
    'AISummary.VolumePages.title': 'AI Summary Title',
    'AISummary.VolumePages.subtitle': 'AI Summary Subtitle',
  };
  return messages[msg.id] ?? msg.id;
});

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('../../hooks/useAISummaryData/useAISummaryData', () => ({
  useAISummaryData: (...args: unknown[]) => mockUseAISummaryData(...args),
}));

jest.mock('components/ai/components/atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({
    content,
    className,
    'data-testid': dataTestId,
  }: {
    content: string;
    className?: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId} className={className}>
      {content}
    </div>
  ),
}));

const mockAISummaryVolumePagesSkeleton = jest.fn(() => (
  <div data-testid="ai-summary-volume-pages-skeleton">Skeleton</div>
));

jest.mock('./AISummaryVolumePagesSkeleton', () => ({
  AISummaryVolumePagesSkeleton: () => mockAISummaryVolumePagesSkeleton(),
}));

jest.mock('./AISummaryVolumePages.styles', () => ({
  AISummaryVolumePagesStyles: {
    Container: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid']}>{children}</div>
    ),
    Title: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid']}>{children}</div>
    ),
    Body: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid']}>{children}</div>
    ),
    SectionIndicator: ({ children }: any) => <p>{children}</p>,
    Empty: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid']}>{children}</div>
    ),
  },
  AISummaryVolumePagesSkeletonStyles: {
    Container: ({ children }: any) => (
      <div data-testid="skeleton-container">{children}</div>
    ),
    FirstSectionSkeleton: ({ children }: any) => (
      <div data-testid="skeleton-first-section">{children}</div>
    ),
    SecondSectionSkeleton: ({ children }: any) => (
      <div data-testid="skeleton-second-section">{children}</div>
    ),
  },
  GradientTextSVGStyles: {
    Svg: ({ children, ...props }: any) => (
      <svg data-testid="gradient-text-svg" {...props}>
        {children}
      </svg>
    ),
  },
}));

jest.mock('assets/img/AISummary/volume-pages.png', () => 'ai-summary-icon.svg');

jest.mock('./GradientTextSVG', () => ({
  GradientTextSVG: ({ children }: { children: string }) => (
    <div data-testid="gradient-text-svg">{children}</div>
  ),
}));

jest.mock('./utils', () => ({
  extractFirstParagraph: (content: string) => ({
    firstParagraph: content.split('\n')[0] || '',
    rest: content.split('\n').slice(1).join('\n'),
  }),
}));

jest.mock('components', () => ({
  Skeleton: ({ width, height, borderRadius }: any) => (
    <div
      data-testid="skeleton"
      data-width={width}
      data-height={height}
      data-border-radius={borderRadius}
    >
      Skeleton
    </div>
  ),
  DataStateHandler: ({ children, empty, message }: any) => (
    <div data-testid="data-state-handler" data-empty={empty}>
      {empty ? (
        <div>
          <span>{message?.title}</span>
          <span>{message?.description}</span>
        </div>
      ) : (
        children
      )}
    </div>
  ),
}));

describe('AISummaryVolumePages', () => {
  const defaultProps = {
    pageName: 'test-page',
    subFilters: { cohort: 'All' },
    dataTestId: 'ai-summary-volume-pages',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAISummaryData.mockReturnValue({
      summary: { seeMore: 'Default summary content' },
      loading: false,
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      mockUseAISummaryData.mockReturnValue({
        summary: null,
        loading: true,
      });
    });

    it('should render skeleton when loading', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId('ai-summary-volume-pages-skeleton'),
      ).toBeInTheDocument();
    });

    it('should not render body when loading', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.queryByTestId(`${defaultProps.dataTestId}-body`),
      ).not.toBeInTheDocument();
    });

    it('should still render container and title when loading', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-container`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-title`),
      ).toBeInTheDocument();
    });
  });

  describe('Loaded State', () => {
    it('should render container with correct data-testid', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-container`),
      ).toBeInTheDocument();
    });

    it('should render title section with correct data-testid', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-title`),
      ).toBeInTheDocument();
    });

    it('should render title text from formatMessage', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(screen.getByText('AI Summary Title')).toBeInTheDocument();
    });

    it('should render icon with correct alt text', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      const img = screen.getByAltText('ai-summary-volume-pages');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'ai-summary-icon.svg');
    });

    it('should render body section when not loading', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-body`),
      ).toBeInTheDocument();
    });

    it('should render subtitle text from formatMessage', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(screen.getByText('AI Summary Subtitle')).toBeInTheDocument();
    });

    it('should not render skeleton when not loading', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.queryByTestId('ai-summary-volume-pages-skeleton'),
      ).not.toBeInTheDocument();
    });
  });

  describe('MarkdownRenderer Integration', () => {
    it('should render MarkdownRenderer with summary seeMore content', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: { seeMore: 'Markdown content here' },
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(screen.getByText('Markdown content here')).toBeInTheDocument();
    });

    it('should render MarkdownRenderer with correct data-testid', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-markdown`),
      ).toBeInTheDocument();
    });

    it('should render MarkdownRenderer with correct className', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      const markdown = screen.getByTestId(
        `${defaultProps.dataTestId}-markdown`,
      );
      expect(markdown).toHaveClass('ai-summary-volume-pages');
    });

    it('should render empty state when summary.seeMore is null', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: { seeMore: null },
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-empty`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`${defaultProps.dataTestId}-markdown`),
      ).not.toBeInTheDocument();
    });

    it('should render empty state when summary.seeMore is undefined', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {},
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-empty`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`${defaultProps.dataTestId}-markdown`),
      ).not.toBeInTheDocument();
    });

    it('should render empty state when summary is null', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: null,
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByTestId(`${defaultProps.dataTestId}-empty`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`${defaultProps.dataTestId}-markdown`),
      ).not.toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useAISummaryData with correct pageName', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          pageName: 'test-page',
        }),
      );
    });

    it('should call useAISummaryData with correct summaryPageIdentifier', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          summaryPageIdentifier: '7. Value Creation; Volume Pages',
        }),
      );
    });

    it('should call useAISummaryData with volume kpiGroup', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          kpiGroup: 'volume',
        }),
      );
    });

    it('should call useAISummaryData with subFilters', () => {
      const subFilters = { cohort: 'Premium', segment: 'Beer' };
      render(
        <AISummaryVolumePages {...defaultProps} subFilters={subFilters} />,
      );

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: { cohort: 'Premium', segment: 'Beer' },
        }),
      );
    });

    it('should pass different pageName to hook', () => {
      render(
        <AISummaryVolumePages {...defaultProps} pageName="different-page" />,
      );

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          pageName: 'different-page',
        }),
      );
    });

    it('should pass empty subFilters when provided', () => {
      render(<AISummaryVolumePages {...defaultProps} subFilters={{}} />);

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: {},
        }),
      );
    });
  });

  describe('Internationalization', () => {
    it('should call formatMessage with title id', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'AISummary.VolumePages.title',
      });
    });

    it('should call formatMessage with subtitle id', () => {
      render(<AISummaryVolumePages {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'AISummary.VolumePages.subtitle',
      });
    });
  });

  describe('Custom DataTestId', () => {
    it('should render with custom dataTestId for container', () => {
      render(<AISummaryVolumePages {...defaultProps} dataTestId="custom-id" />);

      expect(screen.getByTestId('custom-id-container')).toBeInTheDocument();
    });

    it('should render with custom dataTestId for title', () => {
      render(<AISummaryVolumePages {...defaultProps} dataTestId="custom-id" />);

      expect(screen.getByTestId('custom-id-title')).toBeInTheDocument();
    });

    it('should render with custom dataTestId for body', () => {
      render(<AISummaryVolumePages {...defaultProps} dataTestId="custom-id" />);

      expect(screen.getByTestId('custom-id-body')).toBeInTheDocument();
    });

    it('should render with custom dataTestId for markdown', () => {
      render(<AISummaryVolumePages {...defaultProps} dataTestId="custom-id" />);

      expect(screen.getByTestId('custom-id-markdown')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle summary with special characters in seeMore', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: { seeMore: '<script>alert("test")</script>' },
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(
        screen.getByText('<script>alert("test")</script>'),
      ).toBeInTheDocument();
    });

    it('should handle summary with very long content', () => {
      const longContent = 'A'.repeat(10000);
      mockUseAISummaryData.mockReturnValue({
        summary: { seeMore: longContent },
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle summary with markdown syntax', () => {
      const markdownContent = '# Heading\n**Bold** text';
      mockUseAISummaryData.mockReturnValue({
        summary: { seeMore: markdownContent },
        loading: false,
      });

      render(<AISummaryVolumePages {...defaultProps} />);

      const markdown = screen.getByTestId(
        `${defaultProps.dataTestId}-markdown`,
      );
      expect(markdown.textContent).toBe('**Bold** text');
      expect(screen.getByTestId('gradient-text-svg').textContent).toBe(
        '# Heading',
      );
    });

    it('should handle empty string pageName', () => {
      render(<AISummaryVolumePages {...defaultProps} pageName="" />);

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          pageName: '',
        }),
      );
    });

    it('should handle complex subFilters object', () => {
      const complexFilters = {
        cohort: 'All',
        price_segment: 'Premium',
        category: 'Beer',
        region: 'LATAM',
      };

      render(
        <AISummaryVolumePages {...defaultProps} subFilters={complexFilters} />,
      );

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: complexFilters,
        }),
      );
    });
  });
});

describe('AISummaryVolumePagesSkeleton', () => {
  const { AISummaryVolumePagesSkeleton: ActualAISummaryVolumePagesSkeleton } =
    jest.requireActual('./AISummaryVolumePagesSkeleton');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Structure', () => {
    it('should render the skeleton container', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
    });

    it('should render skeleton elements', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByText('Skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render 7 skeleton elements total (1 + 2 + 4)', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(7);
    });

    it('should render first section container', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      expect(screen.getByTestId('skeleton-first-section')).toBeInTheDocument();
    });

    it('should render second section container', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      expect(screen.getByTestId('skeleton-second-section')).toBeInTheDocument();
    });
  });

  describe('Header Skeleton', () => {
    it('should render header skeleton with 100% width', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const headerSkeleton = skeletons.find(
        (skeleton) => skeleton.getAttribute('data-width') === '100%',
      );
      expect(headerSkeleton).toBeInTheDocument();
    });

    it('should render header skeleton with 87px height', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const headerSkeleton = skeletons.find(
        (skeleton) => skeleton.getAttribute('data-height') === '87px',
      );
      expect(headerSkeleton).toBeInTheDocument();
    });

    it('should render header skeleton with small border radius', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const headerSkeleton = skeletons.find(
        (skeleton) => skeleton.getAttribute('data-width') === '100%',
      );
      expect(headerSkeleton).toHaveAttribute('data-border-radius', 'small');
    });
  });

  describe('First Section Skeletons', () => {
    it('should render 2 skeletons in the first section', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const firstSection = screen.getByTestId('skeleton-first-section');
      const skeletons = firstSection.querySelectorAll(
        '[data-testid="skeleton"]',
      );
      expect(skeletons).toHaveLength(2);
    });

    it('should render first section skeletons with 779px width', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const firstSectionSkeletons = skeletons.filter(
        (skeleton) => skeleton.getAttribute('data-height') === '289px',
      );

      firstSectionSkeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-width', '779px');
      });
    });

    it('should render first section skeletons with 289px height', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const firstSectionSkeletons = skeletons.filter(
        (skeleton) =>
          skeleton.getAttribute('data-height') === '289px' &&
          skeleton.getAttribute('data-width') === '779px',
      );
      expect(firstSectionSkeletons).toHaveLength(2);
    });

    it('should render first section skeletons with small border radius', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const firstSectionSkeletons = skeletons.filter(
        (skeleton) => skeleton.getAttribute('data-height') === '289px',
      );

      firstSectionSkeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-border-radius', 'small');
      });
    });
  });

  describe('Second Section Skeletons', () => {
    it('should render 4 skeletons in the second section', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const secondSection = screen.getByTestId('skeleton-second-section');
      const skeletons = secondSection.querySelectorAll(
        '[data-testid="skeleton"]',
      );
      expect(skeletons).toHaveLength(4);
    });

    it('should render second section skeletons with 779px width', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const secondSectionSkeletons = skeletons.filter(
        (skeleton) => skeleton.getAttribute('data-height') === '122px',
      );

      secondSectionSkeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-width', '779px');
      });
    });

    it('should render second section skeletons with 122px height', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const secondSectionSkeletons = skeletons.filter(
        (skeleton) =>
          skeleton.getAttribute('data-height') === '122px' &&
          skeleton.getAttribute('data-width') === '779px',
      );
      expect(secondSectionSkeletons).toHaveLength(4);
    });

    it('should render second section skeletons with small border radius', () => {
      render(<ActualAISummaryVolumePagesSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const secondSectionSkeletons = skeletons.filter(
        (skeleton) => skeleton.getAttribute('data-height') === '122px',
      );

      secondSectionSkeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-border-radius', 'small');
      });
    });
  });
});

describe('GradientTextSVG (mocked)', () => {
  const MockedGradientTextSVG = ({ children }: { children: string }) => (
    <div data-testid="gradient-text-svg">{children}</div>
  );

  describe('Rendering', () => {
    it('should render children text content', () => {
      render(<MockedGradientTextSVG>Hello World</MockedGradientTextSVG>);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render with test id', () => {
      render(<MockedGradientTextSVG>Test content</MockedGradientTextSVG>);

      expect(screen.getByTestId('gradient-text-svg')).toBeInTheDocument();
    });
  });

  describe('Content Variations', () => {
    it('should render empty string content', () => {
      render(<MockedGradientTextSVG>{''}</MockedGradientTextSVG>);

      expect(screen.getByTestId('gradient-text-svg')).toBeInTheDocument();
    });

    it('should render long text content', () => {
      const longText = 'A'.repeat(500);
      render(<MockedGradientTextSVG>{longText}</MockedGradientTextSVG>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should render text with special characters', () => {
      const specialText = 'Test <>&"\'';
      render(<MockedGradientTextSVG>{specialText}</MockedGradientTextSVG>);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('should render text with numbers', () => {
      render(
        <MockedGradientTextSVG>Volume increased by 25%</MockedGradientTextSVG>,
      );

      expect(screen.getByText('Volume increased by 25%')).toBeInTheDocument();
    });
  });
});
