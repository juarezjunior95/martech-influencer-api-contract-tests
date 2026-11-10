export type ItemInfo = {
    name: string;
    meta: string;
};
export type TreeNode = {
    items?: ItemInfo[];
    folders?: Record<string, TreeNode>;
};
export interface ConfigTreeListingOptions<TConfig> {
    configDirName: string;
    fileSuffix: string;
    heading: string;
    introText: string;
    formatMeta: (config: TConfig) => string;
}
export declare function getGroupedConfigTree<TConfig>(options: ConfigTreeListingOptions<TConfig>): Record<string, TreeNode>;
export declare function getAllItemNames(tree: Record<string, TreeNode>): string[];
export declare function generateConfigTreeDescription<TConfig>(options: ConfigTreeListingOptions<TConfig>): string;
