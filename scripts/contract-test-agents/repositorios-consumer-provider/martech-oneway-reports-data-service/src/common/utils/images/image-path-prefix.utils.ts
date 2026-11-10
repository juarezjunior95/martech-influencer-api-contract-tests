export function withImagePathPrefix(imagePath: string): string {
  const raw = process.env.CDN_BASE_URL;
  const prefix =
    raw === undefined || raw === null ? "" : String(raw).replace(/\/+$/, "");
  const path = imagePath.replace(/^\/+/, "");
  if (!prefix) {
    return path;
  }
  return `${prefix}/${path}`;
}
