import { FC } from 'react';

import { useIsAnyLoading } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useExportCountryPageHeader } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/ExportCountryPageHeader/hooks/useExportCountryPageHeader';
import { ExportCountryPageHeaderProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/ExportCountryPageHeader/types';
import {
  StyledExportButton,
  StyledExportIcon,
  StyledExportPageHeader,
} from 'shared/Styles/exportPages.styles';

const ExportIcon: FC = () => <StyledExportIcon />;

export const ExportCountryPageHeader: FC<ExportCountryPageHeaderProps> = ({
  dataTestId,
  monthYear,
}) => {
  const isAnyLoading = useIsAnyLoading();
  const { handlePDFExport } = useExportCountryPageHeader({ monthYear });

  return (
    <StyledExportPageHeader
      data-testid={
        dataTestId
          ? `tabpanel-country-export-page-header-${dataTestId}`
          : undefined
      }
    >
      <StyledExportButton
        data-testid={
          dataTestId
            ? `tabpanel-country-refresh-button-${dataTestId}`
            : undefined
        }
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
