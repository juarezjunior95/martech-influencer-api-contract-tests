import React from 'react';

import { render, screen } from '@testing-library/react';

import { Tag } from './Tag';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, style }: any) => <p style={style}>{children}</p>,
}));

jest.mock('./Tag.styles', () => ({
  TagBox: ({ children, style, ...rest }: any) => (
    <div style={style} {...rest}>
      {children}
    </div>
  ),
}));

describe('Tag Component', () => {
  it('should render Tag with text "Test"', () => {
    render(<Tag text="Test" />);

    const paragraphElement = screen.getByText('Test');
    expect(paragraphElement).toBeInTheDocument();
  });

  describe('dataTestId Prop', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<Tag text="Test" dataTestId="tag-category" />);

      expect(screen.getByTestId('tag-category')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<Tag text="Test" />);

      const tagBox = container.firstChild;
      expect(tagBox).not.toHaveAttribute('data-testid');
    });
  });
});
