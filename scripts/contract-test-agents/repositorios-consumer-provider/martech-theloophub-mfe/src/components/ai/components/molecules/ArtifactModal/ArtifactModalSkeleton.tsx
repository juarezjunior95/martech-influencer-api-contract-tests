import {
  AccordionHeaderSkeleton,
  AccordionItemSkeleton,
  AccordionSkeleton,
  BodyContainer,
  HeaderSkeleton,
  LineSkeleton,
  ParagraphSkeleton,
  SectionTitleSkeleton,
} from './ArtifactModalSkeleton.styles';

export const ArtifactModalSkeleton = () => {
  return (
    <div data-testid="loading">
      <HeaderSkeleton />
      <BodyContainer>
        <ParagraphSkeleton>
          <LineSkeleton width="100%" />
          <LineSkeleton width="90%" />
          <LineSkeleton width="100%" />
          <LineSkeleton width="95%" />
          <LineSkeleton width="85%" />
          <LineSkeleton width="92%" />
        </ParagraphSkeleton>

        <div>
          <SectionTitleSkeleton />
          <AccordionSkeleton>
            <AccordionItemSkeleton>
              <AccordionHeaderSkeleton />
            </AccordionItemSkeleton>
            <AccordionItemSkeleton>
              <AccordionHeaderSkeleton />
            </AccordionItemSkeleton>
            <AccordionItemSkeleton>
              <AccordionHeaderSkeleton />
            </AccordionItemSkeleton>
            <AccordionItemSkeleton>
              <AccordionHeaderSkeleton />
            </AccordionItemSkeleton>
          </AccordionSkeleton>
        </div>
      </BodyContainer>
    </div>
  );
};
