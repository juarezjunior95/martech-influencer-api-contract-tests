"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupedAvailableDatasources = getGroupedAvailableDatasources;
exports.getAllAvailableDatasources = getAllAvailableDatasources;
exports.generateDatasourcesDescription = generateDatasourcesDescription;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getGroupedAvailableDatasources() {
    const datasourcesPath = path.join(process.cwd(), "src", "domain", "config", "datasources");
    const tree = {};
    function scanDirectory(dirPath, relativePath, currentNode) {
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
            }
            else if (entry.isFile() && entry.name.endsWith(".datasource.json")) {
                const datasourceName = relativePath
                    ? `${relativePath}/${entry.name.replace(".datasource.json", "")}`
                    : entry.name.replace(".datasource.json", "");
                const apiDatasourceName = datasourceName.replaceAll("/", "_");
                let filters;
                try {
                    const configData = fs.readFileSync(fullPath, "utf8");
                    const config = JSON.parse(configData);
                    if (config.filters && Array.isArray(config.filters)) {
                        filters = config.filters.map((f) => ({
                            name: f.name,
                            required: f.required === undefined ? undefined : f.required,
                        }));
                        if (filters.length === 0) {
                            filters = undefined;
                        }
                    }
                }
                catch {
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
    function sortTree(node) {
        if (node.datasources) {
            node.datasources.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (node.folders) {
            Object.keys(node.folders).forEach((key) => {
                sortTree(node.folders[key]);
            });
        }
    }
    Object.values(tree).forEach((rootNode) => {
        sortTree(rootNode);
    });
    return tree;
}
function getAllAvailableDatasources() {
    const tree = getGroupedAvailableDatasources();
    const allDatasources = [];
    function extractDatasources(node) {
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
function countDatasources(node) {
    let count = node.datasources?.length || 0;
    if (node.folders) {
        Object.values(node.folders).forEach((folderNode) => {
            count += countDatasources(folderNode);
        });
    }
    return count;
}
function formatDatasourceFilters(filters) {
    if (!filters || filters.length === 0) {
        return "";
    }
    const requiredFilters = filters.filter((f) => f.required === true || f.required === undefined);
    const optionalFilters = filters.filter((f) => f.required === false);
    if (requiredFilters.length === 0 && optionalFilters.length === 0) {
        return "";
    }
    const parts = [];
    if (requiredFilters.length > 0) {
        const requiredText = requiredFilters
            .map((f) => `<code>${f.name}</code>`)
            .join(", ");
        parts.push(`(<b>required:</b> ${requiredText}`);
    }
    if (optionalFilters.length > 0) {
        const optionalText = optionalFilters
            .map((f) => `<code>${f.name}</code>`)
            .join(", ");
        if (requiredFilters.length > 0) {
            parts.push(`| <b>optional:</b> ${optionalText}`);
        }
        else {
            parts.push(`(<b>optional:</b> ${optionalText}`);
        }
    }
    parts.push(`)`);
    return ` <em>${parts.join(" ")}</em>`;
}
function generateDatasourceNodeHTML(node, folderName, level = 0) {
    const hasDatasources = node.datasources && node.datasources.length > 0;
    const hasFolders = node.folders && Object.keys(node.folders).length > 0;
    if (!hasDatasources && !hasFolders) {
        return "";
    }
    const icon = level === 0 ? "📁" : "📂";
    const totalCount = countDatasources(node);
    const dashes = level > 0 ? "--".repeat(level) : "";
    let content = "";
    if (hasDatasources) {
        const datasourceList = node.datasources.map((datasourceInfo) => {
            const filterText = datasourceInfo.filters
                ? formatDatasourceFilters(datasourceInfo.filters)
                : "";
            return `  <li style="margin-bottom: 0.5em;"><code>${datasourceInfo.name}</code>${filterText}</li>`;
        });
        content += `<ul style="margin-top: 0.5em; margin-bottom: 0.5em;">\n${datasourceList.join("\n")}\n</ul>`;
    }
    if (hasFolders) {
        const folderSections = Object.keys(node.folders)
            .sort()
            .map((key) => {
            const folderNode = node.folders[key];
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
function generateDatasourcesDescription() {
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
//# sourceMappingURL=datasource-list.util.js.map