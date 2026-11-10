/* ---------------------------------------------------------------------------------------------------- */
/* Line Chart - Market Share PR Pages                                                                   */
/* ---------------------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------------------------
   Page Types (dropdown):
     Global | Lead Premium | Superior Core | Beyond Beer |
     Balanced Choices | Country

   Expected Output (monthly for selected year):
     dt_ini, dt_end, ac, ly, ac_vs_ly, vol_ac_vs_ly

   Sources:
     - Market Share: gold_common.tlh_kpis_agg
     - Volume:       gold_common.owr_finance_mv

   Parameters:
     :page_type  -> Global | Lead Premium | Superior Core |
                    Beyond Beer | Balanced Choices | Country | Brand | Subbrand
     :brand      -> Brand name (optional - when set
                    filters by key brand; when empty shows aggregate)
     :sub_brand  -> Sub-brand
     :country    -> ISO-3 country code (or 'EUR' for Europe aggregate)
     :zone       -> ABI zone (use 'eur' to select Europe when country is empty)
     :dt_end     -> End date (year determines which months to show)

   Version ID mapping:
     Global                 -> version_id = 2       (brand=N/A, country=ABI)
     Lead Premium           -> version_id = 12      (price_tier = 'Premiumization')
     Superior Core          -> version_id = 12      (price_tier = 'Core Superiority')
     Beyond Beer            -> version_id = 12      (price_tier = 'Beyond Beer')
     Balanced Choices       -> version_id = 12      (price_tier = 'Balanced Choices')
     Country (EUR)          -> version_id = 212     (Europe aggregate)
     Country (no brand)     -> version_id = 1       (brand=N/A, country filtered)
     Country + brand        -> version_id = 215     (brand + country filtered)
     Country + brand + sub  -> version_id = 203     (brand + sub-brand + country filtered)
     Brand                  -> version_id = 220     (brand)
     Subbrand               -> version_id = 221     (sub-brand)

---------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------- */
/* Matheus Jandrey - 2026-04-20 - Query Creation                                                     */
/* Matheus Jandrey - 2026-04-23 - Fixed version_id CASE ordering: 203 before 215                     */
/* MARCELO KOMATSU - 2026-04-23 - FIX TO DISPLAY ALL YEAR                                            */
/* MARCELO KOMATSU - 2026-04-29 - FIX TO FITER ONLY BRAND and ONLY SUBBRAND                          */
/* Matheus Jandrey - 2026-04-29 - FIX volume brand mapping for Brand/Subbrand page types              */
/* Matheus Jandrey - 2026-04-29 - ADD EUR logic (version_id=212)                */
/* ------------------------------------------------------------------------------------------------- */


/* ---------------------------------------------------------------
   1. Parameters CTE - Normalize all inputs
--------------------------------------------------------------- */
WITH parameters AS (
  SELECT
    /* Date */
    CAST(:dt_end AS DATE) AS p_dt_end,

    /* Country - relevant for Country page */
    CASE
      WHEN :page_type != 'Country' THEN NULL
      WHEN COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi')
        AND LOWER(TRIM(:zone)) = 'eur' THEN 'EUR'
      WHEN COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi')
      THEN NULL
      ELSE UPPER(TRIM(:country))
    END AS p_country,

    /* Brand for tlh_kpis_agg - nullified for EUR */
    CASE
      WHEN :page_type not in ('Country', 'Brand')                         THEN NULL
      WHEN :page_type = 'Country' AND (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      ) THEN NULL
      WHEN :brand IS NULL OR LOWER(TRIM(:brand)) IN ('', 'null', 'all')   THEN NULL
      WHEN LOWER(TRIM(:brand)) IN ('michelob', 'michelob ultra')          THEN 'Michelob'
      WHEN LOWER(TRIM(:brand)) IN ('stella', 'stella artois')             THEN 'Stella Artois'
      WHEN LOWER(TRIM(:brand)) IN ('corona', 'corona extra')              THEN 'Corona'
      WHEN LOWER(TRIM(:brand)) IN ('flying fish', 'flyingfish')           THEN 'Flying Fish'
      ELSE TRIM(:brand)
    END AS p_brand_market,

    /* Brand for owr_finance_mv - nullified for EUR */
    CASE
      WHEN :page_type not in  ('Country', 'Brand')                        THEN NULL
      WHEN :page_type = 'Country' AND (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      ) THEN NULL
      WHEN :brand IS NULL
        OR LOWER(TRIM(:brand))    IN ('', 'null', 'all')                   THEN NULL
      WHEN LOWER(TRIM(:brand))    IN ('michelob', 'michelob ultra')        THEN 'Michelob Ultra'
      WHEN LOWER(TRIM(:brand))    IN ('stella', 'stella artois')           THEN 'Stella Artois'
      WHEN LOWER(TRIM(:brand))    IN ('corona', 'corona extra')            THEN 'Corona'
      WHEN LOWER(TRIM(:brand))    IN ('flying fish', 'flyingfish')         THEN 'Flying Fish'
      ELSE TRIM(:brand)
    END AS p_brand_volume,

    /* Sub-brand - nullified for EUR */
    CASE
      WHEN :page_type not in ('Country', 'Subbrand')                        THEN NULL
      WHEN :page_type = 'Country' AND (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      ) THEN NULL
--      WHEN :brand IS NULL
--        OR LOWER(TRIM(:brand))     IN ('', 'null', 'all')                   THEN NULL
      WHEN :sub_brand IS NULL
        OR LOWER(TRIM(:sub_brand)) IN ('', 'null', 'all')                   THEN NULL
      ELSE TRIM(:sub_brand)
    END AS p_sub_brand,

    /* Zone - relevant for Country page; nullified for EUR */
    CASE
      WHEN :page_type != 'Country' THEN NULL
      WHEN UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      THEN NULL
      WHEN :zone IS NULL OR LOWER(TRIM(:zone)) IN ('', 'all') THEN NULL
      ELSE UPPER(TRIM(:zone))
    END AS p_zone,

    /* Version ID - dynamic based on page_type + brand + sub_brand
       IMPORTANT: More specific conditions must come first (EUR before other Country, 203 before 215) */
    CASE
      WHEN :page_type = 'Global'                                                                THEN 2      -- Global Page
      WHEN :page_type IN ('Lead Premium', 'Superior Core', 'Beyond Beer', 'Balanced Choices')   THEN 12     -- Growth Levers
      /* EUR - must come before other Country cases */
      WHEN :page_type = 'Country'
        AND (
          UPPER(TRIM(:country)) = 'EUR'
          OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
        )                                                                                       THEN 212    -- Europe
      WHEN :page_type = 'Country'
        AND :brand IS NOT NULL
        AND LOWER(TRIM(:brand)) NOT IN ('', 'null', 'all')
        AND :sub_brand IS NOT NULL
        AND LOWER(TRIM(:sub_brand)) NOT IN ('', 'null', 'all')                                  THEN 203   -- Brand + Sub-brand Details
      WHEN :page_type = 'Country'
        AND :brand IS NOT NULL
        AND LOWER(TRIM(:brand)) NOT IN ('', 'null', 'all')                                      THEN 215   -- Brand Details
      WHEN :page_type = 'Country'                                                               THEN 1     -- Country aggregate
      WHEN :page_type = 'Brand'
        AND :brand IS NOT NULL
        AND LOWER(TRIM(:brand)) NOT IN ('', 'null', 'all')                                      THEN 220   -- Brand Details
      WHEN :page_type = 'Subbrand'
        AND :sub_brand IS NOT NULL
        AND LOWER(TRIM(:sub_brand)) NOT IN ('', 'null', 'all')                                  THEN 221   -- Brand Details
    END AS p_version_id,

    /* Price tier - only for Growth Levers page types */
    CASE
      WHEN :page_type = 'Lead Premium'     THEN 'Premiumization'
      WHEN :page_type = 'Superior Core'    THEN 'Core Superiority'
      WHEN :page_type = 'Beyond Beer'      THEN 'Beyond Beer'
      WHEN :page_type = 'Balanced Choices' THEN 'Balanced Choices'
      ELSE NULL
    END AS p_price_tier
)
,

/* ---------------------------------------------------------------
   2. Market Share CTE
--------------------------------------------------------------- */
cte_market AS (
  SELECT
    'MTD'                       AS period_type,
    cast(case when year(t.dt_ini) <> year(p.p_dt_end) then dateadd(year, 1, t.dt_ini) else t.dt_ini end as date) dt_ini,
    cast(case when year(t.dt_end) <> year(p.p_dt_end) then dateadd(year, 1, t.dt_end) else t.dt_end end as date) dt_end,
    t.raw_brand                 AS brand,
    t.level_3                   AS sub_brand,
    t.country_iso_code_3        AS country,
    t.abi_zone                  AS zone,
    case when year(t.dt_end) <> year(p.p_dt_end) then null else t.ac end ac,
    t.ly,
    case when year(t.dt_end) <> year(p.p_dt_end) then null else t.ac_vs_ly end ac_vs_ly
  FROM {{KPI_TABLE}}  t
  CROSS JOIN parameters                  p
  WHERE t.kpi_name       = 'market_share'
    AND t.version_id     = p.p_version_id
    AND (t.raw_brand          = p.p_brand_market OR p.p_brand_market IS NULL)
    AND (t.level_3            = p.p_sub_brand    OR p.p_sub_brand    IS NULL)
    AND (t.country_iso_code_3 = p.p_country      OR p.p_country     IS NULL)
    AND (t.abi_zone           = p.p_zone         OR p.p_zone        IS NULL)
    AND (t.price_tier         = p.p_price_tier   OR p.p_price_tier  IS NULL)
    AND MONTH(t.dt_ini)  = MONTH(t.dt_end)                -- Monthly granularity only
    AND ((YEAR(t.dt_end)   >= YEAR(p.p_dt_end) - 1 and month(t.dt_end) > month(p.p_dt_end))
          or (YEAR(t.dt_end) = YEAR(p.p_dt_end)))                -- All months of selected year
)
,

/* ---------------------------------------------------------------
   3. Volume CTE - from owr_finance_mv
--------------------------------------------------------------- */
cte_volume AS (
  SELECT
    CASE WHEN `period_type` = 'MTH' THEN 'MTD' ELSE `period_type` END  AS period_type,
    `ini_date`                                                          AS dt_ini,
    `end_date`                                                          AS dt_end,
    CASE
      WHEN :page_type IN ('Country', 'Brand', 'Subbrand')
        AND :brand IS NOT NULL
        AND LOWER(TRIM(:brand)) NOT IN ('', 'null', 'all')
        /* EUR: brand is N/A even if :brand is provided */
        AND NOT (
          UPPER(TRIM(:country)) = 'EUR'
          OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
        )
      THEN CASE
        WHEN LOWER(TRIM(:brand)) IN ('michelob', 'michelob ultra') THEN 'Michelob'
        WHEN LOWER(TRIM(:brand)) IN ('stella', 'stella artois')    THEN 'Stella Artois'
        WHEN LOWER(TRIM(:brand)) IN ('corona', 'corona extra')     THEN 'Corona'
        WHEN LOWER(TRIM(:brand)) IN ('flying fish', 'flyingfish')  THEN 'Flying Fish'
        ELSE TRIM(:brand)
      END
      ELSE 'N/A'
    END                                                                 AS brand,
    CASE WHEN LOWER(TRIM(:sub_brand)) IN ('corona cero', 'corona - na') THEN 'Corona Cero'
    END                                                                 AS sub_brand,
    /* EUR: output 'EUR' to match cte_market country_iso_code_3 */
    CASE
      WHEN :page_type = 'Country' AND (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      ) THEN 'EUR'
      WHEN :page_type = 'Country' THEN `country_iso_code_3`
      ELSE 'ABI'
    END                                                                 AS country,
    /* EUR: output 'EUR' to match cte_market abi_zone */
    CASE
      WHEN :page_type = 'Country' AND (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      ) THEN 'EUR'
      WHEN :page_type = 'Country' THEN `zone`
      ELSE 'ABI'
    END                                                                 AS zone,
    MEASURE(`volume_ac_vs_ly`)                                          AS vol_ac_vs_ly

  FROM gold_common.owr_finance_mv

  WHERE `period_type` = 'MTH'
    AND YEAR(`end_date`) = YEAR(CAST(:dt_end AS DATE))

    /* Brand filter (for Country, Brand, and Subbrand pages - skipped for EUR) */
    AND (
      :page_type NOT IN ('Country', 'Brand', 'Subbrand')
      OR (
        :page_type = 'Country' AND (
          UPPER(TRIM(:country)) = 'EUR'
          OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
        )
      )
      OR :brand IS NULL
      OR LOWER(TRIM(:brand)) IN ('', 'null', 'all')
      OR `brand_level_1` = CASE
        WHEN LOWER(TRIM(:brand)) IN ('michelob', 'michelob ultra') THEN 'Michelob Ultra'
        WHEN LOWER(TRIM(:brand)) IN ('stella', 'stella artois')    THEN 'Stella Artois'
        WHEN LOWER(TRIM(:brand)) IN ('corona', 'corona extra')     THEN 'Corona'
        WHEN LOWER(TRIM(:brand)) IN ('flying fish', 'flyingfish')  THEN 'Flying Fish'
        ELSE TRIM(:brand)
      END
    )

    /* Country filter (only for Country page) */
    AND (
      :page_type != 'Country'
      OR (
        COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi')
        AND LOWER(TRIM(:zone)) NOT IN ('eur')
      )
      OR CASE
        WHEN COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi')
          AND LOWER(TRIM(:zone)) = 'eur'
        THEN `country_iso_code_3_eur` = 'EUR'
        WHEN UPPER(TRIM(:country)) = 'EUR'
        THEN `country_iso_code_3_eur` = 'EUR'
        ELSE `country_iso_code_3` = UPPER(TRIM(:country))
      END
    )
    /* Zone filter (only for Country page - skipped for EUR) */
    AND (
      :page_type != 'Country'
      OR (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      )
      OR :zone IS NULL
      OR LOWER(TRIM(:zone)) IN ('', 'all')
      OR `zone` = UPPER(TRIM(:zone))
    )
    /* Sub-brand filter (only for Country + brand + sub_brand - skipped for EUR) */
    AND (
      :page_type != 'Country'
      OR (
        UPPER(TRIM(:country)) = 'EUR'
        OR (COALESCE(TRIM(LOWER(:country)), '') IN ('', 'global', 'all', 'abi') AND LOWER(TRIM(:zone)) = 'eur')
      )
      OR :brand IS NULL
      OR LOWER(TRIM(:brand)) IN ('', 'null', 'all')
      OR :sub_brand IS NULL
      OR LOWER(TRIM(:sub_brand)) IN ('', 'null', 'all')
      OR `sub_brand` = CASE
        WHEN LOWER(TRIM(:sub_brand)) IN ('corona cero', 'corona - na') THEN 'Corona - NA'
        ELSE TRIM(:sub_brand)
      END
    )
    /* Growth lever filter (only for Growth Lever pages) */
    AND (
      :page_type NOT IN ('Lead Premium', 'Superior Core', 'Beyond Beer', 'Balanced Choices')
      OR (:page_type = 'Lead Premium'     AND `is_lead_premium_growth_lever`    = true)
      OR (:page_type = 'Superior Core'    AND `is_superior_core_growth_lever`   = true)
      OR (:page_type = 'Beyond Beer'      AND `is_beyond_beer_growth_lever`     = true)
      OR (:page_type = 'Balanced Choices' AND `is_balanced_choice_growth_lever`  = true)
    )

  GROUP BY ALL
)

/* ---------------------------------------------------------------
   4. Final Selection - Join market share with volume
--------------------------------------------------------------- */
  SELECT
    m.period_type,
    m.dt_ini,
    m.dt_end,
    m.brand,
    m.sub_brand,
    m.country,
    m.zone,
    m.ac,
    m.ly,
    m.ac_vs_ly,
    case when m.dt_end > :dt_end then null else v.vol_ac_vs_ly end vol_ac_vs_ly,
    'market_share' kpi_name
  FROM cte_market   m
  LEFT JOIN cte_volume  v
    ON  m.dt_ini   = v.dt_ini
    AND m.dt_end   = v.dt_end
    AND m.brand    = v.brand
    AND m.country  = v.country
    AND m.zone     = v.zone
ORDER BY
    dt_ini ASC
    , dt_end