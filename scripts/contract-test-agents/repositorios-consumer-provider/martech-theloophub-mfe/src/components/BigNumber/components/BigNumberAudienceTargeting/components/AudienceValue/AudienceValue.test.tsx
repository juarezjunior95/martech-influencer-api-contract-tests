import { render, screen } from '@testing-library/react';

import { FALLBACK_VALUE } from '../../utils/constants';
import * as formattersModule from '../../utils/formatters';
import { AudienceValue } from './AudienceValue';

jest.mock('../../utils/formatters', () => ({
  formatAudienceField: jest.fn(),
}));

jest.mock('../Separator/Separator', () => ({
  Separator: ({ dataTestId }: { dataTestId?: string }) => (
    <span data-testid={dataTestId ? `${dataTestId}-separator` : undefined}>
      {' '}
      /{' '}
    </span>
  ),
}));

const formatAudienceField =
  formattersModule.formatAudienceField as jest.MockedFunction<
    typeof formattersModule.formatAudienceField
  >;

describe('AudienceValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render text value', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: 'text value',
      });

      render(
        <AudienceValue
          fieldKey="customField"
          value="text value"
          dataTestId="test"
        />,
      );

      const textElement = screen.getByTestId('test-text-customField');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveTextContent('text value');
    });

    it('should render fallback value', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: FALLBACK_VALUE,
      });

      render(
        <AudienceValue
          fieldKey="customField"
          value={undefined}
          dataTestId="test"
        />,
      );

      const textElement = screen.getByTestId('test-text-customField');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveTextContent(FALLBACK_VALUE);
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: 'text value',
      });

      const { container } = render(
        <AudienceValue fieldKey="customField" value="text value" />,
      );

      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      expect(div).not.toHaveAttribute('data-testid');
    });

    it('should not render separator for text type', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: 'text value',
      });

      render(
        <AudienceValue
          fieldKey="customField"
          value="text value"
          dataTestId="test"
        />,
      );

      expect(screen.queryByTestId('test-separator')).not.toBeInTheDocument();
    });
  });

  describe('Array rendering', () => {
    it('should render array values with separators', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['male', 'female'],
      });

      render(
        <AudienceValue
          fieldKey="gender"
          value={['male', 'female']}
          dataTestId="test"
        />,
      );

      const arrayContainer = screen.getByTestId('test-array-gender');
      expect(arrayContainer).toBeInTheDocument();

      const firstItem = screen.getByTestId('test-item-0');
      const secondItem = screen.getByTestId('test-item-1');

      expect(firstItem).toHaveTextContent('male');
      expect(secondItem).toHaveTextContent('female');
      expect(screen.getByTestId('test-separator')).toBeInTheDocument();
    });

    it('should render single array value without separator', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['male'],
      });

      render(
        <AudienceValue fieldKey="gender" value={['male']} dataTestId="test" />,
      );

      const arrayContainer = screen.getByTestId('test-array-gender');
      expect(arrayContainer).toBeInTheDocument();

      const firstItem = screen.getByTestId('test-item-0');
      expect(firstItem).toHaveTextContent('male');
      expect(screen.queryByTestId('test-separator')).not.toBeInTheDocument();
    });

    it('should render multiple array values with correct number of separators', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['18-24', '25-34', '35-44'],
      });

      render(
        <AudienceValue
          fieldKey="age"
          value={['18-24', '25-34', '35-44']}
          dataTestId="test"
        />,
      );

      const arrayContainer = screen.getByTestId('test-array-age');
      expect(arrayContainer).toBeInTheDocument();

      const firstItem = screen.getByTestId('test-item-0');
      const secondItem = screen.getByTestId('test-item-1');
      const thirdItem = screen.getByTestId('test-item-2');

      expect(firstItem).toHaveTextContent('18-24');
      expect(secondItem).toHaveTextContent('25-34');
      expect(thirdItem).toHaveTextContent('35-44');

      const separators = screen.getAllByTestId('test-separator');
      expect(separators).toHaveLength(2);
    });

    it('should not render anything when array is empty', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: [],
      });

      render(<AudienceValue fieldKey="gender" value={[]} dataTestId="test" />);

      const arrayContainer = screen.getByTestId('test-array-gender');
      expect(arrayContainer).toBeInTheDocument();
      expect(screen.queryByTestId('test-item-0')).not.toBeInTheDocument();
    });
  });

  describe('Formatters handling', () => {
    it('should format gender field correctly', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['male', 'female'],
      });

      render(
        <AudienceValue
          fieldKey="gender"
          value={['male', 'female']}
          dataTestId="test"
        />,
      );

      expect(formatAudienceField).toHaveBeenCalledWith('gender', [
        'male',
        'female',
      ]);
    });

    it('should format age field correctly', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['25-34', '35-44'],
      });

      render(
        <AudienceValue
          fieldKey="age"
          value={['25-34', '35-44']}
          dataTestId="test"
        />,
      );

      expect(formatAudienceField).toHaveBeenCalledWith('age', [
        '25-34',
        '35-44',
      ]);
    });

    it('should format incomeBracket field correctly', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['low', 'medium', 'high'],
      });

      render(
        <AudienceValue
          fieldKey="incomeBracket"
          value={['low', 'medium', 'high']}
          dataTestId="test"
        />,
      );

      expect(formatAudienceField).toHaveBeenCalledWith('incomeBracket', [
        'low',
        'medium',
        'high',
      ]);
    });

    it('should format unknown field as text', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: 'custom value',
      });

      render(
        <AudienceValue
          fieldKey="unknownField"
          value="custom value"
          dataTestId="test"
        />,
      );

      expect(formatAudienceField).toHaveBeenCalledWith(
        'unknownField',
        'custom value',
      );

      const textElement = screen.getByTestId('test-text-unknownField');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveTextContent('custom value');
    });
  });

  describe('Null and undefined values handling', () => {
    it('should format null value as text', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: FALLBACK_VALUE,
      });

      render(
        <AudienceValue fieldKey="gender" value={null} dataTestId="test" />,
      );

      expect(screen.getByTestId('test-text-gender')).toBeInTheDocument();
      expect(screen.getByTestId('test-text-gender')).toHaveTextContent(
        FALLBACK_VALUE,
      );
    });

    it('should format undefined value as text', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: FALLBACK_VALUE,
      });

      render(
        <AudienceValue fieldKey="age" value={undefined} dataTestId="test" />,
      );

      expect(screen.getByTestId('test-text-age')).toBeInTheDocument();
      expect(screen.getByTestId('test-text-age')).toHaveTextContent(
        FALLBACK_VALUE,
      );
    });

    it('should format numeric value as text', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: '123',
      });

      render(
        <AudienceValue fieldKey="customField" value={123} dataTestId="test" />,
      );

      expect(screen.getByTestId('test-text-customField')).toBeInTheDocument();
      expect(screen.getByTestId('test-text-customField')).toHaveTextContent(
        '123',
      );
    });

    it('should format boolean value as text', () => {
      formatAudienceField.mockReturnValue({
        type: 'text',
        value: 'true',
      });

      render(
        <AudienceValue fieldKey="customField" value={true} dataTestId="test" />,
      );

      expect(screen.getByTestId('test-text-customField')).toBeInTheDocument();
      expect(screen.getByTestId('test-text-customField')).toHaveTextContent(
        'true',
      );
    });
  });

  describe('Duplicate items handling', () => {
    it('should format duplicate items', () => {
      formatAudienceField.mockReturnValue({
        type: 'array',
        value: ['item1', 'item2', 'item1'],
      });

      render(
        <AudienceValue
          fieldKey="test"
          value={['item1', 'item2', 'item1']}
          dataTestId="audience"
        />,
      );

      expect(screen.getByTestId('audience-array-test')).toBeInTheDocument();
      expect(screen.getByTestId('audience-item-0')).toHaveTextContent('item1');
      expect(screen.getByTestId('audience-item-1')).toHaveTextContent('item2');
      expect(screen.getByTestId('audience-item-2')).toHaveTextContent('item1');
    });
  });
});
