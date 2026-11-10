/*CREATE OR REPLACE FUNCTION gold_common.owr_value_creation_pr_pages_volume_key_markets_fn(:p_params VARIANT)
RETURNS TABLE
RETURN
Updates (KEEP ONLY LAST FIVE)
  ----------------------------------------------------------------------------------------------------------------------
  Name                      | Date       | Description                                                            | Task
  ----------------------------------------------------------------------------------------------------------------------
  Pedro Campelo              | 2026-08-11 | Fix: ac_vs_ly sign inverted                                            | MARTLH-14124
  Pedro Campelo              | 2026-04-15 | Keep nameless brands(level 1) at end of list for tail/ac_vs_ly totals  | TBD
  Marcelo Komatsu            | 2026-03-31 | Add Tail + Others bucket, filter EUROPE                                | TBD
  Pedro Santana/Lais Silva   | 2026-03-25 | Add 'portifolio' column                                                | TBD
*/
WITH cte_params AS (
    SELECT
        :dt_end AS dt_end,
        case when :period_type is null then 'YTD' else :period_type end AS period_type_src,
        CASE case when :period_type is null then 'YTD' else :period_type end
            WHEN 'L3M' THEN 'R3M'
            WHEN 'MTD' THEN 'MTH'
            ELSE case when :period_type is null then 'YTD' else :period_type end
        END AS period_type_mv,
        case when :country is null then 'ABI' else :country end AS country,
        case when :filter_type is null then 'BEER+ADJ' else :filter_type end as filter_type,
        case when :environment is null then 'PRD' else :environment end environment 
)
, cte_filter_uat AS(
  select
        distinct
        case when (SELECT MAX(dt_end) FROM cte_params) < dt_limit_current then dt_limit_previous else dt_limit_current end dt_end,
        dt_limit_previous dt_end_last
  from gold_common.owr_datelimit_gld
  where datelimit_name = 'Volume'
  and   (select environment from cte_params) = 'UAT'
)
, cte_filter_prd AS(
  select
        distinct
        case when (SELECT MAX(dt_end) FROM cte_params) < dt_limit_current then dt_limit_previous else dt_limit_current end dt_end,
        dt_limit_previous dt_end_last
  from gold_common.owr_datelimit_freeze_gld
  where datelimit_name = 'Volume'
  and   (select environment from cte_params) = 'PRD'
)
,
cte_filter
(
    select  dt_end,
            dt_end_last
    from cte_filter_uat
    union all
    select  dt_end,
            dt_end_last
    from cte_filter_prd 
)
, raw_data AS(
SELECT
      ini_date dt_ini
      , end_date dt_end
      , CASE
            WHEN portfolio = 'Tail' THEN 'Tail'                                          --LOF 2026-03-16: Group all tail brands in Tail
            WHEN COALESCE(TRIM(brand_level_1), '') = '' THEN 'Others'                    --LOF 2026-03-16: Group all brands with empty name in 'Others'
            WHEN (SELECT MAX(country) FROM cte_params) = 'EUR' THEN brand_level_1 || CHAR(10) || country_iso_code_3
            ELSE brand_level_1
      END step_name
      , portfolio                                                                         --Pedro Santana: 2026-04-15: Keep original portfolio for empty brands
      , MEASURE(volume_ac) ac
      , MEASURE(volume_ly) ly
      , MEASURE(volume_og_ly) og_ly
      , MEASURE(volume_bu) bu
      , MEASURE(volume_og_bu) og_bu
      , MEASURE(volume_am_bu) am_bu
      , zone
FROM  gold_common.owr_finance_mv vw
WHERE
      period_type = (SELECT MAX(period_type_mv) FROM cte_params)
      AND end_date = (SELECT dt_end FROM cte_filter)
      AND   case when (select filter_type from cte_params) = 'BEER+ADJ'
                then upper(product_type) IN('BEER', 'ADJ')
            else true
            end
      AND CASE
            WHEN (SELECT MAX(country) FROM cte_params) != 'ABI' THEN
                  /*LOF 2026-03-18: Country Scope*/
                  country_iso_code_3 IN('VNM','URY','ZMB','PAN','MOZ','NLD','TZA','JPN','NGA','ITA'
                        , 'HND','GTM','DEU','FRA','SLV','GBR','ECU','DOM','PER','CHL'
                        , 'CAN','COL','ZAF','BOL','CHN','BEL','MEX','ARG','BRA','KOR'
                        , 'USA','PRY', 'IND')
                  AND (country_iso_code_3_eur = (SELECT MAX(country) FROM cte_params) or country_iso_code_3 = (SELECT MAX(country) FROM cte_params))
            ELSE TRUE
      END
      --AND brand_level_1 <> '' /*LOF 2026-03-23: Remove empty brand name as the original query*/
GROUP BY ALL
HAVING
      MEASURE(volume_ac) <> 0 /*LOF 2026-03-23: Remove zero ac as the original query*/
)
, ly(
SELECT
      ADD_MONTHS(dt_ini, -12) dt_ini
      , ADD_MONTHS(dt_end, -12) dt_end
      , step_name
      , portfolio
      , ly ac
      , NULL ly
      , NULL og_ly
      , NULL bu
      , NULL og_bu
      , NULL am_bu
      , zone
FROM  raw_data
)
, base AS (
SELECT *
FROM  ly
UNION ALL
SELECT *
FROM  raw_data
)
/* Step 2: Add 'Total' AS portfolio so the UNION in final has matching columns */
, start_end_step AS (
SELECT
        dt_ini
      , dt_end
      , (SELECT MAX(period_type_src) FROM cte_params) || "'" || DATE_FORMAT(dt_end, 'yy') step_name
      , 'Total' AS portfolio
      , SUM(ac) ac
      , SUM(ly) ly
      , SUM(og_ly) og_ly
      , SUM(bu) bu
      , SUM(og_bu) og_bu
      , SUM(am_bu) am_bu
      , CASE
            WHEN YEAR(dt_end) = YEAR((SELECT MAX(dt_end) FROM cte_params)) THEN 17
            ELSE 0
      END rnk
      , zone
FROM  base
GROUP BY ALL
)
, groupings AS(
SELECT
      *
      , ROW_NUMBER() OVER(/* QUERY SOMENTE COM AS 4 MEGA, 2 EXPANSION, 1 SUSTAIN, TAIL */
            PARTITION BY dt_end
            ORDER BY
                  CASE portfolio
                        WHEN 'Megabrands' THEN 1
                        WHEN 'Expansion' THEN 2
                        WHEN 'Sustain' THEN 3
                        WHEN 'Others' THEN 4
                        WHEN 'Tail' THEN 5
                        ELSE 6
                  END
                  , ac DESC
      ) rnk
FROM  base
WHERE
      dt_end = (SELECT MAX(dt_end) FROM cte_params)
ORDER BY rnk
)
/* Step 1: Carry portfolio through with CASE — top 14 keep original, Tail stays Tail, rest become Others */
, others AS (
SELECT
        dt_ini
      , dt_end
      , CASE
            WHEN  rnk <= 15 --Limit to 14 brands to leave space to 1 Others + 1 Tail in list of steps
                  /*AND TRIM(step_name) != ''
                  AND NOT CONTAINS(step_name, 'Others')*/
                  THEN step_name
--            WHEN step_name = 'Tail' THEN step_name
            ELSE 'Tail'
      END step_name
      , CASE
            WHEN rnk <= 15 THEN portfolio
--            WHEN step_name = 'Tail' THEN 'Tail'
            ELSE 'Tail'
      END portfolio
      , SUM(ac) ac
      , SUM(ly) ly
      , SUM(og_ly) og_ly
      , SUM(bu) bu
      , SUM(og_bu) og_bu
      , SUM(am_bu) am_bu
      , MIN(CASE
          WHEN step_name = 'Tail' THEN 16
          ELSE rnk
        END) rnk
        , zone
FROM  groupings
GROUP BY ALL
)-- select * from others order by rnk
/* Step 3: Add portfolio to both branches of the UNION ALL */
, final AS (
SELECT
      step_name
      , portfolio
      , ac
      , ly
      , og_ly
      , bu
      , og_bu
      , am_bu
      , rnk
      , dt_ini
      , dt_end
      , zone
FROM  others
UNION ALL
SELECT
      step_name
      , portfolio
      , ac
      , ly
      , og_ly
      , bu
      , og_bu
      , am_bu
      , rnk
      , dt_ini
      , dt_end
      , zone
FROM  start_end_step
) --select * from final order by rnk

/* Step 4: Add portfolio to output + fix ambiguous ac by qualifying with final. */
SELECT
      final.step_name
      , CASE
            WHEN (SELECT MAX(country) FROM cte_params) = 'EUR' THEN SPLIT(final.step_name, CHR(10))[0]
            ELSE final.step_name
      END raw_brand
      , CASE
            WHEN (SELECT MAX(country) FROM cte_params) = 'EUR' and substring(step_name, 1, 3) = (SELECT MAX(period_type_src) FROM cte_params) then 'EUR'
            WHEN (SELECT MAX(country) FROM cte_params) = 'EUR' and substring(step_name, 1, 3) <> (SELECT MAX(period_type_src) FROM cte_params) then SPLIT(final.step_name, CHR(10))[1]
            ELSE (SELECT MAX(country) FROM cte_params)
      END country_iso_code_3
      , ROUND(
            CASE
                  WHEN LEFT(final.step_name, 3) = (SELECT MAX(period_type_src) FROM cte_params) THEN final.ac
                  ELSE final.og_ly
            END
      , 1) ac
      , ROUND(TRY_DIVIDE(final.og_ly, NULLIF(ABS(final.ly), 0)) * 100, 1) ac_vs_ly  --Pedro Campelo 2026-08-11: ABS() added, same pattern as ac_vs_bu below - a negative LY base was flipping the % sign
      , final.bu
      , ROUND(TRY_DIVIDE(final.og_bu, NULLIF(ABS(final.am_bu), 0)) * 100, 1) ac_vs_bu /*LOF 2026-03-18: Verificar se a conta está certa com a metric view*/
      , final.dt_ini
      , final.dt_end
      , (SELECT MAX(period_type_src) FROM cte_params) AS period
      , '%' comp_unit_of_measure
      , 'k hl' unit_of_measure
      ,  final.portfolio
      , zone
FROM  final
ORDER BY
      final.rnk;