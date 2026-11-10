import { useCurrentPage } from 'hooks';
import { VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME } from 'pages';

export const useIsInExportPage = () => {
  const { currentPage } = useCurrentPage();

  const isInExportPage = currentPage === VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME;

  return isInExportPage;
};
