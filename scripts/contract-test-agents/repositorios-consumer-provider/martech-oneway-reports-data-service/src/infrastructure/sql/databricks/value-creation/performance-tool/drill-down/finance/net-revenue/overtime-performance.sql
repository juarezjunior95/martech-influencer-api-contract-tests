/*ENV_[OWR] Performance Tool - Net Revenue - Big Numbers*/
SELECT 
  :kpi,
  ini_date AS dt_ini,
  end_date AS dt_end,
  CASE 
        WHEN period_type = 'R3M' THEN 'L3M'
        WHEN period_type = 'MTH' THEN 'MTD'
        ELSE period_type
  END AS period,
  CASE 
    WHEN :kpi = 'volume' THEN 'k hl'
    ELSE concat('$', 'Mio')
  END AS unit_of_measure,
  '%' AS comp_unit_of_measure,

  ROUND(
      CASE :kpi
        WHEN 'gross'        THEN MEASURE(gross_ac)
        WHEN 'maco'         THEN MEASURE(maco_ac)
        WHEN 'vic'          THEN MEASURE(vic_ac)
        WHEN 'mkt_c'        THEN MEASURE(mkt_c_ac)
        WHEN 'nr'           THEN MEASURE(nr_ac)
        WHEN 'excise_taxes' THEN MEASURE(excise_taxes_ac)
        WHEN 'vlc'          THEN MEASURE(vlc_ac)
        WHEN 'cores'        THEN MEASURE(cores_ac)
        WHEN 'vilc'         THEN MEASURE(vilc_ac)
        WHEN 'sales_c'      THEN MEASURE(sales_c_ac)
        WHEN 'volume'       THEN MEASURE(volume_ac)
        WHEN 'discounts'    THEN MEASURE(discounts_ac)
        WHEN 'sm'           THEN MEASURE(sm_ac)
        ELSE MEASURE(nr_ac)
      END
  ,1) AS ac,

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
        ELSE MEASURE(nr_ac_vs_ly)
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
        ELSE MEASURE(nr_ac_vs_bu)
      END
  ,3) AS ac_vs_bu

FROM  gold_common.owr_finance_mv

WHERE

  period_type IN ('YTD','R3M','MTH')
  AND end_date = :dt_end

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
GROUP BY ALL;