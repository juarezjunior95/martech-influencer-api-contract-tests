export interface LinePointTooltipOptions {
  /**
   * When true and `formattedData` is passed to the handler factory, tooltip values use those strings.
   */
  useFormattedData?: boolean;
  /**
   * `dataset.label` → abbreviation. The order of the keys defines the order of the lines in the tooltip.
   * When defined, values are formatted as thousands with suffix k on the client.
   */
  tooltipLabels?: Record<string, string>;
}

export interface LinePointTooltipHandlerOptions extends LinePointTooltipOptions {
  formattedData?: string[][];
}
