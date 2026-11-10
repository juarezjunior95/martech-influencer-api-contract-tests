import {
  BigNumberBrandVolume,
  BigNumberDemographic,
} from 'components/BigNumber/types';

import {
  BRAND_VOLUME_EMPTY_STATE_TEXT_COLOR,
  BRAND_VOLUME_UNAVAILABLE_MESSAGE,
} from '../constants';
import { getBrandVolumeColor } from '../constants/brandVolumeColors';
import {
  BrandAudiencesCardData,
  BrandAudiencesTargetingCardModel,
} from '../types';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const normalizeKey = (key: string): string =>
  key.toLowerCase().replace(/[-_\s]/g, '');

const getField = (
  obj: Record<string, unknown> | null | undefined,
  ...candidates: string[]
): unknown => {
  if (!obj) return undefined;
  const normalizedCandidates = new Set(candidates.map(normalizeKey));

  for (const [k, v] of Object.entries(obj)) {
    if (normalizedCandidates.has(normalizeKey(k))) return v;
  }

  return undefined;
};

const toStringArray = (value: unknown): string[] | undefined => {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    const out = value
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      .map((v) => v.trim());
    return out.length ? out : undefined;
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return undefined;
};

const mapDemographics = (
  audience: unknown,
): BigNumberDemographic | undefined => {
  if (!isRecord(audience)) return undefined;

  const gender = toStringArray(getField(audience, 'gender'));
  const age = toStringArray(getField(audience, 'age'));
  const incomeBracket = toStringArray(
    getField(
      audience,
      'incomeBracket',
      'income_bracket',
      'income-bracket',
      'IncomeBracket',
      'INCOME_BRACKET',
    ),
  );

  const out: BigNumberDemographic = {};
  if (gender) out.gender = gender;
  if (age) out.age = age;
  if (incomeBracket) out.incomeBracket = incomeBracket;
  return Object.keys(out).length ? out : undefined;
};

const mapBrandVolumePayload = (
  raw: unknown,
): Partial<BigNumberBrandVolume> | undefined => {
  if (!isRecord(raw)) return undefined;

  const value = getField(raw, 'value', 'Value', 'percentage', 'pct');
  const label = getField(raw, 'label', 'Label');
  const measure = getField(raw, 'measure', 'Measure', 'unit');
  const color = getField(raw, 'color', 'Colour', 'Color');
  let stringValue = '';

  if (typeof value === 'string' || typeof value === 'number') {
    stringValue = String(value);
  }

  return {
    value: stringValue,
    label: typeof label === 'string' ? label : undefined,
    measure: typeof measure === 'string' ? measure : undefined,
    color: typeof color === 'string' ? color : undefined,
  };
};

const resolveAudienceType = (
  row: Record<string, unknown>,
  cardTitle?: string,
): 'core' | 'halo' | undefined => {
  const raw = getField(
    row,
    'audienceType',
    'audience_type',
    'AudienceType',
    'type',
  );
  if (raw === 'core' || raw === 'halo') return raw;
  if (cardTitle === 'Core Audience') return 'core';
  if (cardTitle === 'Halo Audience') return 'halo';
  return undefined;
};

const normalizeCardItem = (row: unknown, cardTitle?: string): unknown => {
  if (!isRecord(row)) return row;

  const audience = mapDemographics(getField(row, 'audience', 'Audience'));
  if (!audience) return row;

  const audienceType = resolveAudienceType(row, cardTitle);
  const bvRaw = getField(row, 'brandVolume', 'brand_volume', 'BrandVolume');

  if (!isRecord(bvRaw)) {
    return {
      ...row,
      audience,
      audienceType,
    };
  }

  const bv = mapBrandVolumePayload(bvRaw);
  const valueStr = String(bv?.value ?? '');

  if (valueStr.trim() === '') {
    return {
      ...row,
      audience,
      audienceType,
      brandVolume: {
        value: '',
        color: BRAND_VOLUME_EMPTY_STATE_TEXT_COLOR,
        label: '',
        emptyStateMessage: BRAND_VOLUME_UNAVAILABLE_MESSAGE,
      },
    };
  }

  const isCore = audienceType === 'core' || cardTitle === 'Core Audience';

  return {
    ...row,
    audience,
    audienceType,
    brandVolume: {
      value: valueStr,
      color:
        bv?.color != null && String(bv.color).trim() !== ''
          ? String(bv.color)
          : getBrandVolumeColor(valueStr, isCore),
      label: bv?.label ?? 'of Brand Volume',
      measure: bv?.measure,
    },
  };
};

export const canonicalAudienceCardTitle = (title: string): string => {
  const trimmed = title.trim();
  if (/^core\s*audience$/i.test(trimmed)) return 'Core Audience';
  if (/^halo\s*audience$/i.test(trimmed)) return 'Halo Audience';
  return trimmed;
};

const normalizeCardModel = (
  card: BrandAudiencesTargetingCardModel,
): BrandAudiencesTargetingCardModel => {
  const title = String(card.header?.title ?? '');
  const normalizedTitle = canonicalAudienceCardTitle(title);

  const rows = Array.isArray(card.data) ? card.data : [];
  const data = rows.map((row) =>
    normalizeCardItem(row, normalizedTitle),
  ) as BrandAudiencesCardData;

  return {
    ...card,
    header: {
      ...card.header,
      title: normalizedTitle,
    },
    data,
  };
};

export const normalizeDefinitionBrandAudienceCards = (
  cards: BrandAudiencesTargetingCardModel[],
): BrandAudiencesTargetingCardModel[] => cards.map(normalizeCardModel);

export const extractBrandAudienceCardsFromBff = (
  bffData: unknown,
): BrandAudiencesTargetingCardModel[] => {
  if (!isRecord(bffData)) return [];

  const audienceCards = bffData['audience-cards'];
  if (isRecord(audienceCards) && Array.isArray(audienceCards['card'])) {
    return audienceCards['card'] as BrandAudiencesTargetingCardModel[];
  }

  const DEFINITION_BRAND_AUDIENCE_KEY =
    'consumer_audience-targeting_definition_brand-audience';
  const byKey = bffData[DEFINITION_BRAND_AUDIENCE_KEY];
  if (Array.isArray(byKey)) {
    return byKey as BrandAudiencesTargetingCardModel[];
  }

  const directMatch = findAudienceCardsInObjectValues(bffData);
  if (directMatch) {
    return directMatch;
  }

  const nestedMatch = findAudienceCardsInNestedObjects(bffData);
  if (nestedMatch) {
    return nestedMatch;
  }

  return [];
};

const findAudienceCardsInObjectValues = (
  bffData: Record<string, unknown>,
): BrandAudiencesTargetingCardModel[] | undefined => {
  for (const value of Object.values(bffData)) {
    if (Array.isArray(value) && value.length > 0 && isRecord(value[0])) {
      const first = value[0];
      if (isRecord(first['header']) && Array.isArray(first['data'])) {
        return value as BrandAudiencesTargetingCardModel[];
      }
    }
  }

  return undefined;
};

const findAudienceCardsInNestedObjects = (
  bffData: Record<string, unknown>,
): BrandAudiencesTargetingCardModel[] | undefined => {
  for (const value of Object.values(bffData)) {
    if (!isRecord(value)) {
      continue;
    }

    for (const nested of Object.values(value)) {
      if (Array.isArray(nested) && nested.length > 0 && isRecord(nested[0])) {
        const first = nested[0];
        if (isRecord(first['header']) && Array.isArray(first['data'])) {
          return nested as BrandAudiencesTargetingCardModel[];
        }
      }
    }
  }

  return undefined;
};
