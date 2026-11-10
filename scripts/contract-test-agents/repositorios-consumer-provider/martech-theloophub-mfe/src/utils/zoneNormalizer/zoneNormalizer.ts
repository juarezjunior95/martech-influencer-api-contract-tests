const zoneNormalizer: Record<string, string> = {
  EUR: 'Europe',
  AFR: 'Africa',
  APAC: 'Asia Pacific',
  MAZ: 'Middle East and Africa',
  NAZ: 'North America',
  SAZ: 'South America',
};

export function normalizeZone(zone: string): string {
  return zoneNormalizer[zone] || zone;
}
