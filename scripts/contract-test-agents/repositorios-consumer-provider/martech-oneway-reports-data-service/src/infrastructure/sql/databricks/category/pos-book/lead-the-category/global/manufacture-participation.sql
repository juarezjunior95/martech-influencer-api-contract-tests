/*ENV_[OWR] POS Book - Lead Category - Manufacture Participation - Global*/

WITH CTE_DATES AS (
  SELECT
    *,
    MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI,
    MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM {{KPI_TABLE}}
  WHERE version_id IN (1001, 1002, 1005, 1006, 1012, 1013, 1016, 1017) AND kpi_name='p4w'
    AND (
      CASE
        WHEN :price_segment = 'all'
          THEN (
            (version_id IN (1001, 1002) AND level_4 IN ('Alcohool', 'Beer')) OR
            (version_id IN (1005) AND level_4 <> 'Beer') OR
            (version_id IN (1006))
          )
        ELSE
          (version_id IN (1013, 1016, 1017)) OR
          (version_id IN (1012) AND level_4 <> 'Beer')
      END
    )
    AND (
      version_id in (1016, 1017) OR
      level_4 IN ('Alcohool', 'Beer', 'ABINBEV', 'HEINEKEN', 'OTHERS') OR
      (level_4 = 'TSINGTAO' AND country_iso_code_3 = 'CHN') OR
      (level_4 = 'HITEJINRO.CO' AND country_iso_code_3 = 'KOR') OR
      (level_4 = 'PETROPOLIS' AND country_iso_code_3 = 'BRA') OR
      (level_4 = 'CONSTELLATION' AND country_iso_code_3 = 'USA') OR
      (level_4 = 'CENTRAL CERVECERA' AND country_iso_code_3 = 'COL') OR
      (level_4 = 'MOLSON COORS' AND country_iso_code_3 = 'CAN') OR
      (level_4 = 'CCU' AND country_iso_code_3 = 'ARG') OR
      (level_4 = 'CHINA RESOURCES SNOW' AND country_iso_code_3 = 'CHN') OR
      (level_4 = 'CARLSBERG MARSTON BC' AND country_iso_code_3 = 'GBR') OR
      (level_4 = 'SLEEMAN' AND country_iso_code_3 = 'CAN')
    )
)
SELECT
  maturity,
  CASE
    WHEN country_iso_code_3 = 'ABI' THEN 'Global'
    ELSE country_iso_code_3
  END AS country_iso_code_3,
  CASE
    WHEN :price_segment = 'all' THEN
      CASE
        WHEN level_4 = 'Alcohool' THEN 'Alcohol'
        WHEN level_4 = 'Beer' THEN 'Beer'
        WHEN level_4 = 'ABINBEV' THEN 'Total ABI'
        WHEN level_4 = 'MOLSON COORS' AND COUNTRY_ISO_CODE_3 = 'CAN' THEN 'Heineken Co'
        WHEN level_4 IN ('HEINEKEN', 'CHINA RESOURCES SNOW', 'CENTRAL CERVECERA', 'CCU') THEN 'Heineken Co'
        WHEN level_4 NOT IN ('ABINBEV', 'HEINEKEN', 'Beer', 'Alcohool') THEN 'Other Competitors'
        ELSE INITCAP(level_4)
      END
    ELSE
      CASE
        WHEN version_id in (1016, 1017) THEN INITCAP(price_tier)
        WHEN level_4 = 'ABINBEV' THEN CONCAT('Total ABI ', INITCAP(price_tier))
        WHEN level_4 = 'HEINEKEN' THEN CONCAT('Heineken Co ', INITCAP(price_tier))
        WHEN level_4 = 'MOLSON COORS' AND COUNTRY_ISO_CODE_3 = 'CAN' THEN CONCAT('Heineken Co ', INITCAP(price_tier))
        WHEN level_4 IN ('HEINEKEN', 'CHINA RESOURCES SNOW', 'CENTRAL CERVECERA', 'CCU') THEN CONCAT('Heineken Co ', INITCAP(price_tier))
        WHEN level_4 NOT IN ('ABINBEV', 'HEINEKEN', 'Beer', 'Alcohool') THEN CONCAT('Other Competitors ', INITCAP(price_tier))
        ELSE CONCAT(INITCAP(level_4), ' ', INITCAP(price_tier))
      END
  END AS manufacturer,
  INITCAP(level_4) AS manufacturer_name,
  ac,
  ac_vs_ly,
  dt_ini,
  dt_end
FROM CTE_DATES
WHERE 1 = 1
  AND level_1 = 'N/A'
  AND level_2 = 'N/A'
  AND level_3 = 'N/A'
  AND country_iso_code_3 in ('ABI','USA','CAN','GBR','KOR','ARG','CHN','BRA','ZAF','MEX','COL','PER','ECU')

  -- Remove Others for Global
  AND NOT (country_iso_code_3 = 'ABI' AND level_4 = 'OTHERS')

  -- Price Segment filter
  AND
    CASE
      WHEN :price_segment = 'all'
        THEN version_id in (1001, 1002, 1006) OR (version_id = 1005 AND level_4 NOT IN ('OTHERS'))
      ELSE
        (version_id in (1013, 1016, 1017) OR (version_id = 1012 AND level_4 NOT IN ('OTHERS', 'Alcohool'))) AND price_tier = UPPER(REGEXP_REPLACE(:price_segment, '_', ' '))
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
  level_4;