import { VIEWER_SCOPES } from "@domain/entities/scopes";
import { UserEntity } from "@domain/entities/user.entity";
import { countriesRegistry } from "@domain/registries/countries.registry";

/**
 * Mirrors Drupal `OnewayReportsFilterPluginBase::getUserPermissions()`:
 * empty map means all zones/countries; otherwise zone → allowed ISO3 codes.
 */
export function buildPerformanceToolUserPermissions(
  user: UserEntity | undefined,
): Record<string, string[]> {
  if (
    !user ||
    user.policy.mode === "unrestricted" ||
    user.policy.mode === "all"
  ) {
    return {};
  }
  if (user.policy.mode === "deny") {
    return { NONE: ["NONE"] };
  }

  const map: Record<string, string[]> = {};
  for (const iso3 of user.policy.iso3Set) {
    const rec = countriesRegistry[iso3];
    if (!rec) {
      continue;
    }
    if (!map[rec.zone]) {
      map[rec.zone] = [];
    }
    map[rec.zone].push(iso3);
  }

  if (user.scopes.includes(VIEWER_SCOPES.ZONE.EUR)) {
    if (!map.EUR) {
      map.EUR = [];
    }
    if (!map.EUR.includes("EUR")) {
      map.EUR.push("EUR");
    }
    if (!map.EUR.includes("ABI")) {
      map.EUR.push("ABI");
    }
  }

  if (Object.keys(map).length === 0) {
    return { NONE: ["NONE"] };
  }
  return map;
}
