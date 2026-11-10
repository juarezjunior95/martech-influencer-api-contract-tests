import { PresetConfig } from "@domain/entities/preset.entity";

import {
  ConfigTreeListingOptions,
  TreeNode,
  generateConfigTreeDescription,
  getAllItemNames,
  getGroupedConfigTree,
} from "./config-tree-listing.util";

/**
 * Data-Service preset reference exposed in the listing.
 */
export type PresetRef = {
  name: string;
};

/**
 * Extracts the data-service refs declared in a preset config. Mirrors
 * the three accepted shapes documented on `PresetConfig.preset`.
 */
function extractRefs(config: PresetConfig): PresetRef[] {
  const ref = config.preset;

  if (typeof ref === "string") {
    return [{ name: ref }];
  }
  if (Array.isArray(ref)) {
    return ref.map((name) => ({ name }));
  }
  if (ref && typeof ref === "object") {
    return Object.keys(ref).map((name) => ({ name }));
  }
  return [];
}

/**
 * Renders the inline meta string for a preset (refs and optional
 * formatter), pipe-separated.
 */
function formatPresetMeta(config: PresetConfig): string {
  const parts: string[] = [];

  const refs = extractRefs(config);
  if (refs.length > 0) {
    const refsText = refs.map((r) => `<code>${r.name}</code>`).join(", ");
    parts.push(`refs: ${refsText}`);
  }

  if (config.formatter) {
    parts.push(`formatter: <code>${config.formatter}</code>`);
  }

  if (parts.length === 0) {
    return "";
  }

  return ` <em>(${parts.join(" | ")})</em>`;
}

const presetListingOptions: ConfigTreeListingOptions<PresetConfig> = {
  configDirName: "presets",
  fileSuffix: ".preset.js",
  heading: "Available Presets",
  introText: "The following presets are available:",
  formatMeta: formatPresetMeta,
};

/**
 * Scans the presets directory and builds a recursive tree structure
 * matching the folder hierarchy.
 */
export function getGroupedAvailablePresets(): Record<string, TreeNode> {
  return getGroupedConfigTree(presetListingOptions);
}

/**
 * Scans the presets directory and returns a list of all available preset
 * names (formatted for API use, with `_` instead of `/`).
 */
export function getAllAvailablePresets(): string[] {
  return getAllItemNames(getGroupedAvailablePresets());
}

/**
 * Generates an HTML description of available presets matching the folder
 * structure (renders as nested expandable sections in Swagger UI).
 */
export function generatePresetsDescription(): string {
  return generateConfigTreeDescription(presetListingOptions);
}
