import { useCallback, useEffect, useRef, useState } from 'react';

import type { AgentStepEvent } from '../components/organisms/ExecutionLog';
import { ExecutionLog } from '../components/organisms/ExecutionLog';
import { Sandbox } from '../components/organisms/Sandbox';

// Deterministic delays to avoid Math.random() Sonar hotspot
const STEP_DELAYS = [800, 1800, 1200, 2200, 1500, 1900, 2100];

const evaluatorStepBase = {
  node: 'evaluator' as const,
  question: 'What are the Drivers of Salience for Corona in Brazil?',
  task_code: 'evaluator',
  request_state: 'RUNNING',
  iteration: 1,
};

const evaluatorComplete: AgentStepEvent = {
  ...evaluatorStepBase,
  decision: 'complete',
  outcome: {
    decision: 'complete',
    reasoning:
      'The analysis_tool has provided a detailed breakdown of the drivers of salience for Corona Extra in Brazil.',
    missing_information: '',
  },
};

const evaluatorIncompleteBoth: AgentStepEvent = {
  ...evaluatorStepBase,
  decision: 'incomplete',
  outcome: {
    decision: 'incomplete',
    missing_information:
      '[Demo — missing_information] User-facing gap text (e.g. more context needed).',
    reasoning:
      '[Demo — reasoning] Internal-style text; should not show when missing_information is set (MARTLH-9515).',
  },
};

const evaluatorIncompleteReasoningOnly: AgentStepEvent = {
  ...evaluatorStepBase,
  decision: 'incomplete',
  outcome: {
    decision: 'incomplete',
    reasoning:
      '[Demo — reasoning only] missing_information not sent; fallback to reasoning.',
  },
};

function withEvaluatorVariant(evaluator: AgentStepEvent): AgentStepEvent[] {
  return MOCK_STEPS_COMPLETE.map((step) =>
    step.node === 'evaluator' ? evaluator : step,
  );
}

// Simulated WebSocket events (derived from real API) — evaluator complete (happy path)
const MOCK_STEPS_COMPLETE: AgentStepEvent[] = [
  {
    node: 'planner',
    question: 'What are the drivers of Salience for Corona in Brazil?',
    task_code: 'planner',
    request_state: 'RUNNING',
    outcome: {
      plan: '1. Search for similar past plans regarding drivers of Salience for Corona in Brazil to leverage proven approaches.\n2. If no relevant plan exists, retrieve detailed analysis of Salience drivers for Corona in Brazil using analysis_tool.\n3. Review the analysis for key drivers and insights.\n4. Synthesize findings into a comprehensive final answer',
      reasoning:
        'The user is asking for the drivers of Salience for Corona in Brazil, which is a business analysis question.',
    },
  },
  {
    node: 'similar_plan_tool',
    question: 'What are the Drivers of Salience for Corona in Brazil?',
    task_code: 'planner',
    request_state: 'RUNNING',
    outcome: [
      {
        question: 'Trend of meaningfulness across years for Corona in Brazil',
        overall_plan:
          '1. Retrieve yearly meaningfulness scores for Corona in Brazil.\n2. Summarize and visualize the trend.',
      },
      {
        question: 'Why did salience drop for Corona in 2024?',
        overall_plan:
          '1. Extract drivers of salience change for Corona in 2024.\n2. Summarize findings.',
      },
    ],
  },
  {
    node: 'planner',
    question: 'What are the drivers of Salience for Corona in Brazil?',
    task_code: 'planner',
    request_state: 'RUNNING',
    outcome: {
      plan: '1. Retrieve detailed analysis of the drivers of Salience for Corona in Brazil using analysis_tool.\n2. Review the analysis for key drivers and insights.\n3. Synthesize findings into a comprehensive final answer.',
      reasoning:
        'The similar_plan_tool did not return a directly matching plan. Using analysis_tool.',
    },
  },
  {
    node: 'entity_recognizer_for_analysis_node',
    question: 'What are the Drivers of Salience for Corona in Brazil?',
    task_code: 'tool-executor',
    request_state: 'RUNNING',
    outcome: {
      human_question: 'What are the drivers of Salience for Corona in Brazil?',
      extracted_entities: {
        KPI: 'SALIENT',
        BRAND: 'CORONA',
        COUNTRY: 'BRAZIL',
      },
      validated_entities: {
        BRAZIL: ['COUNTRY'],
        SALIENCE: ['KPI'],
        'CORONA EXTRA': ['BRAND'],
      },
      suggested_entities: {
        SALIENT: [
          {
            suggested_value: 'SALIENCE',
            column: 'KPI',
            similarity_score: 86,
          },
        ],
        CORONA: [
          {
            suggested_value: 'CORONA EXTRA',
            column: 'BRAND',
            similarity_score: 100,
          },
        ],
      },
      data_ambiguity_suggestions: {},
      unknown_entities: [],
      hil_trigger: false,
    },
  },
  {
    node: 'analysis_tool',
    question:
      'what are the drivers of kpi salience for CORONA EXTRA in country brazil?',
    task_code: 'tool-executor',
    request_state: 'RUNNING',
    outcome: {
      function_name: 'get_brand_highlights',
      arguments: {
        brand: ['CORONA EXTRA'],
        country: ['brazil'],
        analysis_requested_for_kpi: ['salience'],
      },
    },
  },
  evaluatorComplete,
  {
    node: 'final_answer_tool',
    question: 'What are the Drivers of Salience for Corona in Brazil?',
    task_code: 'final-answer-generator',
    request_state: 'SUCCESS',
    execution_time_ms: 42000,
    outcome:
      '# Drivers of Salience for Corona in Brazil\n\nThe salience of Corona Extra in Brazil increased from **93.6** in 2024 to **100.6** in 2025.',
  },
];

const MOCK_STEPS_INCOMPLETE_BOTH = withEvaluatorVariant(
  evaluatorIncompleteBoth,
);
const MOCK_STEPS_INCOMPLETE_REASONING_ONLY = withEvaluatorVariant(
  evaluatorIncompleteReasoningOnly,
);

const demoButtonStyles = {
  padding: '6px 16px',
  borderRadius: 20,
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
} as const;

export const ExecutionLogExample = () => {
  const [steps, setSteps] = useState<AgentStepEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const nextEventIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const resetDemo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSteps([]);
    nextEventIndexRef.current = 0;
    setIsStreaming(false);
  }, []);

  const startStreaming = useCallback(
    (scenarioSteps: AgentStepEvent[]) => {
      resetDemo();
      setIsStreaming(true);

      const pushNext = () => {
        if (nextEventIndexRef.current >= scenarioSteps.length) {
          setIsStreaming(false);
          return;
        }

        setSteps((prev) => [...prev, scenarioSteps[nextEventIndexRef.current]]);
        const delay =
          STEP_DELAYS[nextEventIndexRef.current % STEP_DELAYS.length];
        nextEventIndexRef.current++;

        timerRef.current = setTimeout(pushNext, delay);
      };

      timerRef.current = setTimeout(pushNext, 800);
    },
    [resetDemo],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const status = isStreaming
    ? ('streaming' as const)
    : steps.length > 0
      ? ('complete' as const)
      : ('complete' as const);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Sandbox
        title="ExecutionLog"
        description="Timeline de execucao com streaming de eventos (replica do IC UI)"
        background="light"
        height={500}
        padding={16}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => startStreaming(MOCK_STEPS_COMPLETE)}
              disabled={isStreaming}
              style={{
                ...demoButtonStyles,
                background: isStreaming ? '#ccc' : '#E5B611',
                color: isStreaming ? '#888' : '#000',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
              }}
            >
              {isStreaming ? 'Streaming...' : 'Start Demo'}
            </button>
            <button
              onClick={() => startStreaming(MOCK_STEPS_INCOMPLETE_BOTH)}
              disabled={isStreaming}
              style={{
                ...demoButtonStyles,
                background: isStreaming ? '#ccc' : '#E5B611',
                color: isStreaming ? '#888' : '#000',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
              }}
              title="incomplete: both missing_information and reasoning → shows missing_information"
            >
              Demo: incomplete (both fields)
            </button>
            <button
              onClick={() =>
                startStreaming(MOCK_STEPS_INCOMPLETE_REASONING_ONLY)
              }
              disabled={isStreaming}
              style={{
                ...demoButtonStyles,
                background: isStreaming ? '#ccc' : '#E5B611',
                color: isStreaming ? '#888' : '#000',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
              }}
              title="incomplete: missing_information not sent → shows reasoning"
            >
              Demo: incomplete (no missing_information)
            </button>
            <button
              onClick={resetDemo}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: '1px solid #ccc',
                background: 'transparent',
                color: '#666',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              background: '#fff',
              borderRadius: 8,
              padding: 12,
              border: '1px solid #eee',
            }}
          >
            {steps.length === 0 && !isStreaming ? (
              <div
                style={{
                  color: '#999',
                  fontSize: 14,
                  textAlign: 'center',
                  padding: 40,
                }}
              >
                Click &quot;Start Demo&quot; for the complete path, or run an
                incomplete scenario (both fields vs no missing_information)
              </div>
            ) : (
              <ExecutionLog steps={steps} status={status} />
            )}
          </div>
        </div>
      </Sandbox>

      <Sandbox
        title="ExecutionLog (Complete State)"
        description="Estado final com accordion colapsavel mostrando tempo de execucao"
        background="light"
        height={300}
        padding={16}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 12,
            border: '1px solid #eee',
          }}
        >
          <ExecutionLog steps={MOCK_STEPS_COMPLETE} status="complete" />
        </div>
      </Sandbox>
    </div>
  );
};
