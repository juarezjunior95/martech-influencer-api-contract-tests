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
exports.getGroupedConfigTree = getGroupedConfigTree;
exports.getAllItemNames = getAllItemNames;
exports.generateConfigTreeDescription = generateConfigTreeDescription;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const module_1 = require("module");
function getGroupedConfigTree(options) {
    const require = (0, module_1.createRequire)(__filename);
    const rootPath = path.join(process.cwd(), "dist", "src", "domain", "config", options.configDirName);
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
            else if (entry.isFile() && entry.name.endsWith(options.fileSuffix)) {
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
                    const config = configData.default || configData;
                    meta = options.formatMeta(config);
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
                if (!current.items) {
                    current.items = [];
                }
                current.items.push({ name: apiItemName, meta });
            }
        }
    }
    scanDirectory(rootPath, "", tree);
    function sortTree(node) {
        if (node.items) {
            node.items.sort((a, b) => a.name.localeCompare(b.name));
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
function getAllItemNames(tree) {
    const allNames = [];
    function extract(node) {
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
function countItems(node) {
    let count = node.items?.length || 0;
    if (node.folders) {
        Object.values(node.folders).forEach((folderNode) => {
            count += countItems(folderNode);
        });
    }
    return count;
}
function generateNodeHTML(node, folderName, level = 0) {
    const hasItems = node.items && node.items.length > 0;
    const hasFolders = node.folders && Object.keys(node.folders).length > 0;
    if (!hasItems && !hasFolders) {
        return "";
    }
    const icon = level === 0 ? "📁" : "📂";
    const totalCount = countItems(node);
    const dashes = level > 0 ? "--".repeat(level) : "";
    let content = "";
    if (hasItems) {
        const itemList = node.items.map((info) => `  <li><code>${info.name}</code>${info.meta}</li>`);
        content += `<ul>\n${itemList.join("\n")}\n</ul>`;
    }
    if (hasFolders) {
        const folderSections = Object.keys(node.folders)
            .sort((a, b) => a.localeCompare(b))
            .map((key) => generateNodeHTML(node.folders[key], key, level + 1))
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
function generateConfigTreeDescription(options) {
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
//# sourceMappingURL=config-tree-listing.util.js.map