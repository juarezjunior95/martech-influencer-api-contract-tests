import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

const COUNTRY_SUFFIX_PATTERN = / [A-Z]{3}$/;
const PLAIN_TEXT_WATERFALL_FILTERS = new Set([
  "beer_price_segment",
  "portfolio",
]);

const stripCountrySuffix = (value: string): string =>
  COUNTRY_SUFFIX_PATTERN.test(value) ? value.slice(0, -4) : value;

class MarketShareWaterfallTableHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data) {
      return [];
    }

    const total = defaultDataset.data.length;

    return defaultDataset.data.map((item, index) =>
      this.normalizeRow(item, index, total),
    );
  }

  private normalizeRow(item: DataItem, index: number, total: number): DataItem {
    const row = { ...item };
    const isTotal = index === 0 || index === total - 1;

    this.applyCountrySuffixStrip(row, "raw_brand", "RAW_BRAND");
    this.applyCountrySuffixStrip(row, "labels", "LABELS");

    if (row.filter_zone === "EUR" && row.filter_waterfall_filter === "brand") {
      row.filter_waterfall_filter = "brand_eur";
    }

    const filterType = String(row.filter_waterfall_filter ?? "");
    const rawBrand = this.resolveBrandKey(row, filterType, isTotal);
    const countryIso = this.resolveSummaryCountryIso(
      row,
      String(row.country_iso_code_3 ?? ""),
      isTotal,
    );

    if (filterType === "sub_brand" && !isTotal && rawBrand) {
      row.raw_brand = rawBrand;
    }

    row.image_value = this.resolveImage(row, rawBrand, countryIso, isTotal);
    row.badge_value = this.resolveBadge(row, countryIso, isTotal);

    return row;
  }

  private resolveBrandKey(
    row: DataItem,
    filterType: string,
    isTotal: boolean,
  ): string {
    const rawBrand = String(row.raw_brand ?? row.RAW_BRAND ?? "");

    if (rawBrand || filterType !== "sub_brand" || isTotal) {
      return rawBrand;
    }

    return String(row.labels ?? row.LABELS ?? "");
  }

  private isPeriodLabel(label: string, periodType: string): boolean {
    if (!label || !periodType) {
      return false;
    }

    const normalizedPeriodType = periodType.toUpperCase();
    const normalizedLabel = label.toUpperCase();

    return (
      normalizedLabel.startsWith(normalizedPeriodType) &&
      label.charAt(normalizedPeriodType.length) === "'"
    );
  }

  private isSummaryRow(row: DataItem, isTotal: boolean): boolean {
    if (isTotal) {
      return true;
    }

    const periodType = String(row.filter_period_type ?? "");
    const label = String(row.labels ?? row.LABELS ?? "");

    return periodType !== "" && this.isPeriodLabel(label, periodType);
  }

  private resolveSummaryCountryIso(
    row: DataItem,
    countryIso: string,
    isTotal: boolean,
  ): string {
    if (
      this.isSummaryRow(row, isTotal) &&
      (row.filter_country === "ABI" || row.filter_country === "All")
    ) {
      return "ABI";
    }

    return countryIso;
  }

  private resolveImage(
    item: DataItem,
    rawBrand: string,
    countryIso: string,
    isTotal: boolean,
  ): string {
    const filterType = String(item.filter_waterfall_filter ?? "");
    const brandFamily = String(item.filter_brand ?? "");
    const isSummaryRow = this.isSummaryRow(item, isTotal);

    if (PLAIN_TEXT_WATERFALL_FILTERS.has(filterType) && !isSummaryRow) {
      return "";
    }

    if (isSummaryRow && countryIso) {
      return getCountryFlag(countryIso);
    }

    if (rawBrand) {
      return getBrandImage(rawBrand, {
        format: "square",
        brand_family: brandFamily !== "All" ? brandFamily : undefined,
      });
    }

    if (countryIso) {
      return getCountryFlag(countryIso);
    }

    return "";
  }

  private resolveBadge(
    item: DataItem,
    countryIso: string,
    isTotal: boolean,
  ): string {
    const filterType = String(item.filter_waterfall_filter ?? "");

    if (isTotal || filterType === "country") {
      return "";
    }

    if (
      countryIso !== "Others" &&
      countryIso !== "" &&
      (item.filter_country === "ABI" || item.filter_country === "All") &&
      (filterType === "brand" || filterType === "brand_eur")
    ) {
      return getCountryFlag(countryIso);
    }

    return "";
  }

  private applyCountrySuffixStrip(
    row: DataItem,
    lowercaseKey: string,
    uppercaseKey: string,
  ): void {
    const value = row[lowercaseKey] ?? row[uppercaseKey];

    if (typeof value !== "string") {
      return;
    }

    const strippedValue = stripCountrySuffix(value);
    row[lowercaseKey] = strippedValue;
    row[uppercaseKey] = strippedValue;
  }
}

export const marketShareWaterfallTableHandler =
  new MarketShareWaterfallTableHandler();
