import React from 'react';

import { render, screen } from '@testing-library/react';
import { GroupCellRendererParams } from 'ag-grid-community';

import { CampaignsCellRenderer } from './CampaignsCellRenderer';

jest.mock('components', () => ({
  CustomTooltip: ({ children, content, backgroundStyle }: any) => (
    <div
      data-testid="custom-tooltip"
      data-background-style={backgroundStyle}
      data-content={content?.props?.children}
    >
      {children}
    </div>
  ),
}));

jest.mock(
  'shared/Styles/shared.styles',
  () => ({
    StyledBlackTooltipContainer: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <span data-testid="tooltip-container" className={className}>
        {children}
      </span>
    ),
  }),
  { virtual: true },
);

jest.mock('../../../constants', () => ({
  MAX_LENGTH_FOR_TOOLTIP: 10,
}));

jest.mock('./CampaignsCellRenderer.styles', () => ({
  StyledAgCellContent: ({ children, className }: any) => (
    <div data-testid="ag-cell-content" className={className}>
      {children}
    </div>
  ),
  StyledCampaignsContainer: ({ children }: any) => (
    <div data-testid="campaigns-container">{children}</div>
  ),
  StyledCampaignsItem: ({ children, isLast }: any) => (
    <div data-testid="campaigns-item" data-is-last={String(isLast)}>
      {children}
    </div>
  ),
}));

describe('CampaignsCellRenderer', () => {
  const createMockParams = (
    value: Array<{ id: string; value: string; original_value?: number }>,
  ): GroupCellRendererParams =>
    ({
      colDef: { field: 'campaigns' },
      data: {
        campaigns_config: {
          value,
        },
      },
    }) as unknown as GroupCellRendererParams;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering behavior', () => {
    it('renders cell content container with correct class', () => {
      const params = createMockParams([{ id: '1', value: 'Campaign 1' }]);

      render(<CampaignsCellRenderer {...params} />);

      const container = screen.getByTestId('ag-cell-content');
      expect(container).toHaveClass('ag-cell-content');
    });

    it.each([
      [
        'renders campaigns container when value has items',
        [{ id: '1', value: 'Campaign 1' }],
        true,
      ],
      ['does not render campaigns container when value is empty', [], false],
    ])('%s', (_, value, shouldRender) => {
      const params = createMockParams(value);

      render(<CampaignsCellRenderer {...params} />);

      const container = screen.queryByTestId('campaigns-container');
      if (shouldRender) {
        expect(container).toBeInTheDocument();
      } else {
        expect(container).not.toBeInTheDocument();
      }
    });
  });

  describe('Campaign items', () => {
    it('renders all campaign items and sets isLast correctly', () => {
      const params = createMockParams([
        { id: '1', value: 'Camp 1' },
        { id: '2', value: 'Camp 2' },
      ]);

      render(<CampaignsCellRenderer {...params} />);

      const items = screen.getAllByTestId('campaigns-item');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute('data-is-last', 'false');
      expect(items[1]).toHaveAttribute('data-is-last', 'true');
    });

    it('displays the campaign value text', () => {
      const params = createMockParams([{ id: '1', value: 'Test Campaign' }]);

      render(<CampaignsCellRenderer {...params} />);

      expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    });
  });

  describe('Tooltip behavior', () => {
    it.each([
      [
        'renders tooltip for long value with transparent background',
        [{ id: '1', value: 'This is a very long campaign name' }],
        true,
        'This is a very long campaign name',
      ],
      [
        'renders tooltip for item with original_value showing $ prefix',
        [{ id: '1', value: 'Short', original_value: 12345 }],
        true,
        '$12345',
      ],
      [
        'does not render tooltip for short items without original_value',
        [{ id: '1', value: 'Short' }],
        false,
        null,
      ],
    ])('%s', (_, value, shouldRender, expectedContent) => {
      const params = createMockParams(value);

      render(<CampaignsCellRenderer {...params} />);

      const tooltip = screen.queryByTestId('custom-tooltip');
      if (shouldRender) {
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveAttribute('data-background-style', 'transparent');
        if (expectedContent) {
          expect(tooltip).toHaveAttribute('data-content', expectedContent);
        }
      } else {
        expect(tooltip).not.toBeInTheDocument();
      }
    });
  });

  describe('Mixed scenarios and edge cases', () => {
    it('renders some items with tooltip and some without', () => {
      const params = createMockParams([
        { id: '1', value: 'Short' },
        { id: '2', value: 'This is a very long campaign' },
        { id: '3', value: 'Value', original_value: 999 },
      ]);

      render(<CampaignsCellRenderer {...params} />);

      const tooltips = screen.getAllByTestId('custom-tooltip');
      expect(tooltips).toHaveLength(2);

      const items = screen.getAllByTestId('campaigns-item');
      expect(items).toHaveLength(3);
    });

    it('reads config from correct field based on colDef', () => {
      const params = {
        colDef: { field: 'customField' },
        data: {
          customField_config: {
            value: [{ id: '1', value: 'Custom Campaign' }],
          },
        },
      } as unknown as GroupCellRendererParams;

      render(<CampaignsCellRenderer {...params} />);

      expect(screen.getByText('Custom Campaign')).toBeInTheDocument();
    });

    it.each([
      ['single item', [{ id: '1', value: 'Only One' }], 'true'],
      ['empty string value', [{ id: '1', value: '' }], 'true'],
    ])('handles %s correctly', (_, value, expectedIsLast) => {
      const params = createMockParams(value);

      render(<CampaignsCellRenderer {...params} />);

      const item = screen.getByTestId('campaigns-item');
      expect(item).toHaveAttribute('data-is-last', expectedIsLast);
    });

    it('handles original_value of 0 correctly (no tooltip)', () => {
      const params = createMockParams([
        { id: '1', value: 'Val', original_value: 0 },
      ]);

      render(<CampaignsCellRenderer {...params} />);

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });
  });
});
