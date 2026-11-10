/*ENV_[OWR] POS Book - Category Overview - Participation By Portfolio - Country*/

WITH CTE_DATES AS (
  SELECT
      *
    , MAX(DT_INI) OVER (PARTITION BY kpi_name) AS MAX_INI
    , MAX(DT_END) OVER (PARTITION BY kpi_name) AS MAX_END
  FROM {{KPI_TABLE}}
WHERE version_id IN (1007, 1005)
  AND ((version_id=1007 and country_iso_code_3 = :country) or (version_id=1005 and country_iso_code_3=:country and level_4='ABINBEV' and segment='N/A'))
  AND kpi_name='p4w'
  AND NOT (
    (level_1 <> 'N/A' AND level_2 <> 'N/A' AND level_3 <> 'N/A') OR
    (level_1 = 'N/A' AND level_2 <> 'N/A' AND level_3 <> 'N/A') OR
    (level_1 <> 'N/A' AND level_2 = 'N/A' AND level_3 <> 'N/A') OR
    (level_1 <> 'N/A' AND level_2 <> 'N/A' AND level_3 = 'N/A') 
  ) AND level_2 IN ('Male', 'Female', 'N/A')
)
SELECT
    maturity
  , CASE
        WHEN country_iso_code_3 = 'ABI' THEN 'Total ABI'
        ELSE country_iso_code_3
    END AS country_iso_code_3
  , segment
  , ac
  , ac_vs_ly
  , CASE 
      WHEN version_id=1005 then 'Total ABI'
      WHEN ((version_id=1007) and segment = 'Megabrands') then 'Megabrands'
      WHEN ((version_id=1007) and segment = 'Expansion') then 'Expansion'
      WHEN ((version_id=1007) and segment = 'Sustain') then 'Sustain'
      WHEN ((version_id=1007) and segment = 'Tail') then 'Tail'
      else null
    end as type
  , CASE 
      WHEN (level_1 <> 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A') then level_1
      WHEN (level_1 = 'N/A' AND level_2 <> 'N/A' AND level_3 = 'N/A') then level_2
      WHEN (level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 <> 'N/A') then level_3
      WHEN (level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A') then 'Overall'
      ELSE NULL
    END as category
  , dt_ini
  , dt_end
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

ORDER BY    
    CASE
        WHEN version_id = 1005 and segment='N/A' then 1
        WHEN version_id = 1007 and segment='Megabrands' then 2
        WHEN version_id = 1007 and segment='Expansion' then 4
        WHEN version_id = 1007 and segment='Sustain' then 6
        WHEN version_id = 1007 and segment='Tail' then 8
        else 9
    end,

    CASE 
        WHEN segment = 'N/A' THEN 1
        WHEN segment = 'Megabrands' THEN 2
        WHEN segment = 'Expansion' THEN 3
        WHEN segment = 'Sustain' THEN 4
        WHEN segment = 'Tail' THEN 5
        ELSE 6 
    END

  , CASE 
      WHEN level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A' THEN 1 
      WHEN level_1 = 'N/A' AND level_2 <> 'N/A' AND level_3 = 'N/A' THEN 2 
      WHEN level_1 <> 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A' THEN 3 
      WHEN level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 <> 'N/A' THEN 4 
      ELSE 5 
    END

  , CASE
      WHEN level_2 = 'Male' THEN 1 
      WHEN level_1 = 'LDA - 24' THEN 2
      WHEN level_1 = '25-34' THEN 3
      WHEN level_1 = '35-44' THEN 4
      WHEN level_1 = '45-54' THEN 5
      WHEN level_1 = '55+' THEN 6
      WHEN level_3 = 'High Income' THEN 7
      WHEN level_3 = 'Medium Income' THEN 8
      WHEN level_3 = 'Low Income' THEN 9    
      ELSE 10
    END
  , country_iso_code_3 ASC
  , level_4;