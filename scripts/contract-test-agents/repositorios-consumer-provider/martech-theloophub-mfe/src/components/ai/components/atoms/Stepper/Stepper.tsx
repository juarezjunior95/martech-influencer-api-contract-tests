import { memo } from 'react';

import { Check } from '../Icon';
import {
  Container,
  ContentColumn,
  Description,
  Label,
  ProgressColumn,
  StepItem,
  StepNumber,
  VerticalTrack,
} from './Stepper.styles';
import type { StepperProps } from './Stepper.types';
import { isLastStep, resolveStepState } from './Stepper.utils';

export const Stepper = memo(function Stepper({
  steps,
  currentIndex = 0,
  className,
}: StepperProps) {
  return (
    <Container className={className} data-testid="stepper" role="list">
      {steps.map((step, index) => {
        const state = resolveStepState(step, index, currentIndex);
        const isLast = isLastStep(index, steps.length);

        return (
          <StepItem
            key={step.id}
            $state={state}
            data-testid={`stepper-step-${index}`}
            role="listitem"
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <ProgressColumn>
              <StepNumber $state={state}>
                {state === 'complete' ? (
                  <Check
                    size={14}
                    data-testid="check-icon"
                    aria-hidden="true"
                  />
                ) : (
                  index + 1
                )}
              </StepNumber>
              <VerticalTrack aria-hidden="true" $isLast={isLast} />
            </ProgressColumn>

            <ContentColumn>
              <Label>{step.label}</Label>
              {step.description && (
                <Description>{step.description}</Description>
              )}
            </ContentColumn>
          </StepItem>
        );
      })}
    </Container>
  );
});

Stepper.displayName = 'Stepper';
