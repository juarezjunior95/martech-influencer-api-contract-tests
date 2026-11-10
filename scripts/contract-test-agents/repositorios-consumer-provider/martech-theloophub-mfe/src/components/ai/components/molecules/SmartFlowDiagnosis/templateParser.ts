import type { LabelValuePair, QueryParameter } from 'models/InsightsCopilot';

const WHITESPACE = ' \t\n\r\f\v';

export interface TemplatePart {
  type: 'text' | 'placeholder';
  content: string;
}

interface TextToken {
  type: 'text';
  content: string;
}
interface PlaceholderToken {
  type: 'placeholder';
  key: string;
}
interface BlockToken {
  type: 'block';
  prefix: string;
  key: string;
  suffix: string;
}
type TemplateToken = TextToken | PlaceholderToken | BlockToken;

function isWordChar(ch: string): boolean {
  return (
    (ch >= 'a' && ch <= 'z') ||
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= '0' && ch <= '9') ||
    ch === '_'
  );
}

function readKey(str: string, start: number): string {
  let end = start;
  while (end < str.length && isWordChar(str[end])) {
    end++;
  }
  return str.slice(start, end);
}

interface ParsedToken<T> {
  token: T | null;
  fallback: string;
  end: number;
}

function tryParseBlock(template: string, pos: number): ParsedToken<BlockToken> {
  const close = template.indexOf('}', pos + 1);
  if (close === -1) {
    return { token: null, fallback: '{', end: pos + 1 };
  }

  const block = template.slice(pos + 1, close);
  const atIdx = block.indexOf('@');
  const key = atIdx >= 0 ? readKey(block, atIdx + 1) : '';

  if (!key) {
    return {
      token: null,
      fallback: template.slice(pos, close + 1),
      end: close + 1,
    };
  }

  return {
    token: {
      type: 'block',
      prefix: block.slice(0, atIdx),
      key,
      suffix: block.slice(atIdx + 1 + key.length),
    },
    fallback: '',
    end: close + 1,
  };
}

function tryParsePlaceholder(
  template: string,
  pos: number,
): ParsedToken<PlaceholderToken> {
  const key = readKey(template, pos + 1);
  if (!key) {
    return { token: null, fallback: '@', end: pos + 1 };
  }
  return {
    token: { type: 'placeholder', key },
    fallback: '',
    end: pos + 1 + key.length,
  };
}

function tokenize(template: string): TemplateToken[] {
  const tokens: TemplateToken[] = [];
  let i = 0;
  let text = '';

  while (i < template.length) {
    let parsed: ParsedToken<BlockToken | PlaceholderToken> | undefined;

    if (template[i] === '{') {
      parsed = tryParseBlock(template, i);
    } else if (template[i] === '@') {
      parsed = tryParsePlaceholder(template, i);
    }

    if (parsed?.token) {
      if (text) {
        tokens.push({ type: 'text', content: text });
        text = '';
      }
      tokens.push(parsed.token);
      i = parsed.end;
    } else if (parsed) {
      text += parsed.fallback;
      i = parsed.end;
    } else {
      text += template[i];
      i++;
    }
  }

  if (text) {
    tokens.push({ type: 'text', content: text });
  }

  return tokens;
}

export function parseTemplate(template: string): TemplatePart[] {
  return tokenize(template).flatMap((token): TemplatePart[] => {
    switch (token.type) {
      case 'text':
        return [{ type: 'text', content: token.content }];
      case 'placeholder':
        return [{ type: 'placeholder', content: token.key }];
      case 'block': {
        const parts: TemplatePart[] = [];
        if (token.prefix) {
          parts.push({ type: 'text', content: token.prefix });
        }
        parts.push({ type: 'placeholder', content: token.key });
        if (token.suffix) {
          parts.push({ type: 'text', content: token.suffix });
        }
        return parts;
      }
    }
  });
}

function getSelectedLabels(
  selected: Record<string, LabelValuePair[]>,
  key: string,
): string | null {
  const values = selected[`@${key}`];
  if (!values || values.length === 0) {
    return null;
  }
  return values.map((v) => v.label).join(', ');
}

function collapseWhitespace(str: string): string {
  let result = '';
  let prevWhitespace = false;
  for (const ch of str) {
    if (WHITESPACE.includes(ch)) {
      if (!prevWhitespace) {
        result += ' ';
      }
      prevWhitespace = true;
    } else {
      result += ch;
      prevWhitespace = false;
    }
  }
  return result.trim();
}

export function resolveTemplate(
  template: string,
  params: Record<string, QueryParameter>,
  selected: Record<string, LabelValuePair[]>,
): string {
  const resolved = tokenize(template)
    .map((token) => {
      switch (token.type) {
        case 'text':
          return token.content;
        case 'placeholder': {
          const labels = getSelectedLabels(selected, token.key);
          return (
            labels ??
            params[`@${token.key}`]?.placeholder_text ??
            `@${token.key}`
          );
        }
        case 'block': {
          const labels = getSelectedLabels(selected, token.key);
          if (!labels) {
            return '';
          }
          return `${token.prefix}${labels}${token.suffix}`;
        }
      }
    })
    .join('');

  return collapseWhitespace(resolved);
}

export function sortDropdownValues(
  defaults: LabelValuePair[],
  statics: LabelValuePair[],
  searched?: LabelValuePair[],
): LabelValuePair[] {
  const seen = new Set(defaults.map((d) => d.value));

  const staticFiltered = statics.filter((s) => !seen.has(s.value));
  for (const s of staticFiltered) {
    seen.add(s.value);
  }

  const searchedFiltered = (searched ?? []).filter((s) => !seen.has(s.value));

  return [...defaults, ...staticFiltered, ...searchedFiltered];
}
