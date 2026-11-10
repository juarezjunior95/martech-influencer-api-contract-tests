/*-----------------------------------------------------------------------------------------------*/
/* ENV_top countries - Volume Pages                                                               */
/*-----------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------- */
/* country: country                                                                              */
/* dt_end: period                                                                                */
/* page_type: Global,
case  when :page_type = "Global" then 1=1  -- Global
            when :page_type = 'Lead Premium' then is_lead_premium_growth_lever = TRUE -- Lead Premium
            when :page_type = 'Superior Core' then is_superior_core_growth_lever = TRUE -- Superior Core
            when :page_type = 'Non Alc Beer' then is_non_alc = TRUE -- Non Alc Beer
            when :page_type = 'Beyond Beer' then is_beyond_beer_growth_lever = TRUE -- Beyond Beer
            when :page_type = 'Balanced Choices' then is_balanced_choices_growth_lever = true
            when :page_type in ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') then brand_family = :page_type
            when :page_type = 'Corona Cero' then brand_family = 'Corona'
period : YTD / MTD*/
/*---------------------------- Changes ----------------------------------------------------------*/
/* Marcelo Komatsu - 2026.03.23 - New Development                                                */
/* Marcelo Komatsu - 2026.03.24 - Coluna com paises                                              */
/* Marcelo Komatsu - 2026.03.30 - Adjust previous / current period                               */
/* Anna Gouvea     - 2026.04.02 - Adjust MTD dt_end label for previous year                      */
/* Marcelo Komatsu - 2026.04.04 - Adjust Current / Last Year AC_VS_LY                            */
/* Matheus Jandrey - 2026.04.09 - Included 'kpi_name' parameter for 'Volume' and 'Net Revenue'   */
/* Marcelo Komatsu - 2026.04.17 - Add NR/HL                                                      */
/* Marcelo Komatsu - 2026.04.20 - Change delta from ac-ly para og_ly                             */
/*-----------------------------------------------------------------------------------------------*/

WITH base AS (
  SELECT
    :page_type AS page_type
    , country_iso_code_3_eur AS country_iso_code_3
    , :period AS period_type
    , end_date AS dt_end
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_og_ly)
          WHEN 'nr' THEN MEASURE(nr_og_ly)
        END, 1) AS delta
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_ly)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_ly)
        END, 1) AS ac_vs_ly
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_bu)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_bu)
        END, 1) AS ac_vs_bu
    , CASE
        WHEN country_iso_code_3_eur = 'BRA' THEN 1
        WHEN country_iso_code_3_eur = 'USA' THEN 2
        WHEN country_iso_code_3_eur = 'MEX' THEN 3
        WHEN country_iso_code_3_eur = 'CHN' THEN 4
        WHEN country_iso_code_3_eur = 'ZAF' THEN 5
        WHEN country_iso_code_3_eur = 'EUR' THEN 6
        WHEN country_iso_code_3_eur = 'KOR' THEN 7
        WHEN country_iso_code_3_eur = 'CAN' THEN 8
        WHEN country_iso_code_3_eur = 'COL' THEN 9
        WHEN country_iso_code_3_eur = 'ARG' THEN 10
        WHEN country_iso_code_3_eur = 'PER' THEN 11
        WHEN country_iso_code_3_eur = 'NGA' THEN 12
        WHEN country_iso_code_3_eur = 'IND' THEN 13
        WHEN country_iso_code_3_eur = 'DOM' THEN 14
        WHEN country_iso_code_3_eur = 'ECU' THEN 15
        WHEN country_iso_code_3_eur = 'Others' THEN 16
        ELSE 999
      END AS rnk,
     ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN null
          WHEN 'nr' THEN MEASURE(nr_per_hl_vs_ly)
        END, 1) AS per_hl_vs_ly
  FROM
    gold_common.owr_finance_mv
  WHERE
    period_type IN ('YTD', 'MTH')
    AND (
      CASE
        WHEN :period = 'MTD' THEN 'MTH'
        ELSE :period
      END
    ) = period_type
    AND (
      (
        period_type = 'MTH'
        AND ini_date = TO_DATE(:dt_end)
      )
      OR (
        period_type = 'YTD'
        AND ini_date = TO_DATE(CONCAT(YEAR(TO_DATE(:dt_end)), '-01-01'))
      )
    )
    AND end_date = TO_DATE(:dt_end)
    AND CASE
      WHEN :page_type = 'Global' THEN TRUE
      WHEN :page_type = 'Beyond Beer' THEN is_beyond_beer_growth_lever = TRUE
      WHEN :page_type = 'Superior Core' THEN is_superior_core_growth_lever = TRUE
      WHEN :page_type = 'Lead Premium' THEN is_lead_premium_growth_lever = TRUE
      WHEN :page_type = 'Non Alc Beer' THEN is_non_alc = TRUE
      WHEN :page_type = 'Balanced Choices' THEN is_balanced_choice_growth_lever = TRUE
      WHEN :page_type = 'Global Brands' THEN is_global_brand = TRUE AND is_lead_premium_growth_lever = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser', 'Flying Fish') THEN brand_family = :page_type
      WHEN :page_type = 'Corona Cero' THEN brand_family = 'Corona'
      ELSE FALSE
    END
    AND CASE
      WHEN :page_type = 'Corona Cero' THEN product_type = 'BEER' AND is_non_alc = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') THEN product_type = 'BEER' AND is_global_brand = TRUE
      ELSE 1 = 1
    END
    AND country_iso_code_3_eur IN (
      'USA'
      , 'BRA'
      , 'MEX'
      , 'CHN'
      , 'ZAF'
      , 'EUR'
      , 'CAN'
      , 'KOR'
      , 'COL'
      , 'PER'
      , 'ARG'
      , 'DOM'
      , 'IND'
      , 'NGA'
      , 'ECU'
      , 'Others'
    )
  GROUP BY
    ALL
)
, previous_period AS (
  SELECT
    :page_type AS page_type
    , 'ABI' AS country_iso_code_3
    , :period AS period_type
    , ADD_MONTHS(TO_DATE(:dt_end), -12) AS dt_end
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ly)
          WHEN 'nr' THEN MEASURE(nr_ly)
        END, 1) AS delta
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_ly)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_ly)
        END, 1) AS ac_vs_ly
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_bu)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_bu)
        END, 1) AS ac_vs_bu
    , 0 AS rnk,
    ROUND(
      CASE LOWER(:kpi)
        WHEN 'volume' THEN null
        WHEN 'nr' THEN MEASURE(nr_per_hl_vs_ly)
      END, 1) AS per_hl_vs_ly

  FROM
    gold_common.owr_finance_mv
  WHERE
    period_type IN ('YTD', 'MTH')
    AND (
      CASE
        WHEN :period = 'MTD' THEN 'MTH'
        ELSE :period
      END
    ) = period_type
    AND (
      (
        period_type = 'MTH'
        AND ini_date = TO_DATE(:dt_end)
      )
      OR (
        period_type = 'YTD'
        AND ini_date = TO_DATE(CONCAT(YEAR(TO_DATE(:dt_end)), '-01-01'))
      )
    )
    AND end_date = TO_DATE(:dt_end)
    AND CASE
      WHEN :page_type = 'Global' THEN TRUE
      WHEN :page_type = 'Beyond Beer' THEN is_beyond_beer_growth_lever = TRUE
      WHEN :page_type = 'Superior Core' THEN is_superior_core_growth_lever = TRUE
      WHEN :page_type = 'Lead Premium' THEN is_lead_premium_growth_lever = TRUE
      WHEN :page_type = 'Non Alc Beer' THEN is_non_alc = TRUE
      WHEN :page_type = 'Balanced Choices' THEN is_balanced_choice_growth_lever = TRUE
      WHEN :page_type = 'Global Brands' THEN is_global_brand = TRUE AND is_lead_premium_growth_lever = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser', 'Flying Fish') THEN brand_family = :page_type
      WHEN :page_type = 'Corona Cero' THEN brand_family = 'Corona'
      ELSE FALSE
    END
    AND CASE
      WHEN :page_type = 'Corona Cero' THEN product_type = 'BEER' AND is_non_alc = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') THEN product_type = 'BEER' AND is_global_brand = TRUE
      ELSE 1 = 1
    END
  GROUP BY
    ALL
)
, actual_period AS (
  SELECT
    :page_type AS page_type
    , 'ABI' AS country_iso_code_3
    , :period AS period_type
    , TO_DATE(:dt_end) AS dt_end
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac)
          WHEN 'nr' THEN MEASURE(nr_ac)
        END, 1) AS delta
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_ly)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_ly)
        END, 1) AS ac_vs_ly
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN MEASURE(volume_ac_vs_bu)
          WHEN 'nr' THEN MEASURE(nr_ac_vs_bu)
        END, 1) AS ac_vs_bu
    , 99 AS rnk
    , ROUND(
        CASE LOWER(:kpi)
          WHEN 'volume' THEN null
          WHEN 'nr' THEN MEASURE(nr_per_hl_vs_ly)
        END, 1) AS per_hl_vs_ly
  FROM
    gold_common.owr_finance_mv
  WHERE
    period_type IN ('YTD', 'MTH')
    AND (
      CASE
        WHEN :period = 'MTD' THEN 'MTH'
        ELSE :period
      END
    ) = period_type
    AND (
      (
        period_type = 'MTH'
        AND ini_date = TO_DATE(:dt_end)
      )
      OR (
        period_type = 'YTD'
        AND ini_date = TO_DATE(CONCAT(YEAR(TO_DATE(:dt_end)), '-01-01'))
      )
    )
    AND end_date = TO_DATE(:dt_end)
    AND CASE
      WHEN :page_type = 'Global' THEN TRUE
      WHEN :page_type = 'Beyond Beer' THEN is_beyond_beer_growth_lever = TRUE
      WHEN :page_type = 'Superior Core' THEN is_superior_core_growth_lever = TRUE
      WHEN :page_type = 'Lead Premium' THEN is_lead_premium_growth_lever = TRUE
      WHEN :page_type = 'Non Alc Beer' THEN is_non_alc = TRUE
      WHEN :page_type = 'Balanced Choices' THEN is_balanced_choice_growth_lever = TRUE
      WHEN :page_type = 'Global Brands' THEN is_global_brand = TRUE AND is_lead_premium_growth_lever = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser', 'Flying Fish') THEN brand_family = :page_type
      WHEN :page_type = 'Corona Cero' THEN brand_family = 'Corona'
      ELSE FALSE
    END
    AND CASE
      WHEN :page_type = 'Corona Cero' THEN product_type = 'BEER' AND is_non_alc = TRUE
      WHEN :page_type IN ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') THEN product_type = 'BEER' AND is_global_brand = TRUE
      ELSE 1 = 1
    END
  GROUP BY
    ALL
)

SELECT * FROM previous_period
UNION ALL
SELECT * FROM base
UNION ALL
SELECT * FROM actual_period
ORDER BY rnk