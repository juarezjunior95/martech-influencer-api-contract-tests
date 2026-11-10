import { useCallback, useMemo, useState } from 'react';

import { useExportPdf } from 'hooks';
import { PDF_DEFAULT_CONFIG } from 'pages/pillars/ValueCreation/VolumePages/constants/pdfConfig';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useVolumePageExportScopeName } from 'pages/pillars/ValueCreation/VolumePages/hooks/useVolumePageExportScopeName';
import { UseExportCountryPageHeaderProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/ExportCountryPageHeader/types';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/constants/sections';

export const useExportCountryPageHeader = ({
  monthYear,
}: UseExportCountryPageHeaderProps) => {
  const { kpiName } = useVolumePagesKpi();
  const productScopeName = useVolumePageExportScopeName();
  const [isExporting, setIsExporting] = useState(false);
  useRegisterLoading('country-export', isExporting);

  const fileName = useMemo(() => {
    const baseFileName = `Value Creation - Country ${kpiName} - ${monthYear.toUpperCase()}`;

    return `Volume Page - ${productScopeName} - ${baseFileName}`;
  }, [kpiName, monthYear, productScopeName]);

  const { onExport } = useExportPdf(
    useMemo(
      () => ({
        ...PDF_DEFAULT_CONFIG,
        filename: fileName,
      }),
      [fileName],
    ),
  );

  const handlePDFExport = useCallback(async () => {
    setIsExporting(true);

    await onExport(
      Object.values(pageSections)
        .map((section) => document.querySelector(`[data-page-name=${section}]`))
        .filter(Boolean) as HTMLElement[],
    );

    setIsExporting(false);
  }, [onExport]);

  return { handlePDFExport };
};
