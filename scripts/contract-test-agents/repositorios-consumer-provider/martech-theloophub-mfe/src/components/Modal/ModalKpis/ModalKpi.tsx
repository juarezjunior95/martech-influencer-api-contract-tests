import { useEffect } from 'react';

import { Heading, Modal, Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { CalendarClock, ChevronUp } from '@hexa-ui/icons';
import { Close } from '@hexa-ui/icons2';
import { Skeleton } from 'components';
import { useDataRefreshContext } from 'contexts';

import {
  ModalBodyWrapper,
  ModalContentSection,
  ModalContentWrapper,
  ModalTable,
  ModalTitleContent,
  StyledCloseButton,
  StyledSeeMoreButton,
  WrapperTable,
} from './components/ModalTable';

const SkeletonLoader = () => (
  <Skeleton width="558px" height="368px" length={1} />
);

export const ModalKpi = () => {
  const {
    modalOpen,
    setModalOpen,
    setShowAllRows,
    modalData,
    isDisabledBtn,
    handleDataForTab,
    showAllRows,
    toggleShowAllRows,
    selectedTab,
  } = useDataRefreshContext();

  useEffect(() => {
    if (selectedTab && modalOpen) {
      handleDataForTab(selectedTab);
    }
  }, [selectedTab, modalOpen, handleDataForTab]);

  return (
    <>
      {modalOpen && (
        <ModalContentWrapper>
          <Modal.Root
            open={modalOpen}
            variant="overlay"
            title={
              <ModalTitleContent>
                <CalendarClock size="xlarge" />
                <Heading size="H3">Data Refresh & Source</Heading>
              </ModalTitleContent>
            }
            actions={
              <Modal.Action>
                <StyledCloseButton
                  data-testid="close-modal"
                  aria-label="Close modal"
                  onClick={() => {
                    setModalOpen(false);
                    setShowAllRows(false);
                  }}
                >
                  <Icon icon={Close} size="small" />
                </StyledCloseButton>
              </Modal.Action>
            }
          >
            <ModalBodyWrapper>
              <Paragraph>
                Displays details on the latest data update and the source of the
                data being used.
              </Paragraph>
              <ModalContentSection>
                <WrapperTable>
                  {modalData ? (
                    <>
                      <ModalTable data={modalData} />
                      <StyledSeeMoreButton
                        showAllRows={showAllRows}
                        disabled={isDisabledBtn}
                        singleRow={modalData?.rows[0]?.length === 1}
                        onClick={() => {
                          if (!isDisabledBtn) toggleShowAllRows();
                        }}
                      >
                        <Paragraph>
                          {showAllRows ? 'See less' : 'See more'}
                        </Paragraph>
                        <ChevronUp />
                      </StyledSeeMoreButton>
                    </>
                  ) : (
                    <SkeletonLoader />
                  )}
                </WrapperTable>
              </ModalContentSection>
            </ModalBodyWrapper>
          </Modal.Root>
        </ModalContentWrapper>
      )}
    </>
  );
};
