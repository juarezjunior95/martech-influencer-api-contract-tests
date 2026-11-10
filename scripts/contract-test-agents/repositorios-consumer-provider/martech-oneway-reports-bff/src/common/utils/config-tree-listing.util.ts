import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

/**
 * Item information stored in the tree (a single config file).
 * `meta` is the pre-rendered HTML fragment appended after the item name in
 * the listing (e.g. `" <em>(refs: <code>x</code>)</em>"`). Empty string
 * means "no metadata to display".
 */
export type ItemInfo = {
  name: string;
  meta: string;
};

/**
 * Recursive tree structure for grouped items.
 * Each node can have either:
 * - items: array of items (leaf node)
 * - folders: Record<string, TreeNode> (branch node)
 */
export type TreeNode = {
  items?: ItemInfo[];
  folders?: Record<string, TreeNode>;
};

/**
 * Configuration for a single config-tree listing (e.g. views, presets).
 */
export interface ConfigTreeListingOptions<TConfig> {
  /**
   * Folder name under `dist/src/domain/config/` to scan
   * (e.g. `"views"`, `"presets"`).
   */
  configDirName: string;

  /**
   * File suffix for items inside the directory
   * (e.g. `".view.js"`, `".preset.js"`).
   */
  fileSuffix: string;

  /**
   * Heading shown at the top of the description (e.g.
   * `"Available Datasource Views"`).
   */
  heading: string;

  /**
   * Paragraph rendered just below the heading (e.g.
   * `"The following datasource views are available:"`).
   */
  introText: string;

  /**
   * Callback invoked for each parsed config. Should return the HTML
   * fragment to display next to the item name (or `""` for none).
   * Errors thrown here are swallowed and the item is listed without meta.
   */
  formatMeta: (config: TConfig) => string;
}

/**
 * Scans the given config directory and builds a recursive tree structure
 * matching the folder hierarchy.
 */
export function getGroupedConfigTree<TConfig>(
  options: ConfigTreeListingOptions<TConfig>,
): Record<string, TreeNode> {
  const require = createRequire(__filename);
  const rootPath = path.join(
    process.cwd(),
    "dist",
    "src",
    "domain",
    "config",
    options.configDirName,
  );

  const tree: Record<string, TreeNode> = {};

  function scanDirectory(
    dirPath: string,
    relativePath: string,
    currentNode: Record<string, TreeNode>,
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

        // Eagerly initialize the folder node so empty/leaf-only folders
        // still appear in the tree (matches the legacy view-list behaviour
        // exercised by view-list.util.spec).
        if (!currentNode[folderName]) {
          currentNode[folderName] = {};
        }
        const folderNode = currentNode[folderName];
        if (!folderNode.folders) {
          folderNode.folders = {};
        }

        scanDirectory(fullPath, newRelativePath, folderNode.folders);
      } else if (entry.isFile() && entry.name.endsWith(options.fileSuffix)) {
        const itemName = relativePath
          ? `${relativePath}/${entry.name.replace(options.fileSuffix, "")}`
          : entry.name.replace(options.fileSuffix, "");
        const apiItemName = itemName.replaceAll("/", "_");

        let meta = "";
        try {
          if (process.env.NODE_ENV === "development") {
            delete require.cache[require.resolve(fullPath)];
          }

          const configData = require(fullPath);
          const config: TConfig = configData.default || configData;
          meta = options.formatMeta(config);
        } catch {
          // If we can't read the config, just continue without meta
        }

        const pathParts = relativePath ? relativePath.split("/") : [];
        const rootFolder = pathParts[0] || "root";

        if (!tree[rootFolder]) {
          tree[rootFolder] = {};
        }

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

        if (!current.items) {
          current.items = [];
        }
        current.items.push({ name: apiItemName, meta });
      }
    }
  }

  scanDirectory(rootPath, "", tree);

  function sortTree(node: TreeNode): void {
    if (node.items) {
      node.items.sort((a, b) => a.name.localeCompare(b.name));
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
 * Returns a flat sorted list of all item names under the configured tree.
 */
export function getAllItemNames(tree: Record<string, TreeNode>): string[] {
  const allNames: string[] = [];

  function extract(node: TreeNode): void {
    if (node.items) {
      allNames.push(...node.items.map((i) => i.name));
    }
    if (node.folders) {
      Object.values(node.folders).forEach(extract);
    }
  }

  Object.values(tree).forEach(extract);

  return allNames.sort((a, b) => a.localeCompare(b));
}

/**
 * Recursively counts all items in a tree node
 */
function countItems(node: TreeNode): number {
  let count = node.items?.length || 0;
  if (node.folders) {
    Object.values(node.folders).forEach((folderNode) => {
      count += countItems(folderNode);
    });
  }
  return count;
}

/**
 * Recursively generates HTML for a tree node
 */
function generateNodeHTML(
  node: TreeNode,
  folderName: string,
  level: number = 0,
): string {
  const hasItems = node.items && node.items.length > 0;
  const hasFolders = node.folders && Object.keys(node.folders).length > 0;

  if (!hasItems && !hasFolders) {
    return "";
  }

  const icon = level === 0 ? "📁" : "📂";
  const totalCount = countItems(node);
  // Add dashes before emoji based on nesting level (2 dashes per level, starting from level 1)
  const dashes = level > 0 ? "--".repeat(level) : "";

  let content = "";

  if (hasItems) {
    const itemList = node.items!.map(
      (info) => `  <li><code>${info.name}</code>${info.meta}</li>`,
    );
    content += `<ul>\n${itemList.join("\n")}\n</ul>`;
  }

  if (hasFolders) {
    const folderSections = Object.keys(node.folders!)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => generateNodeHTML(node.folders![key], key, level + 1))
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
 * Generates an HTML description of available items matching the folder
 * structure. The output renders as nested expandable sections in Swagger
 * UI.
 */
export function generateConfigTreeDescription<TConfig>(
  options: ConfigTreeListingOptions<TConfig>,
): string {
  const tree = getGroupedConfigTree(options);
  const allItems = getAllItemNames(tree);

  if (allItems.length === 0) {
    return "";
  }

  const folderSections = Object.keys(tree)
    .sort((a, b) => a.localeCompare(b))
    .map((rootFolder) => {
      const rootNode = tree[rootFolder];
      const folderName = rootFolder === "root" ? "Root" : rootFolder;
      return generateNodeHTML(rootNode, folderName, 0);
    })
    .filter((html) => html.length > 0)
    .join("\n\n");

  return `<details>\n<summary><strong>📋 ${options.heading} (${allItems.length})</strong></summary>\n\n<p>${options.introText}</p>\n\n${folderSections}\n\n</details>`;
}
