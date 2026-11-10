import { Children, isValidElement } from 'react';

/**
 * Recursively extracts text content from React nodes.
 *
 * Handles:
 * - Strings and numbers (direct conversion)
 * - Arrays (flattened via React.Children.toArray)
 * - React elements with children (recursive extraction)
 * - Fragments and other special React nodes
 *
 * Security: Includes depth limit to prevent stack overflow attacks
 * with deeply nested malicious content.
 *
 * @param node - React node to extract text from
 * @param depth - Current recursion depth (internal use)
 * @param maxDepth - Maximum allowed depth (default: 50)
 * @returns Extracted text content
 */
export function extractTextFromReactNode(
  node: React.ReactNode,
  depth = 0,
  maxDepth = 50,
): string {
  // Safety: Prevent stack overflow with depth limit
  if (depth > maxDepth) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[MarkdownRenderer] Max depth reached in extractTextFromReactNode. ' +
          'This may indicate malicious or deeply nested content.',
      );
    }
    return '';
  }

  // Base cases: primitive types
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (typeof node === 'boolean') return '';

  // Handle arrays using React.Children.toArray for proper Fragment handling
  if (Array.isArray(node)) {
    return Children.toArray(node)
      .map((child) => extractTextFromReactNode(child, depth + 1, maxDepth))
      .join('');
  }

  // Handle React elements
  if (isValidElement(node) && node.props && 'children' in node.props) {
    const children = node.props.children as React.ReactNode;
    return extractTextFromReactNode(children, depth + 1, maxDepth);
  }

  return '';
}
