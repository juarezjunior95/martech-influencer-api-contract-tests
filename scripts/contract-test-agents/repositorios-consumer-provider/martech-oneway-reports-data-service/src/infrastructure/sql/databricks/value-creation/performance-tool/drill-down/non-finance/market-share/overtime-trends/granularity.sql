/*--------------------------------------------------------------------------------------------------------------- */
/* ENV_LINE_CHART_PERFORMANCE_TOOL_MARKET_SHARE                                                                   */
/*--------------------------------------------------------------------------------------------------------------- */
 
/*------------------------------------ Changes ------------------------------------------------------------------ */
/* MARCELO KOMATSU - 2026-03-27 - CHANGE FILTER TO EUROPE COUNTRY                                                 */
/* MARCELO KOMATSU - 2026-03-30 - CHANGE EUROPE FILTER                                                            */
/* LEANDRO FIGUEIREDO - 2026-03-31 - FIXED parameters processing to pick the proper version_id                    */
/* LEANDRO FIGUEIREDO - 2026-04-13 - VERSION_ID ADJUSTMENT                                                        */
/* ANNA GOUVEA - 2026-04-23 - LINE CHART LY FOR UPCOMING MONTHS                                                   */
/*------------------------------------ Changes ------------------------------------------------------------------ */
 
WITH params_ini AS (
  SELECT
    CAST(:dt_end AS DATE) AS p_dt_end,
 
    CASE
      WHEN COALESCE(TRIM(LOWER(:country)), '') IN('', 'global', 'all', 'abi') /*LOF: If it's requested a brand/sub brand without a country*/
            AND lower(trim(:zone)) != 'eur'
            AND (
              COALESCE(TRIM(LOWER(:brand)), '') NOT IN('', 'all', 'abi')
              OR COALESCE(TRIM(LOWER(:sub_brand)), '') NOT IN('', 'all', 'abi')
             ) THEN NULL
      WHEN COALESCE(TRIM(LOWER(:country)), '') IN('', 'global', 'all', 'abi') and lower(trim(:zone)) = 'eur' THEN 'EUR'
      ELSE UPPER(TRIM(:country))
    END AS p_country,
    --CASE WHEN lower(trim(:zone)) != 'eur' THEN TRUE ELSE FALSE END TESTE,
    CASE
      WHEN :brand IS NULL
        OR TRIM(:brand) = ''
        OR LOWER(TRIM(:brand)) IN ('null', 'all')
      THEN NULL
      ELSE :brand
    END AS p_brand,
 
    CASE
      WHEN :sub_brand IS NULL
        OR TRIM(:sub_brand) = ''
        OR LOWER(TRIM(:sub_brand)) IN ('null', 'all')
      THEN NULL
      ELSE :sub_brand
    END AS p_sub_brand,
 
    /*CASE
      WHEN :period_type IS NULL
        OR TRIM(:period_type) = ''
        OR LOWER(TRIM(:period_type)) = 'null'
      THEN NULL
      WHEN UPPER(TRIM(:period_type)) IN ('MTD', 'YTD', 'L3M')
      THEN UPPER(TRIM(:period_type))
      ELSE NULL
    END AS */
    'MTD' AS p_period_type,
 
    CASE
      WHEN :zone is null
        OR TRIM(:zone) = ''
        OR LOWER(TRIM(:zone)) in ('all')
      THEN NULL
      ELSE :zone
    end as p_zone
) --select * from params_ini
, params_brand AS(
SELECT
      p_dt_end
      , p_country
      , CASE 
          WHEN COALESCE(p_country, '') IN('', 'EUR') THEN NULL
          ELSE p_brand
      END p_brand
      , p_sub_brand
      , p_period_type
      , p_zone
FROM  params_ini
)
, params AS(
SELECT
      p_dt_end
      , p_country
      , p_brand
      , CASE 
          WHEN COALESCE(p_country, '') IN('', 'EUR') THEN NULL
          WHEN p_brand IS NULL THEN NULL
          ELSE p_sub_brand
      END p_sub_brand
      , p_period_type
      , p_zone
FROM  params_brand
),
valid_params AS (
  SELECT
    p_dt_end,
    p_country,
    p_brand,
    p_sub_brand,
    p_period_type,
    p_zone,
 
    CASE
      -- Global
      WHEN p_country = 'ABI' AND p_brand IS NULL AND p_sub_brand IS NULL AND p_zone = 'ABI' THEN 2
 
      WHEN p_country = 'EUR' THEN 212 /*LOF: Europe as a country*/
      WHEN p_country IS NOT NULL THEN
        CASE 
          WHEN p_brand IS NULL AND p_sub_brand IS NULL THEN 1 /*LOF: Any country from the country scope*/
          WHEN p_brand IS NOT NULL AND p_sub_brand IS NULL THEN 215 /*LOF: Any country with a brand*/
          WHEN p_brand IS NOT NULL AND p_sub_brand IS NOT NULL THEN 203 /*LOF: Any country with a sub brand*/
        END
    END AS target_version_id
  FROM params
  WHERE p_dt_end IS NOT NULL
    AND NOT (p_brand IS NOT NULL AND p_country IS NULL)
    AND NOT (p_sub_brand IS NOT NULL AND (p_brand IS NULL OR p_country IS NULL))
)
, result AS (
  SELECT
    CASE WHEN YEAR(t.dt_end) < YEAR(p.p_dt_end) THEN CAST(DATEADD(year, 1, t.dt_end) AS DATE) ELSE t.dt_end   END AS dt_end,
    CASE WHEN YEAR(t.dt_end) < YEAR(p.p_dt_end) THEN NULL                                     ELSE t.ac_vs_ly END as ac_vs_ly,
    CASE WHEN YEAR(t.dt_end) < YEAR(p.p_dt_end) THEN t.ac                                     ELSE t.ly       END as ly,
    CASE WHEN YEAR(t.dt_end) < YEAR(p.p_dt_end) THEN NULL                                     ELSE t.ac       END as ac,
    :period_type AS period_type,
    CASE
      WHEN t.dt_end = p.p_dt_end THEN 1
      ELSE 0
    END AS is_highlight
    --INSPECT
    , t.country_iso_code_3
    , t.level_2
    , t.raw_brand, p.p_brand
    ,  p.target_version_id
  FROM {{KPI_TABLE}} t
  INNER JOIN valid_params p
    ON t.version_id = p.target_version_id
    AND t.dt_end BETWEEN TRUNC(DATEADD(year, -1, p.p_dt_end), 'YEAR') AND p.p_dt_end /*Anna Gouvea: Filter current and last years to ge the LY for the remaining months of current year*/
  WHERE 
    t.kpi_name = 'market_share'
    /*AND (/*LOF: This grabs global data*/
      p.target_version_id = 2
      OR UPPER(TRIM(COALESCE(t.level_1, ''))) = 'BEER'
    )*/
    AND t.dt_ini = t.dt_end /*LOF: This guarantees the results are shown monthly*/
    AND t.dt_end > DATEADD(year,-1,p.p_dt_end) /*Anna Gouvea: To exclude months in the last year that aleready have values in the ly column to avoid duplicated rows*/
    AND CASE /*LOF: Zone filter*/
        WHEN COALESCE(p.p_zone, '') NOT IN('', 'ABI') THEN t.abi_zone = p.p_zone
        ELSE TRUE
    END
    AND CASE /*LOF: Country filter*/
        --WHEN p.target_version_id IN(208) THEN t.level_2 = p.p_country
        WHEN p.target_version_id IN(1, 203, 212, 215) THEN t.country_iso_code_3 = p.p_country
        ELSE TRUE
    END
    AND CASE /*LOF: Brand filter*/
        WHEN p.p_brand IS NOT NULL THEN t.raw_brand = p.p_brand
        ELSE TRUE
    END
    AND CASE /*LOF: Sub brand filter*/
        WHEN p.p_sub_brand IS NOT NULL THEN t.level_3 = p.p_sub_brand
        ELSE TRUE
    END
)
 
SELECT
    dt_end,
    ac_vs_ly,
    ly,
    ac,
    period_type
FROM result
 ORDER BY dt_end; 