import type { FormatResult } from './types';

export function truncateText(text: string, maxLength = 500): string {
  if (!text || typeof text !== 'string') return '';
  const cleaned = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
}

export function truncateMarkdown(text: string, maxLength = 1000): string {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function extractPlanBullets(outcome: unknown): string[] {
  const parsed =
    typeof outcome === 'object' && outcome !== null
      ? (outcome as Record<string, unknown>)
      : null;

  const plan = parsed?.plan;
  if (typeof plan !== 'string') return [];

  return plan
    .split(/\d+\.\s+/)
    .filter((item) => item.trim().length > 0)
    .map((item) => item.replace(/\\n/g, ' ').replace(/\n/g, ' ').trim());
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatEntityLabels(outcome: Record<string, unknown>): string[] {
  const {
    validated_entities = {},
    suggested_entities = {},
    data_ambiguity_suggestions = {},
    unknown_entities = [],
  } = outcome as Record<string, Record<string, unknown> | unknown[]>;

  const labels: string[] = [];
  const ambiguityKeys = Object.keys(
    data_ambiguity_suggestions as Record<string, unknown>,
  );

  for (const key of ambiguityKeys) {
    labels.push(`\`${key} ?\``);
  }

  const validatedObj = validated_entities as Record<string, string[]>;
  for (const [key, types] of Object.entries(validatedObj)) {
    if (
      !(data_ambiguity_suggestions as Record<string, unknown>)[key] &&
      Array.isArray(types) &&
      types.length > 0
    ) {
      labels.push(`\`${capitalize(types[0])}: ${key}\``);
    }
  }

  const suggestedObj = suggested_entities as Record<
    string,
    Array<{ column?: string }>
  >;
  for (const [key, values] of Object.entries(suggestedObj)) {
    if (Array.isArray(values) && values.length > 0 && values[0].column) {
      labels.push(`\`${capitalize(values[0].column)}: ${key} ?\``);
    } else {
      labels.push(`\`${key} ?\``);
    }
  }

  const unknownArr = unknown_entities as Array<
    | string
    | { entity_value?: string; entity_name?: string; entity_type?: string }
  >;
  for (const item of unknownArr) {
    const value = typeof item === 'string' ? item : item?.entity_value;
    const name =
      typeof item === 'string'
        ? item
        : (item?.entity_name ?? item?.entity_type ?? 'Unknown');
    labels.push(`\`${name}: ${value}?\``);
  }

  return labels;
}

export function appendTableReferences(markdown: string, refs: unknown): string {
  if (!Array.isArray(refs) || refs.length === 0) return markdown;
  return markdown + `\n **Sources:** ${refs.join(', ')}`;
}

export function formatResult(markdown: string, isLast: boolean): FormatResult {
  return { markdown, showSkeleton: isLast };
}
