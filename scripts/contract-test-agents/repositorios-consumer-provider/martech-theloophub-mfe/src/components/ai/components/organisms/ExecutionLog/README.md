# ExecutionLog

Real-time timeline component that visualizes the step-by-step execution of the Insights Copilot AI agent. Each step received via WebSocket is formatted into a human-readable timeline entry and displayed with progressive streaming UX.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Data Flow](#data-flow)
- [WebSocket API Contract](#websocket-api-contract)
- [Component Tree](#component-tree)
- [Formatter System (Strategy Registry)](#formatter-system-strategy-registry)
- [Node Types and Business Rules](#node-types-and-business-rules)
- [Auto-Scroll Behavior](#auto-scroll-behavior)
- [Accessibility](#accessibility)
- [CSS Tokens and Theming](#css-tokens-and-theming)
- [Performance Optimizations](#performance-optimizations)
- [File Structure](#file-structure)
- [Adding a New Node Type](#adding-a-new-node-type)
- [Props Reference](#props-reference)
- [Dependencies](#dependencies)

---

## Architecture Overview

```
WebSocket Events
       |
       v
┌──────────────────┐
│  ExecutionLog    │  Orchestrator — manages state, incremental append, status labels
│  (memo)          │
└──────┬───────────┘
       |
       v
┌──────────────────┐     ┌────────────────────┐
│  formatters/     │────>│  FormatResult       │
│  (Strategy       │     │  { markdown,        │
│   Registry)      │     │    showSkeleton }   │
└──────────────────┘     └────────────────────┘
       |
       v
┌──────────────────┐
│  TimelineItem    │  Renders a single step (Marker + Connector + MarkdownRenderer)
│  (memo)          │
└──────────────────┘
       |
       ├── MarkdownRenderer (renders markdown string to HTML)
       └── SkeletonLoader (loading indicator for long-running steps)
```

The component follows a **producer-consumer** pattern:
1. **Producer**: Parent component (InsightsCopilot) receives WebSocket events and accumulates them in a `steps` array.
2. **Consumer**: ExecutionLog receives `steps` + `status`, formats only new entries (incremental append via `processedCountRef`), and renders the timeline.

---

## Data Flow

```
1. WebSocket sends AgentStepEvent (snake_case JSON)
        |
2. InsightsCopilot appends to steps[] state
        |
3. ExecutionLog useEffect detects new steps
   (processedCountRef tracks last processed index)
        |
4. Each new step -> formatStepByNodeType(step, prevStep, allSteps)
        |
5. Strategy Registry resolves the formatter by step.node
        |
6. Formatter returns FormatResult { markdown, showSkeleton }
        |
7. TimelineEntry is appended to timelineEntries state
        |
8. TimelineItem renders the markdown via MarkdownRenderer
        |
9. useAutoScroll keeps the scroll pinned to bottom (unless user scrolled up)
```

### Two Display Modes

| Status | Behavior |
|--------|----------|
| `streaming` | Timeline is visible directly. ProgressLabel shows the current status label at the top. Auto-scroll is active. Last item may show a SkeletonLoader. |
| `complete` | Timeline is wrapped in an Accordion. The accordion title shows total execution time (e.g., "Thought for 42 seconds"). Content is faded (opacity: 0.7). |

---

## WebSocket API Contract

Each event from the WebSocket follows the `AgentStepEvent` interface. Fields use **snake_case** to match the backend API contract directly — no transformation layer is needed.

```typescript
interface AgentStepEvent {
  node: string;              // The pipeline node that produced this event
  next_tool?: string;        // Which node runs next ("END" = terminal)
  question?: string;         // The user's question being processed
  next_question?: string;    // Follow-up question (used by human_assistance)
  outcome?: string | Record<string, unknown> | unknown[];
                             // Node-specific result payload (varies by node)
  iteration?: number;        // Evaluator iteration count (1+ = refinement loop)
  decision?: string;         // Evaluator decision: "complete" | "incomplete"
  missing_information?: string; // What info the evaluator still needs
  execution_time_ms?: number;   // Total pipeline execution time (on final step)
  next_tool_timeout?: number;   // Expected seconds for the next tool to run
}
```

### Key Conventions

- `node` identifies which pipeline stage emitted this event.
- `next_tool` is the next node in the pipeline. When `next_tool === "END"`, the pipeline is complete.
- `outcome` is polymorphic — its shape depends on the `node` type. Each formatter knows how to interpret its specific outcome shape.
- `execution_time_ms` is only present on the final step (`final_answer_tool` with `next_tool: "END"`).

---

## Component Tree

### ExecutionLog (organism)

The root orchestrator. Receives the raw steps array and status, manages formatting, and delegates rendering.

**Key internal state:**
- `timelineEntries: TimelineEntry[]` — formatted entries ready for rendering
- `processedCountRef` — tracks how many steps have been formatted (avoids re-processing)

**Key behaviors:**
- **Incremental append**: Only formats steps from `processedCountRef.current` to `steps.length`
- **Reset on empty**: When `steps` goes to `[]` (new conversation), resets everything
- **Progress label**: Computed via `getStatusLabel()` — shows what the agent is currently doing
- **Duration label**: Computed from `execution_time_ms` on the last step — "Thought for X seconds"

### TimelineItem (atom within organism)

Renders a single step in the timeline with a vertical gutter (marker + connector line) and content area.

**Key behaviors:**
- Wrapped in `React.memo` — only re-renders when its own props change
- Shows `SkeletonLoader` when: `showSkeleton && isLast && status === 'streaming'`
- Each item has a `data-testid` of `timeline-item-{nodeType}` for testing

### Accordion (atom)

Collapsible container used to wrap the timeline in `complete` mode.

**Key behaviors:**
- `aria-controls` + `useId` for accessibility pairing
- `role="region"` on the panel
- Chevron rotation animation with `prefers-reduced-motion` support
- `focus-visible` styling for keyboard navigation

### SkeletonLoader (atom)

Animated loading placeholder shown while waiting for the next step.

**Key behaviors:**
- Shimmer animation via CSS `@keyframes` (gradient sweep)
- `role="status"` + `aria-label="Loading"` for screen readers
- `prefers-reduced-motion` disables animation
- Configurable: `count` (blocks), `size` ('sm' | 'md'), `showAvatar` (boolean)

---

## Formatter System (Strategy Registry)

The formatting logic uses a **Strategy Registry** pattern instead of a monolithic switch/case. Each node type self-registers its formatter at module load time via side-effect imports.

### How It Works

```
formatters/
  types.ts        — FormatContext, FormatResult, NodeFormatter interfaces
  registry.ts     — Map<string, NodeFormatter> + register/get functions
  helpers.ts      — Shared utilities (truncateText, entityLabels, etc.)
  index.ts        — Public API + side-effect imports that trigger registration
  nodes/
    planner.ts           — registerNodeFormatter('planner', ...)
    similarPlan.ts       — registerNodeFormatter('similar_plan_tool', ...)
    entityRecognizer.ts  — registerNodeFormatter([3 variants], ...)
    analysisTool.ts      — registerNodeFormatter('analysis_tool', ...)
    dataTools.ts         — registerNodeFormatter('sql_tool', ...) + 5 others
    evaluator.ts         — registerNodeFormatter('evaluator', ...)
    finalAnswer.ts       — registerNodeFormatter('final_answer_tool', ...)
    humanAssistance.ts   — registerNodeFormatter(['human_assistance', ...], ...)
```

### NodeFormatter Interface

```typescript
interface NodeFormatter {
  statusLabel: string;      // Text shown in ProgressLabel while this node runs
  nextStepLabel: string;    // Text shown when another node points to this one via next_tool
  format: (step: AgentStepEvent, context: FormatContext) => FormatResult;
}
```

### FormatResult

```typescript
interface FormatResult {
  markdown: string;        // Rendered as HTML via MarkdownRenderer
  showSkeleton: boolean;   // Whether to show loading indicator after this entry
}
```

### Adding a New Node Type

1. Create a new file in `formatters/nodes/`:

```typescript
// formatters/nodes/myNewTool.ts
import type { AgentStepEvent } from '../../ExecutionLog.types';
import type { FormatContext, FormatResult } from '../types';
import { registerNodeFormatter } from '../registry';
import { withNextStep } from '../helpers';

registerNodeFormatter('my_new_tool', {
  statusLabel: 'Processing...',
  nextStepLabel: 'Processing...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    let markdown = '**Processing your request...**\n\n';
    // Format the outcome as needed
    return withNextStep(markdown, step, allSteps);
  },
});
```

2. Add the side-effect import in `formatters/index.ts`:

```typescript
import './nodes/myNewTool';
```

That's it. No switch statements to modify, no central mapping to update. The registry picks it up automatically.

---

## Node Types and Business Rules

### `planner`

**Purpose:** The AI agent's planning phase. Receives the user's question and creates a step-by-step execution plan.

**Business rules:**
- **First planner step** (no prior planner in history): Shows "Thinking about how to address your query..." with "Here's my plan:" header
- **After similar_plan_tool** or **iteration > 1**: Shows "Updated plan:" (the agent revised its approach)
- Plan bullets are extracted from `outcome.plan` (a numbered string like "1. Do X\n2. Do Y") and rendered as markdown list items
- Always appends a "next step" block if `next_tool` is not END

**Outcome shape:**
```json
{
  "plan": "1. Step one\n2. Step two\n3. Step three",
  "reasoning": "Why this approach was chosen"
}
```

---

### `similar_plan_tool`

**Purpose:** Searches for previously executed plans similar to the current question. Helps the agent reuse proven approaches.

**Business rules:**
- If `outcome` is an array with items: Shows "Found {N} similar questions I've answered before."
- If empty/no results: Shows "This is a new type of question - building a fresh approach."
- The next step label is resolved dynamically — if there's an incomplete evaluator in history, shows "Improving your answer..." instead

**Outcome shape:**
```json
[
  {
    "question": "Previous similar question",
    "overall_plan": "Plan that was used",
    "next_tool": "analysis_tool"
  }
]
```

---

### `entity_recognizer_for_analysis_node` / `entity_recognizer_doc_qa_node` / `entity_recognizer_for_doc_qa_node`

**Purpose:** Natural language entity extraction. Identifies brands, countries, KPIs, and other entities from the user's question before querying the data.

**Business rules:**
- Shows "Identified from your question:" header
- Displays extracted entities with their types, separated by ` · ` (middle dot)
- Entity display priority: ambiguity suggestions first, then validated, then suggested, then unknown
- **Validated entities**: `"Kpi: SALIENCE"` — confirmed matches
- **Suggested entities**: `"Brand: CORONA ?"` — fuzzy matches (with `?`)
- **Ambiguity suggestions**: `"PREMIUM ?"` — multiple possible interpretations
- **Unknown entities**: `"Unknown: XPTO?"` — not found in the data catalog
- **HIL trigger** (`hil_trigger: true`): Shows "Just a quick clarification..." and stops (no skeleton, no next step). This triggers a human-in-the-loop interaction where the system needs user confirmation.

**Outcome shape:**
```json
{
  "validated_entities": { "BRAZIL": ["COUNTRY"], "CORONA EXTRA": ["BRAND"] },
  "suggested_entities": { "SALIENT": [{ "suggested_value": "SALIENCE", "column": "KPI", "similarity_score": 86 }] },
  "data_ambiguity_suggestions": {},
  "unknown_entities": [],
  "hil_trigger": false
}
```

---

### `analysis_tool`

**Purpose:** Executes a "Smart Flow" — a pre-configured analytical procedure (stored procedure) that retrieves brand/KPI insights from the data warehouse.

**Business rules:**
- If `outcome.stored_proc` exists: Shows "Insights generated using Smart Flow: **{stored_proc}**!"
- Otherwise: Shows "Insights generated using Smart Flow!"
- If `outcome.summary` exists: Appends truncated summary (max 500 chars)
- If `outcome.table_references` array exists: Appends "Sources: ..." reference list
- Marked as a **long-running node** — when another step points to it via `next_tool`, shows "This usually takes about 30 seconds."

**Outcome shape:**
```json
{
  "stored_proc": "get_brand_highlights",
  "arguments": { "brand": ["CORONA EXTRA"], "country": ["brazil"] },
  "summary": "Optional text summary",
  "table_references": ["table1", "table2"]
}
```

---

### `smartflow_analysis_tool_node`

**Purpose:** Alternative Smart Flow execution node with a different payload shape. Appears in certain pipeline configurations.

**Business rules:**
- Shows "Running your Smart Flow..." with "This usually takes about 30 seconds."
- If `outcome.stored_proc` exists: Shows the Smart Flow name
- If `outcome.response` exists: Shows truncated response text
- Appends table references if available

---

### `sql_tool`

**Purpose:** Executes custom SQL queries against the data warehouse when the pre-built Smart Flows don't cover the user's question.

**Business rules:**
- Shows "Insights generated!"
- Displays truncated `outcome.response` (max 500 chars)
- Appends table references

---

### `python_tool`

**Purpose:** Executes Python code for advanced data transformations, statistical analysis, or custom computations.

**Business rules:**
- Shows "Execution complete!"
- Displays truncated `outcome.response`

---

### `chart_creation_tool`

**Purpose:** Generates visualizations (charts, graphs) from the analyzed data.

**Business rules:**
- Shows "Chart created!" (no outcome parsing — the chart is rendered separately in the final answer)

---

### `doc_qa_tool`

**Purpose:** Searches internal documents and reports to answer questions about brand strategies, market research, etc.

**Business rules:**
- Shows "Insights generated!"
- Displays truncated response content (max 1000 chars for markdown)
- If `outcome.document_references` array exists: Extracts filenames from paths and shows as "Sources: file1.pdf, file2.pdf"
- Marked as a **long-running node**

---

### `internet_tool`

**Purpose:** Searches the public internet for supplementary context (market news, competitor data, etc.).

**Business rules:**
- Shows "Insights generated!"
- Displays truncated `outcome.response`
- If `outcome.internet_references` array exists: Shows as "Sources: ..."

---

### `business_knowledge_tool`

**Purpose:** Looks up internal business context, brand guidelines, and domain-specific knowledge.

**Business rules:**
- Shows "Context retrieved!"
- Displays truncated `outcome.response`

---

### `evaluator`

**Purpose:** Reviews the collected information and decides whether the agent has enough data to answer, or needs to loop back for more.

**Business rules:**
- **Decision "complete"**: Shows "My review is complete!" + "I have all the information I need to answer your question."
- **Decision "incomplete"**: Shows "Needs more work" + a single body line resolved in this order: `missing_information` → `reasoning` → default string `Additional information needed` (user-facing gap first when the backend sends both)
- The `decision` field can come from either `outcome.decision` or `step.decision` (API inconsistency handled)
- When decision is incomplete and `iteration > 0`, the next step label becomes "Improving your answer..." (refinement loop)

---

### `final_answer_tool`

**Purpose:** The agent's final step where it synthesizes all gathered information into a response.

**Business rules:**
- Shows "Your response is ready"
- If `next_tool === "END"`: Appends "Complete!" and shows no skeleton (pipeline finished)
- If `next_tool` is something else (rare edge case): Shows skeleton if this is the last step
- The `execution_time_ms` field on this step is used by ExecutionLog to calculate the "Thought for X seconds" accordion title

---

### `human_assistance` / `human_interrupt_for_analysis_node`

**Purpose:** The agent needs human clarification before it can proceed. This pauses the automated pipeline.

**Business rules:**
- Shows "Just a quick clarification..."
- If the step has a `next_question`, it's displayed after the header (this is the question the agent wants to ask the user)

---

## Status Label System

The ProgressLabel at the top of the streaming timeline shows contextual text about what the agent is doing. The label is resolved through a priority chain:

1. If the current step has `next_tool` (and it's not END):
   - For `similar_plan_tool` or `evaluator`: Uses `resolveNextStepLabel()` which checks for incomplete evaluation loops
   - For other nodes: Uses `getNextStepLabelByNode(next_tool)` from the registry
2. If no `next_tool`: Uses `getStatusLabelByNode(node)` from the registry
3. Fallback: "Thinking..."

### Label Resolution Logic

```
Is there an incomplete evaluator in history?
  └── YES → "Improving your answer..."
Has there been an evaluator with iteration > 0?
  └── YES → "Improving your answer..."
Is next_tool planner/similar_plan_tool with iteration < 1?
  └── YES → "Planning next steps..."
Otherwise → registry's nextStepLabel for the target node
```

---

## Auto-Scroll Behavior

The `useAutoScroll` hook manages scroll-to-bottom behavior during streaming.

**How it works:**
1. Attaches a passive `scroll` event listener to the container
2. On each scroll event, calculates `distanceFromBottom = scrollHeight - scrollTop - clientHeight`
3. If `distanceFromBottom > 50px`, marks the user as "scrolled up" (`isUserScrolledUpRef`)
4. When new entries arrive (dependency changes) and the user hasn't scrolled up, auto-scrolls to bottom using `requestAnimationFrame` + `scrollTo({ behavior: 'smooth' })`
5. Exposes `scrollToBottom()` to programmatically reset and scroll down

**Key design decisions:**
- Uses refs (not state) to avoid re-renders on every scroll event
- The 50px threshold prevents false positives from minor scroll jitter
- `requestAnimationFrame` ensures scrolling happens after DOM paint
- `passive: true` on the listener doesn't block the browser's scroll optimization

---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Screen reader announcements | `role="log"` + `aria-relevant="additions"` on ScrollContainer |
| Live status updates | `role="status"` + `aria-live="polite"` on ProgressLabel |
| Loading indicator | `role="status"` + `aria-label="Loading"` on SkeletonLoader |
| Accordion keyboard nav | `focus-visible` ring, `aria-controls` + `aria-expanded` |
| Decorative elements hidden | `aria-hidden="true"` on Gutter (markers + connectors) and Chevron SVG |
| Accordion panel | `role="region"` with `id` paired to trigger's `aria-controls` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all animations |

---

## CSS Tokens and Theming

All visual properties use CSS custom properties with fallback values. This enables theming without code changes — the host application provides the custom properties, and the component falls back to defaults.

### Token Reference

| Token | Fallback | Usage |
|-------|----------|-------|
| `--ai-chat-font-family` | `'Avantt', sans-serif` | Root font family |
| `--ai-chat-font-size-sm` | `12px` | Timeline text, labels, code |
| `--ai-chat-line-height-snug` | `1.4` | Paragraph line height |
| `--ai-chat-color-fg-secondary` | `#5c5c5c` | Item content text |
| `--ai-chat-color-fg-tertiary` | `#8a8a8a` | Labels, empty state, marker fill |
| `--ai-chat-color-bg-secondary` | `#f3f3f3` | Skeleton shimmer highlight |
| `--ai-chat-color-bg-tertiary` | `#e2e2e2` | Skeleton base, avatar |
| `--ai-chat-color-bd-tertiary` | `#e0e0e0` | Marker border, connector line |
| `--ai-chat-border-width-medium` | `2px` | Connector width |
| `--ai-chat-radius-sm` | `4px` | Accordion, skeleton bars |
| `--ai-chat-space-1` | `4px` | Item content bottom padding |
| `--ai-chat-space-2` | `8px` | Gaps, timeline padding, skeleton gaps |
| `--ai-chat-space-3` | `12px` | HR margins, skeleton header gap |
| `--ai-chat-space-4` | `16px` | Skeleton block margin |
| `--ai-chat-transition-normal` | `200ms ease` | Opacity, chevron rotation |
| `--ai-chat-transition-slow` | `300ms ease` | Accordion panel expand |
| `--ai-chat-focus-ring` | `0 0 0 2px rgba(229, 182, 17, 0.4)` | Accordion focus indicator |

---

## Performance Optimizations

| Optimization | Where | What it does |
|-------------|-------|-------------|
| `React.memo` | ExecutionLog, TimelineItem | Prevents re-renders when parent updates but props haven't changed |
| Incremental append | ExecutionLog useEffect | Only processes new steps (processedCountRef), never re-formats existing entries |
| `content-visibility: auto` | ItemRow styled component | Browser skips rendering off-screen items (CSS containment) |
| `contain-intrinsic-size` | ItemRow styled component | Provides estimated size for off-screen items to prevent layout shift |
| `isolation: isolate` | ItemRow styled component | Creates new stacking context, avoids paint pollution from z-index |
| `overscroll-behavior: contain` | ScrollContainer | Prevents scroll chaining to parent when reaching edges |
| Passive scroll listener | useAutoScroll | Doesn't block the main thread on scroll events |
| `requestAnimationFrame` | useAutoScroll | Ensures scroll operations happen at optimal paint timing |
| Refs over state | useAutoScroll | `isUserScrolledUpRef` doesn't trigger re-renders on scroll |
| `useCallback` for formatStep | ExecutionLog | Memoized formatting function, stable reference across renders |
| `useMemo` for labels | ExecutionLog | progressLabel and durationLabel only recompute when steps change |

---

## File Structure

```
ExecutionLog/
├── index.ts                    # Public exports: ExecutionLog, AgentStepEvent, ExecutionLogProps
├── ExecutionLog.tsx            # Main orchestrator component (memo)
├── ExecutionLog.types.ts       # AgentStepEvent, TimelineEntry, ExecutionLogProps
├── ExecutionLog.styles.ts      # Emotion styled components (all timeline styles)
├── TimelineItem.tsx            # Single timeline entry renderer (memo)
├── useAutoScroll.ts            # Custom hook for scroll-to-bottom behavior
├── README.md                   # This file
└── formatters/
    ├── index.ts                # Public API + side-effect node registrations
    ├── types.ts                # FormatContext, FormatResult, NodeFormatter
    ├── registry.ts             # Strategy registry (Map + register/get)
    ├── helpers.ts              # Shared utilities (truncate, entities, next step)
    └── nodes/
        ├── planner.ts          # planner node formatter
        ├── similarPlan.ts      # similar_plan_tool formatter
        ├── entityRecognizer.ts # 3 entity recognizer variants
        ├── analysisTool.ts     # analysis_tool + smartflow_analysis_tool_node
        ├── dataTools.ts        # sql, python, chart, doc_qa, internet, business_knowledge
        ├── evaluator.ts        # evaluator (complete/incomplete decision)
        ├── finalAnswer.ts      # final_answer_tool (terminal step)
        └── humanAssistance.ts  # human_assistance + human_interrupt
```

### Atom Dependencies

```
atoms/
├── Accordion/
│   ├── Accordion.tsx           # Collapsible panel (used in complete mode)
│   ├── Accordion.styles.ts     # Emotion styles with CSS tokens
│   └── index.ts
├── SkeletonLoader/
│   ├── SkeletonLoader.tsx      # Shimmer loading placeholder
│   ├── SkeletonLoader.styles.ts # Emotion styles with keyframes
│   └── index.ts
└── MarkdownRenderer/           # Renders markdown to HTML (external dependency)
```

---

## Props Reference

### `<ExecutionLog>`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `steps` | `AgentStepEvent[]` | Yes | Array of WebSocket events, appended as they arrive |
| `status` | `'streaming' \| 'complete'` | Yes | Current state — streaming shows live timeline, complete wraps in accordion |

### `<TimelineItem>` (internal)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | — | Markdown string to render |
| `nodeType` | `string` | — | Node identifier for test IDs |
| `status` | `'streaming' \| 'complete'` | — | Inherited from parent |
| `isLast` | `boolean` | `false` | Whether this is the last entry |
| `showSkeleton` | `boolean` | `false` | Whether to show loading indicator |

### `<Accordion>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Clickable header content |
| `children` | `ReactNode` | — | Collapsible content |
| `defaultOpen` | `boolean` | `false` | Initial open state |

### `<SkeletonLoader>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `3` | Number of skeleton blocks |
| `size` | `'sm' \| 'md'` | `'md'` | Bar height (12px / 16px) |
| `showAvatar` | `boolean` | `true` | Show circular avatar placeholder |

---

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| `react` | Component framework (useState, useEffect, useRef, useMemo, useCallback, memo) |
| `@emotion/styled` | CSS-in-JS styled components |
| `@emotion/react` | keyframes for SkeletonLoader animation |
| `MarkdownRenderer` | Internal atom — renders markdown strings to HTML |

No external runtime dependencies beyond React and Emotion.
