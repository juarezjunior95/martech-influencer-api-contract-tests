import type { KpiTuple } from "@domain/config/presets/kpis/kpis.types";

/** Drupal `Kpi::KPI_GROUP_RESOURCE_ALLOCATION_RANKING` */
export const KPI_GROUP_RESOURCE_ALLOCATION_RANKING =
  "resource_allocation_ranking";

/** Drupal `Kpi::KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE` */
export const KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE =
  "resource_allocation_bubble";

/** Drupal `Kpi::KPI_GROUP_PERFORMANCE_TOOL` */
export const KPI_GROUP_PERFORMANCE_TOOL = "performance_tool";

/** Drupal `Kpi::KPI_GROUP_INNOVATION` */
export const KPI_GROUP_INNOVATION = "innovation";

/**
 * Innovation Hub — all four innovation KPI options; MACO Margin is returned with
 * `isDisabled: true` until product re-enables it.
 */
export const KPI_GROUP_INNOVATION_HUB = "innovation_hub";

/** Drupal `Kpi::KPI_GROUP_AUDIENCE_TARGETING` */
export const KPI_GROUP_AUDIENCE_TARGETING = "audience_targeting";

/** POS Tool Drilldown fixed KPI options. */
export const KPI_GROUP_POS_TOOL_DRILLDOWN = "pos_tool_drilldown";

const row = (
  value: string,
  label: string,
  opts?: { isDisabled?: boolean },
): KpiTuple => ({
  value,
  label,
  full: "",
  ...(opts?.isDisabled === true ? { isDisabled: true as const } : {}),
});

function getResourceAllocationRankingKpis(): KpiTuple[] {
  return [
    row("media_spend", "Media Spend"),
    row("megabrands", "Megabrands QWOA"),
    row("campaigns", "Campaigns QWOA"),
    row("resource_allocation", "Non-Working Money"),
  ];
}

function getResourceAllocationBubbleKpis(): KpiTuple[] {
  return [
    row("media_qwoa", "Media QWOA"),
    row("campaign_qwoa", "Campaign QWOA"),
    row("non_working_money", "Non-Working Money"),
  ];
}

function getPerformanceToolKpis(): KpiTuple[] {
  return [
    row("volume", "Volume"),
    row("nr", "Net Revenue"),
    row("cores", "CORES"),
    row("market_share", "Market Share"),
    row("power", "Brand Power"),
  ];
}

function getInnovationKpis(): KpiTuple[] {
  return [
    row("volume", "Volume"),
    row("nr", "Net Revenue"),
    row("maco", "MACO"),
  ];
}

function getInnovationHubKpis(): KpiTuple[] {
  return [
    row("volume", "Volume"),
    row("nr", "Net Revenue"),
    row("maco", "MACO"),
    row("maco_margin", "MACO Margin", { isDisabled: true }),
  ];
}

function getAudienceTargetingKpis(): KpiTuple[] {
  return [
    row("p4w", "Participation"),
    row("occasions", "Occasions"),
    row("power", "Brand Power"),
  ];
}

function getPosToolDrilldownKpis(): KpiTuple[] {
  return [
    {
      value: "p4w",
      label: "Participation P4W",
      full: "Participation P4W",
    },
    {
      value: "p7d",
      label: "Participation P7D",
      full: "Participation P7D",
    },
    {
      value: "occasions",
      label: "Occasions P7D/P4W",
      full: "Occasions P7D/P4W",
    },
    {
      value: "servings",
      label: "Servings Total",
      full: "Servings Total",
    },
  ];
}

/**
 * KPI rows for a single legacy group id (`Kpi::getKpisForKey`).
 * Unknown groups yield an empty list, matching Drupal `default: return []`.
 */
export function getKpisForGroup(kpiGroup: string): KpiTuple[] {
  const key = kpiGroup.trim().toLowerCase();
  switch (key) {
    case KPI_GROUP_RESOURCE_ALLOCATION_RANKING:
      return getResourceAllocationRankingKpis().map((r) => ({ ...r }));
    case KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE:
      return getResourceAllocationBubbleKpis().map((r) => ({ ...r }));
    case KPI_GROUP_PERFORMANCE_TOOL:
      return getPerformanceToolKpis().map((r) => ({ ...r }));
    case KPI_GROUP_INNOVATION:
      return getInnovationKpis().map((r) => ({ ...r }));
    case KPI_GROUP_INNOVATION_HUB:
      return getInnovationHubKpis().map((r) => ({ ...r }));
    case KPI_GROUP_AUDIENCE_TARGETING:
      return getAudienceTargetingKpis().map((r) => ({ ...r }));
    case KPI_GROUP_POS_TOOL_DRILLDOWN:
      return getPosToolDrilldownKpis().map((r) => ({ ...r }));
    default:
      return [];
  }
}
