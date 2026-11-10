import React from 'react';

import { render, screen } from '@testing-library/react';

import {
  dataBigNumberVariationMock,
  dataMock,
  emptyDataMock,
} from '../../__mocks';
import { BigNumberContent } from './BigNumberContent';

describe('BigNumberContent', () => {
  it('should render the BigNumberContent component', () => {
    render(<BigNumberContent data={dataMock} />);

    const content = screen.getByTestId('big-number-content');
    expect(content).toBeInTheDocument();
  });

  it('should render the BigNumberContent data', () => {
    render(<BigNumberContent data={dataMock} />);

    const title = screen.getByText(dataMock?.title || '');
    const period = screen.getByText(dataMock?.period || '');

    expect(title).toBeInTheDocument();
    expect(period).toBeInTheDocument();
  });

  it('should render the BigNumberContent with pinned icon', () => {
    render(
      <BigNumberContent
        hasPin={true}
        isPinned={true}
        data={dataBigNumberVariationMock}
      />,
    );

    const pinFilled = screen.getByTestId('pin-filled');

    expect(pinFilled).toBeInTheDocument();
  });

  it('should render the BigNumberContent empty icon', () => {
    render(<BigNumberContent data={emptyDataMock} />);

    const title = screen.getByText(emptyDataMock.title);
    const icon = screen.getByTestId('no-data-yet-icon');

    expect(title).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });
});
