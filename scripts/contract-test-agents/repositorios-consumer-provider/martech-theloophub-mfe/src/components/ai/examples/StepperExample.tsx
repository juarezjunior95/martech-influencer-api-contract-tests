import { useCallback, useEffect, useRef, useState } from 'react';

import { MarkdownRenderer } from 'components/ai/components/atoms/MarkdownRenderer';
import { SkeletonLoader } from 'components/ai/components/atoms/SkeletonLoader';
import { Stepper } from 'components/ai/components/atoms/Stepper';
import type { StepperStep } from 'components/ai/components/atoms/Stepper';
import type { AgentStepEvent } from 'components/ai/components/organisms/ExecutionLog';
import {
  formatStepByNodeType,
  getStatusLabel,
} from 'components/ai/components/organisms/ExecutionLog/formatters';
import { Sandbox } from 'components/ai/components/organisms/Sandbox';

const STEP_DELAYS = [800, 1800, 1200, 2200, 1500, 1900, 2100];

const MOCK_EVENTS: AgentStepEvent[] = [
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
          { suggested_value: 'SALIENCE', column: 'KPI', similarity_score: 86 },
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
  {
    node: 'evaluator',
    question: 'What are the Drivers of Salience for Corona in Brazil?',
    task_code: 'evaluator',
    request_state: 'RUNNING',
    iteration: 1,
    decision: 'complete',
    outcome: {
      decision: 'complete',
      reasoning:
        'The analysis_tool has provided a detailed breakdown of the drivers of salience for Corona Extra in Brazil.',
      missing_information: '',
    },
  },
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

function buildSteps(
  events: AgentStepEvent[],
  options: { showSkeletonOnLast?: boolean; streaming?: boolean } = {},
): StepperStep[] {
  const derived: StepperStep[] = [];

  for (let i = 0; i < events.length; i++) {
    const result = formatStepByNodeType(
      events[i],
      i > 0 ? events[i - 1] : undefined,
      events,
    );
    if (!result) continue;

    const isLast = i === events.length - 1;
    const state: StepperStep['state'] =
      isLast && options.streaming ? 'current' : 'complete';

    derived.push({
      id: `${events[i].node}-${i}`,
      label: getStatusLabel(events[i]),
      description: (
        <>
          <MarkdownRenderer content={result.markdown} />
          {isLast && options.showSkeletonOnLast && (
            <SkeletonLoader count={1} size="sm" showAvatar={false} />
          )}
        </>
      ),
      state,
    });
  }

  return derived;
}

// Phase 1: only first event visible, current + skeleton (still loading)
const PHASE_1 = buildSteps(MOCK_EVENTS.slice(0, 1), {
  streaming: true,
  showSkeletonOnLast: true,
});

// Phase 2: first step complete, second arriving (current + skeleton)
const PHASE_2 = buildSteps(MOCK_EVENTS.slice(0, 2), {
  streaming: true,
  showSkeletonOnLast: true,
});

// Phase 3: first two complete, third loaded and current (no skeleton — content ready)
const PHASE_3 = buildSteps(MOCK_EVENTS.slice(0, 3), {
  streaming: true,
  showSkeletonOnLast: false,
});

// Phase 4: all complete except last, which is current (no skeleton — content ready)
const PHASE_4 = buildSteps(MOCK_EVENTS, {
  streaming: true,
  showSkeletonOnLast: false,
});

export const StepperExample = () => {
  const [receivedEvents, setReceivedEvents] = useState<AgentStepEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const nextIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const resetDemo = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReceivedEvents([]);
    nextIndexRef.current = 0;
    setIsStreaming(false);
  }, []);

  const startStreaming = useCallback(() => {
    resetDemo();
    setIsStreaming(true);

    const pushNext = () => {
      if (nextIndexRef.current >= MOCK_EVENTS.length) {
        setIsStreaming(false);
        return;
      }

      setReceivedEvents((prev) => [...prev, MOCK_EVENTS[nextIndexRef.current]]);

      const delay = STEP_DELAYS[nextIndexRef.current % STEP_DELAYS.length];
      nextIndexRef.current++;
      timerRef.current = setTimeout(pushNext, delay);
    };

    timerRef.current = setTimeout(pushNext, 800);
  }, [resetDemo]);

  const liveSteps = buildSteps(receivedEvents, {
    streaming: isStreaming,
    showSkeletonOnLast: isStreaming,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Sandbox
        title="Stepper"
        description="Streaming progressivo — replica o comportamento do ExecutionLog (estado streaming)"
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={startStreaming}
              disabled={isStreaming}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: 'none',
                background: isStreaming ? '#ccc' : '#E5B611',
                color: isStreaming ? '#888' : '#000',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {isStreaming ? 'Streaming...' : 'Start Demo'}
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
              padding: 16,
              border: '1px solid #eee',
            }}
          >
            {liveSteps.length === 0 && !isStreaming ? (
              <div
                style={{
                  color: '#999',
                  fontSize: 14,
                  textAlign: 'center',
                  padding: 40,
                }}
              >
                Click &quot;Start Demo&quot; to simulate WebSocket streaming
              </div>
            ) : (
              <Stepper steps={liveSteps} />
            )}
          </div>
        </div>
      </Sandbox>

      <Sandbox
        title="Stepper — Phase 1: First step arriving"
        description="Apenas o primeiro step visível, no estado current com skeleton (ainda carregando)"
        background="light"
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
          <Stepper steps={PHASE_1} />
        </div>
      </Sandbox>

      <Sandbox
        title="Stepper — Phase 2: Second step loading"
        description="Primeiro step complete, segundo chegando como current com skeleton"
        background="light"
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
          <Stepper steps={PHASE_2} />
        </div>
      </Sandbox>

      <Sandbox
        title="Stepper — Phase 3: Third step loaded"
        description="Dois steps complete, terceiro com conteúdo carregado como current (sem skeleton)"
        background="light"
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
          <Stepper steps={PHASE_3} />
        </div>
      </Sandbox>

      <Sandbox
        title="Stepper — Phase 4: Last step active"
        description="Todos os steps complete exceto o último, que está current com conteúdo carregado"
        background="light"
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
          <Stepper steps={PHASE_4} />
        </div>
      </Sandbox>
    </div>
  );
};
