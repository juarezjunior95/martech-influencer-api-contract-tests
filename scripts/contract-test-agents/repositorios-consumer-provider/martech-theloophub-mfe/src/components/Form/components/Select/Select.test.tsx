import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Option } from 'models/Filters';

import { Select } from './Select';

describe('Select Component', () => {
  const mockOptions: Option[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockOnValueChange = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup({ delay: null });
  });

  describe('Rendering', () => {
    it('should render the select component', () => {
      render(<Select id="test-select" options={mockOptions} />);

      const selectElement = screen.getByText('Select an option');
      expect(selectElement).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          placeholder="Choose an option"
        />,
      );

      const placeholder = screen.getByText('Choose an option');
      expect(placeholder).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(
        <Select id="test-select" options={mockOptions} label="Select Label" />,
      );

      const label = screen.getByText('Select Label');
      expect(label).toBeInTheDocument();
    });

    it('should render with optional flag', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          label="Select Label"
          optional
        />,
      );

      const optionalFlag = screen.getByText('(optional)');
      expect(optionalFlag).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          error="This field is required"
        />,
      );

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Single Selection', () => {
    it('should call onValueChange when an option is selected', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          onValueChange={mockOnValueChange}
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');
      await user.click(option1);

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith(mockOptions[0]);
      });
    }, 1500);

    it('should display selected value', async () => {
      const { rerender } = render(
        <Select
          id="test-select"
          options={mockOptions}
          onValueChange={mockOnValueChange}
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      const option2 = screen.getByText('Option 2');
      await user.click(option2);

      rerender(
        <Select
          id="test-select"
          options={mockOptions}
          value={mockOptions[1]}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('should allow multiple selections', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          multiple
          onValueChange={mockOnValueChange}
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');
      await user.click(option1);

      expect(mockOnValueChange).toHaveBeenCalledWith([mockOptions[0]]);
    });

    it('should render Select All option when multiple is enabled', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          multiple
          showSelectAll
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Select All')).toBeInTheDocument();
      });
    });

    it('should select all options when Select All is clicked', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          multiple
          showSelectAll
          onValueChange={mockOnValueChange}
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Select All')).toBeInTheDocument();
      });

      const selectAllOption = screen.getByText('Select All');
      await user.click(selectAllOption);

      expect(mockOnValueChange).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Select id="test-select" options={mockOptions} disabled />);

      const selectContainer = document.querySelector(
        '.test-select-select__control--is-disabled',
      );
      expect(selectContainer).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<Select id="test-select" options={mockOptions} loading />);

      const loadingIndicator = document.querySelector(
        '.test-select-select__loading-indicator',
      );
      expect(loadingIndicator).toBeInTheDocument();
    });
  });

  describe('Searchable', () => {
    it('should render search input when searchable is true', async () => {
      render(<Select id="test-select" options={mockOptions} searchable />);

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        const searchInput = document.querySelector(
          'input[name="react-select-search"]',
        );
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('should filter options when searching', async () => {
      render(<Select id="test-select" options={mockOptions} searchable />);

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        const searchInput = document.querySelector(
          'input[name="react-select-search"]',
        );
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = document.querySelector(
        'input[name="react-select-search"]',
      );

      if (searchInput) {
        await user.type(searchInput, 'Option 1');

        await waitFor(() => {
          expect(screen.getByText('Option 1')).toBeInTheDocument();
          expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
          expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Clearable', () => {
    it('should show clear button when clearable and value is selected', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          value={mockOptions[0]}
          clearable
          onValueChange={mockOnValueChange}
        />,
      );

      const clearButton = document.querySelector(
        '.test-select-select__clear-indicator',
      );
      expect(clearButton).toBeInTheDocument();

      if (clearButton) {
        await user.click(clearButton);
        expect(mockOnValueChange).toHaveBeenCalledWith('');
      }
    });
  });

  describe('Chips Mode', () => {
    it('should render chips when chips prop is true and multiple is enabled', async () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          value={[mockOptions[0], mockOptions[1]]}
          multiple
          chips
        />,
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Disabled Options', () => {
    it('should not select disabled options', async () => {
      const optionsWithDisabled: Option[] = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2', isDisabled: true },
        { value: 'option3', label: 'Option 3' },
      ];

      render(
        <Select
          id="test-select"
          options={optionsWithDisabled}
          onValueChange={mockOnValueChange}
        />,
      );

      const selectInput = screen.getByText('Select an option');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      const option2 = screen.getByText('Option 2');
      await user.click(option2);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Default Value', () => {
    it('should render without errors when defaultValue is provided', () => {
      const { container } = render(
        <Select
          id="test-select"
          options={mockOptions}
          defaultValue={mockOptions[1].value as string}
        />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });

    it('should display selected value when value prop is provided', () => {
      const { container } = render(
        <Select
          id="test-select"
          options={mockOptions}
          value={mockOptions[1]}
        />,
      );

      const singleValue = container.querySelector(
        '.test-select-select__single-value',
      );
      expect(singleValue).toBeInTheDocument();
      expect(singleValue).toHaveTextContent('Option 2');
    });
  });

  describe('Size Variants', () => {
    it('should render with small size', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} size="small" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });

    it('should render with medium size', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} size="medium" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });

    it('should render with large size', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} size="large" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Shape Variants', () => {
    it('should render with pill shape', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} shape="pill" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });

    it('should render with square shape', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} shape="square" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Appearance Variants', () => {
    it('should render with default appearance', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} appearance="default" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });

    it('should render with plain appearance', () => {
      const { container } = render(
        <Select id="test-select" options={mockOptions} appearance="plain" />,
      );

      const select = container.querySelector('#test-select');
      expect(select).toBeInTheDocument();
    });
  });

  // NOVOS TESTES DE ID
  describe('data-testid', () => {
    it('should render component with data-testid', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          dataTestId="my-custom-select"
        />,
      );

      expect(screen.getByTestId('my-custom-select')).toBeInTheDocument();
    });

    it('should render label with suffix when data-testid is provided', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          label="My Label"
          dataTestId="my-custom-select"
        />,
      );

      expect(screen.getByTestId('my-custom-select-label')).toBeInTheDocument();
    });

    it('should render error with suffix when data-testid is provided', () => {
      render(
        <Select
          id="test-select"
          options={mockOptions}
          error="Error!"
          dataTestId="my-custom-select"
        />,
      );

      expect(screen.getByTestId('my-custom-select-error')).toBeInTheDocument();
    });

    it('should NOT render data-testids if prop is not provided (Clean Code)', () => {
      const { container } = render(
        <Select
          id="test-select"
          options={mockOptions}
          label="Label"
          error="Err"
        />,
      );

      expect(container.firstChild).not.toHaveAttribute('data-testid');
      expect(screen.getByText('Label')).not.toHaveAttribute('data-testid');
      expect(screen.getByText('Err').parentElement).not.toHaveAttribute(
        'data-testid',
      );
    });
  });
});
