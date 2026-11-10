
/*----------------------------------------------------------------------*/
/* ENV_[OWR] Volume Page - Bar Chart - Brands                           */
/*----------------------------------------------------------------------*/

/*--------------------- FILTERS ----------------------------------------*/
/* dt_end --> last period to filter                                     */
/* page_filter  --> type of filter                                      */
/*    Michelob Ultra, Corona, Corona Cero, Budweiser, Stella Artois     */
/*    Flying Fish                                                       */
/* period_type --> MTD, YT, L3M                                         */
/*--------------------- FILTERS ----------------------------------------*/

/*--------------------- Changes  ---------------------------------------*/
/* MARCELO KOMATSU - 2026-03-25 - INITIAL QUERY                         */
/* MARCELO KOMATSU - 2026-04-09 - INPUT NR                              */
/*--------------------- Changes  ---------------------------------------*/

WITH raw_data AS (
  SELECT
      ini_date          AS dt_ini,
      end_date          AS dt_end,
     -- year(end_date)    AS year,
      ROUND( MEASURE(volume_ac) ,1) AS volume_ac,
      ROUND( MEASURE(volume_bu) ,1) AS volume_bu,
      ROUND( MEASURE(volume_ly) ,1) AS volume_ly,
      ROUND( MEASURE(volume_ac_vs_ly),1) AS volume_ac_vs_ly,
      ROUND( MEASURE(volume_ac_vs_bu),1) AS volume_ac_vs_bu,
      ROUND( MEASURE(volume_bu_vs_ly),1) AS volume_bu_vs_ly,
      ROUND( MEASURE(nr_ac) ,1) AS nr_ac,
      ROUND( MEASURE(nr_bu) ,1) AS nr_bu,
      ROUND( MEASURE(nr_ly) ,1) AS nr_ly,
      ROUND( MEASURE(nr_ac_vs_ly),1) AS nr_ac_vs_ly,
      ROUND( MEASURE(nr_ac_vs_bu),1) AS nr_ac_vs_bu,
      ROUND( MEASURE(nr_bu_vs_ly),1) AS nr_bu_vs_ly


  FROM  gold_common.owr_finance_mv
  WHERE
    period_type = CASE
                              WHEN :period_type = 'L3M' THEN 'R3M'
                              WHEN :period_type = 'MTD' THEN 'MTH'
                              ELSE :period_type
                        END
    AND end_date in (:dt_end, cast(:dt_end as date) - INTERVAL 1 year, cast(:dt_end as date) - INTERVAL 2 year, cast(:dt_end as date) - INTERVAL 3 year, cast(:dt_end as date) - INTERVAL 4 year)

    AND CASE
          WHEN :page_filter IN ('Michelob Ultra', 'Budweiser', 'Corona', 'Stella Artois') THEN brand_level_1 = :page_filter and upper(product_type) = 'BEER'
          WHEN :page_filter IN ('Corona Cero') THEN brand_level_1 = 'Corona' and upper(product_type) = 'BEER' and is_non_alc =  TRUE
          WHEN :page_filter IN ('Flying Fish') THEN brand_level_1 = :page_filter
          else FALSE
        END

  GROUP BY ALL
),
final_data AS (
    SELECT
      dt_ini,
      dt_end,
      "BU'" || DATE_FORMAT(dt_end, 'yy') AS period,
      case
        when :kpi = 'volume' then volume_bu
        when :kpi = 'nr'     then nr_bu
      end AS ac,
      case
        when :kpi = 'volume' then volume_bu_vs_ly
        when :kpi = 'nr'     then nr_bu_vs_ly
      end                       AS ac_vs_ly,
      NULL                      AS ac_vs_bu,
      98                        AS rnk
    FROM raw_data
    where dt_end = :dt_end

    UNION ALL

    SELECT
      dt_ini,
      dt_end,
      :period_type || "'" || DATE_FORMAT(dt_end, 'yy') AS period,
      case
        when :kpi = 'volume' then volume_ac
        when :kpi = 'nr'     then nr_ac
      end AS ac,
      case
        when :kpi = 'volume' then volume_ac_vs_ly
        when :kpi = 'nr'     then nr_ac_vs_ly
      end AS ac_vs_ly,
            case
        when :kpi = 'volume' then volume_ac_vs_bu
        when :kpi = 'nr'     then nr_ac_vs_bu
      end AS ac_vs_bu,
      case when dt_end = :dt_end then 99 else cast(DATE_FORMAT(dt_end, 'yy') as int)   end AS rnk
    FROM raw_data
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