import { TreeNode } from "./config-tree-listing.util";
export type PresetRef = {
    name: string;
};
export declare function getGroupedAvailablePresets(): Record<string, TreeNode>;
export declare function getAllAvailablePresets(): string[];
export declare function generatePresetsDescription(): string;
