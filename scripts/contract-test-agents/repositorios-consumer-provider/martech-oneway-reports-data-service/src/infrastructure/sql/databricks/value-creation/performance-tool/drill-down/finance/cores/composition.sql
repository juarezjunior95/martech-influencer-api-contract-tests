/* CORES Composition Waterfall - KPI Performance com Filtros Globais */

WITH kpi_base AS (
    SELECT
        -- 1. AC
        MEASURE(nr_ac) AS nr_ac,
        MEASURE(vic_ac) AS vic_ac,
        MEASURE(vlc_ac) AS vlc_ac,
        MEASURE(maco_ac) AS maco_ac,
        MEASURE(sales_c_ac) AS sales_ac,
        MEASURE(mkt_c_ac) AS mkt_ac,
        MEASURE(cores_ac) AS cores_ac,

        -- 2. AC vs LY
        MEASURE(nr_ac_vs_ly) AS nr_ac_vs_ly,
        MEASURE(vic_ac_vs_ly) AS vic_ac_vs_ly,
        MEASURE(vlc_ac_vs_ly) AS vlc_ac_vs_ly,
        MEASURE(maco_ac_vs_ly) AS maco_ac_vs_ly,
        MEASURE(sales_c_ac_vs_ly) AS sales_ac_vs_ly,
        MEASURE(mkt_c_ac_vs_ly) AS mkt_ac_vs_ly,
        MEASURE(cores_ac_vs_ly) AS cores_ac_vs_ly,

        -- 3. AC/hl
        MEASURE(nr_ac_per_hl) AS nr_per_hl,
        MEASURE(vic_ac_per_hl) AS vic_per_hl,
        MEASURE(vlc_ac_per_hl) AS vlc_per_hl,
        MEASURE(maco_ac_per_hl) AS maco_per_hl,
        MEASURE(sales_c_ac_per_hl) AS sales_per_hl,
        MEASURE(mkt_c_ac_per_hl) AS mkt_per_hl,
        MEASURE(cores_ac_per_hl) AS cores_per_hl,

        -- 4. AC/hl vs LY
        MEASURE(nr_per_hl_vs_ly) AS nr_per_hl_vs_ly,
        MEASURE(vic_per_hl_vs_ly) AS vic_per_hl_vs_ly,
        MEASURE(vlc_per_hl_vs_ly) AS vlc_per_hl_vs_ly,
        MEASURE(maco_per_hl_vs_ly) AS maco_per_hl_vs_ly,
        MEASURE(sales_c_per_hl_vs_ly) AS sales_per_hl_vs_ly,
        MEASURE(mkt_c_per_hl_vs_ly) AS mkt_per_hl_vs_ly,
        MEASURE(cores_per_hl_vs_ly) AS cores_per_hl_vs_ly

    FROM gold_common.owr_finance_mv
    WHERE end_date = :dt_end
      AND period_type = CASE
                            WHEN :period_type = 'L3M' THEN 'R3M'
                            WHEN :period_type = 'MTD' THEN 'MTH'
                            ELSE :period_type
        END
      --AND end_date IN (:dt_end, ADD_MONTHS(:dt_end, -12))
      AND end_date = :dt_end
      AND CASE :growth_lever
              WHEN 'Lead Premium' THEN is_lead_premium_growth_lever = True
              WHEN 'Superior Core' THEN is_superior_core_growth_lever = True
              WHEN 'Beyond Beer' THEN is_beyond_beer_growth_lever = True
              WHEN 'Balanced Choices' THEN is_balanced_choice_growth_lever = True
              ELSE True
        END
        /* Page filters */
      AND CASE WHEN :brand != 'All' THEN brand_level_1 = :brand ELSE True END
      AND CASE WHEN :sub_brand != 'All' THEN brand_level_3 = :sub_brand ELSE TRUE END
      AND CASE WHEN :country != 'ABI' THEN country_iso_code_3 = :country ELSE True END
      AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE True END
    AND CASE
    WHEN :page_filter IN ('Megabrands', 'Expansion', 'Sustain', 'Tail') THEN portfolio_nab_other = :page_filter
    WHEN :page_filter IN ('Premium', 'Super Premium', 'Core+', 'Core', 'Value', 'Other') THEN price_tier = :page_filter
    ELSE True
END
AND CASE
            WHEN :page_filter IN ('Premium', 'Super Premium', 'Core+', 'Core', 'Value', 'Other') OR :waterfall_filter = 'beer_price_segment' THEN upper(product_type) = 'BEER'
            WHEN :page_filter IN ('Michelob Ultra', 'Budweiser', 'Corona', 'Stella Artois') THEN upper(product_type) = 'BEER'
            ELSE True
END
GROUP BY ALL
),
unpivoted_steps AS (
    SELECT 1 AS rnk, 'Net Revenue' AS step, nr_ac AS ac, nr_ac_vs_ly AS ac_vs_ly, nr_per_hl AS per_hl, nr_per_hl_vs_ly AS per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 2, 'VIC', vic_ac, vic_ac_vs_ly, vic_per_hl, vic_per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 3, 'VLC', vlc_ac, vlc_ac_vs_ly, vlc_per_hl, vlc_per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 4, 'MACO', maco_ac, maco_ac_vs_ly, maco_per_hl, maco_per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 5, 'Sales', sales_ac, sales_ac_vs_ly, sales_per_hl, sales_per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 6, 'Marketing', mkt_ac, mkt_ac_vs_ly, mkt_per_hl, mkt_per_hl_vs_ly FROM kpi_base
    UNION ALL
    SELECT 7, 'CORES', cores_ac, cores_ac_vs_ly, cores_per_hl, cores_per_hl_vs_ly FROM kpi_base
)
SELECT
    step AS step_name,
    ROUND(ac, 1) AS ac,
    ROUND(ac_vs_ly, 1) AS ac_vs_ly,
    ROUND(per_hl, 2) AS per_hl,
    ROUND(per_hl_vs_ly, 1) AS per_hl_vs_ly
FROM unpivoted_steps
ORDER BY rnk;