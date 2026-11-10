/*-----------------------------------------------------------------------------------------------*/
/* ENV_PORTFOLIO - Volume Pages - Country                                                        */
/*-----------------------------------------------------------------------------------------------*/
/* dt_end: period                                                                                */
/* page_type: Global - Portfolio, Country - Portfolio, Lead Premium - Portfolio,                 */
/*            Superior Core - Portfolio, Beyond Beer - Portfolio,                                */
/*            Superior Core, Lead Premium, Beyond Beer (short format for segments-gb)            */
/* country: country_iso_code_3 (used when page_type = 'Country - Portfolio')                     */
/*---------------------------- Changes ----------------------------------------------------------*/
/* 2025.12.01 - THOR MARINHO - VOLUME FOR MONTH, L3M AND YTD - COUNTRY / GLOBAL                  */
/* 2026.01.30 - ALAN SILVA - L3M cross-year support                                              */
/* 2026.03.30 - MATHEUS JANDREY - New Development (Finance Star Schema)                          */
/* 2026.03.31 - MARCELO KOMATSU - Include Total                                                  */
/* 2026.03.31 - MARCELO KOMATSU - EUR Filter                                                     */
/* 2026.04.02 - ANNA GOUVEA - Remove the total line when it's Superior Core - MARTLH-9962        */
/*-----------------------------------------------------------------------------------------------*/
WITH cte_inicial AS (
  SELECT
      portfolio AS segment
      , CASE
          WHEN period_type = 'MTH' THEN 'M'
          WHEN period_type = 'R3M' THEN 'L3M'
          ELSE period_type
      END AS period
      , ROUND(measure(volume_ac_vs_ly), 1) AS ac_vs_ly
  FROM
      gold_common.owr_finance_mv
  WHERE
      TRUE
      AND product_type IN ('BEER', 'ADJ')
      AND period_type IN ('R3M', 'YTD', 'MTH')
      AND end_date = :dt_end
      AND
          CASE
              WHEN :page_type IN ('Beyond Beer - Portfolio', 'Beyond Beer') THEN
                  is_beyond_beer_growth_lever = TRUE
              WHEN :page_type IN ('Superior Core - Portfolio', 'Superior Core') THEN
                  is_superior_core_growth_lever = TRUE
              WHEN :page_type IN ('Lead Premium - Portfolio', 'Lead Premium') THEN
                  is_lead_premium_growth_lever = TRUE
              WHEN :page_type = 'Country - Portfolio' THEN
                  case when :country = 'EUR' then country_iso_code_3_eur = :country else country_iso_code_3 = :country end
              ELSE
                  1=1
          END
  GROUP BY ALL
),
cte_total AS (
  SELECT
      'Total' AS segment
      , CASE
          WHEN period_type = 'MTH' THEN 'M'
          WHEN period_type = 'R3M' THEN 'L3M'
          ELSE period_type
      END AS period
      , ROUND(measure(volume_ac_vs_ly), 1) AS ac_vs_ly
  FROM
      gold_common.owr_finance_mv
  WHERE
      TRUE
      AND product_type IN ('BEER', 'ADJ')
      AND period_type IN ('R3M', 'YTD', 'MTH')
      AND end_date = :dt_end
      AND
          CASE
              WHEN :page_type IN ('Beyond Beer - Portfolio', 'Beyond Beer') THEN
                  is_beyond_beer_growth_lever = TRUE
              WHEN :page_type IN ('Superior Core - Portfolio', 'Superior Core') THEN
                  FALSE /* False to remove the total line when it's Superior Core - MARTLH-9962 */
              WHEN :page_type IN ('Lead Premium - Portfolio', 'Lead Premium') THEN
                  is_lead_premium_growth_lever = TRUE
              WHEN :page_type = 'Country - Portfolio' THEN
                  case when :country = 'EUR' then country_iso_code_3_eur = :country else country_iso_code_3 = :country end
              ELSE
                  1=1
          END
  GROUP BY ALL
)
SELECT segment, period, ac_vs_ly FROM cte_inicial
UNION ALL
SELECT segment, period, ac_vs_ly FROM cte_total
ORDER BY
    CASE period
        WHEN 'M' THEN 1
        WHEN 'L3M' THEN 2
        WHEN 'YTD' THEN 3
        ELSE 4
    END,
    CASE segment
        WHEN 'Megabrands' THEN 1
        WHEN 'Expansion'  THEN 2
        WHEN 'Sustain'    THEN 3
        WHEN 'Tail'       THEN 4
        WHEN 'Total'      THEN 5
        ELSE 99
    END;