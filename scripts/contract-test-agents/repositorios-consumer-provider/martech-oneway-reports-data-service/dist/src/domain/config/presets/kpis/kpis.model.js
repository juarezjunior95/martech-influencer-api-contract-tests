"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPI_GROUP_POS_TOOL_DRILLDOWN = exports.KPI_GROUP_AUDIENCE_TARGETING = exports.KPI_GROUP_INNOVATION_HUB = exports.KPI_GROUP_INNOVATION = exports.KPI_GROUP_PERFORMANCE_TOOL = exports.KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE = exports.KPI_GROUP_RESOURCE_ALLOCATION_RANKING = void 0;
exports.getKpisForGroup = getKpisForGroup;
exports.KPI_GROUP_RESOURCE_ALLOCATION_RANKING = "resource_allocation_ranking";
exports.KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE = "resource_allocation_bubble";
exports.KPI_GROUP_PERFORMANCE_TOOL = "performance_tool";
exports.KPI_GROUP_INNOVATION = "innovation";
exports.KPI_GROUP_INNOVATION_HUB = "innovation_hub";
exports.KPI_GROUP_AUDIENCE_TARGETING = "audience_targeting";
exports.KPI_GROUP_POS_TOOL_DRILLDOWN = "pos_tool_drilldown";
const row = (value, label, opts) => ({
    value,
    label,
    full: "",
    ...(opts?.isDisabled === true ? { isDisabled: true } : {}),
});
function getResourceAllocationRankingKpis() {
    return [
        row("media_spend", "Media Spend"),
        row("megabrands", "Megabrands QWOA"),
        row("campaigns", "Campaigns QWOA"),
        row("resource_allocation", "Non-Working Money"),
    ];
}
function getResourceAllocationBubbleKpis() {
    return [
        row("media_qwoa", "Media QWOA"),
        row("campaign_qwoa", "Campaign QWOA"),
        row("non_working_money", "Non-Working Money"),
    ];
}
function getPerformanceToolKpis() {
    return [
        row("volume", "Volume"),
        row("nr", "Net Revenue"),
        row("cores", "CORES"),
        row("market_share", "Market Share"),
        row("power", "Brand Power"),
    ];
}
function getInnovationKpis() {
    return [
        row("volume", "Volume"),
        row("nr", "Net Revenue"),
        row("maco", "MACO"),
    ];
}
function getInnovationHubKpis() {
    return [
        row("volume", "Volume"),
        row("nr", "Net Revenue"),
        row("maco", "MACO"),
        row("maco_margin", "MACO Margin", { isDisabled: true }),
    ];
}
function getAudienceTargetingKpis() {
    return [
        row("p4w", "Participation"),
        row("occasions", "Occasions"),
        row("power", "Brand Power"),
    ];
}
function getPosToolDrilldownKpis() {
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
function getKpisForGroup(kpiGroup) {
    const key = kpiGroup.trim().toLowerCase();
    switch (key) {
        case exports.KPI_GROUP_RESOURCE_ALLOCATION_RANKING:
            return getResourceAllocationRankingKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE:
            return getResourceAllocationBubbleKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_PERFORMANCE_TOOL:
            return getPerformanceToolKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_INNOVATION:
            return getInnovationKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_INNOVATION_HUB:
            return getInnovationHubKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_AUDIENCE_TARGETING:
            return getAudienceTargetingKpis().map((r) => ({ ...r }));
        case exports.KPI_GROUP_POS_TOOL_DRILLDOWN:
            return getPosToolDrilldownKpis().map((r) => ({ ...r }));
        default:
            return [];
    }
}
//# sourceMappingURL=kpis.model.js.map