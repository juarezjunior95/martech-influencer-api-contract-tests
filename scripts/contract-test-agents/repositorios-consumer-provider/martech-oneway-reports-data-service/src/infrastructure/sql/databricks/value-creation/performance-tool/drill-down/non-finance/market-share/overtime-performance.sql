/*--------------------------------------------------------------------------------------------------------------- */
/* ENV_BIG NUMBERS_PERFORMANCE_TOOL_MARKET_SHARE                                                                  */
/*--------------------------------------------------------------------------------------------------------------- */

/*------------------------------------ Changes ------------------------------------------------------------------ */
/* MARCOS SARAIVA - 2026-03-27 - CORRECTION FILTERS                                                              */
/* MARCELO KOMATSU - 2026-03-30 - EUROPA FILTER WAS NOT RUNNING                                                  */
/* LEANDRO FIGUEIREDO - 2026-04-13 - VERSION_ID ADJUSTMENT                                                       */
/* ANNA GOUVEA - 2026-24-04 - VERSION_ID ADJUSTMENT FOR L3M                                                      */
/*--------------------------------------------------------------------------------------------------------------- */

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

            /* GLOBAL */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(zone)), '') IN ('', 'abi', 'all')
                THEN 2

            /* EUROPE */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND zone = 'EUR'
                THEN 212

            /* COUNTRY */
            WHEN COALESCE(TRIM(LOWER(country)), '') NOT IN ('', 'abi', 'all')
                THEN CASE

                    WHEN COALESCE(TRIM(LOWER(brand)), '') IN ('', 'all')
                     AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
                        THEN 1

                    WHEN COALESCE(TRIM(LOWER(brand)), '') NOT IN ('', 'all')
                     AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
                        THEN 215

                    WHEN COALESCE(TRIM(LOWER(brand)), '') NOT IN ('', 'all')
                     AND COALESCE(TRIM(LOWER(sub_brand)), '') NOT IN ('', 'all')
                        THEN 209

                END

        END AS target_version_id,

        param_dt_end,

        CASE
            WHEN LOWER(TRIM(country)) = 'abi'
             AND LOWER(TRIM(zone)) = 'eur'
                THEN 'EUR'
            ELSE country
        END AS country,

        brand,
        sub_brand,
        zone

    FROM input_params
),

base AS (
    SELECT
        kpi.*,
        vl.target_version_id,
        vl.param_dt_end,
        vl.country,
        vl.brand,
        vl.sub_brand,
        vl.zone

    FROM {{KPI_TABLE}} kpi

    INNER JOIN version_logic vl
        ON kpi.version_id = vl.target_version_id
       AND kpi.dt_end = vl.param_dt_end
       AND kpi.kpi_name = 'market_share'

    WHERE vl.target_version_id IS NOT NULL

      /* ZONE */
      AND CASE
            WHEN vl.zone != 'ABI'
                THEN kpi.abi_zone = vl.zone
            ELSE TRUE
          END

      /* COUNTRY */
      AND CASE
            WHEN vl.target_version_id IN (1, 209, 212, 215)
                THEN kpi.country_iso_code_3 = vl.country
            ELSE TRUE
          END

      /* BRAND */
      AND CASE
            WHEN vl.brand != 'All'
                THEN kpi.raw_brand = vl.brand
            ELSE TRUE
          END

      /* SUB BRAND */
      AND CASE
            WHEN vl.sub_brand != 'All'
                THEN kpi.level_3 = vl.sub_brand
            ELSE TRUE
          END
)

/* ==================== YTD ==================== */

SELECT
    'YTD' AS Period,

    CONCAT(
        DATE_FORMAT(dt_ini, 'MMM'),
        '-',
        DATE_FORMAT(dt_end, 'MMM')
    ) AS Interval,

    ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM base

WHERE dt_ini = DATE_TRUNC('YEAR', dt_end)


UNION ALL


/* ==================== L3M ==================== */

SELECT
    'L3M' AS Period,

    CONCAT(
        DATE_FORMAT(dt_ini, 'MMM'),
        '-',
        DATE_FORMAT(dt_end, 'MMM')
    ) AS Interval,

    ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM base

WHERE dt_ini = ADD_MONTHS(dt_end, -2)


UNION ALL


/* ==================== MTD ==================== */

SELECT
    'MTD' AS Period,
    'Full Month' AS Interval,

    ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM base

WHERE dt_ini = DATE_TRUNC('MONTH', dt_end)

ORDER BY
    CASE Period
        WHEN 'YTD' THEN 1
        WHEN 'L3M' THEN 2
        WHEN 'MTD' THEN 3
    END;
