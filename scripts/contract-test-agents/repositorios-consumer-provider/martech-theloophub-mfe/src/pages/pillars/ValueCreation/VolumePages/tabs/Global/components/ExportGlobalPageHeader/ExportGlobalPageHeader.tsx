import { FC } from 'react';

import { useIsAnyLoading } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useExportGlobalPageHeader } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/ExportGlobalPageHeader/hooks/useExportGlobalPageHeader';
import { ExportGlobalPageHeaderProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/ExportGlobalPageHeader/types';
import {
  StyledExportButton,
  StyledExportIcon,
  StyledExportPageHeader,
} from 'shared/Styles/exportPages.styles';

const ExportIcon: FC = () => <StyledExportIcon />;

export const ExportGlobalPageHeader: FC<ExportGlobalPageHeaderProps> = ({
  dataTestId,
  monthYear,
}) => {
  const isAnyLoading = useIsAnyLoading();
  const { handlePDFExport } = useExportGlobalPageHeader({ monthYear });

  return (
    <StyledExportPageHeader>
      <StyledExportButton
        data-testid={dataTestId ? `${dataTestId}-export-button` : undefined}
        variant="primary"
        size="medium"
        onClick={handlePDFExport}
        isLoading={isAnyLoading}
        icon={ExportIcon}
        trailing
      >
        Export File
      </StyledExportButton>
    </StyledExportPageHeader>
  );
};
