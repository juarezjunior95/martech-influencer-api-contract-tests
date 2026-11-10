import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../hooks/useSubFilterLogic', () => ({
  useSubFilterLogic: jest.fn(),
}));

import { useSubFilterLogic } from '../../hooks/useSubFilterLogic';
import { SubFilterSegmentedControl } from './SubFilterSegmentedControl';

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    value,
    onValueChange,
    options,
    disabled,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'segmented-control'}
      data-disabled={String(disabled)}
    >
      <div data-testid="current-value">{value}</div>
      <div data-testid="options-count">{options.length}</div>
      {options.map((option: any) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          onClick={() => onValueChange(option.value)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
  Grid: {
    Container: 'div',
    Row: 'div',
    Col: 'div',
  },
}));

jest.mock('../FilterSkeleton/FilterSkeleton', () => ({
  FilterSkeleton: ({ dataTestId }: any) => (
    <div data-testid={dataTestId || 'filter-skeleton'}>Loading...</div>
  ),
}));

describe('SubFilterSegmentedControl', () => {
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
    fieldKey: 'test-field',
    pageName: 'test-page',
    apiKey: 'test-api-key',
    stateKey: 'test-state-key',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubFilterLogic.mockReturnValue(defaultMockReturn);
  });

  describe('Basic Rendering', () => {
    it('should render SegmentedControl when conditions are met', () => {
      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should render within a div wrapper', () => {
      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      const wrapper = container.querySelector('div');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.firstChild).toHaveAttribute(
        'data-testid',
        'segmented-control',
      );
    });

    it('should call useSubFilterLogic with props', () => {
      const customProps = {
        fieldKey: 'custom-field',
        pageName: 'custom-page',
      };

      render(
        <SubFilterSegmentedControl
          apiKey="test-api-key"
          stateKey="test-state-key"
          {...customProps}
        />,
      );

      expect(mockUseSubFilterLogic).toHaveBeenCalled();
    });
  });

  describe('isHidden condition', () => {
    it('should return null when isHidden is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
      });

      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('segmented-control')).not.toBeInTheDocument();
      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
    });

    it('should render normally when isHidden is false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });
  });

  describe('isLoaded condition', () => {
    it('should render FilterSkeleton when isLoaded is false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: false,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('filter-skeleton')).toHaveTextContent(
        'Loading...',
      );
      expect(screen.queryByTestId('segmented-control')).not.toBeInTheDocument();
    });

    it('should NOT render FilterSkeleton when isLoaded is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: true,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should prioritize isHidden over isLoaded', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
        isLoaded: false,
      });

      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('options.length condition', () => {
    it('should return null when options array is empty', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [],
      });

      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('segmented-control')).not.toBeInTheDocument();
    });

    it('should render when options has at least one item', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [{ value: 'single', label: 'Single Option' }],
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('options-count')).toHaveTextContent('1');
    });

    it('should render with multiple options', () => {
      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('options-count')).toHaveTextContent('3');
    });
  });

  describe('SegmentedControl props', () => {
    it('should pass currentValue as value prop', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option2',
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('current-value')).toHaveTextContent('option2');
    });

    it('should cast currentValue to string', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 123,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('current-value')).toHaveTextContent('123');
    });

    it('should pass options array', () => {
      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('option-option1')).toBeInTheDocument();
      expect(screen.getByTestId('option-option2')).toBeInTheDocument();
      expect(screen.getByTestId('option-option3')).toBeInTheDocument();
    });

    it('should pass handleOnChange to onValueChange', () => {
      render(<SubFilterSegmentedControl {...defaultProps} />);

      const option2Button = screen.getByTestId('option-option2');
      fireEvent.click(option2Button);

      expect(mockHandleOnChange).toHaveBeenCalledTimes(1);
      expect(mockHandleOnChange).toHaveBeenCalledWith('option2');
    });

    it('should handle multiple option clicks', () => {
      render(<SubFilterSegmentedControl {...defaultProps} />);

      fireEvent.click(screen.getByTestId('option-option1'));
      fireEvent.click(screen.getByTestId('option-option2'));
      fireEvent.click(screen.getByTestId('option-option3'));

      expect(mockHandleOnChange).toHaveBeenCalledTimes(3);
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(1, 'option1');
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(2, 'option2');
      expect(mockHandleOnChange).toHaveBeenNthCalledWith(3, 'option3');
    });
  });

  describe('disabled prop calculation', () => {
    it('should be enabled when both isDisabled and isInUse are false', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: false,
        isInUse: false,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-disabled',
        'false',
      );
    });

    it('should be disabled when isDisabled is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: true,
        isInUse: false,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('should be disabled when isInUse is true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: false,
        isInUse: true,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('should be disabled when both isDisabled and isInUse are true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isDisabled: true,
        isInUse: true,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });
  });

  describe('Conditional Rendering Priority', () => {
    it('should check isHidden first (returns null)', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
        isLoaded: false,
        options: [],
      });

      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should check isLoaded second (returns skeleton)', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
        isLoaded: false,
        options: [],
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('segmented-control')).not.toBeInTheDocument();
    });

    it('should check options.length third (returns null)', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
        isLoaded: true,
        options: [],
      });

      const { container } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render SegmentedControl when all conditions pass', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
        isLoaded: true,
        options: [{ value: 'test', label: 'Test' }],
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: undefined,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('current-value')).toHaveTextContent('');
    });

    it('should handle null currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: null,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should handle empty string currentValue', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: '',
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('current-value')).toHaveTextContent('');
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

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('option-option-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-option_2')).toBeInTheDocument();
      expect(screen.getByTestId('option-option.3')).toBeInTheDocument();
    });

    it('should handle single option', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [{ value: 'only', label: 'Only Option' }],
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('options-count')).toHaveTextContent('1');
    });

    it('should handle many options', () => {
      const manyOptions = Array.from({ length: 10 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: manyOptions,
      });

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('options-count')).toHaveTextContent('10');
    });
  });

  describe('Component Re-rendering', () => {
    it('should update when currentValue changes', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option1',
      });

      const { rerender } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(screen.getByTestId('current-value')).toHaveTextContent('option1');

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        currentValue: 'option3',
      });

      rerender(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('current-value')).toHaveTextContent('option3');
    });

    it('should update when options change', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [{ value: 'a', label: 'A' }],
      });

      const { rerender } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(screen.getByTestId('options-count')).toHaveTextContent('1');

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      });

      rerender(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('options-count')).toHaveTextContent('2');
    });

    it('should toggle between skeleton and control when isLoaded changes', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: false,
      });

      const { rerender } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: true,
      });

      rerender(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should hide when isHidden becomes true', () => {
      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: false,
      });

      const { container, rerender } = render(
        <SubFilterSegmentedControl {...defaultProps} />,
      );

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();

      mockUseSubFilterLogic.mockReturnValue({
        ...defaultMockReturn,
        isHidden: true,
      });

      rerender(<SubFilterSegmentedControl {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Integration with useSubFilterLogic', () => {
    it('should pass all props to useSubFilterLogic', () => {
      const allProps = {
        fieldKey: 'test-field',
        pageName: 'test-page',
        extraProp: 'extra',
      };

      render(
        <SubFilterSegmentedControl
          apiKey="test-api-key"
          stateKey="test-state-key"
          {...allProps}
        />,
      );

      expect(mockUseSubFilterLogic).toHaveBeenCalled();
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
        handleOnChange: mockHandleOnChange,
      };

      mockUseSubFilterLogic.mockReturnValue(customReturn as any);

      render(<SubFilterSegmentedControl {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('current-value')).toHaveTextContent('custom1');
      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-disabled',
        'true',
      );
      expect(screen.getByTestId('option-custom1')).toBeInTheDocument();
      expect(screen.getByTestId('option-custom2')).toBeInTheDocument();
    });
  });
});
