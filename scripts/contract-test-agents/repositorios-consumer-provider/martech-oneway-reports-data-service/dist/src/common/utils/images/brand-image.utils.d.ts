import { BrandImageFormat } from "./brand-image-paths.constants";
export interface BrandImageParams {
    format?: BrandImageFormat;
    brand_family?: string;
}
export declare function normalizeBrandName(value: string): string;
export declare function getBrandImage(value: string | number, params?: BrandImageParams): string;
export declare function getBrandImageSingleUrl(value: string | number, params?: BrandImageParams): string;
export declare function getBrandImageVariants(value: string | number, params?: Pick<BrandImageParams, "brand_family">): Record<string, string>;
export declare function getBrandImageFields(value: string | number, params?: BrandImageParams): {
    image_url: string;
    image_variants: Record<string, string>;
};
