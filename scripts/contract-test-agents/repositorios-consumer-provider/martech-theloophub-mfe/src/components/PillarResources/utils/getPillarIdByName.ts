import { PlatformPillar } from '../types';

/**
 * Resolves pillar id by name from the API response (platformPillars).
 * Runs at runtime after the API response to avoid hardcoded mapping.
 */
export function getPillarIdByName(
  platformPillars: PlatformPillar[],
  pillarName: string,
): number | undefined {
  const pillar = platformPillars.find(
    (p) => p.name.toLowerCase().trim() === pillarName.toLowerCase().trim(),
  );
  return pillar?.id;
}
