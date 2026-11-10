/*----------------------------------------------------------------------------*/
/* Market Share Table — Must Win                                              */
/*----------------------------------------------------------------------------*/
/* Thor Marinho    - 2026.04.20 - Query creation                              */
/*                                                                            */
/* Source: gold_common.tlh_kpis_agg                                         */
/*   version_id 219 = ABI / Growth Levers (weighted avg by price_tier)        */
/*   version_id 217 = Brand-level (raw_brand + maturity, per country)         */
/*   version_id 218 = Subbrand-level (level_3) + ABI maturity totals          */
/*                                                                            */
/* Viewtype → version_id & filter mapping:                                    */
/*   Global       → 216 (raw_brand IS NULL, level_3 IS NULL → ABI maturity)   */
/*   Growth Levers→ 219 (price_tier → Superior Core / Lead Premium / ...)     */
/*   Brand        → 217 (raw_brand IS NOT NULL, level_2 IS NOT NULL)          */
/*   Subbrand     → 218 (level_3 IS NOT NULL, level_2 IS NOT NULL)            */
/*                                                                            */
/* Country → Maturity classification:                                         */
/*   Must Win       = BRA, USA, MEX, CHN, ZAF                                */
/*   Stable/Mature  = EUR, KOR, CAN                                          */
/*   High Growth    = COL, ARG, PER, NGA, IND, DOM, ECU                      */
/*                                                                            */
/* Output columns:                                                            */
/*   row_label    — Always maturity (Must Win / Stable/Mature / High Growth)  */
/*   countries    — Semicolon-separated country codes for each row_label      */
/*   view_label   — Viewtype-specific dimension:                              */
/*                  Growth Levers → Superior Core / Lead Premium / ...         */
/*                  Brand         → brand name                                */
/*                  Subbrand      → subbrand name                             */
/*                  Global        → NULL                                      */
/*                                                                            */
/* Parameters:                                                                */
/*   :segment      — 'Global', 'Growth Levers', 'Brand', 'Subbrand'          */
/*   :dt_end        — Reference date (auto-capped to latest available data)   */
/*   :brand         — Filter by brand   (Brand / Subbrand views; 'All' = all) */
/*   :sub_brand      — Filter by subbrand (Subbrand view only;   'All' = all)  */
/*   :growth_lever  — Filter by lever  (Growth Levers view only; 'All' = all) */
/*----------------------------------------------------------------------------*/

WITH
/* --- Reference date from the market share KPI --- */
cte_filter AS (
    SELECT
        CASE WHEN to_date(:dt_end) < dt_end THEN dt_end_last ELSE dt_end END AS ref_date
    FROM gold_common.owr_kpis_min_max_dates_lk
    WHERE kpi_name = 'market_share'
      AND version_id = CASE :segment
            WHEN 'Global'        THEN 216
            WHEN 'Growth Levers' THEN 219
            WHEN 'Subbrand'      THEN 218
            WHEN 'Brand'         THEN 217
          END
    LIMIT 1
),

/* --- Market share data filtered by viewtype --- */
cte_raw AS (
    SELECT
        /* row_label: always maturity (from level_2) */
        ms.level_2 AS row_label,
        /* view_label: viewtype-specific dimension */
        CASE :segment
            WHEN 'Growth Levers' THEN
                CASE ms.price_tier
                    WHEN 'Core Superiority' THEN 'Superior Core'
                    WHEN 'Premiumization'   THEN 'Lead Premium'
                    WHEN 'Balanced Choices'  THEN 'Balanced Choices'
                    WHEN 'Beyond Beer'       THEN 'Beyond Beer'
                END
            WHEN 'Brand'         THEN ms.raw_brand
            WHEN 'Subbrand'      THEN ms.level_3
            ELSE NULL
        END AS view_label,
        ms.country_iso_code_3,
        ms.dt_ini,
        ms.dt_end,
        ms.ac,
        ms.ly,
        ms.ac_vs_ly
    FROM {{KPI_TABLE}} ms
    CROSS JOIN cte_filter f
    WHERE ms.kpi_name     = 'market_share'
      AND ms.version_id   = CASE :segment
            WHEN 'Growth Levers' THEN 219
            WHEN 'Global'        THEN 216
            WHEN 'Subbrand'      THEN 218
            WHEN 'Brand'         THEN 217
          END
      AND ms.dt_end       = f.ref_date
      /* Viewtype-specific row filters */
      AND (
          (:segment = 'Global'        AND ms.raw_brand = 'N/A'  AND ms.level_3 = 'N/A'  AND ms.level_2 <> 'N/A')
          OR
          (:segment = 'Growth Levers' AND ms.price_tier IN ('Core Superiority', 'Premiumization', 'Balanced Choices', 'Beyond Beer'))
          OR
          (:segment = 'Brand'         AND ms.raw_brand <> 'N/A' AND ms.level_2 <> 'N/A')
          OR
          (:segment = 'Subbrand'      AND ms.level_3 <> 'N/A'   AND ms.level_2 <> 'N/A')
      )
      /* Optional parameter filters — scoped to relevant viewtypes only */
      AND (
          :segment NOT IN ('Brand', 'Subbrand')
          OR :brand = 'All'
          OR ms.raw_brand = :brand
      )
      AND (
          :segment <> 'Subbrand'
          OR :sub_brand = 'All'
          OR ms.level_3 = :sub_brand
      )
      AND (
          :segment <> 'Growth Levers'
          OR :growth_lever = 'All'
          OR CASE ms.price_tier
                WHEN 'Core Superiority' THEN 'Superior Core'
                WHEN 'Premiumization'   THEN 'Lead Premium'
                WHEN 'Balanced Choices' THEN 'Balanced Choices'
                WHEN 'Beyond Beer'      THEN 'Beyond Beer'
                ELSE ms.price_tier
             END = :growth_lever
      )
),

/* --- Map date ranges to periods (handles Jan where MTD = YTD) --- */
cte_periods AS (
    SELECT r.row_label, r.view_label, r.country_iso_code_3, p.period,
           r.ac, r.ly, r.ac_vs_ly, r.dt_ini, r.dt_end
    FROM cte_raw r
    LATERAL VIEW EXPLODE(
        CASE
            /* Single month = MTD; if January also = YTD */
            WHEN r.dt_ini = r.dt_end AND MONTH(r.dt_ini) = 1
                THEN ARRAY('MTD', 'YTD')
            WHEN r.dt_ini = r.dt_end
                THEN ARRAY('MTD')
            /* Year-to-date: starts January */
            WHEN MONTH(r.dt_ini) = 1 AND r.dt_ini <> r.dt_end
                THEN ARRAY('YTD')
            /* Rolling 3 months */
            WHEN CAST(MONTHS_BETWEEN(r.dt_end, r.dt_ini) AS INT) = 2 and MONTH(r.dt_ini) <> 1
                THEN ARRAY('L3M')
            ELSE ARRAY()
        END
    ) p AS period
)
,
cte_periods1 AS (
    SELECT r.row_label, r.view_label, r.country_iso_code_3, p.period,
           r.ac, r.ly, r.ac_vs_ly, r.dt_ini, r.dt_end
    FROM cte_raw r
    LATERAL VIEW EXPLODE(
        CASE
            /* Single month = MTD; if January also = YTD */
            WHEN CAST(MONTHS_BETWEEN(r.dt_end, r.dt_ini) AS INT) = 2 and MONTH(r.dt_ini) = 1
                THEN ARRAY('L3M')
            ELSE ARRAY()
        END
    ) p AS period
),
cte_final
(
    select row_label,
           countries,
           view_label,
           country_iso_code_3,
           dt_end,
           period,
           max(vs_ly_pp) vs_ly_pp
    from     
    (SELECT
        row_label,
        CASE row_label
            WHEN 'Must Win'       THEN 'BRA;USA;MEX;CHN;ZAF'
            WHEN 'Stable/Mature'  THEN 'EUR;KOR;CAN'
            WHEN 'High Growth'    THEN 'COL;ARG;PER;NGA;IND;DOM;ECU'
        END AS countries,
        view_label,
        country_iso_code_3,
        (SELECT ref_date FROM cte_filter) AS dt_end,
        period,
        ROUND(ac_vs_ly, 1) AS vs_ly_pp
    FROM cte_periods
    WHERE row_label IS NOT NULL
    union all 
    SELECT
        row_label,
        CASE row_label
            WHEN 'Must Win'       THEN 'BRA;USA;MEX;CHN;ZAF'
            WHEN 'Stable/Mature'  THEN 'EUR;KOR;CAN'
            WHEN 'High Growth'    THEN 'COL;ARG;PER;NGA;IND;DOM;ECU'
        END AS countries,
        view_label,
        country_iso_code_3,
        (SELECT ref_date FROM cte_filter) AS dt_end,
        period,
        ROUND(ac_vs_ly, 1) AS vs_ly_pp
    FROM cte_periods1
    WHERE row_label IS NOT NULL) A
    group by all 
)


/* --- One row per period (MTD / L3M / YTD) --- */
SELECT
    row_label,
    countries,
    view_label,
    country_iso_code_3,
    dt_end,
    period,
    ROUND(vs_ly_pp, 1) AS vs_ly_pp
FROM cte_final
WHERE row_label IS NOT NULL
ORDER BY
    CASE :segment
        WHEN 'Growth Levers' THEN
            CASE view_label
                WHEN 'Superior Core'     THEN 1
                WHEN 'Lead Premium'      THEN 2
                WHEN 'Balanced Choices'  THEN 3
                WHEN 'Beyond Beer'       THEN 4
            END
        ELSE NULL
    END ASC NULLS LAST,
    CASE row_label
        WHEN 'Must Win'       THEN 1
        WHEN 'Stable/Mature'  THEN 2
        WHEN 'High Growth'    THEN 3
    END ASC NULLS LAST,
    CASE period
        WHEN 'MTD' THEN 1
        WHEN 'L3M' THEN 2
        WHEN 'YTD' THEN 3
    END ASC