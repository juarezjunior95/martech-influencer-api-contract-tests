import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { CarouselChevronLeft, CarouselChevronRight } from '../../atoms/Icon';
import {
  Container,
  ControlButton,
  Controls,
  Header,
  Items,
} from './SuggestionCarousel.styles';

interface SuggestionCarouselProps<T> {
  ariaLabel: string;
  header: ReactNode;
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  pageSize?: number;
}

export function SuggestionCarousel<T>({
  ariaLabel,
  header,
  items,
  getKey,
  renderItem,
  pageSize = 2,
}: Readonly<SuggestionCarouselProps<T>>) {
  const [startIndex, setStartIndex] = useState(0);
  const maxStartIndex = Math.max(
    Math.floor((items.length - 1) / pageSize) * pageSize,
    0,
  );
  const hasPrevious = startIndex > 0;
  const hasNext = startIndex < maxStartIndex;

  useEffect(() => {
    setStartIndex(0);
  }, [items]);

  const visibleItems = useMemo(
    () => items.slice(startIndex, startIndex + pageSize),
    [items, pageSize, startIndex],
  );

  return (
    <Container aria-label={ariaLabel}>
      <Header>
        {header}
        <Controls>
          <ControlButton
            type="button"
            onClick={() =>
              setStartIndex((current) => Math.max(current - pageSize, 0))
            }
            disabled={!hasPrevious}
            aria-label={`${ariaLabel} previous`}
          >
            <CarouselChevronLeft />
          </ControlButton>
          <ControlButton
            type="button"
            onClick={() =>
              setStartIndex((current) =>
                Math.min(current + pageSize, maxStartIndex),
              )
            }
            disabled={!hasNext}
            aria-label={`${ariaLabel} next`}
          >
            <CarouselChevronRight />
          </ControlButton>
        </Controls>
      </Header>
      <Items>
        {visibleItems.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </Items>
    </Container>
  );
}
