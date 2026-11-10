import { render, screen } from '@testing-library/react';

import { Stepper } from './Stepper';
import type { StepperStep } from './Stepper.types';
import { isLastStep, resolveStepState } from './Stepper.utils';

describe('resolveStepState', () => {
  const baseStep: StepperStep = { id: 'step-1', label: 'Step 1' };

  it('should return explicit state when provided', () => {
    expect(resolveStepState({ ...baseStep, state: 'complete' }, 0, 1)).toBe(
      'complete',
    );
    expect(resolveStepState({ ...baseStep, state: 'current' }, 2, 0)).toBe(
      'current',
    );
    expect(resolveStepState({ ...baseStep, state: 'pending' }, 0, 0)).toBe(
      'pending',
    );
  });

  it('should return "complete" when index is before currentIndex', () => {
    expect(resolveStepState(baseStep, 0, 2)).toBe('complete');
    expect(resolveStepState(baseStep, 1, 3)).toBe('complete');
  });

  it('should return "current" when index equals currentIndex', () => {
    expect(resolveStepState(baseStep, 0, 0)).toBe('current');
    expect(resolveStepState(baseStep, 2, 2)).toBe('current');
  });

  it('should return "pending" when index is after currentIndex', () => {
    expect(resolveStepState(baseStep, 2, 0)).toBe('pending');
    expect(resolveStepState(baseStep, 3, 1)).toBe('pending');
  });

  it('should prioritize explicit state over index-based logic', () => {
    expect(resolveStepState({ ...baseStep, state: 'pending' }, 0, 5)).toBe(
      'pending',
    );
  });
});

describe('isLastStep', () => {
  it('should return true when index is the last position', () => {
    expect(isLastStep(2, 3)).toBe(true);
    expect(isLastStep(0, 1)).toBe(true);
  });

  it('should return false when index is not the last position', () => {
    expect(isLastStep(0, 3)).toBe(false);
    expect(isLastStep(1, 3)).toBe(false);
  });

  it('should return false for empty steps array (totalSteps = 0)', () => {
    expect(isLastStep(0, 0)).toBe(false);
  });
});

describe('Stepper', () => {
  const mockSteps: StepperStep[] = [
    {
      id: 'step-1',
      label: 'Running your Smart Flow',
      description: 'This usually takes about 30 seconds',
      state: 'current',
    },
    {
      id: 'step-2',
      label: 'Your response is ready',
      description: 'Complete!',
      state: 'pending',
    },
  ];

  describe('Rendering', () => {
    it('should render numbered steps with provided labels', () => {
      render(<Stepper steps={mockSteps} />);

      expect(screen.getByText('Running your Smart Flow')).toBeInTheDocument();
      expect(screen.getByText('Your response is ready')).toBeInTheDocument();
      // Current step shows number
      expect(screen.getByText('1')).toBeInTheDocument();
      // Pending step shows number
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render Check icon for complete state', () => {
      const steps: StepperStep[] = [
        { id: 'step-1', label: 'Completed Step', state: 'complete' },
      ];

      render(<Stepper steps={steps} />);

      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should render with root stepper role', () => {
      render(<Stepper steps={mockSteps} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render descriptions when provided', () => {
      render(<Stepper steps={mockSteps} />);

      expect(
        screen.getByText('This usually takes about 30 seconds'),
      ).toBeInTheDocument();
      expect(screen.getByText('Complete!')).toBeInTheDocument();
    });

    it('should skip description when not provided', () => {
      const stepsWithoutDescription: StepperStep[] = [
        {
          id: 'step-1',
          label: 'Step Label Only',
        },
      ];

      render(<Stepper steps={stepsWithoutDescription} />);

      expect(screen.getByText('Step Label Only')).toBeInTheDocument();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Stepper steps={mockSteps} className="custom-stepper" />,
      );

      expect(container.querySelector('ol.custom-stepper')).toBeInTheDocument();
    });
  });

  describe('Step States', () => {
    it('should mark current step with aria-current="step"', () => {
      render(<Stepper steps={mockSteps} currentIndex={0} />);

      const firstStep = screen.getByTestId('stepper-step-0');
      expect(firstStep).toHaveAttribute('aria-current', 'step');
    });

    it('should set states based on currentIndex', () => {
      const steps: StepperStep[] = [
        { id: 'step-1', label: 'Step 1' },
        { id: 'step-2', label: 'Step 2' },
        { id: 'step-3', label: 'Step 3' },
      ];

      render(<Stepper steps={steps} currentIndex={1} />);

      const step1 = screen.getByTestId('stepper-step-0');
      const step2 = screen.getByTestId('stepper-step-1');
      const step3 = screen.getByTestId('stepper-step-2');

      // Step 0 should be complete (before current)
      expect(step1).not.toHaveAttribute('aria-current');
      // Step 1 should be current
      expect(step2).toHaveAttribute('aria-current', 'step');
      // Step 2 should be pending (after current)
      expect(step3).not.toHaveAttribute('aria-current');
    });

    it('should respect explicit state prop over currentIndex', () => {
      const steps: StepperStep[] = [
        { id: 'step-1', label: 'Step 1', state: 'complete' },
        { id: 'step-2', label: 'Step 2', state: 'pending' },
      ];

      render(<Stepper steps={steps} currentIndex={0} />);

      const step2 = screen.getByTestId('stepper-step-1');
      // Should respect explicit state=pending despite currentIndex=0
      expect(step2).not.toHaveAttribute('aria-current');
    });
  });

  describe('Vertical Track', () => {
    it('should render one vertical track per step and collapse the last via CSS', () => {
      const steps: StepperStep[] = [
        { id: 'step-1', label: 'Step 1' },
        { id: 'step-2', label: 'Step 2 (last)' },
      ];

      const { container } = render(<Stepper steps={steps} />);

      const tracks = container.querySelectorAll('[aria-hidden="true"]');
      // One track per step keeps the CSS transition mounted on the last step
      expect(tracks.length).toBe(2);
      // The last track is collapsed via CSS to preserve the animation
      expect(tracks[tracks.length - 1]).toHaveStyle({ 'max-height': '0%' });
      expect(tracks[0]).toHaveStyle({ 'max-height': '100%' });
    });

    it('should render one vertical track per step for three steps', () => {
      const steps: StepperStep[] = [
        { id: 'step-1', label: 'Step 1' },
        { id: 'step-2', label: 'Step 2' },
        { id: 'step-3', label: 'Step 3' },
      ];

      const { container } = render(<Stepper steps={steps} />);

      const tracks = container.querySelectorAll('[aria-hidden="true"]');
      // One track per step (the last one is collapsed via CSS)
      expect(tracks.length).toBe(3);
      expect(tracks[0]).toHaveStyle({ 'max-height': '100%' });
      expect(tracks[1]).toHaveStyle({ 'max-height': '100%' });
      expect(tracks[2]).toHaveStyle({ 'max-height': '0%' });
    });
  });

  describe('Data Attributes', () => {
    it('should render stepper with data-testid', () => {
      render(<Stepper steps={mockSteps} />);

      expect(screen.getByTestId('stepper')).toBeInTheDocument();
    });

    it('should render each step with indexed data-testid', () => {
      render(<Stepper steps={mockSteps} />);

      expect(screen.getByTestId('stepper-step-0')).toBeInTheDocument();
      expect(screen.getByTestId('stepper-step-1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have displayName set', () => {
      expect(Stepper.displayName).toBe('Stepper');
    });

    it('should render as ordered list', () => {
      const { container } = render(<Stepper steps={mockSteps} />);

      expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('should have role="list" on container and role="listitem" on items', () => {
      render(<Stepper steps={mockSteps} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(2);
    });

    it('should hide vertical track from screen readers', () => {
      const { container } = render(<Stepper steps={mockSteps} />);

      const tracks = container.querySelectorAll('[aria-hidden="true"]');
      tracks.forEach((track) => {
        expect(track).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty steps array', () => {
      const { container } = render(<Stepper steps={[]} />);

      expect(container.querySelector('ol')).toBeInTheDocument();
      const items = screen.queryAllByRole('listitem');
      expect(items.length).toBe(0);
    });

    it('should handle single step', () => {
      const singleStep: StepperStep[] = [{ id: 'step-1', label: 'Only Step' }];

      const { container } = render(<Stepper steps={singleStep} />);

      expect(screen.getByText('Only Step')).toBeInTheDocument();
      // The single step still renders its track but it is collapsed via CSS
      const tracks = container.querySelectorAll('[aria-hidden="true"]');
      expect(tracks.length).toBe(1);
      expect(tracks[0]).toHaveStyle({ 'max-height': '0%' });
    });

    it('should handle currentIndex beyond steps length', () => {
      render(<Stepper steps={mockSteps} currentIndex={999} />);

      // Should still render all steps
      expect(screen.getByText('Running your Smart Flow')).toBeInTheDocument();
      expect(screen.getByText('Your response is ready')).toBeInTheDocument();
    });

    it('should handle ReactNode as description', () => {
      const stepsWithNode: StepperStep[] = [
        {
          id: 'step-1',
          label: 'With JSX',
          description: <strong>Bold description</strong>,
        },
      ];

      render(<Stepper steps={stepsWithNode} />);

      expect(screen.getByText('Bold description')).toBeInTheDocument();
    });
  });
});
