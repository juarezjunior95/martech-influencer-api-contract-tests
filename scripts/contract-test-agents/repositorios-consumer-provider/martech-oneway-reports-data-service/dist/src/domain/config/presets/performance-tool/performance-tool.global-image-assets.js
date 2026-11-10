"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERFORMANCE_TOOL_SUBBRAND_ASSET_KEY_JOINER = exports.PERFORMANCE_TOOL_BRAND_ASSET_KEY_JOINER = exports.PERFORMANCE_TOOL_ASSET_ATOMIC_RECORD_SEPARATOR = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER = void 0;
exports.normalizePerformanceToolAssetKey = normalizePerformanceToolAssetKey;
exports.performanceToolAssetLogicalIdentity = performanceToolAssetLogicalIdentity;
exports.isValidPerformanceToolAssetAtomicSegment = isValidPerformanceToolAssetAtomicSegment;
exports.splitPerformanceToolAssetKeyAtomics = splitPerformanceToolAssetKeyAtomics;
exports.serializePerformanceToolAssetAtomics = serializePerformanceToolAssetAtomics;
exports.dedupePerformanceToolAssetKeyPipeSegments = dedupePerformanceToolAssetKeyPipeSegments;
exports.dedupeNormalizedJoinedAssetKey = dedupeNormalizedJoinedAssetKey;
exports.performanceToolAssetKeyIncludesLogical = performanceToolAssetKeyIncludesLogical;
exports.canonicalPerformanceToolBrandAssetMapKey = canonicalPerformanceToolBrandAssetMapKey;
exports.stripPlaceholderBrandAssetKeysSupersededByRealImage = stripPlaceholderBrandAssetKeysSupersededByRealImage;
exports.mergeBrandImageUrlMapsPreferringNonPlaceholder = mergeBrandImageUrlMapsPreferringNonPlaceholder;
exports.polishGlobalAssetMapKeys = polishGlobalAssetMapKeys;
exports.isPerformanceToolPlaceholderImageUrl = isPerformanceToolPlaceholderImageUrl;
exports.omitPlaceholderPerformanceToolBrandAssetUrls = omitPlaceholderPerformanceToolBrandAssetUrls;
exports.mergeGlobalPerformanceToolAssetKeys = mergeGlobalPerformanceToolAssetKeys;
exports.brandFamilyGroupToken = brandFamilyGroupToken;
exports.subbrandAssetFamilyGroupToken = subbrandAssetFamilyGroupToken;
exports.collapsePlaceholderPerformanceToolAssetKeysByFamily = collapsePlaceholderPerformanceToolAssetKeysByFamily;
exports.collapsePlaceholderBrandKeysByFamily = collapsePlaceholderBrandKeysByFamily;
exports.collapsePlaceholderSubbrandKeysByFamily = collapsePlaceholderSubbrandKeysByFamily;
exports.buildGlobalPerformanceToolImageAssets = buildGlobalPerformanceToolImageAssets;
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
const brand_image_paths_constants_1 = require("../../../../common/utils/images/brand-image-paths.constants");
const performance_tool_constants_1 = require("./performance-tool.constants");
const performance_tool_ui_rules_1 = require("./performance-tool.ui-rules");
exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER = "|";
exports.PERFORMANCE_TOOL_ASSET_ATOMIC_RECORD_SEPARATOR = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER;
exports.PERFORMANCE_TOOL_BRAND_ASSET_KEY_JOINER = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER;
exports.PERFORMANCE_TOOL_SUBBRAND_ASSET_KEY_JOINER = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER;
function normalizePerformanceToolAssetKey(key) {
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
function performanceToolAssetLogicalIdentity(key) {
    return normalizePerformanceToolAssetKey(key).toLowerCase();
}
function isValidPerformanceToolAssetAtomicSegment(seg) {
    const t = seg.trim();
    if (t.length === 0)
        return false;
    const pipeIdx = t.indexOf("|");
    if (pipeIdx < 0)
        return true;
    if (t.indexOf("|", pipeIdx + 1) >= 0)
        return false;
    const left = t.slice(0, pipeIdx).trim();
    const right = t.slice(pipeIdx + 1).trim();
    if (left.length === 0 || right.length === 0)
        return false;
    if (left.toLowerCase() === right.toLowerCase())
        return false;
    return true;
}
function splitPerformanceToolAssetKeyAtomics(mergedKey) {
    const trimmed = mergedKey.trim();
    if (trimmed.length === 0)
        return [];
    const legacyChunks = trimmed.split(/\|\|+/);
    const out = [];
    for (const chunk of legacyChunks) {
        const c = chunk.trim();
        if (c.length === 0)
            continue;
        out.push(...splitSinglePipeChunkToAtomics(c));
    }
    return out;
}
function splitSinglePipeChunkToAtomics(chunk) {
    const trimmed = chunk.trim();
    if (trimmed.length === 0)
        return [];
    const tokens = trimmed
        .split("|")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    if (tokens.length === 0)
        return [];
    const parsed = parseAtomicsFromPipeTokens(tokens);
    return parsed.length > 0
        ? parsed
        : [normalizePerformanceToolAssetKey(trimmed)];
}
function parseAtomicsFromPipeTokens(tokens) {
    const n = tokens.length;
    const memo = new Map();
    function allowAsCompositePair(left, right) {
        if (isLikelyBrandSubCompositeTokens(left, right))
            return true;
        const tl = left.trim();
        const tr = right.trim();
        if (/\s/.test(tl) || /\s/.test(tr))
            return true;
        if (tl.length >= 4 && tr.length > 0 && tr.length <= 5 && !/\s/.test(tr))
            return true;
        return false;
    }
    function best(i) {
        if (i === n)
            return [];
        if (memo.has(i))
            return memo.get(i);
        const candidates = [];
        const one = tokens[i] ?? "";
        if (one.length > 0 && isValidPerformanceToolAssetAtomicSegment(one)) {
            const tail = best(i + 1);
            if (tail)
                candidates.push([one, ...tail]);
        }
        if (i + 1 < n) {
            const two = `${tokens[i]}|${tokens[i + 1]}`;
            if (isValidPerformanceToolAssetAtomicSegment(two) &&
                allowAsCompositePair(tokens[i], tokens[i + 1])) {
                const tail = best(i + 2);
                if (tail)
                    candidates.push([two, ...tail]);
            }
        }
        if (candidates.length === 0) {
            memo.set(i, null);
            return null;
        }
        candidates.sort((a, b) => {
            if (a.length !== b.length)
                return a.length - b.length;
            return a.join("\u0000").localeCompare(b.join("\u0000"));
        });
        const chosen = candidates[0];
        memo.set(i, chosen);
        return chosen;
    }
    return best(0) ?? [];
}
function isLikelyBrandSubCompositeTokens(brand, sub) {
    const b = brand.trim().toLowerCase();
    const s = sub.trim().toLowerCase();
    if (b.length === 0 || s.length === 0)
        return false;
    if (s === b)
        return false;
    if (s.startsWith(`${b} `))
        return true;
    if (b.length >= 3 && s.startsWith(b))
        return true;
    return false;
}
function removePlainAtomicsRedundantWithCompositeBrandPrefix(atomics) {
    const normalized = atomics
        .map((a) => normalizePerformanceToolAssetKey(a))
        .filter((a) => a.length > 0);
    const brandPrefixIds = new Set();
    for (const a of normalized) {
        const pipe = a.indexOf("|");
        if (pipe < 0 || a.indexOf("|", pipe + 1) >= 0)
            continue;
        if (!isValidPerformanceToolAssetAtomicSegment(a))
            continue;
        const left = normalizePerformanceToolAssetKey(a.slice(0, pipe));
        if (left.length === 0)
            continue;
        brandPrefixIds.add(performanceToolAssetLogicalIdentity(left));
    }
    return normalized.filter((a) => {
        if (a.includes("|"))
            return true;
        return !brandPrefixIds.has(performanceToolAssetLogicalIdentity(a));
    });
}
function expandPerformanceToolAssetKeyToAtomics(raw) {
    const a = normalizePerformanceToolAssetKey(raw);
    if (a.length === 0)
        return [];
    if (isValidPerformanceToolAssetAtomicSegment(a)) {
        return [a];
    }
    const parts = splitPerformanceToolAssetKeyAtomics(a);
    return parts.length > 0 ? parts : [a];
}
function serializePerformanceToolAssetAtomics(atomics) {
    const flattened = [];
    for (const raw of atomics) {
        flattened.push(...expandPerformanceToolAssetKeyToAtomics(raw));
    }
    const byIdentity = new Map();
    for (const a of flattened) {
        const n = normalizePerformanceToolAssetKey(a);
        if (n.length === 0)
            continue;
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
    return uniq.join(exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
}
function dedupePerformanceToolAssetKeyPipeSegments(key) {
    const segments = key.split(exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
    const seen = new Set();
    const out = [];
    for (const raw of segments) {
        const seg = normalizePerformanceToolAssetKey(raw);
        if (seg.length === 0)
            continue;
        const id = performanceToolAssetLogicalIdentity(seg);
        if (seen.has(id))
            continue;
        seen.add(id);
        out.push(seg);
    }
    return out.join(exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
}
function dedupeNormalizedJoinedAssetKey(mergedKey, _joiner) {
    void _joiner;
    const atomics = splitPerformanceToolAssetKeyAtomics(mergedKey);
    if (atomics.length === 0) {
        return normalizePerformanceToolAssetKey(mergedKey);
    }
    return serializePerformanceToolAssetAtomics(atomics);
}
function performanceToolAssetKeyIncludesLogical(mergedKey, logicalKey) {
    const wantId = performanceToolAssetLogicalIdentity(logicalKey);
    if (isValidPerformanceToolAssetAtomicSegment(mergedKey) &&
        performanceToolAssetLogicalIdentity(mergedKey) === wantId) {
        return true;
    }
    for (const a of splitPerformanceToolAssetKeyAtomics(mergedKey)) {
        const an = normalizePerformanceToolAssetKey(a);
        if (performanceToolAssetLogicalIdentity(an) === wantId)
            return true;
        const p = an.indexOf("|");
        if (p >= 0 && an.indexOf("|", p + 1) < 0) {
            const left = an.slice(0, p).trim();
            const right = an.slice(p + 1).trim();
            if (performanceToolAssetLogicalIdentity(left) === wantId)
                return true;
            if (performanceToolAssetLogicalIdentity(right) === wantId)
                return true;
        }
    }
    return false;
}
function canonicalPerformanceToolBrandAssetMapKey(rawKey, joiner = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER) {
    return dedupePerformanceToolAssetKeyPipeSegments(dedupeNormalizedJoinedAssetKey(rawKey, joiner));
}
function addRealImageCoverageFromCanonicalKey(canonicalKey, into) {
    for (const seg of canonicalKey.split(exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER)) {
        const t = normalizePerformanceToolAssetKey(seg);
        if (t.length > 0)
            into.add(performanceToolAssetLogicalIdentity(t));
    }
    for (const a of splitPerformanceToolAssetKeyAtomics(canonicalKey)) {
        const n = normalizePerformanceToolAssetKey(a);
        if (n.length === 0)
            continue;
        into.add(performanceToolAssetLogicalIdentity(n));
        const p = n.indexOf("|");
        if (p >= 0 && n.indexOf("|", p + 1) < 0) {
            const left = normalizePerformanceToolAssetKey(n.slice(0, p));
            const right = normalizePerformanceToolAssetKey(n.slice(p + 1));
            if (left.length > 0)
                into.add(performanceToolAssetLogicalIdentity(left));
            if (right.length > 0)
                into.add(performanceToolAssetLogicalIdentity(right));
        }
    }
}
function isPlaceholderKeySupersededByRealCover(canonicalKey, realCover) {
    const segments = canonicalKey
        .split(exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER)
        .map((s) => normalizePerformanceToolAssetKey(s))
        .filter((s) => s.length > 0);
    if (segments.length === 0)
        return false;
    return segments.every((s) => realCover.has(performanceToolAssetLogicalIdentity(s)));
}
function stripPlaceholderBrandAssetKeysSupersededByRealImage(assets, joiner = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER) {
    const realCover = new Set();
    for (const [k, url] of Object.entries(assets)) {
        if (isPerformanceToolPlaceholderImageUrl(url))
            continue;
        addRealImageCoverageFromCanonicalKey(canonicalPerformanceToolBrandAssetMapKey(k, joiner), realCover);
    }
    const out = {};
    for (const [k, url] of Object.entries(assets)) {
        if (isPerformanceToolPlaceholderImageUrl(url))
            continue;
        out[canonicalPerformanceToolBrandAssetMapKey(k, joiner)] = url;
    }
    for (const [k, url] of Object.entries(assets)) {
        if (!isPerformanceToolPlaceholderImageUrl(url))
            continue;
        const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
        if (out[canon] !== undefined &&
            !isPerformanceToolPlaceholderImageUrl(out[canon])) {
            continue;
        }
        if (isPlaceholderKeySupersededByRealCover(canon, realCover))
            continue;
        out[canon] = url;
    }
    return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}
function mergeBrandImageUrlMapsPreferringNonPlaceholder(brandFlat, subFlat, joiner = exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER) {
    const realCover = new Set();
    const absorbRealCoverage = (rec) => {
        for (const [k, url] of Object.entries(rec)) {
            if (isPerformanceToolPlaceholderImageUrl(url))
                continue;
            addRealImageCoverageFromCanonicalKey(canonicalPerformanceToolBrandAssetMapKey(k, joiner), realCover);
        }
    };
    absorbRealCoverage(brandFlat);
    absorbRealCoverage(subFlat);
    const out = {};
    const putReals = (rec) => {
        for (const [k, url] of Object.entries(rec)) {
            if (isPerformanceToolPlaceholderImageUrl(url))
                continue;
            const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
            out[canon] = url;
        }
    };
    putReals(brandFlat);
    putReals(subFlat);
    const putPlaceholders = (rec) => {
        for (const [k, url] of Object.entries(rec)) {
            if (!isPerformanceToolPlaceholderImageUrl(url))
                continue;
            const canon = canonicalPerformanceToolBrandAssetMapKey(k, joiner);
            if (out[canon] !== undefined &&
                !isPerformanceToolPlaceholderImageUrl(out[canon])) {
                continue;
            }
            if (isPlaceholderKeySupersededByRealCover(canon, realCover))
                continue;
            out[canon] = url;
        }
    };
    putPlaceholders(brandFlat);
    putPlaceholders(subFlat);
    return out;
}
function polishGlobalAssetMapKeys(assets, joiner) {
    const out = {};
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
    return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}
function isPerformanceToolPlaceholderImageUrl(url) {
    return (url.includes("no-image-available") ||
        url.includes(brand_image_paths_constants_1.BRAND_IMAGE_PLACEHOLDER_PATH));
}
function omitPlaceholderPerformanceToolBrandAssetUrls(assets) {
    return Object.fromEntries(Object.entries(assets)
        .filter(([, url]) => !isPerformanceToolPlaceholderImageUrl(url))
        .sort(([a], [b]) => a.localeCompare(b)));
}
function mergeGlobalPerformanceToolAssetKeys(input, _keyJoiner) {
    void _keyJoiner;
    const byUrl = new Map();
    const standalone = new Map();
    for (const [rawKey, url] of Object.entries(input)) {
        const k = normalizePerformanceToolAssetKey(rawKey);
        if (isPerformanceToolPlaceholderImageUrl(url)) {
            const id = performanceToolAssetLogicalIdentity(k);
            if (!standalone.has(id)) {
                standalone.set(id, { displayKey: k, url });
            }
            continue;
        }
        if (!byUrl.has(url))
            byUrl.set(url, new Set());
        byUrl.get(url).add(k);
    }
    const mergedEntries = [];
    for (const [url, keys] of byUrl.entries()) {
        const uniq = [
            ...new Set([...keys].map((x) => normalizePerformanceToolAssetKey(x))),
        ]
            .filter((x) => x.length > 0)
            .sort((a, b) => a.localeCompare(b));
        if (uniq.length === 0)
            continue;
        mergedEntries.push([serializePerformanceToolAssetAtomics(uniq), url]);
    }
    mergedEntries.sort(([a], [b]) => a.localeCompare(b));
    const standaloneObj = {};
    for (const { displayKey, url } of standalone.values()) {
        standaloneObj[displayKey] = url;
    }
    return { ...standaloneObj, ...Object.fromEntries(mergedEntries) };
}
function brandFamilyGroupToken(brandKey) {
    const t = normalizePerformanceToolAssetKey(brandKey);
    const first = t.split(/\s+/)[0] ?? t;
    return (first.length > 0 ? first : t).toLocaleLowerCase();
}
function subbrandAssetFamilyGroupToken(subKey) {
    const t = normalizePerformanceToolAssetKey(subKey);
    const pipe = t.indexOf("|");
    const brandSide = (pipe >= 0 ? t.slice(0, pipe) : t).trim();
    const base = brandSide.length > 0 ? brandSide : t;
    return brandFamilyGroupToken(base);
}
function unifiedPlaceholderFamilyToken(rawKey) {
    const atomics = splitPerformanceToolAssetKeyAtomics(rawKey);
    const sorted = [...atomics]
        .map((a) => normalizePerformanceToolAssetKey(a))
        .filter((a) => a.length > 0)
        .sort((a, b) => a.localeCompare(b));
    const head = sorted[0] ?? rawKey.trim();
    return subbrandAssetFamilyGroupToken(head);
}
function collapsePlaceholderKeysByFamily(assets) {
    const nonPlaceholder = {};
    const phAtomicsByFamily = new Map();
    const phUrlByFamily = new Map();
    for (const [rawKey, url] of Object.entries(assets)) {
        const rowKey = dedupeNormalizedJoinedAssetKey(rawKey, exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
        if (!isPerformanceToolPlaceholderImageUrl(url)) {
            nonPlaceholder[rowKey] = url;
            continue;
        }
        const fam = unifiedPlaceholderFamilyToken(rawKey);
        if (!phAtomicsByFamily.has(fam))
            phAtomicsByFamily.set(fam, new Set());
        const bucket = phAtomicsByFamily.get(fam);
        for (const a of splitPerformanceToolAssetKeyAtomics(rawKey)) {
            bucket.add(normalizePerformanceToolAssetKey(a));
        }
        phUrlByFamily.set(fam, url);
    }
    const collapsedPh = {};
    for (const [fam, atomics] of phAtomicsByFamily) {
        const url = phUrlByFamily.get(fam) ?? "";
        collapsedPh[serializePerformanceToolAssetAtomics(atomics)] = url;
    }
    return { ...nonPlaceholder, ...collapsedPh };
}
function collapsePlaceholderPerformanceToolAssetKeysByFamily(assets) {
    return collapsePlaceholderKeysByFamily(assets);
}
function collapsePlaceholderBrandKeysByFamily(assets) {
    return collapsePlaceholderPerformanceToolAssetKeysByFamily(assets);
}
function collapsePlaceholderSubbrandKeysByFamily(assets) {
    return collapsePlaceholderPerformanceToolAssetKeysByFamily(assets);
}
function isTree(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function trueLeaves(tree) {
    return Object.keys(tree).filter((k) => tree[k] === true);
}
function skipAssetToken(s) {
    if (!s || !String(s).trim())
        return true;
    if (s === performance_tool_ui_rules_1.VALUE_ALL || s === performance_tool_ui_rules_1.SOURCE_GLOBAL_BRANDS)
        return true;
    if (s === performance_tool_constants_1.ZONE_GLOBAL || s === performance_tool_constants_1.COUNTRY_GLOBAL || s === performance_tool_constants_1.COUNTRY_EUR)
        return true;
    return false;
}
function collectBrandsFromCountryBrandTrees(root, out) {
    if (!isTree(root))
        return;
    for (const country of Object.keys(root)) {
        const mid = root[country];
        if (!isTree(mid))
            continue;
        for (const b of trueLeaves(mid)) {
            if (skipAssetToken(b))
                continue;
            const n = normalizePerformanceToolAssetKey(b);
            const id = performanceToolAssetLogicalIdentity(n);
            if (!out.has(id))
                out.set(id, n);
        }
    }
}
function collectFromRelations(relations, brandNames, subEntries) {
    collectBrandsFromCountryBrandTrees(relations.country_brands, brandNames);
    collectBrandsFromCountryBrandTrees(relations.portfolio_country_brands, brandNames);
    collectBrandsFromCountryBrandTrees(relations.bps_country_brands, brandNames);
    const gbc = relations.global_brand_countries;
    if (isTree(gbc)) {
        for (const brand of Object.keys(gbc)) {
            if (skipAssetToken(brand))
                continue;
            const n = normalizePerformanceToolAssetKey(brand);
            const id = performanceToolAssetLogicalIdentity(n);
            if (!brandNames.has(id))
                brandNames.set(id, n);
        }
    }
    const cs = relations.country_subbrands;
    if (isTree(cs)) {
        for (const country of Object.keys(cs)) {
            const mid = cs[country];
            if (!isTree(mid))
                continue;
            for (const s of trueLeaves(mid)) {
                if (skipAssetToken(s))
                    continue;
                const nk = normalizePerformanceToolAssetKey(s.trim());
                const id = performanceToolAssetLogicalIdentity(nk);
                const label = s.trim().replace(/\s+/g, " ");
                if (!subEntries.has(id)) {
                    subEntries.set(id, {
                        label,
                        displayKey: nk,
                    });
                }
                else {
                    const prev = subEntries.get(id);
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
            if (skipAssetToken(brand))
                continue;
            const mid = bcs[brand];
            if (!isTree(mid))
                continue;
            for (const country of Object.keys(mid)) {
                const leaf = mid[country];
                if (!isTree(leaf))
                    continue;
                for (const s of trueLeaves(leaf)) {
                    if (skipAssetToken(s))
                        continue;
                    const nk = normalizePerformanceToolAssetKey(`${brand.trim()}|${s.trim()}`);
                    const id = performanceToolAssetLogicalIdentity(nk);
                    const label = s.trim().replace(/\s+/g, " ");
                    const brandFamily = brand.trim().replace(/\s+/g, " ");
                    if (!subEntries.has(id)) {
                        subEntries.set(id, {
                            label,
                            brand_family: brandFamily,
                            displayKey: nk,
                        });
                    }
                    else {
                        const prev = subEntries.get(id);
                        const next = label.length > prev.label.length
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
            if (!isTree(mid))
                continue;
            for (const country of Object.keys(mid)) {
                const leaf = mid[country];
                if (!isTree(leaf))
                    continue;
                for (const s of trueLeaves(leaf)) {
                    if (skipAssetToken(s))
                        continue;
                    const nk = normalizePerformanceToolAssetKey(s.trim());
                    const id = performanceToolAssetLogicalIdentity(nk);
                    const label = s.trim().replace(/\s+/g, " ");
                    if (!subEntries.has(id)) {
                        subEntries.set(id, {
                            label,
                            displayKey: nk,
                        });
                    }
                    else {
                        const prev = subEntries.get(id);
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
            if (skipAssetToken(brand))
                continue;
            const mid = gbcs[brand];
            if (!isTree(mid))
                continue;
            for (const country of Object.keys(mid)) {
                const leaf = mid[country];
                if (!isTree(leaf))
                    continue;
                for (const s of trueLeaves(leaf)) {
                    if (skipAssetToken(s))
                        continue;
                    const nk = normalizePerformanceToolAssetKey(`${brand.trim()}|${s.trim()}`);
                    const id = performanceToolAssetLogicalIdentity(nk);
                    const label = s.trim().replace(/\s+/g, " ");
                    const brandFamily = brand.trim().replace(/\s+/g, " ");
                    if (!subEntries.has(id)) {
                        subEntries.set(id, {
                            label,
                            brand_family: brandFamily,
                            displayKey: nk,
                        });
                    }
                    else {
                        const prev = subEntries.get(id);
                        const next = label.length > prev.label.length
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
        for (const glKey of Object.keys(gl)) {
            const nested = gl[glKey];
            if (nested && typeof nested === "object") {
                collectFromRelations(nested, brandNames, subEntries);
            }
        }
    }
}
function resolvePerformanceToolSubbrandAssetKey(meta, labelCollisionWithDistinctUrls) {
    if (labelCollisionWithDistinctUrls) {
        return normalizePerformanceToolAssetKey(meta.displayKey);
    }
    return normalizePerformanceToolAssetKey(meta.label);
}
function buildPerformanceToolSubbrandAssetMap(subEntries) {
    const groupedByLabel = new Map();
    for (const meta of subEntries.values()) {
        const labelKey = normalizePerformanceToolAssetKey(meta.label);
        const bucket = groupedByLabel.get(labelKey);
        if (bucket) {
            bucket.push(meta);
        }
        else {
            groupedByLabel.set(labelKey, [meta]);
        }
    }
    const subFlat = {};
    for (const metas of groupedByLabel.values()) {
        const distinctUrls = new Set(metas.map((meta) => (0, brand_image_utils_1.getBrandImageSingleUrl)(meta.label, { brand_family: meta.brand_family })));
        const labelCollisionWithDistinctUrls = distinctUrls.size > 1;
        for (const meta of metas) {
            const key = resolvePerformanceToolSubbrandAssetKey(meta, labelCollisionWithDistinctUrls);
            subFlat[key] = (0, brand_image_utils_1.getBrandImageSingleUrl)(meta.label, {
                brand_family: meta.brand_family,
            });
        }
    }
    return subFlat;
}
function buildGlobalPerformanceToolImageAssets(enabledKpis, getRelationsForKpi) {
    const brandNames = new Map();
    const subEntries = new Map();
    for (const kpi of enabledKpis) {
        collectFromRelations(getRelationsForKpi(kpi), brandNames, subEntries);
    }
    const brandFlat = {};
    for (const name of brandNames.values()) {
        brandFlat[name] = (0, brand_image_utils_1.getBrandImageSingleUrl)(name);
    }
    const subFlat = buildPerformanceToolSubbrandAssetMap(subEntries);
    const unifiedFlat = mergeBrandImageUrlMapsPreferringNonPlaceholder(brandFlat, subFlat, exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
    const merged = mergeGlobalPerformanceToolAssetKeys(unifiedFlat, exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
    const collapsed = collapsePlaceholderPerformanceToolAssetKeysByFamily(merged);
    const polished = polishGlobalAssetMapKeys(collapsed, exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER);
    return {
        brand_assets: omitPlaceholderPerformanceToolBrandAssetUrls(stripPlaceholderBrandAssetKeysSupersededByRealImage(polished, exports.PERFORMANCE_TOOL_ASSET_KEY_JOINER)),
    };
}
//# sourceMappingURL=performance-tool.global-image-assets.js.map