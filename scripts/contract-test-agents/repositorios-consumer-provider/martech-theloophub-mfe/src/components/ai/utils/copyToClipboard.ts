import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown, { type Components } from 'react-markdown';

import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

import { removeCitations } from './removeCitations';

const REMARK_PLUGINS = [remarkGfm];

/**
 * Same sanitization schema used in MarkdownRenderer to support custom tags
 * like <details>, <summary>, <tabgroup>, <chartsgroup>
 */
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'details',
    'summary',
    'mark',
    'tabgroup',
    'chartsgroup',
  ],
  attributes: {
    ...defaultSchema.attributes,
    details: ['open'],
    summary: [],
    mark: [],
    tabgroup: [],
    chartsgroup: [],
    '*': ['className', 'class', 'id'],
  },
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https', 'data'],
    cite: ['http', 'https'],
  },
  clobberPrefix: 'user-',
  clobber: ['name', 'id'],
};

const REHYPE_PLUGINS: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
];

/**
 * Custom components to handle special tags when copying.
 * - chartsgroup: Returns null to exclude chart JSON from copied content
 * - tabgroup: Transparent wrapper that passes through children
 */
function ChartsGroupComponent() {
  return null;
}

function TabGroupComponent({ children }: { children?: ReactNode }) {
  return children as React.ReactElement;
}

/**
 * Type that extends Components to allow custom HTML tags
 * used in AI-generated markdown (chartsgroup, tabgroup)
 */
type CustomComponents = Partial<Components> & {
  chartsgroup?: typeof ChartsGroupComponent;
  tabgroup?: typeof TabGroupComponent;
};

const CUSTOM_COMPONENTS: CustomComponents = {
  chartsgroup: ChartsGroupComponent,
  tabgroup: TabGroupComponent,
};

function markdownToHtml(markdown: string): string {
  const clean = removeCitations(markdown);
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: REMARK_PLUGINS,
        rehypePlugins: REHYPE_PLUGINS,
        components: CUSTOM_COMPONENTS,
      },
      clean,
    ),
  );
}

export async function copyToClipboard(content: string): Promise<void> {
  try {
    const html = markdownToHtml(content);
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([content], { type: 'text/plain' }),
      }),
    ]);
  } catch {
    await navigator.clipboard.writeText(content);
  }
}
