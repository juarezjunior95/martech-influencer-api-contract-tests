/*--------------------------------------------------------------------------------------------------------------- */
/* ENV_BAR CHART_PERFORMANCE_TOOL_MARKET_SHARE                                                                    */
/*--------------------------------------------------------------------------------------------------------------- */
/*------------------------------------ Changes ------------------------------------------------------------------ */
/* ALISSON KARSCHER - 2026-03-27 - TASK 9700                                                                      */
/* MARCELO KOMATSU - 2026-03-30 - EUROPA FILTER WAS NOT RUNNING                                                   */
/* LEANDRO FIGUEIREDO - 2026-04-13 - VERSION_ID ADJUSTMENT                                                        */
/* ANNA GOUVEA - 2026-24-04 - VERSION_ID ADJUSTMENT FOR L3M                                                       */
/*------------------------------------ Changes ------------------------------------------------------------------ */
WITH input_params AS (
  SELECT
    CAST(:dt_end AS DATE) AS param_dt_end,
    :country              AS country,
    :brand                AS brand,
    :sub_brand            AS sub_brand,
    :zone                 AS zone
),

version_logic AS (
   SELECT
    CASE
      /*LOF: Global vision*/
      WHEN COALESCE(TRIM(LOWER(country)), '') IN('', 'abi', 'all') 
        AND COALESCE(TRIM(LOWER(brand)), '') IN('', 'all') 
        AND COALESCE(TRIM(LOWER(sub_brand)), '') IN('', 'all') 
        AND COALESCE(TRIM(LOWER(zone)), '') IN('', 'abi', 'all') THEN 2
      WHEN COALESCE(TRIM(LOWER(country)), '') IN('', 'abi', 'all') AND zone = 'EUR' THEN 212 /*LOF: Europe as a country*/
      WHEN COALESCE(TRIM(LOWER(country)), '') NOT IN('', 'abi', 'all') THEN
        CASE 
          WHEN COALESCE(TRIM(LOWER(brand)), '') IN('', 'all') AND COALESCE(TRIM(LOWER(sub_brand)), '') IN('', 'all') THEN 1 /*LOF: Any country from the country scope*/
          WHEN COALESCE(TRIM(LOWER(brand)), '') NOT IN('', 'all') AND COALESCE(TRIM(LOWER(sub_brand)), '') IN('', 'all') THEN 215 /*LOF: Any country with a brand*/
          WHEN COALESCE(TRIM(LOWER(brand)), '') NOT IN('', 'all') AND COALESCE(TRIM(LOWER(sub_brand)), '') NOT IN('', 'all') THEN 209 /*Anna Gouvea: Any country with a sub brand inluding L3M*/
        END
    END target_version_id, 
    param_dt_end,          
    CASE
      WHEN LOWER(TRIM(country)) = 'abi' AND LOWER(TRIM(zone)) = 'eur' THEN 'EUR'
      ELSE country
    END AS country,
    brand,
    sub_brand,
    zone
  FROM input_params
)
-- ==================== DATE RANGES: ano atual + ano anterior ====================
,date_ranges AS (
  -- Ano atual
  SELECT
    target_version_id, param_dt_end, country, brand, sub_brand, zone,
    param_dt_end AS dt_end_filter,
    ADD_MONTHS(DATE_TRUNC('MONTH', param_dt_end), -12) as dt_end_filter_ly,
    CAST(CASE :period_type
      WHEN 'MTD' THEN DATE_TRUNC('MONTH', ADD_MONTHS(DATE_TRUNC('MONTH', param_dt_end), -12))
      WHEN 'L3M' THEN ADD_MONTHS(DATE_TRUNC('MONTH', ADD_MONTHS(DATE_TRUNC('MONTH', param_dt_end), -12)), -2)
      WHEN 'YTD' THEN DATE_TRUNC('YEAR', ADD_MONTHS(DATE_TRUNC('MONTH', param_dt_end), -12))
    END AS DATE) AS dt_ini_filter_ly,   
    CAST(CASE :period_type
      WHEN 'MTD' THEN DATE_TRUNC('MONTH', param_dt_end)
      WHEN 'L3M' THEN ADD_MONTHS(DATE_TRUNC('MONTH', param_dt_end), -2)
      WHEN 'YTD' THEN DATE_TRUNC('YEAR', param_dt_end)
    END AS DATE) AS dt_ini_filter
  FROM version_logic
),
base_bar_chart AS (
  SELECT
    kpi.*,
    dr.target_version_id AS dr_version_id,
    dr.param_dt_end,      
    dr.country  AS dr_country,
    dr.brand    AS dr_brand,
    dr.sub_brand AS dr_sub_brand,
    kpi.ly,
    dr.dt_ini_filter
  FROM 
    {{KPI_TABLE}} kpi
  INNER JOIN  
    date_ranges dr
  ON 
      kpi.version_id = dr.target_version_id
    AND 
      kpi.dt_end     = dr.dt_end_filter
    AND 
      kpi.kpi_name   = 'market_share'
  WHERE 
      dr.target_version_id IS NOT NULL
    AND CASE /*LOF: Zone filter*/
        WHEN dr.zone != 'ABI' THEN kpi.abi_zone = dr.zone
        ELSE TRUE
    END
    AND CASE /*LOF: Country filter*/
        WHEN dr.target_version_id IN(1, 209, 212, 215) THEN kpi.country_iso_code_3 = dr.country
        ELSE TRUE
    END
    AND CASE /*LOF: Brand filter*/
        WHEN dr.brand != 'All' THEN kpi.raw_brand = dr.brand
        ELSE TRUE
    END
    AND CASE /*LOF: Sub brand filter*/
        WHEN dr.sub_brand != 'All' THEN kpi.level_3 = dr.sub_brand
        ELSE TRUE
    END
),

base_ly AS (
  SELECT
    kpi.*,
    dr.target_version_id AS dr_version_id,
    dr.dt_end_filter_ly,
    dr.dt_ini_filter_ly,      
    dr.country  AS dr_country,
    dr.brand    AS dr_brand,
    dr.sub_brand AS dr_sub_brand,
    kpi.ly
  FROM 
    {{KPI_TABLE}} kpi
  INNER JOIN 
    date_ranges dr
  ON 
      kpi.version_id = dr.target_version_id
    AND 
      kpi.dt_end     = dr.dt_end_filter_ly
    AND 
      kpi.kpi_name   = 'market_share'
  WHERE 
      dr.target_version_id IS NOT NULL
    AND CASE /*LOF: Zone filter*/
        WHEN dr.zone != 'ABI' THEN kpi.abi_zone = dr.zone
        ELSE TRUE
    END
    AND CASE /*LOF: Country filter*/
        WHEN dr.target_version_id IN(1, 209, 212, 215) THEN kpi.country_iso_code_3 = dr.country
        ELSE TRUE
    END
    AND CASE /*LOF: Brand filter*/
        WHEN dr.brand != 'All' THEN kpi.raw_brand = dr.brand
        ELSE TRUE
    END
    AND CASE /*LOF: Sub brand filter*/
        WHEN dr.sub_brand != 'All' THEN kpi.level_3 = dr.sub_brand
        ELSE TRUE
    END
)

SELECT
  CONCAT(
      :period_type,"'", RIGHT(YEAR(dt_end), 2))  AS period,
  ac_vs_ly as ac_vs_ly,
  ac as ac
FROM 
  base_ly
WHERE
  dt_ini = dt_ini_filter_ly

UNION ALL

SELECT
  CONCAT(
      :period_type,
      "'",
      RIGHT(YEAR(dt_end), 2)
    ) AS period,
  ac_vs_ly,
  ac
FROM 
  base_bar_chart
WHERE 
  dt_ini = dt_ini_filter;
 