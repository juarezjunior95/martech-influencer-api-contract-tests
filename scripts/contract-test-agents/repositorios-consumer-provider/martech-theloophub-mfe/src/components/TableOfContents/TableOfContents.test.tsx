import { render, screen } from '@testing-library/react';

jest.mock('./TableOfContents.styles', () => {
  const passthrough = (className: string) => {
    const Component = ({ children, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    );
    Component.displayName = `Styled(${className})`;
    return Component;
  };
  const passthroughSpan = (className: string) => {
    const Component = ({ children, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    );
    Component.displayName = `Styled(${className})`;
    return Component;
  };
  const StyledFlag = ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} className="flag" {...props} />
  );
  StyledFlag.displayName = 'StyledFlag';

  return {
    StyledContainer: passthrough('container'),
    StyledContent: passthrough('content'),
    StyledTitle: passthroughSpan('title'),
    StyledStacked: passthrough('stacked'),
    StyledStackedItem: passthrough('stacked-item'),
    StyledItemHeader: passthrough('item-header'),
    StyledItemTitle: passthroughSpan('item-title'),
    StyledItemDescription: passthroughSpan('item-description'),
    StyledItemPage: passthroughSpan('item-page'),
    StyledGrid: passthrough('grid'),
    StyledCard: passthrough('card'),
    StyledCardHeader: passthrough('card-header'),
    StyledCardHeaderLeft: passthrough('card-header-left'),
    StyledCardSubItems: passthrough('card-sub-items'),
    StyledCardSubItem: passthrough('card-sub-item'),
    StyledSubItemLabel: passthroughSpan('sub-item-label'),
    StyledDivider: passthrough('divider'),
    StyledIconWrapper: passthroughSpan('icon-wrapper'),
    StyledFlag,
  };
});

import { TableOfContents, TocGroup } from './TableOfContents';

const singleStackedGroup: TocGroup[] = [
  {
    layout: 'stacked',
    items: [{ title: 'Only Item', page: 1 }],
  },
];

const multiStackedGroup: TocGroup[] = [
  {
    layout: 'stacked',
    items: [
      { title: 'First', page: 1 },
      { title: 'Second', description: 'desc', page: 2 },
      { title: 'Third', page: 3 },
    ],
  },
];

const gridGroup: TocGroup[] = [
  {
    layout: 'grid',
    columns: 3,
    items: [
      {
        title: 'Brazil',
        countryImageUrl: '/flags/BRA.png',
        countryCode: 'BRA',
        countryName: 'Brazil',
        page: 10,
        subItems: [
          { label: 'Q3 2025', page: 11 },
          { label: 'YTD 2025', page: 12 },
        ],
      },
    ],
  },
];

describe('TableOfContents', () => {
  describe('title', () => {
    it('renders the default title when no title prop is provided', () => {
      render(<TableOfContents groups={[]} />);

      expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    });

    it('renders a custom title when provided', () => {
      render(<TableOfContents title="Sumário" groups={[]} />);

      expect(screen.getByText('Sumário')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders only the title when groups array is empty', () => {
      const { container } = render(
        <TableOfContents groups={[]} dataTestId="toc" />,
      );

      expect(container.querySelector('.stacked')).not.toBeInTheDocument();
      expect(container.querySelector('.grid')).not.toBeInTheDocument();
    });
  });

  describe('stacked layout', () => {
    it('uses stacked layout by default when layout is not specified', () => {
      const { container } = render(
        <TableOfContents
          groups={[{ items: [{ title: 'Untyped', page: 1 }] }]}
        />,
      );

      expect(container.querySelector('.stacked')).toBeInTheDocument();
      expect(container.querySelector('.grid')).not.toBeInTheDocument();
    });

    it('renders all stacked items with their titles and pages', () => {
      render(<TableOfContents groups={multiStackedGroup} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders a divider between the first item and the rest when there are multiple items', () => {
      const { container } = render(
        <TableOfContents groups={multiStackedGroup} />,
      );

      const dividers = container.querySelectorAll('.divider');
      expect(dividers).toHaveLength(1);
    });

    it('does not render a divider when the stacked group has only one item', () => {
      const { container } = render(
        <TableOfContents groups={singleStackedGroup} />,
      );

      expect(container.querySelector('.divider')).not.toBeInTheDocument();
    });

    it('renders the description when provided', () => {
      render(<TableOfContents groups={multiStackedGroup} />);

      expect(screen.getByText('desc')).toBeInTheDocument();
    });

    it('does not render any description element when description is missing', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'stacked',
              items: [{ title: 'No description', page: 1 }],
            },
          ]}
        />,
      );

      expect(
        container.querySelector('.item-description'),
      ).not.toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    it('renders cards inside a grid container', () => {
      const { container } = render(<TableOfContents groups={gridGroup} />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(container.querySelector('.card')).toBeInTheDocument();
    });

    it('applies the configured number of columns via grid-template-columns', () => {
      const { container } = render(<TableOfContents groups={gridGroup} />);

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('defaults to 4 columns when grid columns are not specified', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'grid',
              items: [{ title: 'X', page: 1 }],
            },
          ]}
        />,
      );

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
    });

    it('renders the card title and page', () => {
      render(<TableOfContents groups={gridGroup} />);

      expect(screen.getByText('Brazil')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders sub-items with their labels and pages', () => {
      render(<TableOfContents groups={gridGroup} />);

      expect(screen.getByText('Q3 2025')).toBeInTheDocument();
      expect(screen.getByText('YTD 2025')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders a divider between header and sub-items when sub-items exist', () => {
      const { container } = render(<TableOfContents groups={gridGroup} />);

      expect(container.querySelectorAll('.divider')).toHaveLength(1);
    });

    it('renders a card without any sub-item rows when sub-items are absent', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'grid',
              items: [{ title: 'Lonely', page: 1 }],
            },
          ]}
        />,
      );

      expect(container.querySelector('.card')).toBeInTheDocument();
      expect(container.querySelector('.card-sub-item')).not.toBeInTheDocument();
      expect(
        container.querySelector('.sub-item-label'),
      ).not.toBeInTheDocument();
    });

    it('renders a card without any sub-item rows when sub-items array is empty', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'grid',
              items: [{ title: 'Empty subs', page: 1, subItems: [] }],
            },
          ]}
        />,
      );

      expect(container.querySelector('.card')).toBeInTheDocument();
      expect(container.querySelector('.card-sub-item')).not.toBeInTheDocument();
    });
  });

  describe('flag rendering', () => {
    it('renders a flag using the image URL from item', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'grid',
              items: [
                {
                  title: 'Brazil',
                  countryImageUrl: '/flags/BRA.png',
                  countryCode: 'BRA',
                  countryName: 'Brazil',
                  page: 1,
                },
              ],
            },
          ]}
        />,
      );

      const flag = container.querySelector('.flag') as HTMLImageElement;
      expect(flag).toBeInTheDocument();
      expect(flag).toHaveAttribute('src', '/flags/BRA.png');
      expect(flag).toHaveAttribute('alt', 'Brazil flag');
    });

    it('uses countryCode for alt text when countryName is not provided', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'grid',
              items: [
                {
                  title: 'X',
                  countryImageUrl: '/flags/CHN.png',
                  countryCode: 'CHN',
                  page: 1,
                },
              ],
            },
          ]}
        />,
      );

      const flag = container.querySelector('.flag') as HTMLImageElement;
      expect(flag).toHaveAttribute('alt', 'CHN flag');
    });

    it('does not render a flag when countryImageUrl is not provided', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'stacked',
              items: [{ title: 'No flag', page: 1 }],
            },
          ]}
        />,
      );

      expect(container.querySelector('.flag')).not.toBeInTheDocument();
    });
  });

  describe('icon rendering', () => {
    it('renders a custom icon when provided', () => {
      render(
        <TableOfContents
          groups={[
            {
              layout: 'stacked',
              items: [
                {
                  title: 'Has icon',
                  page: 1,
                  icon: <span data-testid="my-icon">★</span>,
                },
              ],
            },
          ]}
        />,
      );

      expect(screen.getByTestId('my-icon')).toBeInTheDocument();
    });

    it('does not render the icon wrapper when no icon is provided', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'stacked',
              items: [{ title: 'No icon', page: 1 }],
            },
          ]}
        />,
      );

      expect(container.querySelector('.icon-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('dataTestId', () => {
    it('propagates dataTestId to the title element', () => {
      render(<TableOfContents groups={[]} dataTestId="toc" />);

      expect(screen.getByTestId('title-toc')).toBeInTheDocument();
    });

    it('propagates dataTestId to stacked items', () => {
      render(<TableOfContents groups={multiStackedGroup} dataTestId="toc" />);

      expect(screen.getByTestId('stacked-0-0-toc')).toBeInTheDocument();
      expect(screen.getByTestId('stacked-0-1-toc')).toBeInTheDocument();
      expect(screen.getByTestId('stacked-0-2-toc')).toBeInTheDocument();
    });

    it('propagates dataTestId to grid cards and sub-items', () => {
      render(<TableOfContents groups={gridGroup} dataTestId="toc" />);

      expect(screen.getByTestId('card-0-0-toc')).toBeInTheDocument();
      expect(screen.getByTestId('card-0-0-sub-0-toc')).toBeInTheDocument();
      expect(screen.getByTestId('card-0-0-sub-1-toc')).toBeInTheDocument();
    });

    it('does not break when dataTestId is omitted', () => {
      const { container } = render(<TableOfContents groups={gridGroup} />);

      expect(container.querySelector('.card')).toBeInTheDocument();
    });
  });

  describe('multiple groups', () => {
    it('renders multiple groups in order', () => {
      const { container } = render(
        <TableOfContents
          groups={[
            {
              layout: 'stacked',
              items: [{ title: 'Top', page: 1 }],
            },
            {
              layout: 'grid',
              items: [{ title: 'Bottom', page: 2 }],
            },
          ]}
        />,
      );

      expect(container.querySelector('.stacked')).toBeInTheDocument();
      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(screen.getByText('Top')).toBeInTheDocument();
      expect(screen.getByText('Bottom')).toBeInTheDocument();
    });
  });
});
