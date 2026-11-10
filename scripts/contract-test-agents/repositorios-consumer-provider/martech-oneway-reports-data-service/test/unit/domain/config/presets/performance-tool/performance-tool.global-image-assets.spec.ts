import {
  brandFamilyGroupToken,
  buildGlobalPerformanceToolImageAssets,
  canonicalPerformanceToolBrandAssetMapKey,
  collapsePlaceholderBrandKeysByFamily,
  collapsePlaceholderSubbrandKeysByFamily,
  dedupeNormalizedJoinedAssetKey,
  dedupePerformanceToolAssetKeyPipeSegments,
  isPerformanceToolPlaceholderImageUrl,
  isValidPerformanceToolAssetAtomicSegment,
  mergeGlobalPerformanceToolAssetKeys,
  mergeBrandImageUrlMapsPreferringNonPlaceholder,
  normalizePerformanceToolAssetKey,
  omitPlaceholderPerformanceToolBrandAssetUrls,
  PERFORMANCE_TOOL_ASSET_KEY_JOINER,
  performanceToolAssetKeyIncludesLogical,
  performanceToolAssetLogicalIdentity,
  polishGlobalAssetMapKeys,
  serializePerformanceToolAssetAtomics,
  splitPerformanceToolAssetKeyAtomics,
  stripPlaceholderBrandAssetKeysSupersededByRealImage,
  subbrandAssetFamilyGroupToken,
} from "@domain/config/presets/performance-tool/performance-tool.global-image-assets";
import { getBrandImageSingleUrl } from "@common/utils/images/brand-image.utils";

describe("isValidPerformanceToolAssetAtomicSegment", () => {
  it("rejects trivial x|x composites (case-insensitive)", () => {
    expect(isValidPerformanceToolAssetAtomicSegment("4 Pines|4 Pines")).toBe(
      false,
    );
    expect(isValidPerformanceToolAssetAtomicSegment("7Up|7UP")).toBe(false);
  });

  it("rejects more than one pipe per atomic", () => {
    expect(isValidPerformanceToolAssetAtomicSegment("A|B|C")).toBe(false);
  });
});

describe("dedupeNormalizedJoinedAssetKey", () => {
  it("collapses legacy || and duplicate plain atomics", () => {
    expect(
      dedupeNormalizedJoinedAssetKey(
        "4 Pines||4 Pines|4 Pines",
        PERFORMANCE_TOOL_ASSET_KEY_JOINER,
      ),
    ).toBe("4 Pines");
  });

  it("dedupes repeated 1890 across legacy joiners", () => {
    expect(
      dedupeNormalizedJoinedAssetKey(
        "1890||1890|1890",
        PERFORMANCE_TOOL_ASSET_KEY_JOINER,
      ),
    ).toBe("1890");
  });

  it("keeps one composite 7Up|7Up Reduced Sugar", () => {
    const one = "7Up|7Up Reduced Sugar";
    expect(
      dedupeNormalizedJoinedAssetKey(
        `${one}|${one}|${one}`,
        PERFORMANCE_TOOL_ASSET_KEY_JOINER,
      ),
    ).toBe(one);
  });
});

describe("dedupePerformanceToolAssetKeyPipeSegments", () => {
  it("trims, drops duplicate segments by identity, preserves first casing", () => {
    expect(
      dedupePerformanceToolAssetKeyPipeSegments(
        " 7UP | 7UP | 7UP Reduced Sugar ",
      ),
    ).toBe("7UP|7UP Reduced Sugar");
    expect(dedupePerformanceToolAssetKeyPipeSegments("a|b| a |B|b")).toBe(
      "a|b",
    );
  });

  it("keeps distinct segments", () => {
    expect(
      dedupePerformanceToolAssetKeyPipeSegments("Corona|Corona Extra"),
    ).toBe("Corona|Corona Extra");
  });
});

describe("performanceToolAssetKeyIncludesLogical", () => {
  it("matches inside merged single-pipe keys", () => {
    expect(
      performanceToolAssetKeyIncludesLogical("7UP|7Up|Corona", "Corona"),
    ).toBe(true);
    expect(
      performanceToolAssetKeyIncludesLogical(
        "7Up|7Up Reduced Sugar|7UP|7UP Reduced Sugar",
        "7Up|7Up Reduced Sugar",
      ),
    ).toBe(true);
  });

  it("matches logical keys ignoring ASCII case", () => {
    expect(performanceToolAssetKeyIncludesLogical("7UP", "7Up")).toBe(true);
    expect(
      performanceToolAssetKeyIncludesLogical(
        "7UP|7UP Reduced Sugar",
        "7up|7up reduced sugar",
      ),
    ).toBe(true);
  });
});

describe("performanceToolAssetLogicalIdentity", () => {
  it("collapses case-only variants", () => {
    expect(performanceToolAssetLogicalIdentity("7Up")).toBe(
      performanceToolAssetLogicalIdentity("7UP"),
    );
  });
});

describe("normalizePerformanceToolAssetKey", () => {
  it("trims and collapses whitespace for plain keys", () => {
    expect(normalizePerformanceToolAssetKey("  1890  ")).toBe("1890");
    expect(normalizePerformanceToolAssetKey("Quilmes   Extra")).toBe(
      "Quilmes Extra",
    );
  });

  it("normalizes each side of brand|sub", () => {
    expect(normalizePerformanceToolAssetKey(" Quilmes | Quilmes Bock ")).toBe(
      "Quilmes|Quilmes Bock",
    );
  });
});

describe("isPerformanceToolPlaceholderImageUrl", () => {
  it("detects no-image placeholder paths", () => {
    expect(
      isPerformanceToolPlaceholderImageUrl(
        "https://cdn/brands/placeholder/no-image-available.png",
      ),
    ).toBe(true);
  });
});

describe("omitPlaceholderPerformanceToolBrandAssetUrls", () => {
  it("removes only placeholder rows", () => {
    const ph = "https://assets/brands/placeholder/no-image-available.png";
    const out = omitPlaceholderPerformanceToolBrandAssetUrls({
      A: ph,
      B: "https://cdn/b/square.png",
    });
    expect(out).toEqual({ B: "https://cdn/b/square.png" });
  });
});

describe("subbrandAssetFamilyGroupToken", () => {
  it("groups by first word of the brand segment before |", () => {
    expect(subbrandAssetFamilyGroupToken("Labatt Blue|Lite")).toBe("labatt");
    expect(subbrandAssetFamilyGroupToken("Labatt|ICE")).toBe("labatt");
  });

  it("falls back to whole key when there is no pipe", () => {
    expect(subbrandAssetFamilyGroupToken("SoloSub")).toBe("solosub");
  });
});

describe("collapsePlaceholderSubbrandKeysByFamily", () => {
  const ph = "https://assets/brands/placeholder/no-image-available.png";

  it("merges Labatt|* placeholders under one | key", () => {
    const merged = mergeGlobalPerformanceToolAssetKeys(
      {
        "Labatt|Labatt 50": ph,
        "Labatt|Labatt Blue": ph,
        "Labatt Blue|Dry": ph,
        "Budweiser|Foo": "https://cdn/budweiser/square.png",
      },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    const out = collapsePlaceholderSubbrandKeysByFamily(merged);
    expect(out["Budweiser|Foo"]).toBe("https://cdn/budweiser/square.png");
    const labattKeys = Object.keys(out).filter((k) => k.includes("Labatt"));
    expect(labattKeys).toHaveLength(1);
    expect(labattKeys[0]).not.toContain("||");
    expect(out[labattKeys[0]]).toBe(ph);
    expect(
      splitPerformanceToolAssetKeyAtomics(labattKeys[0]).length,
    ).toBeGreaterThanOrEqual(2);
  });
});

describe("brandFamilyGroupToken", () => {
  it("uses the first word case-insensitively", () => {
    expect(brandFamilyGroupToken("Labatt Blue Light")).toBe("labatt");
    expect(brandFamilyGroupToken("  labatt 50 ")).toBe("labatt");
  });
});

describe("collapsePlaceholderBrandKeysByFamily", () => {
  const ph = "https://assets/brands/placeholder/no-image-available.png";

  it("merges Labatt* placeholders under one | key", () => {
    const merged = mergeGlobalPerformanceToolAssetKeys(
      {
        "Labatt 50": ph,
        "Labatt Blue": ph,
        "Labatt Blue Dry": ph,
        Budweiser: "https://cdn/budweiser/square.png",
      },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    const out = collapsePlaceholderBrandKeysByFamily(merged);
    expect(out.Budweiser).toBe("https://cdn/budweiser/square.png");
    expect(Object.keys(out).filter((k) => k.includes("Labatt"))).toHaveLength(
      1,
    );
    const labattKey = Object.keys(out).find((k) => k.includes("Labatt"));
    expect(labattKey).toBeDefined();
    expect(labattKey).not.toContain("||");
    for (const logical of [
      "Labatt 50",
      "Labatt Blue",
      "Labatt Blue Dry",
    ] as const) {
      expect(performanceToolAssetKeyIncludesLogical(labattKey!, logical)).toBe(
        true,
      );
    }
    expect(out[labattKey!]).toBe(ph);
  });

  it("keeps unrelated placeholder families separate", () => {
    const merged = mergeGlobalPerformanceToolAssetKeys(
      { Foo: ph, Bar: ph },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    const out = collapsePlaceholderBrandKeysByFamily(merged);
    expect(out.Foo).toBe(ph);
    expect(out.Bar).toBe(ph);
    expect(Object.keys(out)).toHaveLength(2);
  });
});

describe("mergeGlobalPerformanceToolAssetKeys", () => {
  it("merges non-placeholder keys that share the same URL with |", () => {
    const out = mergeGlobalPerformanceToolAssetKeys(
      {
        "7Up": "https://cdn/7up/square.png",
        "7UP": "https://cdn/7up/square.png",
        Corona: "https://cdn/corona/square.png",
      },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    const seven = Object.entries(out).find(([, u]) => u.includes("7up"));
    expect(seven).toBeDefined();
    expect(seven![0]).not.toContain("||");
    const atomics = splitPerformanceToolAssetKeyAtomics(seven![0]);
    expect(atomics).toHaveLength(1);
    expect(performanceToolAssetLogicalIdentity(atomics[0]!)).toBe("7up");
    expect(out.Corona).toBe("https://cdn/corona/square.png");
  });

  it("does not merge placeholder URLs (one entry per key)", () => {
    const ph = "https://x/brands/placeholder/no-image-available.png";
    const out = mergeGlobalPerformanceToolAssetKeys(
      { A: ph, B: ph, C: "https://cdn/c/square.png" },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    expect(out.A).toBe(ph);
    expect(out.B).toBe(ph);
    expect(out.C).toBe("https://cdn/c/square.png");
    expect(Object.keys(out)).toHaveLength(3);
  });

  it("merges composite subbrand keys that share the same URL", () => {
    const u = "https://cdn/7up/square.png";
    const out = mergeGlobalPerformanceToolAssetKeys(
      {
        "7Up|7Up Reduced Sugar": u,
        "7UP|7UP Reduced Sugar": u,
      },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    expect(Object.keys(out)).toHaveLength(1);
    const k = Object.keys(out)[0];
    expect(k).not.toContain("||");
    expect(out[k]).toBe(u);
    expect(
      performanceToolAssetKeyIncludesLogical(k, "7Up|7Up Reduced Sugar"),
    ).toBe(true);
  });

  it("merges plain brand and composite into one row when they share the same URL", () => {
    const u = "https://cdn/acme/square.png";
    const out = mergeGlobalPerformanceToolAssetKeys(
      { Acme: u, "Acme|Special": u },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    expect(Object.keys(out)).toHaveLength(1);
    const k = Object.keys(out)[0];
    expect(out[k]).toBe(u);
    expect(k).toBe("Acme|Special");
  });

  it("keeps Busch and Busch Light on separate rows when asset URLs differ", () => {
    process.env.CDN_BASE_URL = "https://assets-martech-uat.mybees-platform.dev";

    const buschUrl = getBrandImageSingleUrl("Busch");
    const buschLightUrl = getBrandImageSingleUrl("Busch Light", {
      brand_family: "Busch",
    });

    expect(buschUrl).not.toBe(buschLightUrl);

    const out = mergeGlobalPerformanceToolAssetKeys(
      {
        Busch: buschUrl,
        "Busch NA": getBrandImageSingleUrl("Busch NA", {
          brand_family: "Busch",
        }),
        "Busch Ice": getBrandImageSingleUrl("Busch Ice", {
          brand_family: "Busch",
        }),
        "Busch Light Flavors": getBrandImageSingleUrl("Busch Light Flavors", {
          brand_family: "Busch",
        }),
        "Busch Light": buschLightUrl,
      },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );

    const buschRow = Object.entries(out).find(([, url]) => url === buschUrl);
    const buschLightRow = Object.entries(out).find(
      ([, url]) => url === buschLightUrl,
    );

    expect(buschRow).toBeDefined();
    expect(buschLightRow).toBeDefined();
    expect(
      performanceToolAssetKeyIncludesLogical(buschRow![0], "Busch Light"),
    ).toBe(false);
    expect(
      performanceToolAssetKeyIncludesLogical(
        buschRow![0],
        "Busch Light Flavors",
      ),
    ).toBe(false);
    expect(
      performanceToolAssetKeyIncludesLogical(buschLightRow![0], "Busch Light"),
    ).toBe(true);
    expect(
      performanceToolAssetKeyIncludesLogical(
        buschLightRow![0],
        "Busch Light Flavors",
      ),
    ).toBe(true);
    expect(
      performanceToolAssetKeyIncludesLogical(buschLightRow![0], "Busch"),
    ).toBe(false);
  });

  it("does not associate Busch brand with busch_light assets when subbrand relations use Brand|Sub keys", () => {
    process.env.CDN_BASE_URL = "https://assets-martech-uat.mybees-platform.dev";

    const { brand_assets } = buildGlobalPerformanceToolImageAssets(
      ["volume"],
      () => ({
        country_brands: { USA: { Busch: true } },
        brand_country_subbrands: {
          Busch: { USA: { "Busch Light": true, "Busch Light Flavors": true } },
        },
        country_subbrands: {
          USA: { "Busch Light": true, "Busch NA": true, "Busch Ice": true },
        },
      }),
    );

    const buschUrl = getBrandImageSingleUrl("Busch");
    const buschLightUrl = getBrandImageSingleUrl("Busch Light", {
      brand_family: "Busch",
    });

    const buschLightRow = Object.entries(brand_assets).find(
      ([, url]) => url === buschLightUrl,
    );
    expect(buschLightRow).toBeDefined();
    expect(buschLightRow![0].split("|")).not.toContain("Busch");
    expect(
      performanceToolAssetKeyIncludesLogical(buschLightRow![0], "Busch"),
    ).toBe(false);
    expect(
      performanceToolAssetKeyIncludesLogical(buschLightRow![0], "Busch Light"),
    ).toBe(true);

    const buschRow = Object.entries(brand_assets).find(
      ([, url]) => url === buschUrl,
    );
    expect(buschRow).toBeDefined();
    expect(
      performanceToolAssetKeyIncludesLogical(buschRow![0], "Busch Light"),
    ).toBe(false);
  });
});

describe("serializePerformanceToolAssetAtomics", () => {
  it("sorts and joins with a single pipe", () => {
    expect(serializePerformanceToolAssetAtomics(["B", "A"])).toBe("A|B");
  });

  it("joins with pipe even when some atomics are brand|sub", () => {
    expect(serializePerformanceToolAssetAtomics(["Acme", "Acme|Special"])).toBe(
      "Acme|Special",
    );
  });

  it("flattens outer-joined blobs (multiple pipes) into atomics before deduping", () => {
    expect(
      serializePerformanceToolAssetAtomics([
        "7UP|7UP Reduced Sugar|7UP|SVNS Hard 7UP Original",
      ]),
    ).toBe("7UP|7UP Reduced Sugar|7UP|SVNS Hard 7UP Original");
  });

  it("does not split a single valid Brand|sub atomic", () => {
    expect(serializePerformanceToolAssetAtomics(["Acme|Special"])).toBe(
      "Acme|Special",
    );
  });

  it("drops plain brand when a Brand|sub composite is present (no Brand|Brand|sub)", () => {
    expect(
      serializePerformanceToolAssetAtomics([
        "7UP",
        "7UP|7UP Reduced Sugar",
        "7UP|SVNS Hard 7UP Original",
      ]),
    ).toBe("7UP|7UP Reduced Sugar|7UP|SVNS Hard 7UP Original");
    expect(
      serializePerformanceToolAssetAtomics([
        "Antarctica",
        "Antarctica|Antarctica - Others",
        "Antarctica|Antarctica Chopp",
      ]),
    ).toBe("Antarctica|Antarctica - Others|Antarctica|Antarctica Chopp");
  });
});

describe("stripPlaceholderBrandAssetKeysSupersededByRealImage", () => {
  const ph = "https://assets/brands/placeholder/no-image-available.png";
  const sq = "https://cdn/aguila/square.png";

  it("drops placeholder when the same brand is covered by a real composite", () => {
    const out = stripPlaceholderBrandAssetKeysSupersededByRealImage({
      "Aguila Light": ph,
      "Aguila|Aguila Light": sq,
    });
    expect(Object.keys(out)).toHaveLength(1);
    expect(
      out[canonicalPerformanceToolBrandAssetMapKey("Aguila|Aguila Light")],
    ).toBe(sq);
  });

  it("keeps placeholder when no real image covers its atomics", () => {
    const out = stripPlaceholderBrandAssetKeysSupersededByRealImage({
      "Only Ph": ph,
      Corona: sq,
    });
    expect(out["Only Ph"]).toBe(ph);
    expect(out.Corona).toBe(sq);
    expect(Object.keys(out)).toHaveLength(2);
  });

  it("does not drop placeholder when only part of a multi-atomic key is covered", () => {
    const out = stripPlaceholderBrandAssetKeysSupersededByRealImage({
      "Alpha|Beta": ph,
      Alpha: sq,
    });
    expect(out[canonicalPerformanceToolBrandAssetMapKey("Alpha")]).toBe(sq);
    const phRows = Object.entries(out).filter(([, u]) =>
      isPerformanceToolPlaceholderImageUrl(u),
    );
    expect(phRows).toHaveLength(1);
    expect(phRows[0]![1]).toBe(ph);
  });
});

describe("mergeBrandImageUrlMapsPreferringNonPlaceholder", () => {
  const ph = "https://assets/brands/placeholder/no-image-available.png";
  const sq = "https://cdn/aguila/square.png";

  it("drops placeholder-only keys when all pipe segments appear on a real key (Aguila case)", () => {
    const out = mergeBrandImageUrlMapsPreferringNonPlaceholder(
      {},
      {
        "Aguila 0.0|Aguila Imperial": ph,
        "Aguila 0.0|Aguila|Aguila Imperial|Aguila Light": sq,
      },
    );
    expect(Object.keys(out)).toHaveLength(1);
    expect(Object.values(out)[0]).toBe(sq);
  });

  it("prefers real over placeholder for the same canonical key (brand vs sub)", () => {
    const out = mergeBrandImageUrlMapsPreferringNonPlaceholder(
      { Bud: ph },
      { Bud: sq },
    );
    expect(out[canonicalPerformanceToolBrandAssetMapKey("Bud")]).toBe(sq);
  });
});

describe("polishGlobalAssetMapKeys", () => {
  it("prefers non-placeholder URL when two raw rows collapse to the same canonical key", () => {
    const ph = "https://x/brands/placeholder/no-image-available.png";
    const sq = "https://cdn/brand/square.png";
    const polished = polishGlobalAssetMapKeys(
      { "Bud ": ph, Bud: sq },
      PERFORMANCE_TOOL_ASSET_KEY_JOINER,
    );
    expect(Object.keys(polished)).toHaveLength(1);
    expect(Object.values(polished)[0]).toBe(sq);
  });
});
