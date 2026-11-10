/**
 * Public CDN base for rasterized brand/country assets (`CDN_BASE_URL`).
 */
export function getImagesCdnBaseUrlFromEnv(): string {
  return process.env.CDN_BASE_URL || "";
}
