import styled from '@emotion/styled';

import { chatMessageBodyTypography } from '../../shared/typography';
import { MARKDOWN_CHAT_MESSAGE_CLASS } from './constants';

export const MarkdownWrapper = styled.div`
  font-family: var(--ai-chat-font-family-body, 'Work Sans');
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: var(--ai-chat-line-height-normal, 1.5);
  color: var(--ai-chat-color-text-primary, #141414);

  &.${MARKDOWN_CHAT_MESSAGE_CLASS} {
    ${chatMessageBodyTypography}
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: var(--ai-chat-space-4, 16px);
    margin-bottom: var(--ai-chat-space-2, 8px);
    font-weight: var(--ai-chat-font-weight-semibold, 600);
    line-height: var(--ai-chat-line-height-snug, 1.4);
  }

  h1 {
    font-size: var(--ai-chat-font-size-2xl, 20px);
  }
  h2 {
    font-size: var(--ai-chat-font-size-xl, 18px);
  }
  h3 {
    font-size: var(--ai-chat-font-size-lg, 16px);
  }

  p {
    margin: 0;
  }

  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: var(--ai-chat-space-2, 8px) 0;
    padding-left: var(--ai-chat-space-6, 24px);
  }

  li {
    margin: var(--ai-chat-space-1, 4px) 0;
  }

  strong {
    font-weight: var(--ai-chat-font-weight-semibold, 600);
  }

  code {
    background-color: var(--ai-chat-color-bg-secondary, #f3f3f3);
    padding: 2px var(--ai-chat-space-1, 4px);
    border-radius: var(--ai-chat-radius-sm, 4px);
    font-family: monospace;
    font-size: 13px;
  }

  pre {
    background-color: var(--ai-chat-color-bg-secondary, #f3f3f3);
    padding: var(--ai-chat-space-3, 12px);
    border-radius: var(--ai-chat-radius-md, 8px);
    overflow-x: auto;
    margin: var(--ai-chat-space-2, 8px) 0;
  }

  pre code {
    background: none;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--ai-chat-space-3, 12px) 0;
    font-size: var(--ai-chat-font-size-lg, 16px);
  }

  th,
  td {
    padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-3, 12px);
    text-align: left;
    border: var(--ai-chat-border-width-thin, 1px) solid
      var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
  }

  th {
    background-color: var(--ai-chat-color-bg-default, #ffffff);
    font-weight: var(--ai-chat-font-weight-semibold, 600);
    border-bottom: var(--ai-chat-border-width-medium, 2px) solid
      var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
  }

  tr:nth-of-type(even) {
    background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
  }

  blockquote {
    border-left: 3px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
    margin: var(--ai-chat-space-2, 8px) 0;
    padding-left: var(--ai-chat-space-4, 16px);
    color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  }

  a {
    color: var(--ai-chat-color-link, #1890ff);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  hr {
    border: none;
    border-top: var(--ai-chat-border-width-thin, 1px) solid
      var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
    margin: var(--ai-chat-space-4, 16px) 0;
  }

  &.ai-summary-volume-pages {
    table {
      border-collapse: separate !important;
      border-spacing: 24px 0 !important;
      width: calc(100% + 48px);
      margin-left: -24px;
      margin-right: -24px;
      table-layout: fixed;
    }

    table:nth-of-type(n + 2) td {
      padding-left: 24px !important;
    }
    th {
      text-align: left;
      background: #ffffff;
      border-bottom: none;
      font-size: 24px;
      padding-left: 24px;
      padding-top: 24px;
    }

    td {
      padding: 16px 24px 16px 36px;
      vertical-align: top;
      width: 50%;
      background: #ffffff;
      border: 1px solid #00000014 !important;
      border-bottom: none !important;
      font-size: 16px;
      color: #757575;

      strong {
        color: #141414;
        display: block;
      }
    }
    tr:first-of-type td {
      padding-top: 0;
      border-top: none !important;
    }

    tr:first-child th:first-child {
      border-radius: 24px 24px 0 0;
      border-top: 1px solid #00000014;
    }

    tr:first-child th:last-child {
      border-radius: 24px 24px 0 0;
      border-top: 1px solid #00000014;
    }

    tr:last-child td:first-child {
      border-radius: 0 0 24px 24px;
      border-bottom: 1px solid #00000014;
    }

    tr:last-child td:last-child {
      border-radius: 0 0 24px 24px;
      border-bottom: 1px solid #00000014;
      padding-bottom: 24px;
    }
  }
`;

interface TableScrollContainerProps {
  $enableHorizontalScroll?: boolean;
}

export const TableScrollContainer = styled.div<TableScrollContainerProps>`
  width: 100%;
  max-width: 100%;
  overflow-x: ${({ $enableHorizontalScroll = true }) =>
    $enableHorizontalScroll ? 'auto' : 'visible'};
  margin: var(--ai-chat-space-3, 12px) 0;

  table {
    min-width: max-content;
    margin: 0;
  }
`;
