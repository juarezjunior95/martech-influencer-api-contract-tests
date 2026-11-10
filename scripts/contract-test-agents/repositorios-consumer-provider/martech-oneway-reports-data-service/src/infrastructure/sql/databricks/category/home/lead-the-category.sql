/* Category Home - ABI Market Share - Big Number and Trend */
WITH qry_filter AS (
    SELECT DISTINCT
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_ini
            ELSE dt_ini_last
        END AS dt_ini,
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
            ELSE dt_end_last
        END AS dt_end,
        dt_ini_last,
        dt_end_last,
        version_id,
        kpi_name,
        CONCAT(CAST(YEAR(
            CASE WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end ELSE dt_end_last END
        ) AS STRING), '-01-01') AS dt_ini_year
    FROM gold_common.owr_kpis_min_max_dates_lk
    WHERE kpi_name = 'market_share'
      AND version_id IN (1, 2)
)
, qry_big_number AS (
    SELECT
        fat.country_iso_code_3,
        fat.dt_ini,
        fat.dt_end,
        fat.ac            AS value,
        fat.ac_vs_ly      AS comp_value,
        fat.unit_of_measure,
        fat.comp_unit_of_measure,
        'BIG_NUMBER'      AS display_type,
        ROW_NUMBER() OVER (
            PARTITION BY fat.country_iso_code_3
            ORDER BY fat.dt_end DESC
        ) AS line
    FROM qry_filter dim
    INNER JOIN  {{KPI_TABLE}} fat
        ON  fat.kpi_name   = dim.kpi_name
        AND fat.version_id = dim.version_id
        AND fat.dt_ini     = dim.dt_ini_year
        AND fat.dt_end     IN (dim.dt_end, dim.dt_end_last)
    WHERE fat.kpi_name           = 'market_share'
      AND fat.country_iso_code_3 = :country
      AND fat.version_id         = CASE WHEN :viewtype = 'global' THEN 2 ELSE 1 END
)
, qry_last_refresh AS (
    SELECT MAX(dt_end) AS last_refresh_dt
    FROM qry_big_number
    WHERE line = 1
)
, qry_line_chart AS (
    SELECT
        fat.country_iso_code_3,
        fat.dt_ini,
        fat.dt_end,
        fat.ac            AS value,
        fat.ac_vs_ly      AS comp_value,
        fat.unit_of_measure,
        fat.comp_unit_of_measure,
        'LINE_CHART'      AS display_type,
        ROW_NUMBER() OVER (
            PARTITION BY fat.country_iso_code_3
            ORDER BY fat.dt_end DESC
        ) AS line
    FROM  {{KPI_TABLE}} fat
    CROSS JOIN qry_last_refresh lr
    WHERE fat.kpi_name           = 'market_share'
      AND fat.country_iso_code_3 = :country
      AND fat.version_id         = CASE WHEN :viewtype = 'global' THEN 2 ELSE 1 END
      AND fat.dt_ini             = fat.dt_end
      AND fat.dt_end             <= lr.last_refresh_dt
)
SELECT country_iso_code_3, dt_ini, dt_end, comp_value, value, display_type, unit_of_measure, comp_unit_of_measure
FROM qry_line_chart
WHERE line <= 6
UNION ALL
SELECT country_iso_code_3, dt_ini, dt_end, comp_value, value, display_type, unit_of_measure, comp_unit_of_measure
FROM qry_big_number
WHERE line = 1
ORDER BY display_type ASC, dt_end ASC;