/*UAT_[OWR] Value Creation - Growth League - Megabrands Dashboard*/
 
/* =================== REMEMBER     ======================================== */
/* UAT - gold_common.tlh_kpis_agg                                            */
/* PRD - gold_common.tlh_kpis_freeze_agg                                     */
/* =================== REMEMBER     ======================================== */
 
/* =================== CHNAGES     ======================================== */
/* 2025-08-04 -  MARCELO KOMATSU / THOR MARINHO - CHANGE TABLE TO USE TLH_KPIS_AGG (UAT) AND TLH_KPIS_FREEZE_AGG (PRD), AND CHANGE FILTER TO GET THE CORRECT PERIOD FOR EACH KPI */
/* 2025-08-28 -  MARCELO KOMATSU - ADD ORDER BY FINAL QUERY */
 
WITH QRY_PRINCIPAL AS (
  select
    d.*,
    max(d.DT_INI) over (partition by d.level_3, d.version_id) MAX_INI,
    max(d.DT_END) over (partition by d.level_3, d.version_id) MAX_END
  from
    /* gold_common.tlh_kpis_agg*/ {{KPI_TABLE}} d
  where
    1 = 1 /* fixed filters */
    and kpi_name = 'growth_league'
    and level_1 = 'megabrands_cup'
    and version_id = 107
    AND level_4 = 'N/A'
),
/* QUERY PARA BUSCAR RANKING CORRETO DO MÊS */
QRY_RANKING AS (
SELECT distinct
    raw_geography as country_iso_code_3
    , level_2 as country_ranking
FROM QRY_PRINCIPAL
where 1=1
  and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
  and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)  
  AND level_3 = 'volume'
ORDER BY CAST(COUNTRY_RANKING AS INT)
)
/* QUERY FINAL - MEGABRANDS - POWER - PARTICIPATION */
SELECT
 
        raw_geography       as country_iso_code_3,
        dt_end,
        dt_ini,
        b.country_ranking   as country_ranking,
        level_3             as kpi_variation,
        level_1             as cup,
        level_4             as cup_breakdown,
        round(ac, 1)        as score
 
FROM QRY_PRINCIPAL A
INNER JOIN QRY_RANKING B ON A.raw_geography = b.country_iso_code_3
where 1=1
  and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
  and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)  
  and level_3 in ('brand_power', 'participation')
 
UNION ALL
/* QUERY FINAL - MEGABRANDS - OUTROS*/
 
SELECT
    raw_geography as country_iso_code_3,
    dt_end,
    dt_ini,
    level_2 as country_ranking,
    level_3 as kpi_variation,
    level_1 as cup,
    level_4 as cup_breakdown,
    round(ac, 1) as score
FROM
  QRY_PRINCIPAL
where
  1 = 1
  and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)  
  and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
  and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
  and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
  and level_3 not in ('brand_power', 'participation')
ORDER BY CAST(country_ranking AS INT),
        kpi_variation