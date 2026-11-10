import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedbackModal } from './FeedbackModal';
import { FEEDBACK_OPTIONS } from './feedbackOptions';

describe('FeedbackModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    sentiment: 'positive' as const,
    onSubmit: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Positive sentiment', () => {
    it('renders title for positive feedback', () => {
      render(<FeedbackModal {...defaultProps} />);
      expect(
        screen.getByText(FEEDBACK_OPTIONS.positive.title),
      ).toBeInTheDocument();
    });

    it('renders all positive options as checkboxes', () => {
      render(<FeedbackModal {...defaultProps} />);
      for (const option of FEEDBACK_OPTIONS.positive.options) {
        expect(screen.getByLabelText(option.label)).toBeInTheDocument();
      }
    });
  });

  describe('Negative sentiment', () => {
    it('renders title for negative feedback', () => {
      render(<FeedbackModal {...defaultProps} sentiment="negative" />);
      expect(
        screen.getByText(FEEDBACK_OPTIONS.negative.title),
      ).toBeInTheDocument();
    });

    it('renders all negative options as checkboxes', () => {
      render(<FeedbackModal {...defaultProps} sentiment="negative" />);
      for (const option of FEEDBACK_OPTIONS.negative.options) {
        expect(screen.getByLabelText(option.label)).toBeInTheDocument();
      }
    });
  });

  describe('Interactions', () => {
    it('toggles checkbox selection', () => {
      render(<FeedbackModal {...defaultProps} />);
      const firstOption = screen.getByLabelText(
        FEEDBACK_OPTIONS.positive.options[0].label,
      );

      fireEvent.click(firstOption);
      expect(firstOption).toBeChecked();

      fireEvent.click(firstOption);
      expect(firstOption).not.toBeChecked();
    });

    it('allows typing in comments textarea', () => {
      render(<FeedbackModal {...defaultProps} />);
      const textarea = screen.getByLabelText(/additional comments/i);

      fireEvent.change(textarea, { target: { value: 'Great response!' } });
      expect(textarea).toHaveValue('Great response!');
    });

    it('enforces max length on comments textarea', () => {
      render(<FeedbackModal {...defaultProps} />);
      const textarea = screen.getByLabelText(/additional comments/i);
      expect(textarea).toHaveAttribute('maxlength', '500');
    });

    it('calls onSubmit with selected options and comments', () => {
      render(<FeedbackModal {...defaultProps} />);

      const firstOption = screen.getByLabelText(
        FEEDBACK_OPTIONS.positive.options[0].label,
      );
      fireEvent.click(firstOption);

      const textarea = screen.getByLabelText(/additional comments/i);
      fireEvent.change(textarea, { target: { value: 'Nice!' } });

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        [FEEDBACK_OPTIONS.positive.options[0].value],
        'Nice!',
      );
    });

    it('resets state after submit', async () => {
      defaultProps.onSubmit.mockResolvedValue(undefined);
      render(<FeedbackModal {...defaultProps} />);

      const firstOption = screen.getByLabelText(
        FEEDBACK_OPTIONS.positive.options[0].label,
      );
      fireEvent.click(firstOption);

      const textarea = screen.getByLabelText(/additional comments/i);
      fireEvent.change(textarea, { target: { value: 'Nice!' } });

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(firstOption).not.toBeChecked();
      });
      expect(textarea).toHaveValue('');
    });

    it('disables submit when negative sentiment has no selection', () => {
      render(<FeedbackModal {...defaultProps} sentiment="negative" />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit when negative sentiment has a selection', () => {
      render(<FeedbackModal {...defaultProps} sentiment="negative" />);
      const firstOption = screen.getByLabelText(
        FEEDBACK_OPTIONS.negative.options[0].label,
      );
      fireEvent.click(firstOption);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('shows Other input when Other checkbox is selected', () => {
      render(<FeedbackModal {...defaultProps} />);
      const otherCheckbox = screen.getByLabelText('Other');
      fireEvent.click(otherCheckbox);

      expect(screen.getByLabelText('Other feedback')).toBeInTheDocument();
    });

    it('clears Other text when Other checkbox is deselected', () => {
      render(<FeedbackModal {...defaultProps} />);
      const otherCheckbox = screen.getByLabelText('Other');
      fireEvent.click(otherCheckbox);

      const otherInput = screen.getByLabelText('Other feedback');
      fireEvent.change(otherInput, { target: { value: 'test' } });
      expect(otherInput).toHaveValue('test');

      fireEvent.click(otherCheckbox);
      fireEvent.click(otherCheckbox);

      expect(screen.getByLabelText('Other feedback')).toHaveValue('');
    });

    it('submits other text with "other:" prefix', () => {
      render(<FeedbackModal {...defaultProps} />);
      const otherCheckbox = screen.getByLabelText('Other');
      fireEvent.click(otherCheckbox);

      const otherInput = screen.getByLabelText('Other feedback');
      fireEvent.change(otherInput, { target: { value: 'my reason' } });

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        ['other: my reason'],
        '',
      );
    });

    it('resets form on cancel', () => {
      render(<FeedbackModal {...defaultProps} />);
      const firstOption = screen.getByLabelText(
        FEEDBACK_OPTIONS.positive.options[0].label,
      );
      fireEvent.click(firstOption);
      expect(firstOption).toBeChecked();

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
