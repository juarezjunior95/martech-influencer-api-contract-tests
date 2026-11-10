import React from 'react';

import { render, screen } from '@testing-library/react';

import { ContentHeader } from './ContentHeader';

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

describe('ContentHeader', () => {
  it('should render the title correctly', () => {
    render(<ContentHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render the subtitle when provided', () => {
    render(<ContentHeader title="Test Title" subtitle="Test Subtitle" />);

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(<ContentHeader title="Test Title" />);

    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('should render tooltip icon when tooltip prop is provided', () => {
    render(
      <ContentHeader
        title="Test Title"
        tooltip="Tooltip Content"
        dataTestId="content-header"
      />,
    );

    const tooltipTrigger = screen.getByTestId('content-header-tooltip');
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it('should not render tooltip when tooltip prop is not provided', () => {
    render(<ContentHeader title="Test Title" dataTestId="content-header" />);

    expect(
      screen.queryByTestId('content-header-tooltip'),
    ).not.toBeInTheDocument();
  });

  it('should render rightContent when provided', () => {
    render(
      <ContentHeader
        title="Test Title"
        rightContent={<button>Action Button</button>}
      />,
    );

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('should not render rightContent when not provided', () => {
    render(<ContentHeader title="Test Title" />);

    expect(screen.queryByText('Action Button')).not.toBeInTheDocument();
  });

  it('should render all props together correctly', () => {
    render(
      <ContentHeader
        title="Complete Title"
        subtitle="Complete Subtitle"
        tooltip="Complete Tooltip"
        rightContent={<span>Right Content</span>}
        dataTestId="content-header"
      />,
    );

    expect(screen.getByText('Complete Title')).toBeInTheDocument();
    expect(screen.getByText('Complete Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('content-header-tooltip')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });
});
