import { BadRequestException } from "@nestjs/common";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import type {
  Competition,
  CompetitionDefault,
  CompetitionDivision,
  GlCompetitionsPresetConfig,
  GlCompetitionsPresetValue,
} from "@domain/config/presets/gl-competitions/gl-competitions.types";

type CompetitionKind = "league" | "cup";

/**
 * Internal registry shape — competitions tagged with their `kind`
 * before being filtered and projected to the public {@link Competition}.
 */
interface CompetitionEntry {
  label: string;
  value: string;
  kind: CompetitionKind;
  divisions?: CompetitionDivision[];
  default?: CompetitionDivision;
}

const VALID_TYPES: ReadonlySet<string> = new Set(["league", "cup"]);
const FALLBACK_KA_DEFAULT: CompetitionDefault = {
  label: "KA Dashboard",
  value: "channels_cup",
};

/**
 * Auto-derive a default `value` from a label (lowercased,
 * whitespace replaced with underscores) when no explicit value is
 * given.
 */
function deriveValue(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

function division(label: string): CompetitionDivision {
  return { label, value: deriveValue(label) };
}

/**
 * Canonical competition registry, in display order.
 */
const COMPETITIONS: ReadonlyArray<CompetitionEntry> = [
  {
    label: "Premier League",
    value: deriveValue("Premier League"),
    kind: "league",
  },
  {
    label: "Super League",
    value: deriveValue("Super League"),
    kind: "league",
  },
  {
    label: "Megabrands Dashboard",
    value: "megabrands_cup",
    kind: "cup",
    divisions: [division("Country"), division("Brand")],
    default: division("Country"),
  },
  {
    label: "KA Dashboard",
    value: "channels_cup",
    kind: "cup",
    divisions: [division("League A"), division("League B")],
    default: division("League A"),
  },
  {
    label: "BEES Dashboard",
    value: "bees_cup",
    kind: "cup",
    divisions: [division("Acceleration Index"), division("Maturity Index")],
    default: division("Acceleration Index"),
  },
  {
    label: "DTC Dashboard",
    value: "dtc_cup",
    kind: "cup",
  },
];

/**
 * GL competitions preset handler.
 *
 * Builds a list of competitions (optionally filtered by `type`) and a
 * top-level `default` row. Selection rules:
 *   - `type` omitted / empty → full list. Top-level `default` value
 *     is forced to `"KA Dashboard"`; label comes from the first
 *     competition. The `KA Dashboard` label override is honored if
 *     the first competition's label happens to match.
 *   - `type = "league" | "cup"` → only matching competitions. Default
 *     is the first match (`label` + `value`), with the same
 *     `KA Dashboard` override.
 *   - any other `type` → `BadRequestException`.
 */
class GlCompetitionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const cfg = (preset["gl-competitions"] ?? {}) as GlCompetitionsPresetConfig;
    const filterType = (cfg.type ?? "").trim();

    if (filterType !== "" && !VALID_TYPES.has(filterType)) {
      throw new BadRequestException(
        "Invalid filter type. Must be either 'league' or 'cup'.",
      );
    }

    const filtered = filterType
      ? COMPETITIONS.filter((entry) => entry.kind === filterType)
      : COMPETITIONS;

    const values = filtered.map((entry) => this.formatCompetition(entry));
    const defaultValue = this.resolveDefault(filtered, filterType);

    const glCompetitionsValue: GlCompetitionsPresetValue = {
      values,
      default: defaultValue,
      enabled: true,
    };

    return { ...preset, "gl-competitions": glCompetitionsValue };
  }

  private formatCompetition(entry: CompetitionEntry): Competition {
    const out: Competition = { label: entry.label, value: entry.value };
    if (entry.divisions && entry.divisions.length > 0) {
      out.divisions = entry.divisions.map((division) => ({ ...division }));
    }
    if (entry.default) {
      out.default = { ...entry.default };
    }
    return out;
  }

  private resolveDefault(
    filtered: ReadonlyArray<CompetitionEntry>,
    filterType: string,
  ): CompetitionDefault | Record<string, never> {
    const head = filtered[0];
    if (!head) {
      return {};
    }

    const label = head.label || "KA Dashboard";
    const baseValue = filterType === "" ? "KA Dashboard" : head.value;
    const value =
      label === "KA Dashboard" ? FALLBACK_KA_DEFAULT.value : baseValue;

    return { label, value };
  }
}

export const glCompetitionsHandler = new GlCompetitionsPresetHandler();
