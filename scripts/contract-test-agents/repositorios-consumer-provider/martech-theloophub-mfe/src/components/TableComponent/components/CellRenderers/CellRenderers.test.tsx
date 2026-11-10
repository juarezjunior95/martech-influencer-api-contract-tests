import { fireEvent, render, screen } from '@testing-library/react';

import { AxisCell } from './AxisCell';
import { BarChartCell } from './BarChartCell';
import { CheckboxCell } from './CheckboxCell';
import { HeaderGridCell } from './HeaderGridCell';
import { IconCell } from './IconCell';
import { ImageCell } from './ImageCell';
import { IndexTagCell } from './IndexTagCell';
import { NumberCell } from './NumberCell';
import { TextCell } from './TextCell/index';

const mockColumn = { id: 'col1', title: 'Column 1' };

describe('CellRenderers', () => {
  describe('TextCell', () => {
    it('should render value correctly', () => {
      render(
        <TextCell
          cell={{ value: 'Test Value' }}
          column={mockColumn}
          dataTestId="text-cell"
        />,
      );

      expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    it('should render dash when value is null', () => {
      render(
        <TextCell
          cell={{ value: null }}
          column={mockColumn}
          dataTestId="text-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is undefined', () => {
      render(<TextCell cell={{}} column={mockColumn} dataTestId="text-cell" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(
        <TextCell
          cell={{ value: 'Main', subtitle: 'Sub' }}
          column={mockColumn}
          dataTestId="text-cell"
        />,
      );

      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Sub')).toBeInTheDocument();
    });

    it('should render number value as string', () => {
      render(
        <TextCell
          cell={{ value: 12345 }}
          column={mockColumn}
          dataTestId="text-cell"
        />,
      );

      expect(screen.getByText('12345')).toBeInTheDocument();
    });
  });

  describe('NumberCell', () => {
    it('should render number value', () => {
      render(
        <NumberCell
          cell={{ value: 123 }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should render unit measure', () => {
      render(
        <NumberCell
          cell={{ value: 45.5, unitMeasure: '%' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('45.5')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('should render variation measure', () => {
      render(
        <NumberCell
          cell={{
            value: 5.2,
            variationDirection: 'up',
            variationMeasure: 'vs LY',
          }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('5.2')).toBeInTheDocument();
      expect(screen.getByText('vs LY')).toBeInTheDocument();
    });

    it('should render secondary value', () => {
      render(
        <NumberCell
          cell={{ value: 100, secondaryValue: 200 }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should render with variationDirection up', () => {
      render(
        <NumberCell
          cell={{ value: 5.2, variationDirection: 'up' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('5.2')).toBeInTheDocument();
    });

    it('should render with variationDirection down', () => {
      render(
        <NumberCell
          cell={{ value: -3.1, variationDirection: 'down' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('-3.1')).toBeInTheDocument();
    });

    it('should render with variationDirection neutral', () => {
      render(
        <NumberCell
          cell={{ value: 0, variationDirection: 'neutral' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render with showArrow true', () => {
      render(
        <NumberCell
          cell={{ value: 5.2, variationDirection: 'up', showArrow: true }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('5.2')).toBeInTheDocument();
    });

    it('should render with showArrow false', () => {
      render(
        <NumberCell
          cell={{ value: 5.2, variationDirection: 'up', showArrow: false }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('5.2')).toBeInTheDocument();
    });

    it('should render secondary only', () => {
      render(
        <NumberCell
          cell={{ secondaryValue: 500, secondaryOnly: true }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByTestId('number-cell-secondary')).toBeInTheDocument();
    });

    it('should render with stacked layout', () => {
      render(
        <NumberCell
          cell={{ value: 100, secondaryValue: 200, layout: 'stacked' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByTestId('number-cell-secondary')).toBeInTheDocument();
    });

    it('should render with secondaryUnitMeasure', () => {
      render(
        <NumberCell
          cell={{
            value: 100,
            secondaryValue: 200,
            secondaryUnitMeasure: ' units',
          }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByTestId('number-cell-secondary')).toBeInTheDocument();
    });

    it('should render prefix', () => {
      render(
        <NumberCell
          cell={{ value: 100, prefix: '$' }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render dash when value is null', () => {
      render(
        <NumberCell
          cell={{ value: null }}
          column={mockColumn}
          dataTestId="number-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('AxisCell', () => {
    it('should render axis value', () => {
      render(
        <AxisCell
          cell={{ value: 'Axis Label' }}
          column={mockColumn}
          dataTestId="axis-cell"
        />,
      );

      expect(screen.getByText('Axis Label')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(
        <AxisCell
          cell={{ value: 'Main', subtitle: 'Subtitle' }}
          column={mockColumn}
          dataTestId="axis-cell"
        />,
      );

      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('should render dash when value is null', () => {
      render(
        <AxisCell
          cell={{ value: null }}
          column={mockColumn}
          dataTestId="axis-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should fill the cell width and use larger right padding when align is right', () => {
      render(
        <AxisCell
          cell={{ value: 'Male' }}
          column={{ ...mockColumn, align: 'right' }}
          dataTestId="axis-cell-right"
        />,
      );

      const cell = screen.getByTestId('axis-cell-right');
      expect(cell).toHaveStyle({
        width: '100%',
        'padding-right': '16px',
        'justify-content': 'flex-end',
      });
    });

    it('should keep auto width and default padding when align is not right', () => {
      render(
        <AxisCell
          cell={{ value: 'Male' }}
          column={{ ...mockColumn, align: 'left' }}
          dataTestId="axis-cell-left"
        />,
      );

      const cell = screen.getByTestId('axis-cell-left');
      expect(cell).toHaveStyle({
        width: 'auto',
        'padding-right': '8px',
      });
    });
  });

  describe('ImageCell', () => {
    it('should render image when src provided', () => {
      render(
        <ImageCell
          cell={{ value: 'Label', img: 'http://example.com/image.png' }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByTestId('image-cell-image')).toBeInTheDocument();
    });

    it('should render only text when no image', () => {
      render(
        <ImageCell
          cell={{ value: 'Just Text' }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      expect(screen.getByText('Just Text')).toBeInTheDocument();
      expect(screen.queryByTestId('image-cell-image')).not.toBeInTheDocument();
    });

    it('should render with circle shape', () => {
      render(
        <ImageCell
          cell={{
            value: 'Label',
            img: 'http://example.com/image.png',
            imgShape: 'circle',
          }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      expect(screen.getByTestId('image-cell-image')).toBeInTheDocument();
    });

    it('should render with square shape', () => {
      render(
        <ImageCell
          cell={{
            value: 'Label',
            img: 'http://example.com/image.png',
            imgShape: 'square',
          }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      expect(screen.getByTestId('image-cell-image')).toBeInTheDocument();
    });

    it('should render with image position top', () => {
      render(
        <ImageCell
          cell={{
            value: 'Label',
            img: 'http://example.com/image.png',
            imagePosition: 'top',
          }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      expect(screen.getByTestId('image-cell-image')).toBeInTheDocument();
    });

    it('should render imgName as alt', () => {
      render(
        <ImageCell
          cell={{
            value: 'Label',
            img: 'http://example.com/image.png',
            imgName: 'Test Image',
          }}
          column={mockColumn}
          dataTestId="image-cell"
        />,
      );

      const img = screen.getByTestId('image-cell-image');
      expect(img).toHaveAttribute('alt', 'Test Image');
    });
  });

  describe('IconCell', () => {
    it('should render icon with label', () => {
      render(
        <IconCell
          cell={{ value: 'Label', icon: 'Beer' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByTestId('icon-cell-icon-wrapper')).toBeInTheDocument();
    });

    it('should render icon without label', () => {
      render(
        <IconCell
          cell={{ icon: 'Check' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByTestId('icon-cell-icon-wrapper')).toBeInTheDocument();
      expect(screen.queryByTestId('icon-cell-label')).not.toBeInTheDocument();
    });

    it('should render icon with small size', () => {
      render(
        <IconCell
          cell={{ icon: 'Check', iconSize: 'small' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByTestId('icon-cell-icon-wrapper')).toBeInTheDocument();
    });

    it('should render icon with medium size', () => {
      render(
        <IconCell
          cell={{ icon: 'Check', iconSize: 'medium' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByTestId('icon-cell-icon-wrapper')).toBeInTheDocument();
    });

    it('should render icon with large size', () => {
      render(
        <IconCell
          cell={{ icon: 'Check', iconSize: 'large' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByTestId('icon-cell-icon-wrapper')).toBeInTheDocument();
    });

    it('should render icon on right position', () => {
      render(
        <IconCell
          cell={{ value: 'Label', icon: 'Check', iconPosition: 'right' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('should render external URL icon', () => {
      render(
        <IconCell
          cell={{ value: 'Label', icon: 'https://example.com/icon.png' }}
          column={mockColumn}
          dataTestId="icon-cell"
        />,
      );

      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('HeaderGridCell', () => {
    it('should render main value', () => {
      render(
        <HeaderGridCell
          cell={{ value: 'Header' }}
          column={mockColumn}
          dataTestId="header-cell"
        />,
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('should render subtext and subtitle', () => {
      render(
        <HeaderGridCell
          cell={{ value: 'Main', subtext: 'Subtext', subtitle: 'Subtitle' }}
          column={mockColumn}
          dataTestId="header-cell"
        />,
      );

      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Subtext')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('should render with icon', () => {
      render(
        <HeaderGridCell
          cell={{ value: 'Header', icon: 'BarChart2' }}
          column={mockColumn}
          dataTestId="header-cell"
        />,
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
    });
  });

  describe('CheckboxCell', () => {
    it('should render checkbox unchecked', () => {
      render(
        <CheckboxCell
          cell={{ value: 'Option', checkbox: true, checkboxState: 'unchecked' }}
          column={mockColumn}
          dataTestId="checkbox-cell"
        />,
      );

      expect(screen.getByText('Option')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render checkbox checked', () => {
      render(
        <CheckboxCell
          cell={{ value: 'Option', checkbox: true, checkboxState: 'checked' }}
          column={mockColumn}
          dataTestId="checkbox-cell"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render checkbox disabled', () => {
      render(
        <CheckboxCell
          cell={{
            value: 'Option',
            checkbox: true,
            checkboxState: 'unchecked',
            disabled: true,
          }}
          column={mockColumn}
          dataTestId="checkbox-cell"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should call onCheckboxChange when clicked', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxCell
          cell={{ value: 'Option', checkbox: true, checkboxState: 'unchecked' }}
          column={mockColumn}
          onCheckboxChange={handleChange}
          dataTestId="checkbox-cell"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should not call onCheckboxChange when disabled', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxCell
          cell={{
            value: 'Option',
            checkbox: true,
            checkboxState: 'unchecked',
            disabled: true,
          }}
          column={mockColumn}
          onCheckboxChange={handleChange}
          dataTestId="checkbox-cell"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('IndexTagCell', () => {
    it('should render value correctly', () => {
      render(
        <IndexTagCell
          cell={{ value: 100 }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render dash when value is null', () => {
      render(
        <IndexTagCell
          cell={{ value: null }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is undefined', () => {
      render(
        <IndexTagCell
          cell={{}}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is empty string', () => {
      render(
        <IndexTagCell
          cell={{ value: '' }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is dash', () => {
      render(
        <IndexTagCell
          cell={{ value: '-' }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render tag element for valid value', () => {
      render(
        <IndexTagCell
          cell={{ value: 110 }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByTestId('index-tag-cell-tag')).toBeInTheDocument();
    });

    it('should render string value correctly', () => {
      render(
        <IndexTagCell
          cell={{ value: '95' }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('95')).toBeInTheDocument();
    });

    it('should apply custom thresholds from props', () => {
      render(
        <IndexTagCell
          cell={{ value: 80 }}
          column={mockColumn}
          dataTestId="index-tag-cell"
          thresholds={{ upMin: 90, downMax: 70 }}
        />,
      );

      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('should apply custom thresholds from cell', () => {
      render(
        <IndexTagCell
          cell={{ value: 80, tagThresholds: { upMin: 90, downMax: 70 } }}
          column={mockColumn}
          dataTestId="index-tag-cell"
        />,
      );

      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('should prioritize cell thresholds over prop thresholds', () => {
      render(
        <IndexTagCell
          cell={{ value: 80, tagThresholds: { upMin: 75, downMax: 70 } }}
          column={mockColumn}
          dataTestId="index-tag-cell"
          thresholds={{ upMin: 90, downMax: 60 }}
        />,
      );

      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });

  describe('BarChartCell', () => {
    it('should render bar with percentage value', () => {
      render(
        <BarChartCell
          cell={{ value: 59.2 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('59.2%')).toBeInTheDocument();
    });

    it('should render dash when value is empty', () => {
      render(
        <BarChartCell
          cell={{ value: '-' }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is null', () => {
      render(
        <BarChartCell
          cell={{ value: null }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render dash when value is undefined', () => {
      render(
        <BarChartCell
          cell={{}}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render value with percentage sign if not already present', () => {
      render(
        <BarChartCell
          cell={{ value: 45.5 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('45.5%')).toBeInTheDocument();
    });

    it('should preserve percentage sign if already in value', () => {
      render(
        <BarChartCell
          cell={{ value: '60.0%' }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('60.0%')).toBeInTheDocument();
    });

    it('should clamp label to 100% when value exceeds 100', () => {
      render(
        <BarChartCell
          cell={{ value: 150 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should clamp label to 100% when string value exceeds 100%', () => {
      render(
        <BarChartCell
          cell={{ value: '150%' }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should apply bar color when provided', () => {
      render(
        <BarChartCell
          cell={{ value: 50 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
          barColor="#F0DF78"
        />,
      );

      const bar = screen.getByTestId('bar-chart-cell-bar');
      expect(bar).toBeInTheDocument();
    });

    it('should render bar with correct test id', () => {
      render(
        <BarChartCell
          cell={{ value: 30 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByTestId('bar-chart-cell-bar')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-cell-label')).toBeInTheDocument();
    });

    it('should handle zero value', () => {
      render(
        <BarChartCell
          cell={{ value: 0 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('should handle 100% value', () => {
      render(
        <BarChartCell
          cell={{ value: 100 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should handle string numeric values', () => {
      render(
        <BarChartCell
          cell={{ value: '75.5' }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('75.5%')).toBeInTheDocument();
    });

    it('should clamp label to 100% when numeric value exceeds 100', () => {
      render(
        <BarChartCell
          cell={{ value: 150 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should clamp label to 100% when percentage string exceeds 100', () => {
      render(
        <BarChartCell
          cell={{ value: '150.0%' }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should place label as sibling of the bar inside the bar container by default (Figma layout)', () => {
      render(
        <BarChartCell
          cell={{ value: 30 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
        />,
      );

      const cell = screen.getByTestId('bar-chart-cell');
      const label = screen.getByTestId('bar-chart-cell-label');
      const bar = screen.getByTestId('bar-chart-cell-bar');
      const barContainer = bar.parentElement as HTMLElement;

      expect(barContainer).toContainElement(label);
      expect(label.previousElementSibling).toBe(bar);
      expect(cell).toContainElement(label);
    });

    it('should place label outside the bar container when labelPosition is "end"', () => {
      render(
        <BarChartCell
          cell={{ value: 30 }}
          column={mockColumn}
          dataTestId="bar-chart-cell"
          labelPosition="end"
        />,
      );

      const cell = screen.getByTestId('bar-chart-cell');
      const label = screen.getByTestId('bar-chart-cell-label');
      const bar = screen.getByTestId('bar-chart-cell-bar');
      const barContainer = bar.parentElement as HTMLElement;

      expect(barContainer).not.toContainElement(label);
      expect(cell).toContainElement(label);
      expect(label.parentElement).toBe(cell);
    });
  });
});
