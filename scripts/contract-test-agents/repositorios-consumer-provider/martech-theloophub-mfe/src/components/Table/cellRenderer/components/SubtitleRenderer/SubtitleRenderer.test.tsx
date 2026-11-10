import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SubtitleRenderer } from './SubtitleRenderer';

jest.mock('shared/Styles', () => ({
  StyledRefreshLabel: ({ children, className, fontColor }: any) => (
    <span
      data-testid="styled-refresh-label"
      className={className}
      data-font-color={fontColor}
    >
      {children}
    </span>
  ),
}));

describe('SubtitleRenderer', () => {
  it('should render the component', () => {
    render(<SubtitleRenderer value="Main Value" subtitle="Subtitle Text" />);

    expect(screen.getByText('Main Value')).toBeInTheDocument();
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
  });

  it('should render value', () => {
    render(<SubtitleRenderer value="Test Value" subtitle="Test Subtitle" />);

    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should render subtitle in StyledRefreshLabel', () => {
    render(<SubtitleRenderer value="Value" subtitle="Subtitle" />);

    const styledLabel = screen.getByTestId('styled-refresh-label');
    expect(styledLabel).toHaveTextContent('Subtitle');
  });

  it('should apply cell-subtitle className', () => {
    render(<SubtitleRenderer value="Value" subtitle="Subtitle" />);

    const styledLabel = screen.getByTestId('styled-refresh-label');
    expect(styledLabel).toHaveClass('cell-subtitle');
  });

  it('should apply primary fontColor', () => {
    render(<SubtitleRenderer value="Value" subtitle="Subtitle" />);

    const styledLabel = screen.getByTestId('styled-refresh-label');
    expect(styledLabel).toHaveAttribute('data-font-color', 'primary');
  });

  it('should render with numeric value', () => {
    render(<SubtitleRenderer value={123} subtitle="Subtitle" />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render with empty subtitle', () => {
    render(<SubtitleRenderer value="Value" subtitle="" />);

    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByTestId('styled-refresh-label')).toBeEmptyDOMElement();
  });

  it('should render with undefined value', () => {
    render(<SubtitleRenderer value={undefined} subtitle="Subtitle" />);

    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render with null value', () => {
    render(<SubtitleRenderer value={null} subtitle="Subtitle" />);

    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render value and subtitle in correct order', () => {
    const { container } = render(
      <SubtitleRenderer value="First" subtitle="Second" />,
    );

    const content = container.textContent;
    expect(content).toBe('FirstSecond');
  });
});
