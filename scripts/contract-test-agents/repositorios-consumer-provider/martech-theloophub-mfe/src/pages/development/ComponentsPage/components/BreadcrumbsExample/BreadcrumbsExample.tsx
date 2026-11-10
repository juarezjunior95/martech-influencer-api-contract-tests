import { Heading } from '@hexa-ui/components';
import { Breadcrumbs } from 'components';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';
import {
  defaultPageList,
  pageListWithFiveItems,
  pageListWithFourItems,
  pageListWithOneItem,
  pageListWithSixItems,
  pageListWithThreeItems,
  pageListWithTwoItems,
  pillarsPageList,
} from './Breadcrumbs.mock';

export const BreadcrumbsExample = () => {
  return (
    <StyledContainer style={{ padding: '20px' }}>
      <StyledSection>
        <Heading>Breadcrumbs</Heading>
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Pillars navigation example (Collapsable)
        </Heading>
        <Breadcrumbs pageList={pillarsPageList} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Without home page icon (Collapsable)
        </Heading>
        <Breadcrumbs pageList={defaultPageList} showIcon={false} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          With home page icon (Collapsable)
        </Heading>
        <Breadcrumbs pageList={defaultPageList} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 1
        </Heading>
        <Breadcrumbs pageList={pageListWithOneItem} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 2
        </Heading>
        <Breadcrumbs pageList={pageListWithTwoItems} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 3
        </Heading>
        <Breadcrumbs pageList={pageListWithThreeItems} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 4 or more (Collapsable)
        </Heading>
        <Breadcrumbs pageList={pageListWithFourItems} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 5 or more (Collapsable)
        </Heading>
        <Breadcrumbs pageList={pageListWithFiveItems} showIcon={true} />
      </StyledSection>

      <StyledSection style={{ gap: '0', flexDirection: 'column' }}>
        <Heading size="H5" style={{ paddingLeft: '8px' }}>
          Show Level 6 (Collapsable)
        </Heading>
        <Breadcrumbs pageList={pageListWithSixItems} showIcon={true} />
      </StyledSection>
    </StyledContainer>
  );
};
