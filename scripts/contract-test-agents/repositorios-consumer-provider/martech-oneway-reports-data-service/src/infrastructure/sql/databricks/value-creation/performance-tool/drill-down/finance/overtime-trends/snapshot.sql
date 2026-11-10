/* ENV_[OWR] Performance Tool - Volume - Bar Chart*/
/* RAFAEL DIAS - 2026.05.22 - MARTLH-11187: vs LY na barra do periodo anterior; removido bloco ly sem uso & ac_vs_bu na barra do periodo anterior */
/* RAFAEL DIAS - 2026.05.26 - MARTLH-11592: bu_vs_ly -> bu_vs_lyam (denominador am_vly, paridade com Brand P&L) */

WITH raw_data AS (
  SELECT
      :kpi,
      ini_date          AS dt_ini,
      end_date          AS dt_end,
ROUND( 
    CASE :kpi
      WHEN 'gross'        THEN MEASURE(gross_ac_lyam)
      WHEN 'maco'         THEN MEASURE(maco_ac_lyam)
      WHEN 'vic'          THEN MEASURE(vic_ac_lyam)
      WHEN 'mkt_c'        THEN MEASURE(mkt_c_ac_lyam)
      WHEN 'nr'           THEN MEASURE(nr_ac_lyam)
      WHEN 'excise_taxes' THEN MEASURE(excise_taxes_ac_lyam)
      WHEN 'vlc'          THEN MEASURE(vlc_ac_lyam)
      WHEN 'cores'        THEN MEASURE(cores_ac_lyam)
      WHEN 'vilc'         THEN MEASURE(vilc_ac_lyam)
      WHEN 'sales_c'      THEN MEASURE(sales_c_ac_lyam)
      WHEN 'volume'       THEN MEASURE(volume_ac_lyam)
      WHEN 'discounts'    THEN MEASURE(discounts_ac_lyam)
      WHEN 'sm'           THEN MEASURE(sm_ac_lyam)
      ELSE MEASURE(volume_ac_lyam)
    END
,1) AS ac,
ROUND( 
    CASE :kpi
      WHEN 'gross'        THEN MEASURE(gross_bu)
      WHEN 'maco'         THEN MEASURE(maco_bu)
      WHEN 'vic'          THEN MEASURE(vic_bu)
      WHEN 'mkt_c'        THEN MEASURE(mkt_c_bu)
      WHEN 'nr'           THEN MEASURE(nr_bu)
      WHEN 'excise_taxes' THEN MEASURE(excise_taxes_bu)
      WHEN 'vlc'          THEN MEASURE(vlc_bu)
      WHEN 'cores'        THEN MEASURE(cores_bu)
      WHEN 'vilc'         THEN MEASURE(vilc_bu)
      WHEN 'sales_c'      THEN MEASURE(sales_c_bu)
      WHEN 'volume'       THEN MEASURE(volume_bu)
      WHEN 'discounts'    THEN MEASURE(discounts_bu)
      WHEN 'sm'           THEN MEASURE(sm_bu)
      ELSE MEASURE(volume_bu)
    END
,1) AS bu,
ROUND( 
    CASE :kpi
      WHEN 'gross'        THEN MEASURE(gross_ac_vs_ly)
      WHEN 'maco'         THEN MEASURE(maco_ac_vs_ly)
      WHEN 'vic'          THEN MEASURE(vic_ac_vs_ly)
      WHEN 'mkt_c'        THEN MEASURE(mkt_c_ac_vs_ly)
      WHEN 'nr'           THEN MEASURE(nr_ac_vs_ly)
      WHEN 'excise_taxes' THEN MEASURE(excise_taxes_ac_vs_ly)
      WHEN 'vlc'          THEN MEASURE(vlc_ac_vs_ly)
      WHEN 'cores'        THEN MEASURE(cores_ac_vs_ly)
      WHEN 'vilc'         THEN MEASURE(vilc_ac_vs_ly)
      WHEN 'sales_c'      THEN MEASURE(sales_c_ac_vs_ly)
      WHEN 'volume'       THEN MEASURE(volume_ac_vs_ly)
      WHEN 'discounts'    THEN MEASURE(discounts_ac_vs_ly)
      WHEN 'sm'           THEN MEASURE(sm_ac_vs_ly)
      ELSE MEASURE(volume_ac_vs_ly)
    END
,1) AS ac_vs_ly,
ROUND( 
    CASE :kpi
      WHEN 'gross'        THEN MEASURE(gross_ac_vs_bu)
      WHEN 'maco'         THEN MEASURE(maco_ac_vs_bu)
      WHEN 'vic'          THEN MEASURE(vic_ac_vs_bu)
      WHEN 'mkt_c'        THEN MEASURE(mkt_c_ac_vs_bu)
      WHEN 'nr'           THEN MEASURE(nr_ac_vs_bu)
      WHEN 'excise_taxes' THEN MEASURE(excise_taxes_ac_vs_bu)
      WHEN 'vlc'          THEN MEASURE(vlc_ac_vs_bu)
      WHEN 'cores'        THEN MEASURE(cores_ac_vs_bu)
      WHEN 'vilc'         THEN MEASURE(vilc_ac_vs_bu)
      WHEN 'sales_c'      THEN MEASURE(sales_c_ac_vs_bu)
      WHEN 'volume'       THEN MEASURE(volume_ac_vs_bu)
      WHEN 'discounts'    THEN MEASURE(discounts_ac_vs_bu)
      WHEN 'sm'           THEN MEASURE(sm_ac_vs_bu)
      ELSE MEASURE(volume_ac_vs_bu)
    END
,1) AS ac_vs_bu,
ROUND( 
    CASE :kpi
      WHEN 'gross'        THEN MEASURE(gross_bu_vs_lyam)
      WHEN 'maco'         THEN MEASURE(maco_bu_vs_lyam)
      WHEN 'vic'          THEN MEASURE(vic_bu_vs_lyam)
      WHEN 'mkt_c'        THEN MEASURE(mkt_c_bu_vs_lyam)
      WHEN 'nr'           THEN MEASURE(nr_bu_vs_lyam)
      WHEN 'excise_taxes' THEN MEASURE(excise_taxes_bu_vs_lyam)
      WHEN 'vlc'          THEN MEASURE(vlc_bu_vs_lyam)
      WHEN 'cores'        THEN MEASURE(cores_bu_vs_lyam)
      WHEN 'vilc'         THEN MEASURE(vilc_bu_vs_lyam)
      WHEN 'sales_c'      THEN MEASURE(sales_c_bu_vs_lyam)
      WHEN 'volume'       THEN MEASURE(volume_bu_vs_lyam)
      WHEN 'discounts'    THEN MEASURE(discounts_bu_vs_lyam)
      WHEN 'sm'           THEN MEASURE(sm_bu_vs_lyam)
      ELSE MEASURE(volume_bu_vs_lyam)
    END
,1) AS bu_vs_ly
  FROM  gold_common.owr_finance_mv
  WHERE
    period_type = CASE 
                              WHEN :period_type = 'L3M' THEN 'R3M'
                              WHEN :period_type = 'MTD' THEN 'MTH'
                              ELSE :period_type
                        END
    AND end_date IN (:dt_end, ADD_MONTHS(:dt_end, -12))
    AND CASE :growth_lever
            WHEN 'Lead Premium' THEN is_lead_premium_growth_lever = TRUE
            WHEN 'Superior Core' THEN is_superior_core_growth_lever = TRUE
            WHEN 'Beyond Beer' THEN is_beyond_beer_growth_lever = TRUE
            WHEN 'Balanced Choices' THEN is_balanced_choice_growth_lever = TRUE
            ELSE TRUE
        END
    AND CASE WHEN :brand != 'All' THEN brand_level_1 = :brand ELSE TRUE END
    AND CASE WHEN :sub_brand != 'All' THEN brand_level_3 = :sub_brand ELSE TRUE END
    AND CASE WHEN :country != 'ABI' THEN country_iso_code_3 = :country ELSE TRUE END
    AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
    AND CASE 
          WHEN :page_filter IN ('Megabrands', 'Expansion', 'Sustain', 'Tail') THEN portfolio_nab_other = :page_filter
          WHEN :page_filter IN ('Premium', 'Super Premium', 'Core+', 'Core', 'Value', 'Other') THEN price_tier = :page_filter
          ELSE TRUE
        END
    AND CASE 
          WHEN :page_filter IN ('Premium', 'Super Premium', 'Core+', 'Core', 'Value', 'Other') OR :waterfall_filter = 'beer_price_segment' THEN upper(product_type) = 'BEER'
          WHEN :page_filter IN ('Michelob Ultra', 'Budweiser', 'Corona', 'Stella Artois') THEN upper(product_type) = 'BEER'
          ELSE TRUE
        END
  GROUP BY ALL
),
final_data AS (
    SELECT 
      dt_ini,
      dt_end,
      :period_type || "'" || DATE_FORMAT(dt_end, 'yy') AS period,
      ac          AS ac,
      ac_vs_ly    AS ac_vs_ly,
      ac_vs_bu    AS ac_vs_bu,
      1           AS rnk
    FROM raw_data
    WHERE dt_end = ADD_MONTHS(:dt_end, -12)
    UNION ALL
    SELECT 
      dt_ini,
      dt_end,
      "BU'" || DATE_FORMAT(dt_end, 'yy') AS period,
      bu          AS ac,
      bu_vs_ly    AS ac_vs_ly,
      NULL        AS ac_vs_bu,
      2           AS rnk
    FROM raw_data 
    WHERE dt_end = :dt_end
    UNION ALL
    SELECT 
      dt_ini,
      dt_end,
      :period_type || "'" || DATE_FORMAT(dt_end, 'yy') AS period,
      ac          AS ac,
      ac_vs_ly    AS ac_vs_ly,
      ac_vs_bu    AS ac_vs_bu,
      3           AS rnk
    FROM raw_data 
    WHERE dt_end = :dt_end
)
SELECT 
  dt_ini,
  dt_end,
  period, 
  ROUND(ac, 1) ac, 
  ROUND(ac_vs_ly, 1) ac_vs_ly, 
  ROUND(ac_vs_bu, 1) ac_vs_bu,
  'k hl' AS unit_of_measure,
  '%' AS comp_unit_of_measure
FROM final_data 
ORDER BY rnk;