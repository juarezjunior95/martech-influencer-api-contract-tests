import React from 'react';

import { render, screen } from '@testing-library/react';

import { CaptionWithFlag } from './CaptionWithFlag';

describe('AdvancedContainer Component', () => {
  const absoluteFlag =
    'https://cdn.example.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/BRA.png';

  it('should renders the component correctly', () => {
    render(<CaptionWithFlag label="ABI" flag={absoluteFlag} />);
    expect(screen.getByText('ABI')).toBeInTheDocument();
  });

  it('should not render the component if both flag and label are not provided', () => {
    render(<CaptionWithFlag label="" flag="" />);
    expect(screen.queryByText('ABI')).not.toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('propagates dataTestId to container, label and image — omits test ids when not provided', () => {
      const { container, rerender } = render(
        <CaptionWithFlag label="ABI" flag={absoluteFlag} dataTestId="custom" />,
      );
      expect(
        screen.getByTestId('caption-with-flag-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('caption-with-flag-label-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('caption-with-flag-img-custom'),
      ).toBeInTheDocument();

      rerender(<CaptionWithFlag label="ABI" flag={absoluteFlag} />);
      expect(container.querySelectorAll('[data-testid]')).toHaveLength(0);
    });
  });

  describe('flagSize prop', () => {
    it('renders flag at the provided flagSize', () => {
      render(
        <CaptionWithFlag
          label="ABI"
          flag={absoluteFlag}
          flagSize={32}
          dataTestId="custom"
        />,
      );

      const img = screen.getByTestId('caption-with-flag-img-custom');
      expect(img).toHaveStyle({ width: '32px', height: '32px' });
    });

    it('falls back to the default flag size (40px) when flagSize is not provided', () => {
      render(
        <CaptionWithFlag label="ABI" flag={absoluteFlag} dataTestId="custom" />,
      );

      const img = screen.getByTestId('caption-with-flag-img-custom');
      expect(img).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('does not leak the flagSize prop as a DOM attribute (uses the $-prefixed transient prop)', () => {
      render(
        <CaptionWithFlag
          label="ABI"
          flag={absoluteFlag}
          flagSize={32}
          dataTestId="custom"
        />,
      );

      const img = screen.getByTestId('caption-with-flag-img-custom');
      expect(img).not.toHaveAttribute('flagsize');
      expect(img).not.toHaveAttribute('flagSize');
      expect(img).not.toHaveAttribute('$flagsize');
    });
  });

  describe('boldLabel prop', () => {
    it('renders the label with bold weight (600) when boldLabel is true', () => {
      render(
        <CaptionWithFlag
          label="ABI"
          flag={absoluteFlag}
          boldLabel
          dataTestId="custom"
        />,
      );

      const label = screen.getByTestId('caption-with-flag-label-custom');
      expect(label).toHaveStyle({ fontWeight: '600' });
    });

    it('renders the label with normal weight (400) when boldLabel is omitted', () => {
      render(
        <CaptionWithFlag label="ABI" flag={absoluteFlag} dataTestId="custom" />,
      );

      const label = screen.getByTestId('caption-with-flag-label-custom');
      expect(label).toHaveStyle({ fontWeight: '400' });
    });
  });
});
