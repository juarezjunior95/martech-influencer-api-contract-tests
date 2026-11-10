import type { AgentStepEvent } from '../../ExecutionLog.types';
import { getFormatter } from '../registry';

import './evaluator';

describe('evaluator node formatter', () => {
  const makeContext = (steps: AgentStepEvent[]) => ({
    prevStep: undefined as AgentStepEvent | undefined,
    allSteps: steps,
  });

  const format = (step: AgentStepEvent) => {
    const formatter = getFormatter('evaluator');
    expect(formatter).toBeDefined();
    return formatter?.format(step, makeContext([step]));
  };

  it('complete: shows review complete copy', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'complete',
      },
    };

    expect(format(step).markdown).toContain('My review is complete!');
    expect(format(step).markdown).toContain(
      'I have all the information I need to answer your question.',
    );
  });

  it('unknown decision: no complete/incomplete copy', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: { decision: 'pending' },
    };

    expect(format(step).markdown).toBe('');
  });

  it('incomplete: when both missing_information and reasoning exist, missing_information is shown', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'incomplete',
        missing_information: 'User-facing gap text',
        reasoning: 'Internal reasoning text',
      },
    };

    const { markdown } = format(step);

    expect(markdown).toContain('User-facing gap text');
    expect(markdown).not.toContain('Internal reasoning text');
    expect(markdown).toMatch(/^Needs more work\n\n/);
  });

  it('incomplete: only reasoning → fallback to reasoning', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'incomplete',
        reasoning: 'Only reasoning available',
      },
    };

    expect(format(step).markdown).toContain('Only reasoning available');
  });

  it('incomplete: only missing_information → shows missing_information', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'incomplete',
        missing_information: 'Only missing_information present',
      },
    };

    expect(format(step).markdown).toContain('Only missing_information present');
  });

  it('incomplete: neither field → default copy', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'incomplete',
      },
    };

    expect(format(step).markdown).toContain('Additional information needed');
  });

  it('incomplete: decision from step.decision when omitted in outcome', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      decision: 'incomplete',
      outcome: {
        missing_information: 'Resolved via step.decision',
      },
    };

    expect(format(step).markdown).toContain('Resolved via step.decision');
  });

  it('incomplete: empty missing_information is kept (?? does not skip empty string)', () => {
    const step: AgentStepEvent = {
      node: 'evaluator',
      outcome: {
        decision: 'incomplete',
        missing_information: '',
        reasoning: 'Would not show if missing_information were nullish',
      },
    };

    expect(format(step).markdown).toBe('Needs more work\n\n');
  });
});
