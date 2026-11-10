interface ExportCountryPageHeaderProps {
  dataTestId?: string;
  monthYear: string;
}

type UseExportCountryPageHeaderProps = Pick<
  ExportCountryPageHeaderProps,
  'monthYear'
>;

export type { ExportCountryPageHeaderProps, UseExportCountryPageHeaderProps };
