import type { TableHeaderType } from '../../types';

export type DataTableHeaderTooltipSize = 'auto' | 'medium';

export type DataTableHeaderTooltipConfig = {
  hasContent: boolean;
  title: string | undefined;
  text: string | undefined;
  indicatorColor: string | undefined;
  size: DataTableHeaderTooltipSize;
};

export function getDataTableHeaderTooltipConfig(
  column: TableHeaderType,
  parentColor?: string,
): DataTableHeaderTooltipConfig {
  const titleRaw = column.tooltipTitle?.trim() ?? '';
  const textRaw = column.tooltipContent?.trim() ?? '';
  const hasContent = titleRaw !== '' || textRaw !== '';

  const resolvedColor = column.color ?? parentColor;
  const indicatorColor =
    resolvedColor != null && String(resolvedColor).trim() !== ''
      ? resolvedColor
      : undefined;

  return {
    hasContent,
    title: titleRaw || undefined,
    text: textRaw || undefined,
    indicatorColor,
    size: titleRaw && textRaw ? 'medium' : 'auto',
  };
}
