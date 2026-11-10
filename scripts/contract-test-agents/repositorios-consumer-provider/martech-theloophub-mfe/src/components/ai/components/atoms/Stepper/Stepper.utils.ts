import type { StepperStep } from './Stepper.types';

export function resolveStepState(
  step: StepperStep,
  index: number,
  currentIndex: number,
): NonNullable<StepperStep['state']> {
  if (step.state) return step.state;
  if (index < currentIndex) return 'complete';
  if (index === currentIndex) return 'current';
  return 'pending';
}

export function isLastStep(index: number, totalSteps: number): boolean {
  return index === totalSteps - 1;
}
