import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { removeCitations } from '../../../utils';
import { createMarkdownComponents } from './lib/components';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from './lib/config';
import { MarkdownWrapper } from './styles';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  tableHorizontalScroll?: boolean;
}

export function MarkdownRenderer({
  content,
  className,
  tableHorizontalScroll = true,
}: Readonly<MarkdownRendererProps>) {
  const markdownComponents = useMemo(
    () => createMarkdownComponents({ tableHorizontalScroll }),
    [tableHorizontalScroll],
  );

  return (
    <MarkdownWrapper className={className}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={markdownComponents}
      >
        {removeCitations(content)}
      </ReactMarkdown>
    </MarkdownWrapper>
  );
}

MarkdownRenderer.displayName = 'MarkdownRenderer';
