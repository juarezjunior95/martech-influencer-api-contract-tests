import type { NodeFormatter } from './types';

const DEFAULT_STATUS = 'Thinking and discussing with Insights Copilot';

const nodeFormatters = new Map<string, NodeFormatter>();

export function registerNodeFormatter(
  nodeTypes: string | string[],
  formatter: NodeFormatter,
) {
  const types = Array.isArray(nodeTypes) ? nodeTypes : [nodeTypes];
  for (const type of types) {
    nodeFormatters.set(type, formatter);
  }
}

export function getFormatter(nodeType: string): NodeFormatter | undefined {
  return nodeFormatters.get(nodeType);
}

export function getStatusLabelByNode(nodeType: string): string {
  return nodeFormatters.get(nodeType)?.statusLabel ?? DEFAULT_STATUS;
}
