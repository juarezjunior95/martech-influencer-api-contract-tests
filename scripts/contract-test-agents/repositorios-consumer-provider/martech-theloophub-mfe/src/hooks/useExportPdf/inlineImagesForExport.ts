const CSS_URL_REGEX = /url\((['"]?)(.*?)\1\)/g;

const resolvedImageCache = new Map<string, string>();
const inFlightImageFetches = new Map<string, Promise<string | null>>();

export type InlineImagesOptions = {
  skipPseudoElements?: boolean;
  imageDataFormat?: 'image/png' | 'image/jpeg';
  jpegQuality?: number;
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const isInlineableImageSrc = (src: string): boolean =>
  Boolean(src) && !src.startsWith('data:') && !src.startsWith('blob:');

const withExportCacheBust = (url: string, token: string): string => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('_pdfExport', token);
    return parsed.href;
  } catch {
    return url;
  }
};

const extractUrlsFromCssValue = (value: string): string[] => {
  if (!value || value === 'none') return [];

  const urls: string[] = [];
  const regex = new RegExp(CSS_URL_REGEX.source, 'g');
  let match = regex.exec(value);

  while (match) {
    const url = match[2].trim();
    if (isInlineableImageSrc(url)) urls.push(url);
    match = regex.exec(value);
  }

  return urls;
};

const replaceUrlsInCssValue = (
  value: string,
  urlMap: Map<string, string>,
): string =>
  value.replace(CSS_URL_REGEX, (full, _quote, url) => {
    const trimmed = url.trim();
    const replacement = urlMap.get(trimmed);
    return replacement ? `url("${replacement}")` : full;
  });

const loadImageAsDataUrl = (
  src: string,
  cacheBustToken: string,
  imageDataFormat: 'image/png' | 'image/jpeg' = 'image/png',
  jpegQuality = 0.85,
): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const context = canvas.getContext('2d');

        if (!context) {
          resolve(null);
          return;
        }

        context.drawImage(img, 0, 0);
        const quality =
          imageDataFormat === 'image/jpeg' ? jpegQuality : undefined;
        resolve(canvas.toDataURL(imageDataFormat, quality));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = withExportCacheBust(src, cacheBustToken);
  });

const fetchAsDataUrl = async (
  src: string,
  cacheBustToken: string,
  imageDataFormat: 'image/png' | 'image/jpeg' = 'image/png',
  jpegQuality = 0.85,
): Promise<string | null> => {
  if (!isInlineableImageSrc(src)) return null;

  const cached = resolvedImageCache.get(src);
  if (cached) return cached;

  const inFlight = inFlightImageFetches.get(src);
  if (inFlight !== undefined) return await inFlight;

  const fetchPromise = (async () => {
    try {
      const response = await fetch(withExportCacheBust(src, cacheBustToken), {
        mode: 'cors',
        credentials: 'omit',
        cache: 'force-cache',
      });
      if (response.ok) {
        const dataUrl = await blobToDataUrl(await response.blob());
        resolvedImageCache.set(src, dataUrl);
        return dataUrl;
      }
    } catch (error) {
      console.warn('[PDF Export] Could not fetch image:', src, error);
    }

    const fallback = await loadImageAsDataUrl(
      src,
      cacheBustToken,
      imageDataFormat,
      jpegQuality,
    );
    if (fallback) {
      resolvedImageCache.set(src, fallback);
    }
    return fallback;
  })().finally(() => {
    inFlightImageFetches.delete(src);
  });

  inFlightImageFetches.set(src, fetchPromise);
  return fetchPromise;
};

const buildUrlMap = async (
  urls: Iterable<string>,
  cacheBustToken: string,
  imageDataFormat: 'image/png' | 'image/jpeg' = 'image/png',
  jpegQuality = 0.85,
): Promise<Map<string, string>> => {
  const uniqueUrls = [...new Set(urls)];
  const entries = await Promise.all(
    uniqueUrls.map(async (url) => {
      const dataUrl = await fetchAsDataUrl(
        url,
        cacheBustToken,
        imageDataFormat,
        jpegQuality,
      );
      return dataUrl ? ([url, dataUrl] as const) : null;
    }),
  );

  return new Map(
    entries.filter((entry): entry is [string, string] => entry !== null),
  );
};

const lookupDataUrl = (
  urlMap: Map<string, string>,
  img: HTMLImageElement,
): string | undefined => {
  const candidates = [img.currentSrc, img.src, img.getAttribute('src') ?? ''];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const dataUrl = urlMap.get(candidate);
    if (dataUrl) return dataUrl;
  }

  return undefined;
};

const waitForImg = (img: HTMLImageElement, timeoutMs = 3000) =>
  new Promise<void>((resolve) => {
    if (img.complete) {
      resolve();
      return;
    }

    const timer = globalThis.setTimeout(resolve, timeoutMs);
    const finish = () => {
      globalThis.clearTimeout(timer);
      resolve();
    };

    img.addEventListener('load', finish, { once: true });
    img.addEventListener('error', finish, { once: true });
  });

type PseudoStyleTarget = {
  el: HTMLElement;
  pseudo: '::before' | '::after';
  property: 'background-image' | 'content';
  value: string;
};

const collectUrlsFromElementTree = (
  root: HTMLElement,
  skipPseudoElements = false,
) => {
  const urlsToInline = new Set<string>();
  const elements = [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>('*')),
  ];
  const pseudoTargets: PseudoStyleTarget[] = [];

  elements.forEach((el) => {
    if (el.tagName === 'IMG') {
      const img = el as HTMLImageElement;
      const src = img.currentSrc || img.src;
      if (isInlineableImageSrc(src)) urlsToInline.add(src);
    }

    [el.style.backgroundImage, el.style.background].forEach((value) => {
      extractUrlsFromCssValue(value).forEach((url) => urlsToInline.add(url));
    });

    const computed = globalThis.getComputedStyle(el);
    extractUrlsFromCssValue(computed.backgroundImage).forEach((url) =>
      urlsToInline.add(url),
    );

    if (skipPseudoElements) return;

    (['::before', '::after'] as const).forEach((pseudo) => {
      const pseudoStyle = globalThis.getComputedStyle(el, pseudo);

      if (
        pseudoStyle.backgroundImage &&
        pseudoStyle.backgroundImage !== 'none'
      ) {
        const urls = extractUrlsFromCssValue(pseudoStyle.backgroundImage);
        if (urls.length > 0) {
          urls.forEach((url) => urlsToInline.add(url));
          pseudoTargets.push({
            el,
            pseudo,
            property: 'background-image',
            value: pseudoStyle.backgroundImage,
          });
        }
      }

      if (pseudoStyle.content?.includes('url(')) {
        const urls = extractUrlsFromCssValue(pseudoStyle.content);
        if (urls.length > 0) {
          urls.forEach((url) => urlsToInline.add(url));
          pseudoTargets.push({
            el,
            pseudo,
            property: 'content',
            value: pseudoStyle.content,
          });
        }
      }
    });
  });

  return { elements, urlsToInline, pseudoTargets };
};

/**
 * Replaces cross-origin image sources in <img> tags and CSS background images
 * with data URLs so html2canvas can paint them when allowTaint is false.
 */
export const inlineImagesForExport = async (
  element: HTMLElement,
  options: InlineImagesOptions = {},
): Promise<() => void> => {
  const {
    skipPseudoElements = false,
    imageDataFormat = 'image/png',
    jpegQuality = 0.85,
  } = options;

  const { elements, urlsToInline, pseudoTargets } = collectUrlsFromElementTree(
    element,
    skipPseudoElements,
  );
  const cacheBustToken = String(Date.now());
  const urlMap = await buildUrlMap(
    urlsToInline,
    cacheBustToken,
    imageDataFormat,
    jpegQuality,
  );
  const restorations: Array<() => void> = [];

  await Promise.all(
    elements.map(async (el) => {
      if (el.tagName === 'IMG') {
        const img = el as HTMLImageElement;
        const src = img.currentSrc || img.src;
        if (!isInlineableImageSrc(src)) return;

        let dataUrl = lookupDataUrl(urlMap, img);
        if (!dataUrl) {
          dataUrl =
            (await fetchAsDataUrl(
              src,
              cacheBustToken,
              imageDataFormat,
              jpegQuality,
            )) ?? undefined;
        }

        const originalSrc = img.src;
        const originalSrcset = img.srcset;
        const originalCrossOrigin = img.crossOrigin;

        if (dataUrl) {
          img.crossOrigin = 'anonymous';
          img.src = dataUrl;
          img.removeAttribute('srcset');
          await img.decode?.().catch(() => undefined);
        } else {
          img.crossOrigin = 'anonymous';
          img.src = withExportCacheBust(src, cacheBustToken);
          await waitForImg(img);
        }

        restorations.push(() => {
          img.src = originalSrc;
          img.crossOrigin = originalCrossOrigin;
          if (originalSrcset) {
            img.srcset = originalSrcset;
          } else {
            img.removeAttribute('srcset');
          }
        });
        return;
      }

      const computedBackgroundImage =
        globalThis.getComputedStyle(el).backgroundImage;
      const nextBackgroundImage = replaceUrlsInCssValue(
        computedBackgroundImage,
        urlMap,
      );

      if (
        computedBackgroundImage &&
        computedBackgroundImage !== 'none' &&
        nextBackgroundImage !== computedBackgroundImage
      ) {
        const originalBackgroundImage = el.style.backgroundImage;
        const originalBackground = el.style.background;

        el.style.backgroundImage = nextBackgroundImage;

        restorations.push(() => {
          el.style.backgroundImage = originalBackgroundImage;
          el.style.background = originalBackground;
        });
      }
    }),
  );

  if (pseudoTargets.length > 0 && urlMap.size > 0) {
    const styleEl = document.createElement('style');
    styleEl.dataset.exportInlineStyles = 'true';
    let styleRules = '';
    let pseudoIndex = 0;

    pseudoTargets.forEach((target) => {
      const nextValue = replaceUrlsInCssValue(target.value, urlMap);
      if (nextValue === target.value) return;

      const className = `export-pseudo-${pseudoIndex}`;
      pseudoIndex += 1;
      target.el.classList.add(className);
      styleRules += `.${className}${target.pseudo} { ${target.property}: ${nextValue} !important; }\n`;

      restorations.push(() => {
        target.el.classList.remove(className);
      });
    });

    if (styleRules) {
      styleEl.textContent = styleRules;
      document.head.appendChild(styleEl);
      restorations.push(() => {
        styleEl.remove();
      });
    } else {
      styleEl.remove();
    }
  }

  return () => {
    const restorationsInReverseOrder = [...restorations].reverse();
    restorationsInReverseOrder.forEach((restore) => restore());
  };
};
