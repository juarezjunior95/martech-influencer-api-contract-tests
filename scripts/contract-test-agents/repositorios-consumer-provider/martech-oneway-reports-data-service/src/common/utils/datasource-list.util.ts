import * as fs from "fs";
import * as path from "path";

/**
 * Filter information from datasource config
 */
export type DatasourceFilter = {
  name: string;
  required?: boolean | undefined;
};

/**
 * Datasource information with optional filters
 */
export type DatasourceInfo = {
  name: string;
  filters?: DatasourceFilter[];
};

/**
 * Recursive tree structure for grouped datasources
 * Each node can have either:
 * - datasources: array of datasource info (leaf node)
 * - folders: Record<string, DatasourceTreeNode> (branch node)
 */
export type DatasourceTreeNode = {
  datasources?: DatasourceInfo[];
  folders?: Record<string, DatasourceTreeNode>;
};

/**
 * Scans the datasources directory and builds a recursive tree structure matching the folder hierarchy
 * @returns Tree structure matching the actual folder structure
 */
export function getGroupedAvailableDatasources(): Record<
  string,
  DatasourceTreeNode
> {
  const datasourcesPath = path.join(
    process.cwd(),
    "src",
    "domain",
    "config",
    "datasources",
  );

  const tree: Record<string, DatasourceTreeNode> = {};

  function scanDirectory(
    dirPath: string,
    relativePath: string,
    currentNode: Record<string, DatasourceTreeNode>,
  ): void {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const folderName = entry.name;
        const newRelativePath = relativePath
          ? `${relativePath}/${folderName}`
          : folderName;

        if (!currentNode[folderName]) {
          currentNode[folderName] = {};
        }

        const folderNode = currentNode[folderName];
        if (!folderNode.folders) {
          folderNode.folders = {};
        }

        scanDirectory(fullPath, newRelativePath, folderNode.folders);
      } else if (entry.isFile() && entry.name.endsWith(".datasource.json")) {
        const datasourceName = relativePath
          ? `${relativePath}/${entry.name.replace(".datasource.json", "")}`
          : entry.name.replace(".datasource.json", "");
        const apiDatasourceName = datasourceName.replaceAll("/", "_");

        // Read the datasource config to extract filter information
        let filters: DatasourceFilter[] | undefined;
        try {
          const configData = fs.readFileSync(fullPath, "utf8");
          const config = JSON.parse(configData);
          if (config.filters && Array.isArray(config.filters)) {
            filters = config.filters.map((f: any) => ({
              name: f.name,
              required: f.required === undefined ? undefined : f.required,
            }));
            // Remove if empty
            if (filters.length === 0) {
              filters = undefined;
            }
          }
        } catch {
          // If we can't read the config, just continue without filters
        }

        // Determine the root folder
        const pathParts = relativePath ? relativePath.split("/") : [];
        const rootFolder = pathParts[0] || "root";

        if (!tree[rootFolder]) {
          tree[rootFolder] = {};
        }

        // Navigate/create the tree structure
        let current = tree[rootFolder];
        for (let i = 1; i < pathParts.length; i++) {
          const folderName = pathParts[i];
          if (!current.folders) {
            current.folders = {};
          }
          if (!current.folders[folderName]) {
            current.folders[folderName] = {};
          }
          current = current.folders[folderName];
        }

        // Add datasource to current node with filter information
        if (!current.datasources) {
          current.datasources = [];
        }
        current.datasources.push({
          name: apiDatasourceName,
          filters: filters,
        });
      }
    }
  }

  scanDirectory(datasourcesPath, "", tree);

  // Sort datasources and folders recursively
  function sortTree(node: DatasourceTreeNode): void {
    if (node.datasources) {
      node.datasources.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (node.folders) {
      Object.keys(node.folders).forEach((key) => {
        sortTree(node.folders![key]);
      });
    }
  }

  Object.values(tree).forEach((rootNode) => {
    sortTree(rootNode);
  });

  return tree;
}

/**
 * Scans the datasources directory and returns a list of all available datasource names
 * @returns Array of datasource names (formatted for API use, with _ instead of /)
 */
export function getAllAvailableDatasources(): string[] {
  const tree = getGroupedAvailableDatasources();
  const allDatasources: string[] = [];

  function extractDatasources(node: DatasourceTreeNode): void {
    if (node.datasources) {
      allDatasources.push(...node.datasources.map((d) => d.name));
    }
    if (node.folders) {
      Object.values(node.folders).forEach((folderNode) => {
        extractDatasources(folderNode);
      });
    }
  }

  Object.values(tree).forEach((rootNode) => {
    extractDatasources(rootNode);
  });

  return allDatasources.sort();
}

/**
 * Recursively counts all datasources in a tree node
 */
function countDatasources(node: DatasourceTreeNode): number {
  let count = node.datasources?.length || 0;
  if (node.folders) {
    Object.values(node.folders).forEach((folderNode) => {
      count += countDatasources(folderNode);
    });
  }
  return count;
}

/**
 * Formats filter information for display
 * Required filters are shown as (required: filter1, filter2)
 * Optional filters are shown separately as (optional: filter3, filter4)
 */
function formatDatasourceFilters(
  filters: DatasourceFilter[] | undefined,
): string {
  if (!filters || filters.length === 0) {
    return "";
  }

  // Separate required and optional filters
  const requiredFilters = filters.filter(
    (f) => f.required === true || f.required === undefined,
  );
  const optionalFilters = filters.filter((f) => f.required === false);

  // If no filters to display, return empty
  if (requiredFilters.length === 0 && optionalFilters.length === 0) {
    return "";
  }

  const parts: string[] = [];

  // Add required filters with "required:" label
  if (requiredFilters.length > 0) {
    const requiredText = requiredFilters
      .map((f) => `<code>${f.name}</code>`)
      .join(", ");
    parts.push(`(<b>required:</b> ${requiredText}`);
  }

  // Add optional filters with "optional:" label
  if (optionalFilters.length > 0) {
    const optionalText = optionalFilters
      .map((f) => `<code>${f.name}</code>`)
      .join(", ");

    // If there are required filters, use "|" separator, otherwise open with parenthesis
    if (requiredFilters.length > 0) {
      parts.push(`| <b>optional:</b> ${optionalText}`);
    } else {
      parts.push(`(<b>optional:</b> ${optionalText}`);
    }
  }

  // Close the parenthesis
  parts.push(`)`);

  // Join parts with space and wrap in emphasis
  return ` <em>${parts.join(" ")}</em>`;
}

/**
 * Recursively generates HTML for a datasource tree node
 */
function generateDatasourceNodeHTML(
  node: DatasourceTreeNode,
  folderName: string,
  level: number = 0,
): string {
  const hasDatasources = node.datasources && node.datasources.length > 0;
  const hasFolders = node.folders && Object.keys(node.folders).length > 0;

  if (!hasDatasources && !hasFolders) {
    return "";
  }

  const icon = level === 0 ? "📁" : "📂";
  const totalCount = countDatasources(node);
  // Add dashes before emoji based on nesting level (2 dashes per level, starting from level 1)
  const dashes = level > 0 ? "--".repeat(level) : "";

  let content = "";

  // Add datasources if they exist
  if (hasDatasources) {
    const datasourceList = node.datasources!.map((datasourceInfo) => {
      const filterText = datasourceInfo.filters
        ? formatDatasourceFilters(datasourceInfo.filters)
        : "";
      return `  <li style="margin-bottom: 0.5em;"><code>${datasourceInfo.name}</code>${filterText}</li>`;
    });
    content += `<ul style="margin-top: 0.5em; margin-bottom: 0.5em;">\n${datasourceList.join("\n")}\n</ul>`;
  }

  // Add nested folders if they exist
  if (hasFolders) {
    const folderSections = Object.keys(node.folders!)
      .sort()
      .map((key) => {
        const folderNode = node.folders![key];
        return generateDatasourceNodeHTML(folderNode, key, level + 1);
      })
      .filter((html) => html.length > 0)
      .join("\n\n");

    if (folderSections) {
      if (content) {
        content += "\n\n";
      }
      content += folderSections;
    }
  }

  if (!content) {
    return "";
  }

  return `<details>\n<summary><strong>${dashes}${icon} ${folderName} (${totalCount})</strong></summary>\n\n${content}\n\n</details>`;
}

/**
 * Generates an HTML description of available datasources matching the folder structure
 * This is designed to be used in Swagger documentation
 * @returns HTML string with nested expandable sections
 */
export function generateDatasourcesDescription(): string {
  const availableDatasources = getAllAvailableDatasources();
  const tree = getGroupedAvailableDatasources();

  if (availableDatasources.length === 0) {
    return "";
  }

  const folderSections = Object.keys(tree)
    .sort()
    .map((rootFolder) => {
      const rootNode = tree[rootFolder];
      const folderName = rootFolder === "root" ? "Root" : rootFolder;
      return generateDatasourceNodeHTML(rootNode, folderName, 0);
    })
    .filter((html) => html.length > 0)
    .join("\n\n");

  return `<details>\n<summary><strong>📋 Available Datasources (${availableDatasources.length})</strong></summary>\n\n<p>The following datasources are available:</p>\n\n${folderSections}\n\n</details>`;
}
