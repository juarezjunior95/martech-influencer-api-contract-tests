import { TreeNode } from "./config-tree-listing.util";
export type ViewFilter = {
    name: string;
};
export declare function getGroupedAvailableViews(): Record<string, TreeNode>;
export declare function getAllAvailableViews(): string[];
export declare function generateViewsDescription(): string;
