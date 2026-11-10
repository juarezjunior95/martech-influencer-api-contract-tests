import type { KpiTuple } from "@domain/config/presets/kpis/kpis.types";
export declare const KPI_GROUP_RESOURCE_ALLOCATION_RANKING = "resource_allocation_ranking";
export declare const KPI_GROUP_RESOURCE_ALLOCATION_BUBBLE = "resource_allocation_bubble";
export declare const KPI_GROUP_PERFORMANCE_TOOL = "performance_tool";
export declare const KPI_GROUP_INNOVATION = "innovation";
export declare const KPI_GROUP_INNOVATION_HUB = "innovation_hub";
export declare const KPI_GROUP_AUDIENCE_TARGETING = "audience_targeting";
export declare const KPI_GROUP_POS_TOOL_DRILLDOWN = "pos_tool_drilldown";
export declare function getKpisForGroup(kpiGroup: string): KpiTuple[];
