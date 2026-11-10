/*ENV_[OWR] POS Book - Category Overview - Participation By Country*/

WITH CTE_DATES AS (
  SELECT
    *,
    MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI,
    MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM
    {{KPI_TABLE}}
  WHERE
    version_id IN (1001, 1002)
    AND CASE :pos_kpi WHEN 'participation' THEN kpi_name = 'p4w'
                      WHEN 'occasions' THEN kpi_name = 'occasion'
                      ELSE kpi_name = 'serving' END
)
SELECT
  dt_ini,
  dt_end,
  maturity,
  country_iso_code_3,
  level_4 AS category,
  CAST(ac AS STRING) AS ac,
  CAST(ac_vs_ly AS STRING) AS ac_vs_ly,
  level_1 AS gender,
  level_2 AS age,
  level_3 AS socio_economic_level,
  kpi_name
FROM
  CTE_DATES
WHERE
  1 = 1
  AND level_4 not in ("Beer + Beyond Beer")
  AND country_iso_code_3 in ('ABI','USA','CAN','GBR','KOR','ARG','CHN','BRA','ZAF','MEX','COL','PER','ECU')
  AND YEAR(LEAST(TO_DATE(:dt_end), MAX_END)) = YEAR(DT_END)
  AND QUARTER(LEAST(TO_DATE(:dt_end), MAX_END)) = QUARTER(DT_END)
  AND CASE
    WHEN
      :timeperiod = 'R12M'
    THEN
      (
        YEAR(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = YEAR(DT_INI)
        AND MONTH(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = MONTH(DT_INI)
      )
    WHEN
      :timeperiod = 'QTD'
    THEN
      (
        QUARTER(DT_INI) = QUARTER(DT_END)
        AND MONTH(DT_INI) = (QUARTER(DT_INI) * 3) - 2
      )
    WHEN :timeperiod = 'YTD' THEN (MONTH(DT_INI) = 1)
  END
  AND CASE
    WHEN
      :cohort = 'All'
    THEN
      level_1 = 'N/A'
      AND level_2 = 'N/A'
      AND level_3 = 'N/A'
    ELSE
      (
        (
          UPPER(level_1) = UPPER(:cohort)
          AND level_2 = 'N/A'
          AND level_3 = 'N/A'
        )
        OR (
          level_1 = 'N/A'
          AND UPPER(level_2) = UPPER(:cohort)
          AND level_3 = 'N/A'
        )
        OR (
          level_1 = 'N/A'
          AND level_2 = 'N/A'
          AND UPPER(level_3) = UPPER(:cohort)
        )
      )
  END
ORDER BY
  CASE maturity
    WHEN 'N/A' THEN 1
    WHEN 'M3' THEN 2
    WHEN 'M2' THEN 3
    WHEN 'M1' THEN 4
    ELSE 5
  END,
  CASE
    WHEN country_iso_code_3 = 'Global' THEN 1
    WHEN country_iso_code_3 = 'USA' THEN 2
    WHEN country_iso_code_3 = 'CAN' THEN 3
    WHEN country_iso_code_3 = 'GBR' THEN 4
    WHEN country_iso_code_3 = 'KOR' THEN 5
    WHEN country_iso_code_3 = 'ARG' THEN 6
    WHEN country_iso_code_3 = 'CHN' THEN 7
    WHEN country_iso_code_3 = 'BRA' THEN 8
    WHEN country_iso_code_3 = 'ZAF' THEN 9
    WHEN country_iso_code_3 = 'MEX' THEN 10    
    WHEN country_iso_code_3 = 'COL' THEN 11
    WHEN country_iso_code_3 = 'PER' THEN 12
    WHEN country_iso_code_3 = 'ECU' THEN 13
    ELSE 14
  END,
  country_iso_code_3 ASC,
  level_4;