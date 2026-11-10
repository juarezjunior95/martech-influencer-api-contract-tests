import { getBrandImageSingleUrl } from "@common/utils/images/brand-image.utils";
import { BRAND_IMAGE_PLACEHOLDER_PATH } from "@common/utils/images/brand-image-paths.constants";
import type { BoolTree } from "@domain/config/presets/performance-tool/performance-tool.relation-collector";
import {
  COUNTRY_EUR,
  COUNTRY_GLOBAL,
  ZONE_GLOBAL,
} from "@domain/config/presets/performance-tool/performance-tool.constants";
import {
  SOURCE_GLOBAL_BRANDS,
  VALUE_ALL,
} from "@domain/config/presets/performance-tool/performance-tool.ui-rules";

export const PERFORMANCE_TOOL_ASSET_KEY_JOINER = "|";

export const PERFORMANCE_TOOL_ASSET_ATOMIC_RECORD_SEPARATOR =
  PERFORMANCE_TOOL_ASSET_KEY_JOINER;

export const PERFORMANCE_TOOL_BRAND_ASSET_KEY_JOINER =
  PERFORMANCE_TOOL_ASSET_KEY_JOINER;

export const PERFORMANCE_TOOL_SUBBRAND_ASSET_KEY_JOINER =
  PERFORMANCE_TOOL_ASSET_KEY_JOINER;

export function normalizePerformanceToolAssetKey(key: string): string {
  const collapsed = key.trim().replace(/\s+/g, " ");
  const pipe = collapsed.indexOf("|");
  if (pipe < 0) {
    return collapsed;
  }
  const left = collapsed.slice(0, pipe).trim().replace(/\s+/g, " ");
  const right = collapsed
    .slice(pipe + 1)
    .trim()
    .replace(/\s+/g, " ");
  if (left.length === 0 && right.length > 0) {
    return right;
  }
  if (left.length > 0 && right.length === 0) {
    return left;
  }
  return `${left}|${right}`;
}

export function performanceToolAssetLogicalIdentity(key: string): string {
  return normalizePerformanceToolAssetKey(key).toLowerCase();
}

export function isValidPerformanceToolAssetAtomicSegment(seg: string): boolean {
  const t = seg.trim();
  if (t.length === 0) return false;
  const pipeIdx = t.indexOf("|");
  if (pipeIdx < 0) return true;
  if (t.indexOf("|", pipeIdx + 1) >= 0) return false;
  const left = t.slice(0, pipeIdx).trim();
  const right = t.slice(pipeIdx + 1).trim();
  if (left.length === 0 || right.length === 0) return false;
  if (left.toLowerCase() === right.toLowerCase()) return false;
  return true;
}

export function splitPerformanceToolAssetKeyAtomics(
  mergedKey: string,
): string[] {
  const trimmed = mergedKey.trim();
  if (trimmed.length === 0) return [];
  const legacyChunks = trimmed.split(/\|\|+/);
  const out: string[] = [];
  for (const chunk of legacyChunks) {
    const c = chunk.trim();
    if (c.length === 0) continue;
    out.push(...splitSinglePipeChunkToAtomics(c));
  }
  return out;
}

function splitSinglePipeChunkToAtomics(chunk: string): string[] {
  const trimmed = chunk.trim();
  if (trimmed.length === 0) return [];
  const tokens = trimmed
    .split("|")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return [];
  const parsed = parseAtomicsFromPipeTokens(tokens);
  return parsed.length > 0
    ? parsed
    : [normalizePerformanceToolAssetKey(trimmed)];
}

function parseAtomicsFromPipeTokens(tokens: readonly string[]): string[] {
  const n = tokens.length;
  const memo = new Map<number, string[] | null>();

  function allowAsCompositePair(left: string, right: string): boolean {
    if (isLikelyBrandSubCompositeTokens(left, right)) return true;
    const tl = left.trim();
    const tr = right.trim();
    if (/\s/.test(tl) || /\s/.test(tr)) return true;
    if (tl.length >= 4 && tr.length > 0 && tr.length <= 5 && !/\s/.test(tr))
      return true;
    return false;
  }

  function best(i: number): string[] | null {
    if (i === n) return [];
    if (memo.has(i)) return memo.get(i)!;

    const candidates: string[][] = [];

    const one = tokens[i] ?? "";
    if (one.length > 0 && isValidPerformanceToolAssetAtomicSegment(one)) {
      const tail = best(i + 1);
      if (tail) candidates.push([one, ...tail]);
    }

    if (i + 1 < n) {
      const two = `${tokens[i]}|${tokens[i + 1]}`;
      if (
        isValidPerformanceToolAssetAtomicSegment(two) &&
        allowAsCompositePair(tokens[i]!, tokens[i + 1]!)
      ) {
        const tail = best(i + 2);
        if (tail) candidates.push([two, ...tail]);
      }
    }

    if (candidates.length === 0) {
      memo.set(i, null);
      return null;
    }

    candidates.sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.join("\u0000").localeCompare(b.join("\u0000"));
    });
    const chosen = candidates[0]!;
    memo.set(i, chosen);
    return chosen;
  }

  return best(0) ?? [];
}

function isLikelyBrandSubCompositeTokens(brand: string, sub: string): boolean {
  const b = brand.trim().toLowerCase();
  const s = sub.trim().toLowerCase();
  if (b.length === 0 || s.length === 0) return false;
  if (s === b) return false;
  if (s.startsWith(`${b} `)) return true;
  if (b.length >= 3 && s.startsWith(b)) return true;
  return false;
}

function removePlainAtomicsRedundantWithCompositeBrandPrefix(
  atomics: readonly string[],
): string[] {
  const normalized = atomics
    .map((a) => normalizePerformanceToolAssetKey(a))
    .filter((a) => a.length > 0);
  const brandPrefixIds = new Set<string>();
  for (const a of normalized) {
    const pipe = a.indexOf("|");
    if (pipe < 0 || a.indexOf("|", pipe + 1) >= 0) continue;
    if (!isValidPerformanceToolAssetAtomicSegment(a)) continue;
    const left = normalizePerformanceToolAssetKey(a.slice(0, pipe));
    if (left.length === 0) continue;
    brandPrefixIds.add(performanceToolAssetLogicalIdentity(left));
  }
  return normalized.filter((a) => {
    if (a.includes("|")) return true;
    return !brandPrefixIds.has(performanceToolAssetLogicalIdentity(a));
  });
}

function expandPerformanceToolAssetKeyToAtomics(raw: string): string[] {
  const a = normalizePerformanceToolAssetKey(raw);
  if (a.length === 0) return [];
  if (isValidPerformanceToolAssetAtomicSegment(a)) {
    return [a];
  }
  const parts = splitPerformanceToolAssetKeyAtomics(a);
  return parts.length > 0 ? parts : [a];
}

export function serializePerformanceToolAssetAtomics(
  atomics: Iterable<string>,
): string {
  const flattened: string[] = [];
  for (const raw of atomics) {
    flattened.push(...expandPerformanceToolAssetKeyToAtomics(raw));
  }
  const byIdentity = new Map<string, string>();
  for (const a of flattened) {
    const n = normalizePerformanceToolAssetKey(a);
    if (n.length === 0) continue;
    const id = performanceToolAssetLogicalIdentity(n);
    const prev = byIdentity.get(id);
    if (prev === undefined || n.localeCompare(prev) < 0) {
      byIdentity.set(id, n);
    }
  }
  const pruned = removePlainAtomicsRedundantWithCompositeBrandPrefix([
    ...byIdentity.values(),
  ]);
  const uniq = pruned.sort((a, b) => a.localeCompare(b));
  return uniq.join(PERFORMANCE_TOOL_ASSET_KEY_JOINER);
}

export function dedupePerformanceToolAssetKeyPipeSegments(key: string): string {
  const segments = key.split(PERFORMANCE_TOOL_ASSET_KEY_JOINER);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of segments) {
    const seg = normalizePerformanceToolAssetKey(raw);
    if (seg.length === 0) continue;
    const id = performanceToolAssetLogicalIdentity(seg);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(seg);
  }
  return out.join(PERFORMANCE_TOOL_ASSET_KEY_JOINER);
}

export function dedupeNormalizedJoinedAssetKey(
  mergedKey: string,
  _joiner: string,
): string {
  void _joiner;
  const atomics = splitPerformanceToolAssetKeyAtomics(mergedKey);
  if (atomics.length === 0) {
    return normalizePerformanceToolAssetKey(mergedKey);
  }
  return serializePerformanceToolAssetAtomics(atomics);
}

export function performanceToolAssetKeyIncludesLogical(
  mergedKey: string,
  logicalKey: string,
): boolean {
  const wantId = performanceToolAssetLogicalIdentity(logicalKey);
  if (
    isValidPerformanceToolAssetAtomicSegment(mergedKey) &&
    performanceToolAssetLogicalIdentity(mergedKey) === wantId
  ) {
    return true;
  }
  for (const a of splitPerformanceToolAssetKeyAtomics(mergedKey)) {
    const an = normalizePerformanceToolAssetKey(a);
    if (performanceToolAssetLogicalIdentity(an) === wantId) return true;
    const p = an.indexOf("|");
    if (p >= 0 && an.indexOf("|", p + 1) < 0) {
      const left = an.slice(0, p).trim();
      const right = an.slice(p + 1).trim();
      if (performanceToolAssetLogicalIdentity(left) === wantId) return true;
      if (performanceToolAssetLogicalIdentity(right) === wantId) return true;
    }
  }
  return false;
}

export function canonicalPerformanceToolBrandAssetMapKey(
  rawKey: string,
  joiner: string = PERFORMANCE_TOOL_ASSET_KEY_JOINER,
): string {
  return dedupePerformanceToolAssetKeyPipeSegments(
    dedupeNormalizedJoinedAssetKey(rawKey, joiner),
  );
}

function addRealImageCoverageFromCanonicalKey(
  canonicalKey: string,
  into: Set<string>,
): void {
  for (const seg of canonicalKey.split(PERFORMANCE_TOOL_ASSET_KEY_JOINER)) {
    const t = normalizePerformanceToolAssetKey(seg);
    if (t.length > 0) into.add(performanceToolAssetLogicalIdentity(t));
  }
  for (const a of splitPerformanceToolAssetKeyAtomics(canonicalKey)) {
    const n = normalizePerformanceToolAssetKey(a);
    if (n.length === 0) continue;
    into.add(performanceToolAssetLogicalIdentity(n));
    const p = n.indexOf("|");
    if (p >= 0 && n.indexOf("|", p + 1) < 0) {
      const left = normalizePerformanceToolAssetKey(n.slice(0, p));
      const right = normalizePerformanceToolAssetKey(n.slice(p + 1));
      if (left.length > 0) into.add(performanceToolAssetLogicalIdentity(left));
      if (right.length > 0)
        into.add(performanceToolAssetLogicalIdentity(right));
    }
  }
}

function isPlaceholderKeySupersededByRealCover(
  canonicalKey: string,
  realCover: ReadonlySet<string>,
): boolean {
  const segments = canonicalKey
    .split(PERFORMANCE_TOOL_ASSET_KEY_JOINER)
    .map((s) => normalizePerformanceToolAssetKey(s))
    .filter((s) => s.length > 0);
  if (segments.length === 0) return false;
  return segments.every((s) =>
    realCover.has(performanceToolAssetLogicalIdentity(s)),
  );
}

export function stripPlaceholderBrandAssetKeysSupersededByRealImage(
  assets: Record<string, string>,
  joiner: string = PERFORMANCE_TOOL_ASSET_KEY_JOINER,
): Record<string, string> {
  const realCover = new Set<string>();
  for (const [k, url] of Object.entries(assets)) {
    if (isPerformanceToolPlaceholderImageUrl(url)) continue;
    addRealImageCoverageFromCanonicalKey(
      canonicalPerformanceToolBrandAssetMapKey(k, joiner),
      realCover,
    );
  }

  const out: Record<string, string> = {};
  for (const [k, url] of Object.entries(assets)) {
    if (isPerformanceToolPlaceholderImageUrl(url)) continue;
    out[canonicalPerformanceToolBrandAssetMapKey(k, joiner)] = url;
  }

  for (const [k, url] of Object.entries(assets)) {
    if (!isPerformanceToolPlaceholderImageUrl(url)) continue;
    const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
    if (
      out[canon] !== undefined &&
      !isPerformanceToolPlaceholderImageUrl(out[canon]!)
    ) {
      continue;
    }
    if (isPlaceholderKeySupersededByRealCover(canon, realCover)) continue;
    out[canon] = url;
  }

  return Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => a.localeCompare(b)),
  );
}

export function mergeBrandImageUrlMapsPreferringNonPlaceholder(
  brandFlat: Record<string, string>,
  subFlat: Record<string, string>,
  joiner: string = PERFORMANCE_TOOL_ASSET_KEY_JOINER,
): Record<string, string> {
  const realCover = new Set<string>();
  const absorbRealCoverage = (rec: Record<string, string>) => {
    for (const [k, url] of Object.entries(rec)) {
      if (isPerformanceToolPlaceholderImageUrl(url)) continue;
      addRealImageCoverageFromCanonicalKey(
        canonicalPerformanceToolBrandAssetMapKey(k, joiner),
        realCover,
      );
    }
  };
  absorbRealCoverage(brandFlat);
  absorbRealCoverage(subFlat);

  const out: Record<string, string> = {};

  const putReals = (rec: Record<string, string>) => {
    for (const [k, url] of Object.entries(rec)) {
      if (isPerformanceToolPlaceholderImageUrl(url)) continue;
      const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
      out[canon] = url;
    }
  };
  putReals(brandFlat);
  putReals(subFlat);

  const putPlaceholders = (rec: Record<string, string>) => {
    for (const [k, url] of Object.entries(rec)) {
      if (!isPerformanceToolPlaceholderImageUrl(url)) continue;
      const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
      if (
        out[canon] !== undefined &&
        !isPerformanceToolPlaceholderImageUrl(out[canon]!)
      ) {
        continue;
      }
      if (isPlaceholderKeySupersededByRealCover(canon, realCover)) continue;
      out[canon] = url;
    }
  };
  putPlaceholders(brandFlat);
  putPlaceholders(subFlat);

  return out;
}

export function polishGlobalAssetMapKeys(
  assets: Record<string, string>,
  joiner: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [rawKey, url] of Object.entries(assets)) {
    const key = canonicalPerformanceToolBrandAssetMapKey(rawKey, joiner);
    const prev = out[key];
    if (prev === undefined) {
      out[key] = url;
      continue;
    }
    const prevPh = isPerformanceToolPlaceholderImageUrl(prev);
    const curPh = isPerformanceToolPlaceholderImageUrl(url);
    if (!(!prevPh && curPh)) {
      out[key] = url;
    }
  }
  return Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => a.localeCompare(b)),
  );
}

export function isPerformanceToolPlaceholderImageUrl(url: string): boolean {
  return (
    url.includes("no-image-available") ||
    url.includes(BRAND_IMAGE_PLACEHOLDER_PATH)
  );
}

/** API payload: omit `brand_assets` rows whose URL is the generic placeholder. */
export function omitPlaceholderPerformanceToolBrandAssetUrls(
  assets: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(assets)
      .filter(([, url]) => !isPerformanceToolPlaceholderImageUrl(url))
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

export function mergeGlobalPerformanceToolAssetKeys(
  input: Record<string, string>,
  _keyJoiner: string,
): Record<string, string> {
  void _keyJoiner;
  const byUrl = new Map<string, Set<string>>();
  const standalone = new Map<string, { displayKey: string; url: string }>();

  for (const [rawKey, url] of Object.entries(input)) {
    const k = normalizePerformanceToolAssetKey(rawKey);
    if (isPerformanceToolPlaceholderImageUrl(url)) {
      const id = performanceToolAssetLogicalIdentity(k);
      if (!standalone.has(id)) {
        standalone.set(id, { displayKey: k, url });
      }
      continue;
    }
    if (!byUrl.has(url)) byUrl.set(url, new Set());
    byUrl.get(url)!.add(k);
  }

  const mergedEntries: [string, string][] = [];

  for (const [url, keys] of byUrl.entries()) {
    const uniq = [
      ...new Set([...keys].map((x) => normalizePerformanceToolAssetKey(x))),
    ]
      .filter((x) => x.length > 0)
      .sort((a, b) => a.localeCompare(b));
    if (uniq.length === 0) continue;
    mergedEntries.push([serializePerformanceToolAssetAtomics(uniq), url]);
  }
  mergedEntries.sort(([a], [b]) => a.localeCompare(b));

  const standaloneObj: Record<string, string> = {};
  for (const { displayKey, url } of standalone.values()) {
    standaloneObj[displayKey] = url;
  }

  return { ...standaloneObj, ...Object.fromEntries(mergedEntries) };
}

export function brandFamilyGroupToken(brandKey: string): string {
  const t = normalizePerformanceToolAssetKey(brandKey);
  const first = t.split(/\s+/)[0] ?? t;
  return (first.length > 0 ? first : t).toLocaleLowerCase();
}

export function subbrandAssetFamilyGroupToken(subKey: string): string {
  const t = normalizePerformanceToolAssetKey(subKey);
  const pipe = t.indexOf("|");
  const brandSide = (pipe >= 0 ? t.slice(0, pipe) : t).trim();
  const base = brandSide.length > 0 ? brandSide : t;
  return brandFamilyGroupToken(base);
}

function unifiedPlaceholderFamilyToken(rawKey: string): string {
  const atomics = splitPerformanceToolAssetKeyAtomics(rawKey);
  const sorted = [...atomics]
    .map((a) => normalizePerformanceToolAssetKey(a))
    .filter((a) => a.length > 0)
    .sort((a, b) => a.localeCompare(b));
  const head = sorted[0] ?? rawKey.trim();
  return subbrandAssetFamilyGroupToken(head);
}

function collapsePlaceholderKeysByFamily(
  assets: Record<string, string>,
): Record<string, string> {
  const nonPlaceholder: Record<string, string> = {};
  const phAtomicsByFamily = new Map<string, Set<string>>();
  const phUrlByFamily = new Map<string, string>();

  for (const [rawKey, url] of Object.entries(assets)) {
    const rowKey = dedupeNormalizedJoinedAssetKey(
      rawKey,
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    if (!isPerformanceToolPlaceholderImageUrl(url)) {
      nonPlaceholder[rowKey] = url;
      continue;
    }
    const fam = unifiedPlaceholderFamilyToken(rawKey);
    if (!phAtomicsByFamily.has(fam)) phAtomicsByFamily.set(fam, new Set());
    const bucket = phAtomicsByFamily.get(fam)!;
    for (const a of splitPerformanceToolAssetKeyAtomics(rawKey)) {
      bucket.add(normalizePerformanceToolAssetKey(a));
    }
    phUrlByFamily.set(fam, url);
  }

  const collapsedPh: Record<string, string> = {};
  for (const [fam, atomics] of phAtomicsByFamily) {
    const url = phUrlByFamily.get(fam) ?? "";
    collapsedPh[serializePerformanceToolAssetAtomics(atomics)] = url;
  }

  return { ...nonPlaceholder, ...collapsedPh };
}

export function collapsePlaceholderPerformanceToolAssetKeysByFamily(
  assets: Record<string, string>,
): Record<string, string> {
  return collapsePlaceholderKeysByFamily(assets);
}

export function collapsePlaceholderBrandKeysByFamily(
  assets: Record<string, string>,
): Record<string, string> {
  return collapsePlaceholderPerformanceToolAssetKeysByFamily(assets);
}

export function collapsePlaceholderSubbrandKeysByFamily(
  assets: Record<string, string>,
): Record<string, string> {
  return collapsePlaceholderPerformanceToolAssetKeysByFamily(assets);
}

function isTree(v: unknown): v is BoolTree {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function trueLeaves(tree: BoolTree): string[] {
  return Object.keys(tree).filter((k) => tree[k] === true);
}

function skipAssetToken(s: string): boolean {
  if (!s || !String(s).trim()) return true;
  if (s === VALUE_ALL || s === SOURCE_GLOBAL_BRANDS) return true;
  if (s === ZONE_GLOBAL || s === COUNTRY_GLOBAL || s === COUNTRY_EUR)
    return true;
  return false;
}

function collectBrandsFromCountryBrandTrees(
  root: unknown,
  out: Map<string, string>,
) {
  if (!isTree(root)) return;
  for (const country of Object.keys(root)) {
    const mid = root[country];
    if (!isTree(mid)) continue;
    for (const b of trueLeaves(mid)) {
      if (skipAssetToken(b)) continue;
      const n = normalizePerformanceToolAssetKey(b);
      const id = performanceToolAssetLogicalIdentity(n);
      if (!out.has(id)) out.set(id, n);
    }
  }
}

function collectFromRelations(
  relations: Record<string, unknown>,
  brandNames: Map<string, string>,
  subEntries: Map<
    string,
    { label: string; brand_family?: string; displayKey: string }
  >,
): void {
  collectBrandsFromCountryBrandTrees(relations.country_brands, brandNames);
  collectBrandsFromCountryBrandTrees(
    relations.portfolio_country_brands,
    brandNames,
  );
  collectBrandsFromCountryBrandTrees(relations.bps_country_brands, brandNames);

  const gbc = relations.global_brand_countries;
  if (isTree(gbc)) {
    for (const brand of Object.keys(gbc)) {
      if (skipAssetToken(brand)) continue;
      const n = normalizePerformanceToolAssetKey(brand);
      const id = performanceToolAssetLogicalIdentity(n);
      if (!brandNames.has(id)) brandNames.set(id, n);
    }
  }

  const cs = relations.country_subbrands;
  if (isTree(cs)) {
    for (const country of Object.keys(cs)) {
      const mid = cs[country];
      if (!isTree(mid)) continue;
      for (const s of trueLeaves(mid)) {
        if (skipAssetToken(s)) continue;
        const nk = normalizePerformanceToolAssetKey(s.trim());
        const id = performanceToolAssetLogicalIdentity(nk);
        const label = s.trim().replace(/\s+/g, " ");
        if (!subEntries.has(id)) {
          subEntries.set(id, {
            label,
            displayKey: nk,
          });
        } else {
          const prev = subEntries.get(id)!;
          if (label.length > prev.label.length) {
            subEntries.set(id, { ...prev, label });
          }
        }
      }
    }
  }

  const bcs = relations.brand_country_subbrands;
  if (isTree(bcs)) {
    for (const brand of Object.keys(bcs)) {
      if (skipAssetToken(brand)) continue;
      const mid = bcs[brand];
      if (!isTree(mid)) continue;
      for (const country of Object.keys(mid)) {
        const leaf = mid[country];
        if (!isTree(leaf)) continue;
        for (const s of trueLeaves(leaf)) {
          if (skipAssetToken(s)) continue;
          const nk = normalizePerformanceToolAssetKey(
            `${brand.trim()}|${s.trim()}`,
          );
          const id = performanceToolAssetLogicalIdentity(nk);
          const label = s.trim().replace(/\s+/g, " ");
          const brandFamily = brand.trim().replace(/\s+/g, " ");
          if (!subEntries.has(id)) {
            subEntries.set(id, {
              label,
              brand_family: brandFamily,
              displayKey: nk,
            });
          } else {
            const prev = subEntries.get(id)!;
            const next =
              label.length > prev.label.length
                ? { ...prev, label }
                : { ...prev };
            if (!prev.brand_family && brandFamily) {
              next.brand_family = brandFamily;
            }
            subEntries.set(id, next);
          }
        }
      }
    }
  }

  const pcs = relations.portfolio_country_subbrands;
  if (isTree(pcs)) {
    for (const portfolio of Object.keys(pcs)) {
      const mid = pcs[portfolio];
      if (!isTree(mid)) continue;
      for (const country of Object.keys(mid)) {
        const leaf = mid[country];
        if (!isTree(leaf)) continue;
        for (const s of trueLeaves(leaf)) {
          if (skipAssetToken(s)) continue;
          const nk = normalizePerformanceToolAssetKey(s.trim());
          const id = performanceToolAssetLogicalIdentity(nk);
          const label = s.trim().replace(/\s+/g, " ");
          if (!subEntries.has(id)) {
            subEntries.set(id, {
              label,
              displayKey: nk,
            });
          } else {
            const prev = subEntries.get(id)!;
            if (label.length > prev.label.length) {
              subEntries.set(id, { ...prev, label });
            }
          }
        }
      }
    }
  }

  const gbcs = relations.global_brand_country_subbrands;
  if (isTree(gbcs)) {
    for (const brand of Object.keys(gbcs)) {
      if (skipAssetToken(brand)) continue;
      const mid = gbcs[brand];
      if (!isTree(mid)) continue;
      for (const country of Object.keys(mid)) {
        const leaf = mid[country];
        if (!isTree(leaf)) continue;
        for (const s of trueLeaves(leaf)) {
          if (skipAssetToken(s)) continue;
          const nk = normalizePerformanceToolAssetKey(
            `${brand.trim()}|${s.trim()}`,
          );
          const id = performanceToolAssetLogicalIdentity(nk);
          const label = s.trim().replace(/\s+/g, " ");
          const brandFamily = brand.trim().replace(/\s+/g, " ");
          if (!subEntries.has(id)) {
            subEntries.set(id, {
              label,
              brand_family: brandFamily,
              displayKey: nk,
            });
          } else {
            const prev = subEntries.get(id)!;
            const next =
              label.length > prev.label.length
                ? { ...prev, label }
                : { ...prev };
            if (!prev.brand_family && brandFamily) {
              next.brand_family = brandFamily;
            }
            subEntries.set(id, next);
          }
        }
      }
    }
  }

  const gl = relations.gl;
  if (gl && typeof gl === "object" && !Array.isArray(gl)) {
    for (const glKey of Object.keys(gl as Record<string, unknown>)) {
      const nested = (gl as Record<string, unknown>)[glKey];
      if (nested && typeof nested === "object") {
        collectFromRelations(
          nested as Record<string, unknown>,
          brandNames,
          subEntries,
        );
      }
    }
  }
}

function resolvePerformanceToolSubbrandAssetKey(
  meta: { label: string; brand_family?: string; displayKey: string },
  labelCollisionWithDistinctUrls: boolean,
): string {
  if (labelCollisionWithDistinctUrls) {
    return normalizePerformanceToolAssetKey(meta.displayKey);
  }
  return normalizePerformanceToolAssetKey(meta.label);
}

function buildPerformanceToolSubbrandAssetMap(
  subEntries: Map<
    string,
    { label: string; brand_family?: string; displayKey: string }
  >,
): Record<string, string> {
  const groupedByLabel = new Map<
    string,
    Array<{ label: string; brand_family?: string; displayKey: string }>
  >();

  for (const meta of subEntries.values()) {
    const labelKey = normalizePerformanceToolAssetKey(meta.label);
    const bucket = groupedByLabel.get(labelKey);
    if (bucket) {
      bucket.push(meta);
    } else {
      groupedByLabel.set(labelKey, [meta]);
    }
  }

  const subFlat: Record<string, string> = {};
  for (const metas of groupedByLabel.values()) {
    const distinctUrls = new Set(
      metas.map((meta) =>
        getBrandImageSingleUrl(meta.label, { brand_family: meta.brand_family }),
      ),
    );
    const labelCollisionWithDistinctUrls = distinctUrls.size > 1;

    for (const meta of metas) {
      const key = resolvePerformanceToolSubbrandAssetKey(
        meta,
        labelCollisionWithDistinctUrls,
      );
      subFlat[key] = getBrandImageSingleUrl(meta.label, {
        brand_family: meta.brand_family,
      });
    }
  }

  return subFlat;
}

export function buildGlobalPerformanceToolImageAssets(
  enabledKpis: readonly string[],
  getRelationsForKpi: (kpi: string) => Record<string, unknown>,
): {
  brand_assets: Record<string, string>;
} {
  const brandNames = new Map<string, string>();
  const subEntries = new Map<
    string,
    { label: string; brand_family?: string; displayKey: string }
  >();

  for (const kpi of enabledKpis) {
    collectFromRelations(getRelationsForKpi(kpi), brandNames, subEntries);
  }

  const brandFlat: Record<string, string> = {};
  for (const name of brandNames.values()) {
    brandFlat[name] = getBrandImageSingleUrl(name);
  }

  const subFlat = buildPerformanceToolSubbrandAssetMap(subEntries);

  const unifiedFlat = mergeBrandImageUrlMapsPreferringNonPlaceholder(
    brandFlat,
    subFlat,
    PERFORMANCE_TOOL_ASSET_KEY_JOINER,
  );

  const merged = mergeGlobalPerformanceToolAssetKeys(
    unifiedFlat,
    PERFORMANCE_TOOL_ASSET_KEY_JOINER,
  );
  const collapsed = collapsePlaceholderPerformanceToolAssetKeysByFamily(merged);

  const polished = polishGlobalAssetMapKeys(
    collapsed,
    PERFORMANCE_TOOL_ASSET_KEY_JOINER,
  );

  return {
    brand_assets: omitPlaceholderPerformanceToolBrandAssetUrls(
      stripPlaceholderBrandAssetKeysSupersededByRealImage(
        polished,
        PERFORMANCE_TOOL_ASSET_KEY_JOINER,
      ),
    ),
  };
}
