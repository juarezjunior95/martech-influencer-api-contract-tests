/*ENV_[OWR] POS Book - Lead Category - Manufacture Participation - Country*/

WITH CTE_DATES AS (
  SELECT
    *,
    MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI,
    MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM --mrt_am.gold_common.tlh_kpis_freeze_agg
  {{KPI_TABLE}} /* use `tlh_kpis_freeze_agg` in PROD and `tlh_kpis_agg` in TEST */
  WHERE kpi_name = 'p4w'
    AND level_3 IN ('Low Income', 'Medium Income', 'High Income', 'N/A')
    AND (
      CASE 
        WHEN :price_segment = 'all' 
          THEN (
            (version_id IN (1001) AND level_4 IN ('Beer')) OR
            (version_id IN (1005) AND level_4 <> 'Beer')
          )
        ELSE
          (version_id IN (1012, 1016) AND level_4 <> 'Beer')
      END
    )
)
SELECT
  maturity,
  country_iso_code_3,
  CASE
    WHEN :price_segment = 'all' THEN
      CASE
        WHEN level_4 = 'Beer' THEN 'Beer'
        WHEN level_4 = 'ABINBEV' THEN 'Total ABI'
        WHEN level_4 = 'HEINEKEN' THEN 'Heineken Co'
        ELSE INITCAP(level_4)
      END
    ELSE
      CASE
        WHEN version_id in (1016) THEN INITCAP(price_tier)
        WHEN level_4 = 'ABINBEV' THEN CONCAT('Total ABI ', INITCAP(price_tier))
        WHEN level_4 = 'HEINEKEN' THEN CONCAT('Heineken Co ', INITCAP(price_tier))
        ELSE CONCAT(INITCAP(level_4), ' ', INITCAP(price_tier))
      END
  END AS manufacturer,
  ac,
  ac_vs_ly,
  level_2 AS gender,
  level_1 AS age,
  level_3 AS socio_economic_level,
  CASE
    WHEN (level_1 <> 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A') THEN level_1
    WHEN (level_1 = 'N/A' AND level_2 <> 'N/A' AND level_3 = 'N/A') THEN level_2
    WHEN (level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 <> 'N/A') THEN level_3
    WHEN (level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A') THEN 'Overall'
    ELSE NULL
  END AS type
FROM CTE_DATES
WHERE 1 = 1
  AND level_2 IN ('Male', 'Female', 'N/A')
  AND level_4 NOT IN ('OTHERS')
  AND NOT (
    (level_1 <> 'N/A' AND level_2 <> 'N/A' AND level_3 <> 'N/A') OR
    (level_1 = 'N/A' AND level_2 <> 'N/A' AND level_3 <> 'N/A') OR
    (level_1 <> 'N/A' AND level_2 = 'N/A' AND level_3 <> 'N/A') OR
    (level_1 <> 'N/A' AND level_2 <> 'N/A' AND level_3 = 'N/A')
  )

  -- Price Segment filter
  AND 
    CASE 
      WHEN :price_segment != 'all' THEN price_tier = UPPER(REGEXP_REPLACE(:price_segment, '_', ' ')) 
      ELSE 1=1
    END

  -- Period filter
  AND YEAR(LEAST(TO_DATE(:dt_end), MAX_END)) = YEAR(DT_END)
  AND QUARTER(LEAST(TO_DATE(:dt_end), MAX_END)) = QUARTER(DT_END)
  AND CASE 
        WHEN :timeperiod = 'R12M' THEN (
          YEAR(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = YEAR(DT_INI)
          AND MONTH(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = MONTH(DT_INI)
        )
        WHEN :timeperiod = 'QTD' THEN (
          QUARTER(DT_INI) = QUARTER(DT_END)
          AND MONTH(DT_INI) = (QUARTER(DT_INI)*3)-2
        )
        WHEN :timeperiod = 'YTD' THEN (
          MONTH(DT_INI) = 1
        )
      END

  AND (
    CASE
      WHEN :viewtype = 'country' THEN
        country_iso_code_3 = :country
        OR (
          :manufacturer IS NOT NULL
          AND :manufacturer <> ''
          AND country_iso_code_3 = 'ABI'
          AND :manufacturer IN (
            SELECT DISTINCT level_4
            FROM --mrt_am.gold_common.tlh_kpis_freeze_agg
            {{KPI_TABLE}} /* use `tlh_kpis_freeze_agg` in PROD and `tlh_kpis_agg` in TEST */
            WHERE country_iso_code_3 = :country
              AND kpi_name = 'p4w'
          )
          AND level_1 = 'N/A'
          AND level_2 = 'N/A'
          AND level_3 = 'N/A'
        )
    END
  )
ORDER BY
  CASE maturity
    WHEN 'N/A' THEN 1
    WHEN 'M3' THEN 2
    WHEN 'M2' THEN 3
    WHEN 'M1' THEN 4
    ELSE 5
  END,
  CASE country_iso_code_3
    WHEN 'Global' THEN 1
    WHEN 'USA' THEN 2
    WHEN 'CAN' THEN 3
    WHEN 'GBR' THEN 4
    WHEN 'KOR' THEN 5
    WHEN 'ARG' THEN 6
    WHEN 'CHN' THEN 7
    WHEN 'BRA' THEN 8
    WHEN 'ZAF' THEN 9
    WHEN 'MEX' THEN 10
    WHEN 'COL' THEN 11
    WHEN 'PER' THEN 12
    WHEN 'ECU' THEN 13
    ELSE 14
  END,
  CASE
    WHEN version_id in (1016, 1017) THEN 1
    WHEN level_4 = 'Alcohool' THEN 2
    WHEN level_4 = 'Beer' THEN 3
    WHEN level_4 = 'ABINBEV' THEN 4
    WHEN level_4 = 'HEINEKEN' THEN 5
    WHEN level_4 IN ('CHINA RESOURCES SNOW', 'CCU', 'MOLSON COORS', 'CENTRAL CERVECERA') THEN 6
    ELSE 7
  END,
  country_iso_code_3 ASC,
  level_4,
  CASE 
    WHEN type = 'Overall' THEN 1
    WHEN type = 'Male' THEN 2
    WHEN type = 'Female' THEN 3
    WHEN type = 'LDA - 24' THEN 4
    WHEN type = '25-34' THEN 5
    WHEN type = '35-44' THEN 6
    WHEN type = '45-54' THEN 7
    WHEN type = '55+' THEN 8
    WHEN type = 'High Income' THEN 9
    WHEN type = 'Medium Income' THEN 10
    WHEN type = 'Low Income' THEN 11
    ELSE 12
  END;