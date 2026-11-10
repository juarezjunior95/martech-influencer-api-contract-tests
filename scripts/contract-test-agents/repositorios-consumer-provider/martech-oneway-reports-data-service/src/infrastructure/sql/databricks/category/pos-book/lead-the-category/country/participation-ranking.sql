/*ENV_[OWR] POS Book - Brand Participation Ranking - Country */

WITH CTE_DATES AS (
  SELECT
    *,
    MAX(dt_ini) OVER(PARTITION BY kpi_name, version_id) max_ini,
    MAX(dt_end) OVER(PARTITION BY kpi_name, version_id) max_end
  FROM {{KPI_TABLE}}
    WHERE kpi_name='p4w'
    AND (version_id = CASE WHEN :price_segment = 'All' THEN 1011 ELSE 1014 END)
)
SELECT
  maturity,
  country_iso_code_3,
  raw_brand,
  ac,
  ac_vs_ly,
  'pp' as comp_unit_of_measure,
  level_1 AS gender,
  level_2 AS age,
  level_3 AS socio_economic_level,
  level_4 AS abi_comp,
  dt_ini,
  dt_end,
  price_tier
FROM CTE_DATES
WHERE 1=1
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
  AND CASE :cohort WHEN 'All' THEN level_1 = "N/A" AND level_2 = "N/A" AND level_3 = "N/A"
                  ELSE (
                    (UPPER(level_1) = UPPER(:cohort) AND level_2 = "N/A" AND level_3 = "N/A")
                    OR
                    (level_1 = "N/A" AND UPPER(level_2) = UPPER(:cohort) AND level_3 = "N/A")
                    OR
                    (level_1 = "N/A" AND level_2 = "N/A" AND UPPER(level_3) = UPPER(:cohort))
                  )
        END
  AND country_iso_code_3 = :country
  AND (CASE WHEN :price_segment = 'All' THEN TRUE ELSE (price_tier = UPPER(REGEXP_REPLACE(:price_segment, '_', ' '))) END)
ORDER BY 
  CASE maturity WHEN 'N/A' THEN 1 WHEN 'M3' THEN 2 WHEN 'M2' THEN 3 WHEN 'M1' THEN 4 ELSE 5 END,
  country_iso_code_3 ASC,
  ac DESC;