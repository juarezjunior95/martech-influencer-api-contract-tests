import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../hooks/useSubFilterLogic', () => ({
  useSubFilterLogic: jest.fn(),
}));

import { useSubFilterLogic } from '../../hooks/useSubFilterLogic';
import { SubFilterSelect } from './SubFilterSelect';

jest.mock('components/Form', () => ({
  Select: ({
    id,
    value,
    onValueChange,
    disabled,
    options,
    shape,
    size,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div data-testid="select-component">
      <select
        data-testid={dataTestId || 'select-element'}
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        data-shape={shape}
        data-size={size}
        {...props}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('../FilterSkeleton/FilterSkeleton', () => ({
  FilterSkeleton: ({ dataTestId }: any) => (
    <div data-testid={dataTestId || 'filter-skeleton'}>Loading...</div>
  ),
}));

describe('SubFilterSelect', () => {
  const mockUseSubFilterLogic = useSubFilterLogic as jest.MockedFunction<
    typeof useSubFilterLogic
  >;
  const mockHandleOnChange = jest.fn();

  const defaultMockReturn = {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    currentValue: 'option1',
    isDisabled: false,
    isInUse: false,
    isHidden: false,
    isLoaded: true,
    stateKey: 'test-state-key',
    handleOnChange: mockHandleOnChange,
  };

  const defaultProps = {
    name: 'test-filter',
    apiKey: 'test-api',
    stateKey: 'test-state',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubFilterLogic.mockReturnValue(defaultMockReturn);
  });

  describe('Basic Rendering', () => {
    it('should render Select component when conditions are met', () => {
      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
      expect(screen.getByTestId('select-element')).toBeInTheDocument();
    });

    it('should render within a div wrapper with minWidth 120px', () => {
      const { container } = render(<SubFilterSelect {...defaultProps} />);

      const wrapper = container.querySelector('div[style*="min-width"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle({ minWidth: '120px' });
    });

    it('should call useSubFilterLogic with correct props', () => {
      const customProps = {
        name: 'custom-filter',
        apiKey: 'custom-api',
        stateKey: 'custom-state',
        params: { country: 'BR' },
        iconsByValue: { option1: 'icon1' },
        allKey: 'all',
      };

      render(<SubFilterSelect {...customProps} />);

      expect(mockUseSubFilterLogic).toHaveBeenCalledWith({
        name: 'custom-filter',
        apiKey: 'custom-api',
        stateKey: 'custom-state',
        params: { country: 'BR' },
        groupBy: undefined,
        iconsByValue: { option1: 'icon1' },
        allKey: 'all',
      });
    });
  });

  describe('isHidden condition', () => {
    it('should return null when isHidden is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
      });

      const { container } = render(<SubFilterSelect {...defaultProps} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('select-component')).not.toBeInTheDocument();
      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
    });

    it('should render normally when isHidden is false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });
  });

  describe('isLoaded condition', () => {
    it('should render FilterSkeleton when isLoaded is false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: false,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('filter-skeleton')).toHaveTextContent(
        'Loading...',
      );
      expect(screen.queryByTestId('select-component')).not.toBeInTheDocument();
    });

    it('should NOT render FilterSkeleton when isLoaded is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: true,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should prioritize isHidden over isLoaded', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
        isLoaded: false,
      });

      const { container } = render(<SubFilterSelect {...defaultProps} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('Select props', () => {
    it('should pass id prop from stateKey', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('id', 'test-state');
    });

    it('should pass currentValue as value prop', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option2',
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement: HTMLSelectElement =
        screen.getByTestId('select-element');
      expect(selectElement.value).toBe('option2');
    });

    it('should pass options array', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('should call handleOnChange when value changes', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement: HTMLSelectElement =
        screen.getByTestId('select-element');
      fireEvent.change(selectElement, { target: { value: 'option3' } });

      expect(mockHandleOnChange).toHaveBeenCalledTimes(1);
      expect(mockHandleOnChange).toHaveBeenCalledWith('option3');
    });

    it('should pass default shape as pill', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('data-shape', 'pill');
    });

    it('should pass default size as medium', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('data-size', 'medium');
    });

    it('should pass aria-label from stateKey', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('aria-label', 'test-state');
    });
  });

  describe('disabled prop calculation', () => {
    it('should be enabled when both isDisabled and isInUse are false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: false,
        isInUse: false,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).not.toBeDisabled();
    });

    it('should be disabled when isDisabled is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: true,
        isInUse: false,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toBeDisabled();
    });

    it('should be disabled when isInUse is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: false,
        isInUse: true,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toBeDisabled();
    });

    it('should be disabled when both isDisabled and isInUse are true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: true,
        isInUse: true,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toBeDisabled();
    });
  });

  describe('Additional Select props passthrough', () => {
    it('should pass additional props to Select component', () => {
      render(
        <SubFilterSelect
          {...defaultProps}
          placeholder="Select an option"
          data-custom="custom-value"
        />,
      );

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('placeholder', 'Select an option');
      expect(selectElement).toHaveAttribute('data-custom', 'custom-value');
    });

    it('should override shape prop', () => {
      render(<SubFilterSelect {...defaultProps} shape="square" />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('data-shape', 'square');
    });

    it('should override size prop', () => {
      render(<SubFilterSelect {...defaultProps} size="large" />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('data-size', 'large');
    });

    it('should not allow overriding id prop through stateKey', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');
      expect(selectElement).toHaveAttribute('id', 'test-state');
      expect(selectElement).toHaveAttribute('aria-label', 'test-state');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [],
      });

      render(<SubFilterSelect {...defaultProps} />);

      const options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options).toHaveLength(0);
    });

    it('should handle undefined currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: undefined,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement: HTMLSelectElement =
        screen.getByTestId('select-element');

      expect(selectElement).toBeInTheDocument();
    });

    it('should handle null currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: null,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('select-element')).toBeInTheDocument();
    });

    it('should handle empty string currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: '',
      });

      render(<SubFilterSelect {...defaultProps} />);

      const selectElement: HTMLSelectElement =
        screen.getByTestId('select-element');
      expect(selectElement).toBeInTheDocument();
    });

    it('should handle single option', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [{ value: 'only', label: 'Only Option' }],
      });

      render(<SubFilterSelect {...defaultProps} />);

      const options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Only Option');
    });

    it('should handle many options', () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: manyOptions,
      });

      render(<SubFilterSelect {...defaultProps} />);

      const options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options).toHaveLength(20);
    });

    it('should handle options with special characters', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [
          { value: 'option-1', label: 'Option 1' },
          { value: 'option_2', label: 'Option 2' },
          { value: 'option.3', label: 'Option 3' },
        ],
      });

      render(<SubFilterSelect {...defaultProps} />);

      const options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options[0]).toHaveValue('option-1');
      expect(options[1]).toHaveValue('option_2');
      expect(options[2]).toHaveValue('option.3');
    });
  });

  describe('Component Re-rendering', () => {
    it('should update when currentValue changes', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option1',
      });

      const { rerender } = render(<SubFilterSelect {...defaultProps} />);

      let selectElement = screen.getByTestId(
        'select-element',
      ) as HTMLSelectElement;
      expect(selectElement.value).toBe('option1');

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option3',
      });

      rerender(<SubFilterSelect {...defaultProps} />);

      selectElement = screen.getByTestId('select-element') as HTMLSelectElement;
      expect(selectElement.value).toBe('option3');
    });

    it('should update when options change', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [{ value: 'a', label: 'A' }],
      });

      const { rerender } = render(<SubFilterSelect {...defaultProps} />);

      let options = screen
        .getByTestId('select-element')
        .querySelectorAll('option');
      expect(options).toHaveLength(1);

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      });

      rerender(<SubFilterSelect {...defaultProps} />);

      options = screen.getByTestId('select-element').querySelectorAll('option');
      expect(options).toHaveLength(2);
    });

    it('should toggle between skeleton and select when isLoaded changes', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: false,
      });

      const { rerender } = render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: true,
      });

      rerender(<SubFilterSelect {...defaultProps} />);

      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should hide when isHidden becomes true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
      });

      const { container, rerender } = render(
        <SubFilterSelect {...defaultProps} />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
      });

      rerender(<SubFilterSelect {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });

    it('should update disabled state', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: false,
        isInUse: false,
      });

      const { rerender } = render(<SubFilterSelect {...defaultProps} />);

      let selectElement = screen.getByTestId('select-element');
      expect(selectElement).not.toBeDisabled();

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: true,
        isInUse: false,
      });

      rerender(<SubFilterSelect {...defaultProps} />);

      selectElement = screen.getByTestId('select-element');
      expect(selectElement).toBeDisabled();
    });
  });

  describe('Integration with useSubFilterLogic', () => {
    it('should pass only useSubFilterLogic props to the hook', () => {
      const props = {
        name: 'test-filter',
        apiKey: 'test-api',
        stateKey: 'test-state',
        params: { country: 'BR' },
        iconsByValue: { opt1: 'icon' },
        allKey: 'all',
        placeholder: 'Select',
        className: 'custom-class',
      };

      render(<SubFilterSelect {...props} />);

      expect(mockUseSubFilterLogic).toHaveBeenCalledWith({
        name: 'test-filter',
        apiKey: 'test-api',
        stateKey: 'test-state',
        params: { country: 'BR' },
        groupBy: undefined,
        iconsByValue: { opt1: 'icon' },
        allKey: 'all',
      });
    });

    it('should use all values returned from useSubFilterLogic', () => {
      const customReturn = {
        options: [
          { value: 'custom1', label: 'Custom 1' },
          { value: 'custom2', label: 'Custom 2' },
        ],
        currentValue: 'custom1',
        isDisabled: true,
        isInUse: false,
        isHidden: false,
        isLoaded: true,
        stateKey: 'custom-state',
        handleOnChange: mockHandleOnChange,
      };

      mockUseSubFilterLogic.mockReturnValue(customReturn);

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
      const selectElement: HTMLSelectElement =
        screen.getByTestId('select-element');
      expect(selectElement.value).toBe('custom1');
      expect(selectElement).toBeDisabled();

      const options = selectElement.querySelectorAll('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('Custom 1');
      expect(options[1]).toHaveTextContent('Custom 2');
    });
  });

  describe('Multiple onChange calls', () => {
    it('should handle multiple value changes', () => {
      render(<SubFilterSelect {...defaultProps} />);

      const selectElement = screen.getByTestId('select-element');

      fireEvent.change(selectElement, { target: { value: 'option1' } });
      fireEvent.change(selectElement, { target: { value: 'option2' } });
      fireEvent.change(selectElement, { target: { value: 'option3' } });

      expect(mockHandleOnChange).toHaveBeenCalledTimes(3);
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(1, 'option1');
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(2, 'option2');
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(3, 'option3');
    });
  });

  describe('Conditional Rendering Priority', () => {
    it('should check isHidden first', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
        isLoaded: false,
      });

      const { container } = render(<SubFilterSelect {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });

    it('should check isLoaded second (returns skeleton)', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
        isLoaded: false,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('select-component')).not.toBeInTheDocument();
    });

    it('should render Select when all conditions pass', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
        isLoaded: true,
      });

      render(<SubFilterSelect {...defaultProps} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });
  });
});
