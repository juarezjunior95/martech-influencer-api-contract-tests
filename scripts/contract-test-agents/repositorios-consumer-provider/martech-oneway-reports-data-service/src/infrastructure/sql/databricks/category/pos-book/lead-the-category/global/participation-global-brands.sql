/*ENV_[OWR] POS Book - Category Overview - Participation By Global Brands*/

WITH CTE_DATES AS (
  SELECT
    *
    , MAX(dt_ini) OVER (PARTITION BY version_id) AS max_ini
    , MAX(dt_end) OVER (PARTITION BY version_id) AS max_end
  FROM {{KPI_TABLE}}
  WHERE 1=1
    AND version_id IN (1009, 1010)
    AND kpi_name = 'p4w'
)
SELECT
    maturity
  , country_iso_code_3
  , raw_brand
  , ac
  , ac_vs_ly
  , level_1 AS gender
  , level_2 AS age
  , level_3 AS socio_economic_level
FROM CTE_DATES
WHERE 1=1
  /* Parameters */
  AND country_iso_code_3 in ('ABI','USA','CAN','GBR','KOR','ARG','CHN','BRA','ZAF','MEX','COL','PER','ECU') 
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
ORDER BY
    CASE maturity
      WHEN 'N/A' THEN 1 
      WHEN 'M3'  THEN 2 
      WHEN 'M2'  THEN 3 
      WHEN 'M1'  THEN 4 
      ELSE 5
    END
  , CASE country_iso_code_3
      WHEN 'Global' THEN 1
      WHEN 'USA'    THEN 2
      WHEN 'CAN'    THEN 3
      WHEN 'GBR'    THEN 4
      WHEN 'KOR'    THEN 5
      WHEN 'ARG'    THEN 6
      WHEN 'CHN'    THEN 7
      WHEN 'BRA'    THEN 8
      WHEN 'ZAF'    THEN 9
      WHEN 'MEX'    THEN 10
      WHEN 'COL'    THEN 11
      WHEN 'PER'    THEN 12
      WHEN 'ECU'    THEN 13
      ELSE 14
    END
  , CASE raw_brand 
      WHEN 'CORONA'         THEN 1
      WHEN 'HEINEKEN'       THEN 2
      WHEN 'BUDWEISER'      THEN 3
      WHEN 'MICHELOB ULTRA' THEN 4 
      WHEN 'STELLA ARTOIS'  THEN 5 
      ELSE 6 
    END;