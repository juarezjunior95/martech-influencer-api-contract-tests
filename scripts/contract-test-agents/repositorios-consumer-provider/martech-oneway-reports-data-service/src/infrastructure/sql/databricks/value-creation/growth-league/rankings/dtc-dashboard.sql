/*UAT_[OWR] Value Creation - Growth League - DTC Cup - Tier 1*/

/* 2025-08-04 -  MARCELO KOMATSU / THOR MARINHO - CHANGE TABLE TO USE TLH_KPIS_AGG (UAT) AND TLH_KPIS_FREEZE_AGG (PRD) */
/* 2026-03-19 -  VICTOR MOTTA -  REMOVE FILTER level_4 = 'tier_1' AT CTE_DATES */
WITH CTE_DATES AS (
  SELECT
    d.*,
    max(d.DT_INI) OVER (PARTITION BY d.level_3, d.version_id) MAX_INI,
    max(d.DT_END) OVER (PARTITION BY d.level_3, d.version_id) MAX_END
  from
    /* UAT TABLE */
    {{KPI_TABLE}} d
    /* PRD TABLE */
    /*gold_common.tlh_kpis_freeze_agg d */
  WHERE
    1 = 1
    AND kpi_name = 'growth_league'
    AND level_1 = 'dtc_cup'
    AND version_id = 107
)
SELECT
  raw_geography,
  dt_end,
  level_2 AS country_ranking,
  level_3 AS kpi_variation,
  level_1 AS cup,
  level_4 AS cup_breakdown,
  ac AS score
FROM
  CTE_DATES
WHERE
  1 = 1
  AND year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
  AND year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  AND month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  AND month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
ORDER BY
  level_2 ASC;

