export const cardsOrder = [
  'Beer Participation',
  'Superior Core',
  'Lead Premium',
  'Balanced Choices',
  'Beyond Beer',
];

export function sortGrowthLeversByDefaultOrder<T extends { title: string }>(
  data: T[],
): T[] {
  return (
    data
      ?.slice()
      .sort(
        (a, b) => cardsOrder.indexOf(a.title) - cardsOrder.indexOf(b.title),
      ) || []
  );
}
