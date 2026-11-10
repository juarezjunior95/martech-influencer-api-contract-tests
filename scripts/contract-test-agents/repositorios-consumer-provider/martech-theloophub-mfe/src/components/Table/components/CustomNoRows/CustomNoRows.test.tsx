import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CustomNoRows } from './CustomNoRows';

jest.mock('components', () => ({
  NoDataYet: ({ color, title, description }: any) => (
    <div data-testid="no-data-yet" data-color={color}>
      <div data-testid="title">{title}</div>
      <div data-testid="description">{description}</div>
    </div>
  ),
}));

describe('CustomNoRows', () => {
  it('should render the component', () => {
    const { getByTestId } = render(<CustomNoRows />);

    expect(getByTestId('no-data-yet')).toBeInTheDocument();
  });

  it('should render with title', () => {
    const { getByTestId } = render(<CustomNoRows title="No Data" />);

    expect(getByTestId('title')).toHaveTextContent('No Data');
  });

  it('should render with description', () => {
    const { getByTestId } = render(
      <CustomNoRows description="No records found" />,
    );

    expect(getByTestId('description')).toHaveTextContent('No records found');
  });

  it('should render with both title and description', () => {
    const { getByTestId } = render(
      <CustomNoRows
        title="Empty Table"
        description="Add data to get started"
      />,
    );

    expect(getByTestId('title')).toHaveTextContent('Empty Table');
    expect(getByTestId('description')).toHaveTextContent(
      'Add data to get started',
    );
  });

  it('should always pass color as primary to NoDataYet', () => {
    const { getByTestId } = render(<CustomNoRows />);

    expect(getByTestId('no-data-yet')).toHaveAttribute('data-color', 'primary');
  });

  it('should render without title or description', () => {
    const { getByTestId } = render(<CustomNoRows />);

    expect(getByTestId('no-data-yet')).toBeInTheDocument();
  });
});
