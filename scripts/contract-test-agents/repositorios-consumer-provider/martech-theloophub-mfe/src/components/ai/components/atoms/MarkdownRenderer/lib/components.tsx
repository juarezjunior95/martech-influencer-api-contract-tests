import { isValidElement } from 'react';

import { Accordion } from '../../Accordion';
import { TableScrollContainer } from '../styles';
import { extractTextFromReactNode } from './utils';

const DEFAULT_SUMMARY_TEXT = 'Details';

/**
 * Extracts text content from a React element's children.
 * Returns default text if children are not present or invalid.
 */
function extractSummaryText(element: React.ReactElement): string {
  const props = element.props;

  if (!props || typeof props !== 'object' || !('children' in props)) {
    return DEFAULT_SUMMARY_TEXT;
  }

  const children = props.children as React.ReactNode;
  return children ? extractTextFromReactNode(children) : DEFAULT_SUMMARY_TEXT;
}

/**
 * Checks if a React element is a summary element based on its key.
 * Uses multiple strategies for robustness against ReactMarkdown changes.
 */
function isSummaryElement(child: React.ReactNode): child is React.ReactElement {
  return (
    isValidElement(child) &&
    child.key !== null &&
    typeof child.key === 'string' &&
    (child.key.startsWith('summary-') || child.key.includes('summary'))
  );
}

/**
 * Custom component for rendering <details> tags in markdown.
 *
 * Extracts the <summary> content and passes it to the Accordion component,
 * while rendering the rest of the children as accordion content.
 */
function DetailsComponent({
  children,
  ...props
}: Readonly<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDetailsElement>,
    HTMLDetailsElement
  >
>) {
  const childArray = Array.isArray(children) ? children : [children];
  let summaryText = DEFAULT_SUMMARY_TEXT;
  const rest: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (isSummaryElement(child)) {
      summaryText = extractSummaryText(child);
    } else {
      rest.push(child);
    }
  });

  return (
    <Accordion summary={summaryText} {...props}>
      {rest}
    </Accordion>
  );
}

DetailsComponent.displayName = 'DetailsComponent';

/**
 * Custom component for rendering <tabgroup> tags.
 * Simply passes through children (acts as a transparent wrapper).
 */
function TabGroupComponent({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  return <>{children}</>;
}

TabGroupComponent.displayName = 'TabGroupComponent';

/**
 * Custom component for <summary> tags.
 * Returns null because summary content is handled by the DetailsComponent.
 */
function SummaryComponent() {
  return null;
}
SummaryComponent.displayName = 'SummaryComponent';

/**
 * Custom component for <chartsgroup> tags.
 * Returns null to ignore charts for now (future implementation).
 */
function ChartsGroupComponent() {
  return null;
}

ChartsGroupComponent.displayName = 'ChartsGroupComponent';

interface CreateMarkdownComponentsOptions {
  tableHorizontalScroll?: boolean;
}

/**
 * Custom components mapping for ReactMarkdown.
 *
 * These components handle custom HTML tags in the AI-generated markdown:
 * - details: Rendered as Accordion component
 * - summary: Handled by DetailsComponent (returns null standalone)
 * - tabgroup: Transparent wrapper for table grouping
 * - chartsgroup: Ignored for now (future feature)
 */
export const createMarkdownComponents = ({
  tableHorizontalScroll = true,
}: CreateMarkdownComponentsOptions = {}) => {
  function TableComponent({
    children,
    ...props
  }: Readonly<React.TableHTMLAttributes<HTMLTableElement>>) {
    return (
      <TableScrollContainer
        data-testid="markdown-table-scroll"
        $enableHorizontalScroll={tableHorizontalScroll}
      >
        <table {...props}>{children}</table>
      </TableScrollContainer>
    );
  }

  TableComponent.displayName = 'TableComponent';

  return {
    details: DetailsComponent,
    summary: SummaryComponent,
    tabgroup: TabGroupComponent,
    chartsgroup: ChartsGroupComponent,
    table: TableComponent,
  } as const;
};

export const markdownComponents = createMarkdownComponents();
