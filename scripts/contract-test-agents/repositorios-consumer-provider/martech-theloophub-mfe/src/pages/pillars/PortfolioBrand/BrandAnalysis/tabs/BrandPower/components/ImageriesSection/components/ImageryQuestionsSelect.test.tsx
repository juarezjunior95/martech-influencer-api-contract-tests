import { render, screen } from '@testing-library/react';
import { Option } from 'models/Filters';
import { SubFilters } from 'models/SubFilters';

import { ImageryQuestionsSelect } from './ImageryQuestionsSelect';

const mockActiveSubFilters: SubFilters = {
  imagery_questions: 'question1',
};

const mockSubFiltersData: SubFilters = {
  imagery_questions: {
    values: [
      { label: 'Question 1', value: 'question1' },
      { label: 'Question 2', value: 'question2' },
    ],
  },
};

let mockOnValueChange: (op: any) => void = () => undefined;

jest.mock('components', () => ({
  Select: ({
    value,
    onValueChange,
  }: {
    value: string;
    options: Array<Option & { id?: string }>;
    onValueChange: (op: any) => void;
  }) => {
    mockOnValueChange = onValueChange;
    return <div data-testid="select" data-value={value} />;
  },
}));

describe('ImageryQuestionsSelect', () => {
  const renderComponent = (
    props: Partial<{
      activeSubFilters: SubFilters;
      subFiltersData: SubFilters;
      setSubFilterValue: jest.Mock;
    }> = {},
  ) => {
    const setSubFilterValue = props.setSubFilterValue ?? jest.fn();
    render(
      <ImageryQuestionsSelect
        activeSubFilters={props.activeSubFilters ?? mockActiveSubFilters}
        setSubFilterValue={setSubFilterValue}
        subFiltersData={props.subFiltersData ?? mockSubFiltersData}
      />,
    );
    return { setSubFilterValue };
  };

  it('renders the current active value', () => {
    renderComponent();
    expect(screen.getByTestId('select')).toHaveAttribute(
      'data-value',
      'question1',
    );
  });

  describe('single value payloads', () => {
    it('uses option.value when provided', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange({ value: 'question2', label: 'Question 2' });

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'question2',
      );
    });

    it('falls back to id when option has no value', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange({ id: 'question1', label: 'Question 1' });

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'question1',
      );
    });

    it('falls back to label when option has neither value nor id', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange({ label: 'Question only label' });

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'Question only label',
      );
    });

    it('accepts a plain string payload', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange('question1');

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'question1',
      );
    });
  });

  describe('array payloads', () => {
    it('uses the first item value', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange([{ value: 'arr1', label: 'A' }]);

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'arr1',
      );
    });

    it('falls back to first item id when value is missing', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange([{ id: 'arr-id', label: 'A' }]);

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'arr-id',
      );
    });

    it('falls back to first item label when value/id are missing', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange([{ label: 'Only label' }]);

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'Only label',
      );
    });

    it('accepts a string-only array', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange(['plain-string']);

      expect(setSubFilterValue).toHaveBeenCalledWith(
        'imagery_questions',
        'plain-string',
      );
    });

    it('ignores empty arrays', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange([]);

      expect(setSubFilterValue).not.toHaveBeenCalled();
    });

    it('ignores arrays whose first item has only nullish keys', () => {
      const { setSubFilterValue } = renderComponent();

      mockOnValueChange([{ value: null, id: undefined, label: undefined }]);

      expect(setSubFilterValue).not.toHaveBeenCalled();
    });
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
  ])('ignores %s payloads', (_label, payload) => {
    const { setSubFilterValue } = renderComponent();

    mockOnValueChange(payload as any);

    expect(setSubFilterValue).not.toHaveBeenCalled();
  });

  it('ignores single objects with all nullish keys', () => {
    const { setSubFilterValue } = renderComponent();

    mockOnValueChange({ value: null, id: undefined, label: undefined });

    expect(setSubFilterValue).not.toHaveBeenCalled();
  });

  it.each([
    ['empty options', { imagery_questions: { values: [] } } as SubFilters],
    ['missing imagery_questions entry', {} as SubFilters],
  ])('handles %s gracefully', (_label, subFiltersData) => {
    renderComponent({ subFiltersData });
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
