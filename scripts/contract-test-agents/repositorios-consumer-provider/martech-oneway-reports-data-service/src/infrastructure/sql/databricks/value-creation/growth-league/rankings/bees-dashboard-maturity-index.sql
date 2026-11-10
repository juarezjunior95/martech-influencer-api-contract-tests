/*UAT_[OWR] Value Creation - Growth League - Bees Cup - Maturity Index*/
WITH CTE_DATES AS (
  select d.*
    , max(d.DT_INI) over(partition by d.level_3, d.version_id) MAX_INI
    , max(d.DT_END) over(partition by d.level_3, d.version_id) MAX_END
  from 
    /* UAT TABLE - uncomment/comment to use it or to not use it */
    /* gold_common.tlh_kpis_agg*/ {{KPI_TABLE}} d  
    /* PRD TABLE - uncomment/comment to use it or to not use it */
    /* gold_common.tlh_kpis_freeze_agg d */
  where 1=1
  /* fixed filters */
  and kpi_name = 'growth_league'
  and level_1 = 'bees_cup'
  and version_id = 107
  AND level_4 = 'maturity_index'
)
SELECT 
  raw_geography as country_iso_code_3
  , dt_end
  , level_2 as country_ranking
  , level_3 as kpi_variation
  , level_1 as cup
  , level_4 as cup_breakdown
  , ac as score
FROM CTE_DATES
where 1=1
  and year(MAX_INI) = year(DT_INI)
  and year(MAX_END) = year(DT_END)
  and month(MAX_INI) = month(DT_INI)
  and month(MAX_END) = month(DT_END)
ORDER BY kpi_variation, CAST(country_ranking AS INT)
/* DEPRECATED FILTER - LEGACY
  and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
  and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
DEPRECATED FILTER - LEGACY */