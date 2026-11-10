const createKpisGroupMapFromGrouped = (groups: Record<string, string[]>) => {
  const entries: [string, string][] = [];

  for (const [value, keys] of Object.entries(groups)) {
    for (const key of keys) {
      entries.push([key, value]);
    }
  }

  return Object.fromEntries(entries) as Record<string, string>;
};

export const kpisGroupMap = createKpisGroupMapFromGrouped({
  volume: [
    'Volume',
    'Core Superiority',
    'Balanced Choices',
    'Premiumization',
    'Beyond Beer',
  ],
  pos: ['Beer Participation'],
  market_share: ['Market Share'],
  power: ['Brand Power'],
  finance: ['Net Revenue', 'CORES'],
});
