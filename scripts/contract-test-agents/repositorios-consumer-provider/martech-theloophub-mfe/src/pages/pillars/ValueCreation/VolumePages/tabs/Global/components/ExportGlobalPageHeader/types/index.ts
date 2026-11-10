export interface ExportGlobalPageHeaderProps {
  dataTestId?: string;
  monthYear: string;
}

export type UseExportGlobalPageHeaderProps = Pick<
  ExportGlobalPageHeaderProps,
  'monthYear'
>;
