import { useCallback, useMemo, useState } from 'react';

import { useExportPdf } from 'hooks';
import { PDF_DEFAULT_CONFIG } from 'pages/pillars/ValueCreation/VolumePages/constants/pdfConfig';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useVolumePageExportScopeName } from 'pages/pillars/ValueCreation/VolumePages/hooks/useVolumePageExportScopeName';
import { UseExportGlobalPageHeaderProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/ExportGlobalPageHeader/types';
import { globalExportPageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/sections';

export const useExportGlobalPageHeader = ({
  monthYear,
}: UseExportGlobalPageHeaderProps) => {
  const { kpiName } = useVolumePagesKpi();
  const productScopeName = useVolumePageExportScopeName();
  const [isExporting, setIsExporting] = useState(false);
  useRegisterLoading('global-export', isExporting);
  const fileName = useMemo(() => {
    const baseFileName = `Value Creation - Global ${kpiName} Pages - ${monthYear.toUpperCase()}`;

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
      globalExportPageSections
        .map((section) => document.querySelector(`[data-page-name=${section}]`))
        .filter(Boolean) as HTMLElement[],
    );

    setIsExporting(false);
  }, [onExport]);

  return { handlePDFExport };
};
