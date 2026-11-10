/*ENV_[OWR] Performance Tool - Market Share - Waterfall                               */

/* ----------------------- CREATED BY ----------------------------------------------- */
/* 2026.03.25 - Alan Silva - Market Share Waterfall Query                             */
/* 2026.03.25 - Matheus Jandrey - Corrections and improvements for delta calculation  */
/* ----------------------- PARAMETERS ----------------------------------------------- */
/* :dt_end            --> reference date for analysis                                 */
/* :period_type       --> YTD, MTD, L3M                                               */
/* :waterfall_filter  --> country, brand, sub_brand, growth_levers                    */
/* :country           --> country ISO code or 'ABI' for global                        */
/* :zone              --> zone code or 'ABI' for all zones                            */
/* :brand             --> brand name or 'All'                                         */
/* :max_ranked        --> max ranked items to display (default 15)                    */
/* ----------------------- VERSION IDs ---------------------------------------------- */
/* Share Totals (gold_common.tlh_kpis_agg):                                           */
/*   204 - Countries + EUR consolidated (top 15, global weighted)                     */
/*   212 - Countries + EUR (no ranking, global weighted - fixed-list source)          */
/*     1 - Country level       2 - Global level       4 - Zone level                  */
/*    10 - Zone-level growth lever aggregate (6 rows, 1 per zone)                     */
/*    12 - Global growth lever aggregate (1 row per growth lever, ABI/ABI)            */
/*   201 - Countrie + EUR                                                             */
/*    11 - Growth Levers (Core Superiority, Premiumization) per country               */
/*   209 - Brand x country x subbrand attribute (subbrand filtering)                  */
/*   210 - Brand x country, top 15 brands                                             */
/*   213 - Brand x country, all brands (BEER only, sub_brand parent)                  */
/*   208 - Brand x country (country in LEVEL_2), brand_gl alternative                 */
/*   220 - Global weighted brand MS (1 row per brand, ABI/ABI)                        */
/*   221 - Global weighted sub_brand MS (1 row per sub_brand, ABI/ABI)                */
/*   222 - Subbrand x country (country in LEVEL_2), sub_brand_gl alternative          */
/* ---------------------------------------------------------------------------------  */

WITH ms_data AS (
  SELECT *,
    CASE
      WHEN UPPER(TRIM(COALESCE(LEVEL_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_3)
      WHEN UPPER(TRIM(COALESCE(LEVEL_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_2)
      WHEN UPPER(TRIM(COALESCE(LEVEL_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_1)
      ELSE 'N/A'
    END AS resolved_sub_brand,
    CASE PRICE_TIER
      WHEN 'Core Superiority' THEN 'Superior Core'
      WHEN 'Premiumization' THEN 'Lead Premium'
    END AS mapped_growth_lever
  FROM gold_common.tlh_kpis_agg
  WHERE KPI_NAME = 'market_share'
    AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
    AND (
      (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END))
--        AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63))
      OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
      OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
)

,

/* ===== VERSION_ID 212 existence check (evaluated once for current period) ===== */
has_v212 AS (
  SELECT COALESCE(MAX(1), 0) AS flag
  FROM ms_data
  WHERE VERSION_ID = 212
    AND DT_END = :dt_end
),

/* ===== BASE: Waterfall step data ===== */
base AS (

  /* COUNTRY waterfall: global view (zone=ABI, country=ABI) */
  SELECT DT_END, COUNTRY_ISO_CODE_3 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = CASE WHEN (SELECT flag FROM has_v212) = 1 THEN 212 ELSE 204 END

  UNION ALL

  /* GROWTH LEVERS by country - V11 (global, growth_lever selected) */
  SELECT DT_END, COUNTRY_ISO_CODE_3 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:growth_lever,'All') NOT IN ('All','')
    AND lower(mapped_growth_lever) = lower(:growth_lever)
    AND VERSION_ID = 11

  UNION ALL

  /* COUNTRY waterfall: zone-specific - V1 */
  SELECT DT_END, COUNTRY_ISO_CODE_3 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone != 'ABI' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 1
    AND ABI_ZONE = :zone

  UNION ALL

  /* COUNTRY + specific country + brand=All → show brands - V210 */
  SELECT DT_END, RAW_BRAND AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :country != 'ABI' AND :brand = 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = 210
    AND COUNTRY_ISO_CODE_3 = :country
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END

  UNION ALL

  /* BRAND waterfall - V210 */
  SELECT DT_END,
         CASE WHEN :country = 'ABI' THEN RAW_BRAND || CHR(10) || COUNTRY_ISO_CODE_3
              ELSE RAW_BRAND END AS step_name,
         AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'brand'
    AND :brand = 'All'
    AND VERSION_ID = 210
    AND CASE WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country ELSE TRUE END
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END

  UNION ALL

  /* COUNTRY waterfall for specific brand (country=ABI) - V208 */
  SELECT DT_END, LEVEL_2 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :country = 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 208
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END

  UNION ALL

  /* COUNTRY + country + brand → show sub_brands - V209 */
  SELECT DT_END, resolved_sub_brand AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :country != 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 209
    AND COUNTRY_ISO_CODE_3 = :country
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END

  UNION ALL

  /* SUB_BRAND waterfall (country-specific) - V209 */
  SELECT DT_END, resolved_sub_brand AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :sub_brand = 'All' AND :country != 'ABI'
    AND VERSION_ID = 209
    AND COUNTRY_ISO_CODE_3 = :country
    AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END

  UNION ALL

  /* SUB_BRAND waterfall global (country=ABI, zone=ABI) - V221 */
  SELECT DT_END, resolved_sub_brand AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :sub_brand = 'All' AND :country = 'ABI' AND :zone = 'ABI'
    AND VERSION_ID = 221
    AND COUNTRY_ISO_CODE_3 = 'ABI' AND ABI_ZONE = 'ABI'
    AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END

  UNION ALL

  /* SUB_BRAND waterfall zone-specific (country=ABI, zone!=ABI) - V222 */
  SELECT DT_END, resolved_sub_brand AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :sub_brand = 'All' AND :country = 'ABI' AND :zone != 'ABI'
    AND VERSION_ID = 222
    AND ABI_ZONE = :zone
    AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END

  UNION ALL

  /* COUNTRY waterfall for specific sub_brand - V222 */
  SELECT DT_END, LEVEL_2 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :sub_brand != 'All'
    AND RAW_BRAND = :brand
    AND resolved_sub_brand = :sub_brand
    AND VERSION_ID = 222
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END

  UNION ALL

  /* GROWTH LEVERS waterfall: global (zone=ABI, country=ABI) - V212/V204 */
  SELECT DT_END, COUNTRY_ISO_CODE_3 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'growth_levers'
    AND :zone = 'ABI' AND :country = 'ABI'
    AND VERSION_ID = CASE WHEN (SELECT flag FROM has_v212) = 1 THEN 212 ELSE 204 END

  UNION ALL

  /* GROWTH LEVERS waterfall: zone-specific (zone!=ABI, country=ABI) - V1 */
  SELECT DT_END, COUNTRY_ISO_CODE_3 AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'growth_levers'
    AND :zone != 'ABI' AND :country = 'ABI'
    AND VERSION_ID = 1
    AND ABI_ZONE = :zone

  UNION ALL

  /* GROWTH LEVERS waterfall: country-specific (country!=ABI) - V11 */
  SELECT DT_END, PRICE_TIER AS step_name, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'growth_levers'
    AND :country != 'ABI'
    AND VERSION_ID = 11
    AND COUNTRY_ISO_CODE_3 = :country
    AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END
)
,

/* ===== PARENT BASE: Parent-level MS rows for waterfall totals ===== */
parent_base_raw AS (

  /* Global MS (zone=ABI, country=ABI, brand=All, no growth_lever) - V2 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = 2

  UNION ALL

  /* Global growth lever MS parent - V12 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:growth_lever,'All') NOT IN ('All','')
    AND VERSION_ID = 12
    AND lower(mapped_growth_lever) = lower(:growth_lever)
    AND COUNTRY_ISO_CODE_3 = 'ABI' AND ABI_ZONE = 'ABI'

  UNION ALL

  /* Growth lever for brand (zone=ABI, brand!=All) - V220 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:growth_lever,'All') NOT IN ('All','')
    AND VERSION_ID = 220
    AND lower(mapped_growth_lever) = lower(:growth_lever)

  UNION ALL

  /* Global brand MS parent (zone=ABI, country=ABI, brand!=All) - V220 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :country = 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = 220
    AND COUNTRY_ISO_CODE_3 = 'ABI' AND ABI_ZONE = 'ABI'

  UNION ALL

  /* Global sub_brand MS parent (zone=ABI, sub_brand!=All) - V221 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'ABI' AND :brand != 'All' AND :sub_brand != 'All'
    AND RAW_BRAND = :brand
    AND resolved_sub_brand = :sub_brand
    AND VERSION_ID = 221
    AND COUNTRY_ISO_CODE_3 = 'ABI' AND ABI_ZONE = 'ABI'

  UNION ALL

  /* Zone-level brand parent (zone!=ABI, country=ABI, brand!=All) - V208 SUM */
  SELECT DT_END, SUM(AC) AS AC, SUM(LY) AS LY, SUM(AC_VS_LY) AS AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone != 'ABI' AND :country = 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 208
    AND ABI_ZONE = :zone
  GROUP BY DT_END
  HAVING COUNT(*) > 0

  UNION ALL

  /* Zone-level sub_brand parent (zone!=ABI, sub_brand!=All) - V222 SUM */
  SELECT DT_END, SUM(AC) AS AC, SUM(LY) AS LY, SUM(AC_VS_LY) AS AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone != 'ABI' AND :brand != 'All' AND :sub_brand != 'All'
    AND RAW_BRAND = :brand
    AND resolved_sub_brand = :sub_brand
    AND VERSION_ID = 222
    AND ABI_ZONE = :zone
  GROUP BY DT_END
  HAVING COUNT(1) > 0

  UNION ALL

  /* Zone MS (zone=EUR, country=ABI, brand=All) - V212 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone = 'EUR' AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 212
    AND ABI_ZONE = :zone

  UNION ALL

  /* Zone MS (non-EUR zones, country=ABI, brand=All) - V4 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :zone NOT IN ('ABI', 'EUR') AND :country = 'ABI' AND :brand = 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = 4
    AND ABI_ZONE = :zone

  UNION ALL

  /* Country MS parent (country!=ABI, brand=All) - V1 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :country != 'ABI' AND :brand = 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND COALESCE(:growth_lever,'All') IN ('All','')
    AND VERSION_ID = 1
    AND COUNTRY_ISO_CODE_3 = :country

  UNION ALL

  /* Brand MS parent (country!=ABI, brand!=All) - V213 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'country'
    AND :country != 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND VERSION_ID = 213
    AND COUNTRY_ISO_CODE_3 = :country

  UNION ALL

  /* Country or Global MS for brand waterfall */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'brand'
    AND VERSION_ID = CASE
        WHEN :country = 'ABI' AND :zone = 'ABI' THEN 2
        WHEN :country != 'ABI' AND :zone != 'EUR' THEN 1
        WHEN :country != 'ABI' AND :zone = 'EUR' THEN 1
        WHEN :country = 'ABI' AND :zone = 'EUR' THEN 212
        WHEN :country = 'ABI' AND :zone NOT IN ('ABI', 'EUR') THEN 4
    END
    AND CASE
        WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country
        WHEN :country = 'ABI' AND :zone = 'EUR' THEN COUNTRY_ISO_CODE_3 = :zone
        WHEN :country = 'ABI' AND :zone NOT IN ('ABI', 'EUR') THEN ABI_ZONE = :zone
        ELSE TRUE
    END

  UNION ALL

  /* Brand MS for sub_brand waterfall (country-specific) - V213 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :country != 'ABI'
    AND VERSION_ID = 213
    AND COUNTRY_ISO_CODE_3 = :country
    AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END

  UNION ALL

  /* Global brand MS parent for sub_brand (country=ABI, zone=ABI) - V220 */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :country = 'ABI' AND :zone = 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND VERSION_ID = 220
    AND COUNTRY_ISO_CODE_3 = 'ABI' AND ABI_ZONE = 'ABI'

  UNION ALL

  /* Zone-level brand MS parent for sub_brand (country=ABI, zone!=ABI) - V208 SUM */
  SELECT DT_END, SUM(AC) AS AC, SUM(LY) AS LY, SUM(AC_VS_LY) AS AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'sub_brand'
    AND :country = 'ABI' AND :zone != 'ABI' AND :brand != 'All'
    AND RAW_BRAND = :brand
    AND VERSION_ID = 208
    AND ABI_ZONE = :zone
  GROUP BY DT_END
  HAVING COUNT(*) > 0

  UNION ALL

  /* Country MS for growth_levers waterfall */
  SELECT DT_END, AC, LY, AC_VS_LY
  FROM ms_data
  WHERE lower(:waterfall_filter) = 'growth_levers'
    AND VERSION_ID = CASE
        WHEN :country != 'ABI' THEN 1
        WHEN :zone != 'ABI' THEN 4
        ELSE 2
    END
    AND CASE
        WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country
        WHEN :zone != 'ABI' THEN ABI_ZONE = :zone
        ELSE TRUE
    END
),

parent_base AS (
  SELECT
      SUM(CASE WHEN DT_END = :dt_end THEN AC END) AS AC
    , SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC_VS_LY END) AS LY_VS_LY
    , SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC END) AS LY
    , SUM(CASE WHEN DT_END = :dt_end THEN AC_VS_LY END) AS AC_VS_LY
    , SUM(CASE WHEN DT_END = :dt_end THEN AC END)
      - COALESCE(SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC END), 0) AS DELTA
  FROM parent_base_raw
),

/* ===== AGGREGATION & RANKING ===== */
step_agg AS (
  SELECT
      cur.step_name
    , cur.ac
    , cur.ly
    , cur.ac_vs_ly
    , cur.ac - COALESCE(py.ac, 0) AS delta
  FROM (
    SELECT
        step_name
      , SUM(AC) AS ac
      , SUM(LY) AS ly
      , SUM(AC_VS_LY) AS ac_vs_ly
    FROM base
    WHERE DT_END = :dt_end
    GROUP BY step_name
  ) cur
  LEFT JOIN (
    SELECT
        step_name
      , SUM(AC) AS ac
    FROM base
    WHERE DT_END = ADD_MONTHS(:dt_end, -12)
    GROUP BY step_name
  ) py
    ON cur.step_name = py.step_name
),

fixed_countries_abi AS (
  SELECT col1 AS step_name, col2 AS rnk
  FROM VALUES
    ('BRA', 1), ('USA', 2), ('MEX', 3), ('CHN', 4), ('ZAF', 5),
    ('EUR', 6), ('KOR', 7), ('CAN', 8), ('COL', 9), ('PER', 10),
    ('NGA', 11), ('IND', 12), ('DOM', 13), ('ECU', 14)
  AS t(col1, col2)
),

step_ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      ORDER BY
        CASE WHEN TRIM(REPLACE(COALESCE(step_name, ''), CHR(10), '')) = ''
                  OR LEFT(step_name, 1) = CHR(10)
                  OR RIGHT(step_name, 1) = CHR(10)
                  OR UPPER(TRIM(COALESCE(step_name, ''))) IN ('N/A', 'NA', 'NULL', 'NONE')
                  OR CONTAINS(step_name, 'Others')
             THEN CASE WHEN lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI' THEN 16
                       ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 1 END
        END,
        CASE WHEN lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI' THEN
              CASE step_name
                WHEN 'USA' THEN 2 WHEN 'BRA' THEN 1 WHEN 'MEX' THEN 3
                WHEN 'CHN' THEN 4 WHEN 'ZAF' THEN 5 WHEN 'EUR' THEN 6
                WHEN 'CAN' THEN 8 WHEN 'KOR' THEN 7 WHEN 'COL' THEN 9
                WHEN 'PER' THEN 10 WHEN 'DOM' THEN 13
                WHEN 'IND' THEN 12 WHEN 'NGA' THEN 11 WHEN 'ECU' THEN 14
                ELSE 18
              END
        END,
        CASE WHEN lower(:waterfall_filter) = 'country' AND :zone = 'EUR' AND :country = 'ABI' THEN
              CASE step_name
                WHEN 'NLD' THEN 1 WHEN 'ITA' THEN 2 WHEN 'DEU' THEN 3
                WHEN 'FRA' THEN 4 WHEN 'GBR' THEN 5 WHEN 'BEL' THEN 6
                ELSE 18
              END
        END,
        CASE WHEN lower(:waterfall_filter) IN ('brand', 'sub_brand', 'growth_levers')
                OR (lower(:waterfall_filter) = 'country' AND :zone NOT IN ('ABI', 'EUR'))
                OR (lower(:waterfall_filter) = 'country' AND :country != 'ABI')
            THEN ac
        END DESC
    ) AS rnk
  FROM step_agg
),

top_steps AS (
  SELECT f.step_name, COALESCE(s.ac, 0) AS ac, COALESCE(s.ly, 0) AS ly,
         COALESCE(s.ac_vs_ly, 0) AS ac_vs_ly, COALESCE(s.delta, 0) AS delta, f.rnk
  FROM fixed_countries_abi f
  LEFT JOIN step_agg s ON s.step_name = f.step_name
  WHERE lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI'

  UNION ALL

  SELECT step_name, ac, ly, ac_vs_ly, delta, rnk
  FROM step_ranked
  WHERE NOT (lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI')
    AND rnk <= COALESCE(NULLIF(:max_ranked, ''), 15)
    AND TRIM(REPLACE(COALESCE(step_name, ''), CHR(10), '')) != ''
    AND UPPER(TRIM(COALESCE(step_name, ''))) NOT IN ('N/A', 'NA', 'NULL', 'NONE')
    AND NOT CONTAINS(COALESCE(step_name, ''), 'Others')
),

/* ===== VOLUME DATA ===== */
vol_step_data AS (
  SELECT country_iso_code_3_eur AS step_name,
    MEASURE(volume_ac) AS vol_ac, MEASURE(volume_ly) AS vol_ly, MEASURE(volume_og_ly) AS vol_og_ly
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI'
    AND upper(product_type) = 'BEER'
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY country_iso_code_3_eur

  UNION ALL

  SELECT country_iso_code_3_finance_scope AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'country' AND :zone != 'ABI' AND :country = 'ABI'
    AND upper(product_type) = 'BEER' AND zone = :zone
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY country_iso_code_3_finance_scope

  UNION ALL

  /* Brand volumes when specific country selected */
  SELECT brand_level_1_taxonomy AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand = 'All'
    AND upper(product_type) = 'BEER'
    AND country_iso_code_3_finance_scope = :country
    AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY brand_level_1_taxonomy

  UNION ALL

  /* Sub-brand volumes when specific country + brand */
  SELECT CASE
        WHEN UPPER(TRIM(COALESCE(brand_level_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_3)
        WHEN UPPER(TRIM(COALESCE(brand_level_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_2)
        WHEN UPPER(TRIM(COALESCE(brand_level_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_1)
        ELSE 'N/A'
      END AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand != 'All'
    AND COALESCE(:sub_brand, 'All') = 'All'
    AND upper(product_type) = 'BEER'
    AND country_iso_code_3_finance_scope = :country
    AND brand_level_1 = :brand
    AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY ALL

  UNION ALL

  /* Brand waterfall volumes */
  SELECT CASE WHEN :country = 'ABI' THEN brand_level_1_taxonomy || CHR(10) || country_iso_code_3_finance_scope
           ELSE brand_level_1_taxonomy END AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'brand' AND upper(product_type) = 'BEER'
    AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
    AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY ALL

  UNION ALL

  /* Sub_brand waterfall volumes */
  SELECT CASE
        WHEN UPPER(TRIM(COALESCE(brand_level_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_3)
        WHEN UPPER(TRIM(COALESCE(brand_level_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_2)
        WHEN UPPER(TRIM(COALESCE(brand_level_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_1)
        ELSE 'N/A'
      END AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'sub_brand' AND upper(product_type) = 'BEER'
    AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
    AND CASE WHEN :brand != 'All' THEN brand_level_1 = :brand ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY ALL

  UNION ALL

  /* brand_gl waterfall volumes */
  SELECT CASE WHEN :country = 'ABI' THEN brand_level_1_taxonomy || CHR(10) || country_iso_code_3_finance_scope
           ELSE brand_level_1_taxonomy END AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'brand_gl' AND upper(product_type) = 'BEER'
    AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
    AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY ALL

  UNION ALL

  /* sub_brand_gl waterfall volumes */
  SELECT CASE
        WHEN UPPER(TRIM(COALESCE(brand_level_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_3)
        WHEN UPPER(TRIM(COALESCE(brand_level_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_2)
        WHEN UPPER(TRIM(COALESCE(brand_level_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_1)
        ELSE 'N/A'
      END AS step_name,
    MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
  FROM gold_common.owr_finance_mv
  WHERE lower(:waterfall_filter) = 'sub_brand_gl' AND upper(product_type) = 'BEER'
    AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
    AND CASE WHEN :brand != 'All' THEN brand_level_1 = :brand ELSE TRUE END
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE lower(:growth_lever)
          WHEN 'superior core' THEN is_superior_core_growth_lever
          WHEN 'lead premium' THEN is_lead_premium_growth_lever
          ELSE TRUE
        END
  GROUP BY ALL
),

vol_step_agg AS (
  SELECT step_name, SUM(vol_ac) AS vol_ac, SUM(vol_ly) AS vol_ly, SUM(vol_og_ly) AS vol_og_ly
  FROM vol_step_data GROUP BY step_name
),

vol_parent_data AS (
  SELECT MEASURE(volume_ac) AS vol_ac, MEASURE(volume_ly) AS vol_ly, MEASURE(volume_og_ly) AS vol_og_ly
  FROM gold_common.owr_finance_mv
  WHERE upper(product_type) = 'BEER'
    AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
    AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
    AND CASE WHEN (lower(:waterfall_filter) = 'country' AND :zone != 'ABI' AND :country = 'ABI')
               OR (lower(:waterfall_filter) = 'growth_levers' AND :zone != 'ABI' AND :country = 'ABI')
               OR (lower(:waterfall_filter) = 'sub_brand' AND :zone != 'ABI' AND :country = 'ABI')
             THEN zone = :zone ELSE TRUE END
    AND CASE WHEN (lower(:waterfall_filter) IN ('brand', 'sub_brand', 'growth_levers') AND :country != 'ABI')
               OR (lower(:waterfall_filter) = 'country' AND :country != 'ABI')
             THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
    AND CASE WHEN (lower(:waterfall_filter) IN ('sub_brand') AND :brand != 'All')
               OR (lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand != 'All')
             THEN brand_level_1 = :brand ELSE TRUE END
),

/* ===== VOLUME LOOKUPS ===== */
vol_lookup AS (
  SELECT ts.step_name,
    CASE WHEN ABS(COALESCE(va.vol_ly, 0)) > 0
      THEN CASE WHEN ABS(COALESCE(va.vol_og_ly, 0) / va.vol_ly * 100) > 1000000000 THEN 100.0
        ELSE COALESCE(va.vol_og_ly, 0) / ABS(va.vol_ly) * 100 END
      ELSE NULL END AS vol_vs_ly,
    va.vol_ac
  FROM top_steps ts LEFT JOIN vol_step_agg va ON ts.step_name = va.step_name

  UNION ALL

  SELECT 'Others' AS step_name,
    CASE WHEN ABS(p.vol_ly - COALESCE(s.total_vol_ly, 0)) > 0
      THEN CASE WHEN ABS((p.vol_og_ly - COALESCE(s.total_vol_og_ly, 0)) / (p.vol_ly - COALESCE(s.total_vol_ly, 0)) * 100) > 1000000000 THEN 100.0
        ELSE (p.vol_og_ly - COALESCE(s.total_vol_og_ly, 0)) / ABS(p.vol_ly - COALESCE(s.total_vol_ly, 0)) * 100 END
      ELSE NULL END AS vol_vs_ly,
    p.vol_ac - COALESCE(s.vol_ac, 0) AS vol_ac
  FROM vol_parent_data p
  CROSS JOIN (
    SELECT COALESCE(SUM(va.vol_ly), 0) AS total_vol_ly,
           COALESCE(SUM(va.vol_og_ly), 0) AS total_vol_og_ly,
           COALESCE(SUM(va.vol_ac), 0) AS vol_ac
    FROM top_steps ts LEFT JOIN vol_step_agg va ON ts.step_name = va.step_name
  ) s

  UNION ALL

  SELECT :period_type || "'" || DATE_FORMAT(:dt_end, 'yy') AS step_name,
    CASE WHEN ABS(COALESCE(p.vol_ly, 0)) > 0
      THEN CASE WHEN ABS(COALESCE(p.vol_og_ly, 0) / p.vol_ly * 100) > 1000000000 THEN 100.0
        ELSE COALESCE(p.vol_og_ly, 0) / ABS(p.vol_ly) * 100 END
      ELSE NULL END AS vol_vs_ly,
    p.vol_ac
  FROM vol_parent_data p
),

/* ===== FINAL ASSEMBLY ===== */
others_bar AS (
  SELECT 'Others' AS step_name,
    p.ac - COALESCE(s.total_ac, 0) AS ac,
    p.ly - COALESCE(s.total_ly, 0) AS ly,
    p.ac_vs_ly - COALESCE(s.total_vs_ly, 0) AS ac_vs_ly,
    p.delta - COALESCE(s.total_delta, 0) AS delta,
    CASE WHEN lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI' THEN 16
      ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 1 END AS rnk
  FROM parent_base p
  CROSS JOIN (
    SELECT COALESCE(SUM(ac), 0) AS total_ac,
           COALESCE(SUM(ly), 0) AS total_ly,
           COALESCE(SUM(ac_vs_ly), 0) AS total_vs_ly,
           COALESCE(SUM(delta), 0) AS total_delta
    FROM top_steps
  ) s
),

final AS (
  SELECT step_name, ROUND(ac, 1) AS ac, ROUND(delta, 1) AS delta, ROUND(ac_vs_ly, 1) AS ac_vs_ly, rnk
  FROM top_steps
  UNION ALL
  SELECT step_name, ROUND(ac, 1) AS ac, ROUND(delta, 1) AS delta, ROUND(ac_vs_ly, 1) AS ac_vs_ly, rnk
  FROM others_bar
  UNION ALL
  SELECT :period_type || "'" || DATE_FORMAT(ADD_MONTHS(:dt_end, -12), 'yy') AS step_name,
    ROUND(LY, 1) AS ac,
    ROUND(LY_VS_LY, 1) AS delta,
    ROUND(LY_VS_LY, 1) AS ac_vs_ly,
    0 AS rnk
  FROM parent_base
  UNION ALL
  SELECT :period_type || "'" || DATE_FORMAT(:dt_end, 'yy') AS step_name,
    ROUND(AC, 1) AS ac,
    ROUND(DELTA, 1) AS delta,
    ROUND(AC_VS_LY, 1) AS ac_vs_ly,
    CASE WHEN lower(:waterfall_filter) = 'country' AND :zone = 'ABI' AND :country = 'ABI' THEN 17
      ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 2 END AS rnk
  FROM parent_base
),

result AS (
  SELECT
    f.step_name AS labels,
    CASE
      WHEN LEFT(f.step_name, 3) = :period_type THEN
        CASE WHEN lower(:waterfall_filter) IN ('sub_brand') THEN :brand
             WHEN lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand != 'All' THEN :brand
             ELSE '' END
      WHEN lower(:waterfall_filter) IN ('brand') AND :country = 'ABI' THEN get(split(f.step_name, CHR(10)), 0)
      WHEN lower(:waterfall_filter) IN ('brand') AND :country != 'ABI' THEN f.step_name
      WHEN lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand = 'All' THEN f.step_name
      WHEN lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand != 'All' THEN :brand
      WHEN lower(:waterfall_filter) IN ('sub_brand') THEN :brand
      ELSE '' END AS raw_brand,
    CASE
      WHEN LEFT(f.step_name, 3) = :period_type THEN
        CASE WHEN :country != 'ABI' THEN :country WHEN :zone != 'ABI' THEN :zone ELSE 'ABI' END
      WHEN lower(:waterfall_filter) = 'country' AND :country = 'ABI' THEN f.step_name
      WHEN lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND COALESCE(:sub_brand, 'All') = 'All' THEN :country
      WHEN lower(:waterfall_filter) = 'country' THEN f.step_name
      WHEN lower(:waterfall_filter) IN ('brand') AND :country = 'ABI' THEN get(split(f.step_name, CHR(10)), 1)
      WHEN lower(:waterfall_filter) IN ('brand') AND :country != 'ABI' THEN :country
      WHEN lower(:waterfall_filter) = 'growth_levers' AND :country = 'ABI' THEN f.step_name
      WHEN lower(:waterfall_filter) = 'growth_levers' AND :country != 'ABI' THEN :country
      ELSE '' END AS country_iso_code_3,
    CASE
      WHEN LEFT(f.step_name, 3) = :period_type THEN ''
      WHEN lower(:waterfall_filter) IN ('sub_brand') THEN f.step_name
      WHEN lower(:waterfall_filter) = 'country' AND :country != 'ABI' AND :brand != 'All' AND COALESCE(:sub_brand, 'All') = 'All' THEN f.step_name
      WHEN lower(:waterfall_filter) = 'growth_levers' AND :country != 'ABI' THEN f.step_name
      ELSE '' END AS product_type,
    f.ac,
    f.delta,
    f.ac_vs_ly AS vs_ly,
    CASE WHEN f.rnk = 0 THEN CAST(NULL AS DECIMAL(10,1)) ELSE ROUND(vl.vol_vs_ly, 1) END AS vol_vs_ly,
    vl.vol_ac / SUM(CASE WHEN vl.step_name != :period_type || "'" || DATE_FORMAT(:dt_end, 'yy') THEN vl.vol_ac END) OVER() * 100 AS vol_weight,
    '%' AS unit_of_measure, 'pp' AS comp_unit_of_measure,
    :dt_end AS filter_dt_end, :period_type AS filter_period_type,
    :waterfall_filter AS filter_waterfall_filter, :country AS filter_country,
    :zone AS filter_zone, :brand AS filter_brand,
    COALESCE(NULLIF(:max_ranked, ''), 15) AS filter_max_ranked, f.rnk
  FROM final f
  LEFT JOIN vol_lookup vl ON f.step_name = vl.step_name
)
  SELECT *
  FROM result
  WHERE NOT (
    LEFT(labels, 3) != :period_type
    AND COALESCE(AC, 0) = 0 AND COALESCE(DELTA, 0) = 0 AND COALESCE(VS_LY, 0) = 0
  )
  ORDER BY rnk