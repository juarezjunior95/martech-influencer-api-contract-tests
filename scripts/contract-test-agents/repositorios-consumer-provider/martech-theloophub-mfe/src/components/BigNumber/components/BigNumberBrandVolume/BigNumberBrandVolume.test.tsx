import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberBrandVolume } from './BigNumberBrandVolume';

describe('BigNumberBrandVolume', () => {
  const mockItem: BigNumberData = {
    brandVolume: {
      value: '51.2',
      label: 'of Brand Volume',
      color: '#007800',
    },
  };

  describe('Rendering', () => {
    test('should render brand volume value with percentage', () => {
      render(<BigNumberBrandVolume item={mockItem} />);

      expect(screen.getByText(/51.2%/)).toBeInTheDocument();
    });

    test('should render brand volume label', () => {
      render(<BigNumberBrandVolume item={mockItem} />);

      expect(screen.getByText('of Brand Volume')).toBeInTheDocument();
    });

    test('should render empty state message and hide label', () => {
      render(
        <BigNumberBrandVolume
          item={{
            brandVolume: {
              value: '',
              color: '#5c5c5c',
              label: '',
              emptyStateMessage: 'No R12M POS volume available',
            },
          }}
          dataTestId="bv-empty"
        />,
      );

      expect(screen.getByTestId('bv-empty-empty-state')).toHaveTextContent(
        'No R12M POS volume available',
      );
      expect(screen.queryByTestId('bv-empty-label')).not.toBeInTheDocument();
    });

    test('should render with custom measure instead of default %', () => {
      const itemWithMeasure: BigNumberData = {
        brandVolume: {
          value: '100',
          label: 'of Brand Volume',
          color: '#007800',
          measure: ' pts',
        },
      };

      render(<BigNumberBrandVolume item={itemWithMeasure} />);

      expect(screen.getByText(/100 pts/)).toBeInTheDocument();
    });

    test('should not render when brandVolume is not provided', () => {
      const itemWithoutBrandVolume: BigNumberData = {};

      const { container } = render(
        <BigNumberBrandVolume item={itemWithoutBrandVolume} />,
      );

      expect(container.firstChild).toBeNull();
    });

    test('should apply correct color to value', () => {
      render(
        <BigNumberBrandVolume item={mockItem} dataTestId="brand-volume-test" />,
      );

      const valueElement = screen.getByTestId('brand-volume-test-value');
      expect(valueElement).toHaveStyle({ color: '#007800' });
    });

    test('should render with 0% value', () => {
      const itemWithZero: BigNumberData = {
        brandVolume: {
          value: '0',
          label: 'of Brand Volume',
          color: '#BA0B0B',
        },
      };

      render(<BigNumberBrandVolume item={itemWithZero} />);

      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });

    test('should render with 100% value', () => {
      const itemWith100: BigNumberData = {
        brandVolume: {
          value: '100',
          label: 'of Brand Volume',
          color: '#007800',
        },
      };

      render(<BigNumberBrandVolume item={itemWith100} />);

      expect(screen.getByText(/100%/)).toBeInTheDocument();
    });

    test('should render when label is empty string', () => {
      const itemWithEmptyLabel: BigNumberData = {
        brandVolume: {
          value: '51.2',
          label: '',
          color: '#007800',
        },
      };

      render(
        <BigNumberBrandVolume
          item={itemWithEmptyLabel}
          dataTestId="brand-volume-empty-label"
        />,
      );

      const labelElement = screen.getByTestId('brand-volume-empty-label-label');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveTextContent('');
    });

    test('should render with measure containing special characters', () => {
      const itemWithSpecialMeasure: BigNumberData = {
        brandVolume: {
          value: '100',
          label: 'of Brand Volume',
          color: '#007800',
          measure: ' pp',
        },
      };

      render(<BigNumberBrandVolume item={itemWithSpecialMeasure} />);

      expect(screen.getByText(/100 pp/)).toBeInTheDocument();
    });

    test('should render without color property', () => {
      const itemWithoutColor: BigNumberData = {
        brandVolume: {
          value: '51.2',
          label: 'of Brand Volume',
          color: undefined,
        },
      };

      const { container } = render(
        <BigNumberBrandVolume
          item={itemWithoutColor}
          dataTestId="brand-volume-no-color"
        />,
      );

      expect(container).toBeInTheDocument();
      expect(screen.getByText(/51.2%/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should render with decimal value with multiple decimal places', () => {
      const itemWithDecimals: BigNumberData = {
        brandVolume: {
          value: '51.234',
          label: 'of Brand Volume',
          color: '#007800',
        },
      };

      render(<BigNumberBrandVolume item={itemWithDecimals} />);

      expect(screen.getByText(/51.234%/)).toBeInTheDocument();
    });

    test('should render with very large percentage value', () => {
      const itemWithLargeValue: BigNumberData = {
        brandVolume: {
          value: '999.9',
          label: 'of Brand Volume',
          color: '#007800',
        },
      };

      render(<BigNumberBrandVolume item={itemWithLargeValue} />);

      expect(screen.getByText(/999.9%/)).toBeInTheDocument();
    });

    test('should render negative value', () => {
      const itemWithNegative: BigNumberData = {
        brandVolume: {
          value: '-5.2',
          label: 'of Brand Volume',
          color: '#BA0B0B',
        },
      };

      render(<BigNumberBrandVolume item={itemWithNegative} />);

      expect(screen.getByText(/-5.2%/)).toBeInTheDocument();
    });

    test('should handle label with special characters', () => {
      const itemWithSpecialLabel: BigNumberData = {
        brandVolume: {
          value: '51.2',
          label: 'of Brand Volume (R12M)',
          color: '#007800',
        },
      };

      render(<BigNumberBrandVolume item={itemWithSpecialLabel} />);

      expect(screen.getByText('of Brand Volume (R12M)')).toBeInTheDocument();
    });

    test('should render multiple instances without conflict', () => {
      const { container } = render(
        <div>
          <BigNumberBrandVolume item={mockItem} dataTestId="brand-volume-1" />
          <BigNumberBrandVolume
            item={{
              brandVolume: {
                value: '23.2',
                label: 'of Brand Volume',
                color: '#141414',
              },
            }}
            dataTestId="brand-volume-2"
          />
        </div>,
      );

      expect(screen.getByTestId('brand-volume-1-value')).toBeInTheDocument();
      expect(screen.getByTestId('brand-volume-2-value')).toBeInTheDocument();
      expect(screen.getByText(/51.2%/)).toBeInTheDocument();
      expect(screen.getByText(/23.2%/)).toBeInTheDocument();
    });
  });

  describe('Tooltips', () => {
    test('should render Core tooltip when audienceType is core', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="core"
          dataTestId="brand-volume-core"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-core-value');
      await user.hover(valueElement);

      const elements = await screen.findAllByText('Core Audience Brand Volume');
      expect(elements[0]).toBeInTheDocument();
    });

    test('should render Halo tooltip when audienceType is halo', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="halo"
          dataTestId="brand-volume-halo"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-halo-value');
      await user.hover(valueElement);

      const elements = await screen.findAllByText('Halo Audience Brand Volume');
      expect(elements[0]).toBeInTheDocument();
    });

    test('should not render tooltip when audienceType is not provided', () => {
      render(
        <BigNumberBrandVolume
          item={mockItem}
          dataTestId="brand-volume-no-tooltip"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-no-tooltip-value');
      expect(valueElement.closest('[data-tooltip]')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Content Validation', () => {
    test('should display correct Core tooltip subtitle', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="core"
          dataTestId="brand-volume-core"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-core-value');
      await user.hover(valueElement);

      const elements = await screen.findAllByText(
        /Share of total brand volume \(R12M\) coming from the Core Audience/,
      );
      expect(elements[0]).toBeInTheDocument();
    });

    test('should display Core tooltip health indicator text', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="core"
          dataTestId="brand-volume-core"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-core-value');
      await user.hover(valueElement);

      const greenElements = await screen.findAllByText(
        /Green = Core ≥50% \(aligned\)/,
      );
      expect(greenElements[0]).toBeInTheDocument();
      const redElements = await screen.findAllByText(
        /Red = Core <50% \(off-target\)/,
      );
      expect(redElements[0]).toBeInTheDocument();
    });

    test('should display Halo tooltip subtitle', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="halo"
          dataTestId="brand-volume-halo"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-halo-value');
      await user.hover(valueElement);

      const elements = await screen.findAllByText(
        /Adjacent consumers 1-2 steps from the Core/,
      );
      expect(elements[0]).toBeInTheDocument();
    });

    test('should display Halo tooltip no health indicator text', async () => {
      const user = userEvent.setup();

      render(
        <BigNumberBrandVolume
          item={mockItem}
          audienceType="halo"
          dataTestId="brand-volume-halo"
        />,
      );

      const valueElement = screen.getByTestId('brand-volume-halo-value');
      await user.hover(valueElement);

      const elements = await screen.findAllByText(
        /Halo does not receive a Health indicator/,
      );
      expect(elements[0]).toBeInTheDocument();
    });
  });

  describe('Data Test IDs', () => {
    test('should apply dataTestId to container when provided', () => {
      render(
        <BigNumberBrandVolume item={mockItem} dataTestId="custom-test-id" />,
      );

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    test('should apply dataTestId to value element', () => {
      render(
        <BigNumberBrandVolume item={mockItem} dataTestId="custom-test-id" />,
      );

      expect(screen.getByTestId('custom-test-id-value')).toBeInTheDocument();
    });

    test('should apply dataTestId to label element', () => {
      render(
        <BigNumberBrandVolume item={mockItem} dataTestId="custom-test-id" />,
      );

      expect(screen.getByTestId('custom-test-id-label')).toBeInTheDocument();
    });

    test('should apply dataTestId to divider element', () => {
      render(
        <BigNumberBrandVolume item={mockItem} dataTestId="custom-test-id" />,
      );

      expect(screen.getByTestId('custom-test-id-divider')).toBeInTheDocument();
    });

    test('should not apply dataTestId when not provided', () => {
      const { container } = render(<BigNumberBrandVolume item={mockItem} />);

      const elementsWithTestId = container.querySelectorAll('[data-testid]');
      expect(elementsWithTestId).toHaveLength(0);
    });
  });
});
