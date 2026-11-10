/* Bees Distribution - Card Chart - Big Number */

/* ------------------------------------------------------------------------------------------------------ */
/* Marcelo Komatsu - 2025-01-16 - When we refresh Data with new SKU File, Megabrand changed to Mega Brand */

WITH BASE_QUERY AS(
    SELECT
        *
    FROM
        /* mrt_am.gold_common.tlh_kpis_freeze_agg */
        {{KPI_TABLE}}
    WHERE
        VERSION_ID IN (1,2,53,64)
      AND
        CASE
            WHEN :viewtype = 'global' THEN (COUNTRY_ISO_CODE_3 = 'ABI')
            WHEN :viewtype = 'country' THEN (COUNTRY_ISO_CODE_3 = :country)
            END
      AND
        CASE
            WHEN :scope = 'megabrand' THEN (SEGMENT in ('Megabrand', 'Mega Brand'))
            ELSE SEGMENT = 'N/A'
            END
      AND
        CASE
            WHEN :pageview = 'distribution' THEN (KPI_NAME = 'distribution')
            WHEN :pageview = 'bees buyers' THEN (KPI_NAME = 'bees buyers')
            WHEN :pageview = 'sku per poc' THEN (KPI_NAME = 'sku per poc')
            END
),
     CTE_PRE_PROC AS (
         SELECT
             dt_ini,
             dt_end,
             MAX(DT_END) OVER (PARTITION BY YEAR(dt_end)) MAX_END,
             version_id,
             kpi_name,
             country_iso_code_3,
             ROUND(ac,1) AS ac,
             ROUND(ly,1) AS ly,
             ROUND(ac_vs_ly,1) AS ac_vs_ly
         FROM BASE_QUERY bq
     )
SELECT
    version_id,
    country_iso_code_3,
    kpi_name,
    YEAR(dt_end) AS year,
    TO_CHAR(DATEADD(year, -1, dt_end), 'yyyy-MM-dd') AS vs_ly_date,
    ac,
    CASE
    WHEN ac IS NULL THEN NULL
    WHEN ABS(ac) < 1000 THEN CAST(ROUND(ac, 1) AS STRING)
    WHEN ABS(ac) >= 1000000 THEN CONCAT(CAST(ROUND(ac / 1000000, 1) AS STRING), 'M')
    ELSE CONCAT(CAST(ROUND(ac / 1000, 1) AS STRING), 'K')
END AS average_ac_display,
    ly AS average_ly,
    CASE
        WHEN ly IS NULL THEN NULL
        WHEN ABS(ly) < 1000 THEN CAST(ROUND(ly, 1) AS STRING)
        WHEN ABS(ly) >= 1000000 THEN CONCAT(CAST(ROUND(ly / 1000000, 1) AS STRING), 'M')
        ELSE CONCAT(CAST(ROUND(ly / 1000, 1) AS STRING), 'K')
END AS average_ly_display,
    ac_vs_ly AS delta_pct
FROM CTE_PRE_PROC
WHERE
  MONTH(dt_ini) = 1
  AND dt_end = MAX_END
ORDER BY dt_end DESC
LIMIT 1
