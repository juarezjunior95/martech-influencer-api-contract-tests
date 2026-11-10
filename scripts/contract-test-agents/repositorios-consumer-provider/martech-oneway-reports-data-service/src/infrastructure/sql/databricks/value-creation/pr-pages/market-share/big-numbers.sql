
/*-------------------------------------------------------------------------------------------------------------- */
/* ENV_BIG NUMBERS_PERFORMANCE_TOOL_MARKET_SHARE                                                                  */
/*--------------------------------------------------------------------------------------------------------------- */

/* PARAMETERS:
GLOBAL:
  brand: all
  country: ABI
  dt_end: last period
  sub_brand: all
  zone: abi
  growth_lever: all

COUNTRY:
  brand: all
  country: BRA, EUR, ITA
  dt_end: last period
  sub_brand: all
  zone: abi
  growth_lever: all

BRAND:
  brand: Corona, Flying Fish, Budweiser, Stella Artois, Michelob
  country: All
  dt_end: last period
  sub_brand: all
  zone: abi
  growth_lever: all

SUBBRAND:
  brand: All
  country: All
  dt_end: last period
  sub_brand: Corona Cero
  zone: abi
  growth_lever: all

GROWTH_LEVER:
  brand: All
  country: All
  dt_end: last period
  sub_brand: All
  zone: abi
  growth_lever: Lead Premium, Superior Core
*/

/*------------------------------------ Changes ------------------------------------------------------------------ */
/* MARCOS SARAIVA - 2026-03-27 - CORRECTION FILTERS                                                              */
/* MARCELO KOMATSU - 2026-03-30 - EUROPA FILTER WAS NOT RUNNING                                                  */
/* LEANDRO FIGUEIREDO - 2026-04-13 - VERSION_ID ADJUSTMENT                                                       */
/* ALAN SILVA - 2026-04-15 - SUB_BRAND CARD QUERY USES L3M-ENABLED VERSION_ID 209                               */
/* 2026-08-13 - AC_VS_LY CALCULATED AS CURRENT AC - PREVIOUS YEAR AC                                              */
/*--------------------------------------------------------------------------------------------------------------- */

WITH input_params AS (
    SELECT
        CAST(:dt_end AS DATE) AS param_dt_end,
        :country              AS country,
        :brand                AS brand,
        :sub_brand            AS sub_brand,
        :zone                 AS zone,
        :growth_lever         AS growth_lever
),

version_logic AS (
    SELECT
        CASE

            /* GLOBAL */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(zone)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(growth_lever)), '') IN ('', 'all')
                THEN 2

            /* EUROPA */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND zone = 'EUR'
                THEN 212

            /* PAIS */
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

            /* BRAND */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(zone)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(brand)), '') NOT IN ('', 'all')
             AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
                THEN 220

            /* SUBBRAND */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(zone)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(sub_brand)), '') NOT IN ('', 'all')
                THEN 221

            /* GROWTH LEVER */
            WHEN COALESCE(TRIM(LOWER(country)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(zone)), '') IN ('', 'abi', 'all')
             AND COALESCE(TRIM(LOWER(brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(sub_brand)), '') IN ('', 'all')
             AND COALESCE(TRIM(LOWER(growth_lever)), '') NOT IN ('', 'all')
                THEN 12

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
        zone,
        growth_lever

    FROM input_params
),

/* --------------------------------------------------------------------------------------------------------------
   ALTERAÇÃO:
   Antes trazia somente:
       kpi.dt_end = vl.param_dt_end

   Agora traz:
       período atual
       + mesmo período do ano anterior
-------------------------------------------------------------------------------------------------------------- */
base AS (
    SELECT
        kpi.*,
        vl.target_version_id,
        vl.param_dt_end,
        vl.country,
        vl.brand,
        vl.sub_brand,

        CASE
            WHEN COALESCE(TRIM(LOWER(vl.growth_lever)), '') NOT IN ('', 'all')
                THEN vl.growth_lever

            WHEN kpi.price_tier = 'Core Superiority'
                THEN 'Superior Core'

            WHEN kpi.price_tier = 'Premiumization'
                THEN 'Lead Premium'

            ELSE 'All'
        END AS growth_lever

    FROM {{KPI_TABLE}} kpi

    INNER JOIN version_logic vl
        ON kpi.version_id = vl.target_version_id

       AND kpi.dt_end IN (
            vl.param_dt_end,
            ADD_MONTHS(vl.param_dt_end, -12)
       )

       AND kpi.kpi_name = 'market_share'

    WHERE vl.target_version_id IS NOT NULL

      /* EUROPA */
      AND CASE
            WHEN vl.target_version_id IN (212)
                THEN kpi.country_iso_code_3 = 'EUR'
            ELSE TRUE
          END

      /* PAIS */
      AND CASE
            WHEN vl.target_version_id IN (1, 209, 215)
                THEN kpi.country_iso_code_3 = vl.country
            ELSE TRUE
          END

      /* BRAND */
      AND CASE
            WHEN LOWER(vl.brand) != 'all'
                THEN kpi.raw_brand = vl.brand
            ELSE TRUE
          END

      /* SUBBRAND */
      AND CASE
            WHEN LOWER(vl.sub_brand) != 'all'
                THEN kpi.level_3 = vl.sub_brand
            ELSE TRUE
          END

      /* GROWTH LEVER */
      AND CASE
            WHEN vl.growth_lever = 'Superior Core'
                THEN kpi.price_tier = 'Core Superiority'

            WHEN vl.growth_lever = 'Lead Premium'
                THEN kpi.price_tier = 'Premiumization'

            WHEN vl.growth_lever NOT IN (
                'Superior Core',
                'Lead Premium',
                'All'
            )
                THEN FALSE

            ELSE TRUE
          END
),

/* ==================== YTD ==================== */

ytd_raw AS (
    SELECT *
    FROM base
    WHERE dt_ini = DATE_TRUNC('YEAR', dt_end)
),

ytd_corrected AS (
    SELECT
        y.*,

        ROUND(
            y.ac -
            LAG(y.ac) OVER (
                PARTITION BY
                    y.version_id,
                    y.country_iso_code_3,
                    y.abi_zone,
                    y.raw_brand,
                    y.level_3,
                    y.price_tier,
                    y.kpi_name,
                    y.growth_lever
                ORDER BY y.dt_end
            ),
            1
        ) AS corrected_ac_vs_ly

    FROM ytd_raw y
),

/* ==================== L3M ==================== */

l3m_raw AS (
    SELECT *
    FROM base
    WHERE dt_ini = ADD_MONTHS(dt_end, -2)
),

l3m_corrected AS (
    SELECT
        l.*,

        ROUND(
            l.ac -
            LAG(l.ac) OVER (
                PARTITION BY
                    l.version_id,
                    l.country_iso_code_3,
                    l.abi_zone,
                    l.raw_brand,
                    l.level_3,
                    l.price_tier,
                    l.kpi_name,
                    l.growth_lever
                ORDER BY l.dt_end
            ),
            1
        ) AS corrected_ac_vs_ly

    FROM l3m_raw l
),

/* ==================== MTD ==================== */

mtd_raw AS (
    SELECT *
    FROM base
    WHERE dt_ini = DATE_TRUNC('MONTH', dt_end)
),

mtd_corrected AS (
    SELECT
        m.*,

        ROUND(
            m.ac -
            LAG(m.ac) OVER (
                PARTITION BY
                    m.version_id,
                    m.country_iso_code_3,
                    m.abi_zone,
                    m.raw_brand,
                    m.level_3,
                    m.price_tier,
                    m.kpi_name,
                    m.growth_lever
                ORDER BY m.dt_end
            ),
            1
        ) AS corrected_ac_vs_ly

    FROM mtd_raw m
)

/* ==================== YTD ==================== */

SELECT
    'YTD' AS Period,

    CONCAT(
        DATE_FORMAT(dt_ini, 'MMM'),
        '-',
        DATE_FORMAT(dt_end, 'MMM')
    ) AS Interval,

    corrected_ac_vs_ly AS ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    growth_lever,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM ytd_corrected
WHERE dt_end = param_dt_end


UNION ALL


/* ==================== L3M ==================== */

SELECT
    'L3M' AS Period,

    CONCAT(
        DATE_FORMAT(dt_ini, 'MMM'),
        '-',
        DATE_FORMAT(dt_end, 'MMM')
    ) AS Interval,

    corrected_ac_vs_ly AS ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    growth_lever,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM l3m_corrected
WHERE dt_end = param_dt_end


UNION ALL


/* ==================== MTD ==================== */

SELECT DISTINCT
    'MTD' AS Period,
    'Full Month' AS Interval,

    corrected_ac_vs_ly AS ac_vs_ly,
    ac_vs_bu,
    ac,
    dt_ini,
    dt_end,
    growth_lever,
    '%'  AS unit_of_measure,
    'pp' AS comp_unit_of_measure

FROM mtd_corrected
WHERE dt_end = param_dt_end


ORDER BY
    CASE Period
        WHEN 'YTD' THEN 1
        WHEN 'L3M' THEN 2
        WHEN 'MTD' THEN 3
    END;
