/*UAT_[OWR] Value Creation - Growth League - KA CUP - LEAGUE A*/

/* ------------------------------  CHANGES --------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------- */

/* QUERY BASE DE TRABALHO */
WITH QRY_BASE AS (
  select d.*
    , max(d.DT_INI) over(partition by d.level_3, d.version_id) MAX_INI
    , max(d.DT_END) over(partition by d.level_3, d.version_id) MAX_END
  from
    /* UAT TABLE */
    /* gold_common.tlh_kpis_agg*/ {{KPI_TABLE}} d
    /* PRD TABLE */
    /*gold_common.tlh_kpis_freeze_agg d */
  where 1=1
  /* fixed filters */
  and kpi_name = 'growth_league'
  and level_1 = 'ka_cup'
  and level_4 = 'league_a'
  and version_id = 107
)

/* QUERY DE RESULTADO */

SELECT
    dt_end                          as dt_end
    , raw_geography                 as country_iso_code_3
    , level_2                       as country_ranking
    , level_3                       as kpi_variation
    , level_1                       as cup
    , level_4                       as cup_breakdown
    , cast(round(ac, 1) as double)  as score
FROM QRY_BASE
where 1=1
  and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
  and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)  
