/*----------------------------------------------------------------------------*/
/* Growth Levers & Priorities - Market Share Table                            */
/*----------------------------------------------------------------------------*/
/* Thor Marinho    - 2026.04.10 - Query creation                              */
/*                                                                            */
/* Source: gold_common.tlh_kpis_agg                                           */
/*   version_id 12  = global weighted average by Vol. BU FY (28 countries)    */
/*   version_id 10  = zone-level by price tier (abi_zone — EUR only)          */
/*   version_id 11  = country-level by price tier (individual countries)      */
/*   version_id 227 = Priorities segment-level (Local Core Plus, Local        */
/*                    Prem/SP)                                                */
/*                                                                            */
/* view_level → version_id & filter mapping:                                  */
/*   Growth Levers Global  → 12  (price_tier → Superior Core / Lead Premium / */
/*                                Balanced Choices / Beyond Beer)              */
/*   Growth Levers Country → 10  when :country = 'EUR' (abi_zone = 'EUR')     */
/*                         → 11  otherwise (country_iso_code_3 = :country)    */
/*   Priorities (Global)   → 227 (segment → Local Core Plus / Local Prem/SP)  */
/*   Priorities Country    → 227 (segment → Local Core Plus / Local Prem/SP)  */
/*                                                                            */
/* Parameters:                                                                */
/*   :view_level    — 'Growth Levers Global', 'Growth Levers Country',        */
/*                    'Growth Levers', 'Priorities', 'Priorities Global',      */
/*                    'Priorities Country'                                     */
/*   :dt_end        — Reference date (auto-capped to latest available data)   */
/*   :country       — 'EUR' for Europe (zone) or ISO3 country code            */
/*   :growth_lever  — Filter by label ('All' = no filter). Accepts both       */
/*                    Growth Lever names (Superior Core, Lead Premium, ...)    */
/*                    and Priorities names (Local Core Plus, Local Prem/SP)    */
/*                                                                            */
/* Parameter scope:                                                           */
/*   view_level               :dt_end  :country  :growth_lever                */
/*   Growth Levers Global     active   IGNORED   active                       */
/*   Growth Levers / bare     active   IGNORED   active                       */
/*   Growth Levers Country    active   active    active                       */
/*   Priorities / bare        active   IGNORED   active                       */
/*   Priorities Global        active   IGNORED   active                       */
/*   Priorities Country       active   active    active                       */
/*   :country is IGNORED for non-Country views (avoids breaking the query).   */
/*                                                                            */
/* Notes:                                                                     */
/*   Bare values ('Growth Levers', 'Priorities') are treated as Global.       */
/*   All expected labels always appear via scaffold LEFT JOIN.                 */
/*   EUR is a special case: uses zone-level v10 (abi_zone).                   */
/*----------------------------------------------------------------------------*/

WITH
/* --- Reference date from the market share KPI --- */
cte_filter AS (
    SELECT
        CASE WHEN to_date(:dt_end) < dt_end THEN dt_end_last ELSE dt_end END AS ref_date
    FROM gold_common.owr_kpis_min_max_dates_lk
    WHERE kpi_name = 'market_share'
      AND version_id = CASE
            WHEN :view_level = 'Growth Levers Country' AND :country = 'EUR' THEN 10
            WHEN :view_level = 'Growth Levers Country' THEN 11
            WHEN :view_level LIKE 'Growth Levers%'     THEN 12
            WHEN :view_level LIKE 'Priorities%'        THEN 227
            ELSE 12
          END
    LIMIT 1
),

/* --- Scaffold: all expected labels per view (ensures rows even without data) --- */
cte_scaffold AS (
    SELECT *
    FROM VALUES
        ('Superior Core',    1, 'Growth Levers'),
        ('Lead Premium',     2, 'Growth Levers'),
        ('Balanced Choices', 3, 'Growth Levers'),
        ('Beyond Beer',      4, 'Growth Levers'),
        ('Local Core Plus',  1, 'Priorities'),
        ('Local Prem/SP',    2, 'Priorities')
    AS t(label, sort_order, view_group)
    WHERE (
        (view_group = 'Growth Levers' AND :view_level LIKE 'Growth Levers%')
        OR
        (view_group = 'Priorities'     AND :view_level LIKE 'Priorities%')
    )
    /* :growth_lever filter — active for all views */
    AND (:growth_lever = 'All' OR label = :growth_lever)
),

/* --- Market share data: Growth Levers (v12/v10/v11) or Priorities (v227) --- */
cte_raw AS (
    SELECT
        CASE
            WHEN :view_level = 'Growth Levers Country' AND :country = 'EUR'
                THEN ms.abi_zone
            ELSE ms.country_iso_code_3
        END AS zone_or_country,
        CASE
            WHEN :view_level LIKE 'Growth Levers%' THEN
                CASE ms.price_tier
                    WHEN 'Core Superiority'  THEN 'Superior Core'
                    WHEN 'Premiumization'    THEN 'Lead Premium'
                    WHEN 'Balanced Choices'  THEN 'Balanced Choices'
                    WHEN 'Beyond Beer'       THEN 'Beyond Beer'
                END
            WHEN :view_level LIKE 'Priorities%' THEN ms.segment
        END AS growth_lever,
        ms.dt_ini,
        ms.dt_end,
        ms.ac,
        ms.ly,
        ms.ac_vs_ly
    FROM {{KPI_TABLE}} ms
    CROSS JOIN cte_filter f
    WHERE ms.kpi_name     = 'market_share'
      AND ms.version_id   = CASE
            WHEN :view_level = 'Growth Levers Country' AND :country = 'EUR' THEN 10
            WHEN :view_level = 'Growth Levers Country' THEN 11
            WHEN :view_level LIKE 'Growth Levers%'     THEN 12
            WHEN :view_level LIKE 'Priorities%'        THEN 227
            ELSE 12
          END
      AND ms.dt_end       = f.ref_date
      /* View-specific row filters */
      AND (
          (:view_level LIKE 'Growth Levers%' AND ms.price_tier IN ('Core Superiority', 'Premiumization', 'Balanced Choices', 'Beyond Beer'))
          OR
          (:view_level LIKE 'Priorities%'    AND ms.segment IN ('Local Core Plus', 'Local Prem/SP'))
      )
      /* :country filter — IGNORED unless view_level ends with 'Country' */
      AND (
          :view_level NOT LIKE '%Country'
          OR
          (:view_level = 'Growth Levers Country' AND :country = 'EUR' AND ms.abi_zone = 'EUR')
          OR
          (:view_level = 'Growth Levers Country' AND :country <> 'EUR' AND ms.country_iso_code_3 = :country)
          OR
          (:view_level = 'Priorities Country'    AND ms.country_iso_code_3 = :country)
      )
      /* :growth_lever filter — active for all views */
      AND (
          :growth_lever = 'All'
          OR (:view_level LIKE 'Growth Levers%' AND
              CASE ms.price_tier
                  WHEN 'Core Superiority' THEN 'Superior Core'
                  WHEN 'Premiumization'   THEN 'Lead Premium'
                  WHEN 'Balanced Choices' THEN 'Balanced Choices'
                  WHEN 'Beyond Beer'      THEN 'Beyond Beer'
                  ELSE ms.price_tier
              END = :growth_lever)
          OR (:view_level LIKE 'Priorities%' AND ms.segment = :growth_lever)
      )
),

/* --- Map date ranges to periods (handles Jan where MTD = YTD) --- */
cte_ms AS (
    SELECT r.zone_or_country, r.growth_lever, p.period, r.ac, r.ly, r.ac_vs_ly, r.dt_ini, r.dt_end
    FROM cte_raw r
    LATERAL VIEW EXPLODE(
        CASE
            WHEN r.dt_ini = r.dt_end AND MONTH(r.dt_ini) = 1
                THEN ARRAY('MTD', 'YTD')
            WHEN r.dt_ini = r.dt_end
                THEN ARRAY('MTD')
            WHEN MONTH(r.dt_ini) = 1 AND r.dt_ini <> r.dt_end
                THEN ARRAY('YTD')
            WHEN CAST(MONTHS_BETWEEN(r.dt_end, r.dt_ini) AS INT) = 2 and month(dt_ini) <> 1
                THEN ARRAY('L3M')
            ELSE ARRAY()
        END
    ) p AS period
),
cte_ms1 AS (
    SELECT r.zone_or_country, r.growth_lever, p.period, r.ac, r.ly, r.ac_vs_ly, r.dt_ini, r.dt_end
    FROM cte_raw r
    LATERAL VIEW EXPLODE(
        CASE
            WHEN CAST(MONTHS_BETWEEN(r.dt_end, r.dt_ini) AS INT) = 2 and month(dt_ini) = 1
                THEN ARRAY('L3M')
            ELSE ARRAY()
        END
    ) p AS period
),

/* --- Pivot periods into columns --- */
cte_pivoted1 AS (
    SELECT
        zone_or_country,
        growth_lever,
        MAX(CASE WHEN period = 'MTD' THEN ROUND(ac_vs_ly, 1) END) AS mtd_vs_ly_pp,
        MAX(CASE WHEN period = 'L3M' THEN ROUND(ac_vs_ly, 1) END) AS l3m_vs_ly_pp,
        MAX(CASE WHEN period = 'YTD' THEN ROUND(ac_vs_ly, 1) END) AS ytd_vs_ly_pp
    FROM cte_ms
    GROUP BY zone_or_country, growth_lever
    union all 
    SELECT
        zone_or_country,
        growth_lever,
        MAX(CASE WHEN period = 'MTD' THEN ROUND(ac_vs_ly, 1) END) AS mtd_vs_ly_pp,
        MAX(CASE WHEN period = 'L3M' THEN ROUND(ac_vs_ly, 1) END) AS l3m_vs_ly_pp,
        MAX(CASE WHEN period = 'YTD' THEN ROUND(ac_vs_ly, 1) END) AS ytd_vs_ly_pp
    FROM cte_ms1
    GROUP BY zone_or_country, growth_lever
),
cte_pivoted AS (
    SELECT
        zone_or_country,
        growth_lever,
        MAX(mtd_vs_ly_pp) AS mtd_vs_ly_pp,
        MAX(l3m_vs_ly_pp) AS l3m_vs_ly_pp,
        MAX(ytd_vs_ly_pp) AS ytd_vs_ly_pp
    FROM cte_pivoted1
    GROUP BY zone_or_country, growth_lever
)
/* --- Final SELECT: scaffold LEFT JOIN ensures all expected labels appear --- */
SELECT
    COALESCE(p.zone_or_country,
        CASE WHEN :view_level LIKE '%Country' THEN :country ELSE 'ABI' END
    ) AS country_iso_code_3,
    s.label AS growth_lever,
    (SELECT ref_date FROM cte_filter) AS dt_end,
    p.mtd_vs_ly_pp,
    p.l3m_vs_ly_pp,
    p.ytd_vs_ly_pp
FROM cte_scaffold s
LEFT JOIN cte_pivoted p ON p.growth_lever = s.label
ORDER BY s.sort_order