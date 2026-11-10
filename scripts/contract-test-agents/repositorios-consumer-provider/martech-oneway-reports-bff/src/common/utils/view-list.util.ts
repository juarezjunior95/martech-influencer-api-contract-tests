import { ViewConfig } from "@domain/entities/view.entity";

import {
  ConfigTreeListingOptions,
  TreeNode,
  generateConfigTreeDescription,
  getAllItemNames,
  getGroupedConfigTree,
} from "./config-tree-listing.util";

/**
 * Filter information from view config
 */
export type ViewFilter = {
  name: string;
};

/**
 * Extracts the filter groups declared in a view config. Mirrors the two
 * accepted shapes (object map of groups, or legacy flat array).
 */
function extractFilterGroups(
  config: ViewConfig,
): Record<string, ViewFilter[]> | undefined {
  if (
    config.filters &&
    typeof config.filters === "object" &&
    !Array.isArray(config.filters)
  ) {
    const groups: Record<string, ViewFilter[]> = {};
    for (const [groupName, groupFilters] of Object.entries(config.filters)) {
      if (Array.isArray(groupFilters)) {
        groups[groupName] = groupFilters.map((f: any) => ({ name: f.name }));
      }
    }
    if (Object.keys(groups).length === 0) {
      return undefined;
    }
    return groups;
  }

  if (config.filters && Array.isArray(config.filters)) {
    const filters = (config.filters as { name: string }[]).map((f) => ({
      name: f.name,
    }));
    if (filters.length > 0) {
      return { default: filters };
    }
  }

  return undefined;
}

function formatFilterGroup(groupName: string, filters: ViewFilter[]): string {
  if (!filters || filters.length === 0) {
    return "";
  }
  const filterText = filters.map((f) => `<code>${f.name}</code>`).join(", ");
  const groupLabel = groupName === "default" ? "Default" : groupName;
  return `<strong>${groupLabel}</strong>: ${filterText}`;
}

/**
 * Renders the inline meta string for a view: a single inline list when
 * the only group is `default`, or pipe-separated named groups otherwise.
 */
function formatViewMeta(config: ViewConfig): string {
  const filterGroups = extractFilterGroups(config);
  if (!filterGroups || Object.keys(filterGroups).length === 0) {
    return "";
  }

  const groupNames = Object.keys(filterGroups);

  if (groupNames.length === 1 && groupNames[0] === "default") {
    const filterText = filterGroups.default
      .map((f) => `<code>${f.name}</code>`)
      .join(", ");
    return ` <em>(${filterText})</em>`;
  }

  const groupTexts = groupNames.map((groupName) =>
    formatFilterGroup(groupName, filterGroups[groupName]),
  );
  return ` <em>(${groupTexts.join(" | ")})</em>`;
}

const viewListingOptions: ConfigTreeListingOptions<ViewConfig> = {
  configDirName: "views",
  fileSuffix: ".view.js",
  heading: "Available Datasource Views",
  introText: "The following datasource views are available:",
  formatMeta: formatViewMeta,
};

/**
 * Scans the views directory and builds a recursive tree structure
 * matching the folder hierarchy.
 */
export function getGroupedAvailableViews(): Record<string, TreeNode> {
  return getGroupedConfigTree(viewListingOptions);
}

/**
 * Scans the views directory and returns a list of all available view
 * names (formatted for API use, with `_` instead of `/`).
 */
export function getAllAvailableViews(): string[] {
  return getAllItemNames(getGroupedAvailableViews());
}

/**
 * Generates an HTML description of available views matching the folder
 * structure (renders as nested expandable sections in Swagger UI).
 */
export function generateViewsDescription(): string {
  return generateConfigTreeDescription(viewListingOptions);
}
