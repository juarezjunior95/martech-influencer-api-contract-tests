import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { dataMock } from './__mocks';
import { BigNumber } from './BigNumber';

const pinCallbackMock = jest.fn();

describe('BigNumber', () => {
  it('should render the BigNumber component with card', () => {
    render(<BigNumber data={dataMock} />);

    const content = screen.getByTestId('big-number-card');

    expect(content).toBeInTheDocument();
  });

  it('should render the BigNumber component without card', () => {
    render(<BigNumber likeCard={false} data={dataMock} />);

    const content = screen.queryByTestId('big-number-card');
    expect(content).not.toBeInTheDocument();
  });

  it('should call pinCallback when clicked', async () => {
    render(<BigNumber hasPin pinCallback={pinCallbackMock} data={dataMock} />);

    const pinButton = screen.getByTestId('pin');
    await fireEvent.click(pinButton);

    expect(pinCallbackMock).toHaveBeenCalled();
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<BigNumber data={dataMock} dataTestId="custom" />);

      expect(screen.getByTestId('big-number-card-custom')).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<BigNumber data={dataMock} />);

      expect(
        screen.queryByTestId('big-number-card-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
