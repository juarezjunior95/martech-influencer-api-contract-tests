import React from 'react';

import { render, screen } from '@testing-library/react';

import { dataMock } from './__mocks';
import { HeaderContent, HeaderContentItem } from './HeaderContent';

describe('HeaderContent', () => {
  it('should render the HeaderContent component with correct data-testid', () => {
    render(<HeaderContent items={dataMock} dataTestId="my-test" />);

    const headerContent = screen.getByTestId('header-content-my-test');

    expect(headerContent).toBeInTheDocument();

    dataMock.forEach((item) => {
      if (item.title) {
        expect(
          screen.getByText(item.title, { exact: true }),
        ).toBeInTheDocument();
      }

      if (item.subtitle) {
        expect(
          screen.getByText(item.subtitle, { exact: true }),
        ).toBeInTheDocument();
      }

      if (item.content) {
        item.content.forEach((content) => {
          expect(headerContent).toContainHTML(content.props.children);
        });
      }
    });
  });

  it('should render dividers with correct dynamic ids', () => {
    render(<HeaderContent items={dataMock} dataTestId="div-test" />);

    const dividers = screen.getAllByTestId(/header-content-div-test-divider-/);
    expect(dividers).toHaveLength(dataMock.length - 1);
  });

  it('should not render data-testid if prop is not provided', () => {
    render(<HeaderContent items={dataMock} />);

    const element = screen.queryByTestId('header-content');
    expect(element).not.toBeInTheDocument();
  });

  it('should render only the HeaderContent content when title and subtitle are missing', () => {
    const items: HeaderContentItem[] = [
      {
        content: [<p key="unique-content">This is a unique content</p>],
      },
    ];

    render(<HeaderContent items={items} dataTestId="content-only" />);

    const content = screen.getByText('This is a unique content');
    expect(content).toBeInTheDocument();

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
