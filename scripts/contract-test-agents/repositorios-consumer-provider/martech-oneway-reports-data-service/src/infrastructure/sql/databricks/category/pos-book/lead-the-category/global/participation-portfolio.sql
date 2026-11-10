/*ENV_[OWR] POS Book - Category Overview - Participation By Portfolio - Global*/

WITH CTE_DATES AS (
  SELECT
      *
    , MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI
    , MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM {{KPI_TABLE}}
  WHERE (
      (version_id IN ('1005', '1006') AND segment = 'N/A' AND LEVEL_4='ABINBEV')
      OR version_id IN (1007, 1008)
    )
    and kpi_name = 'p4w'
    and case :cohort when 'All' then level_1 = "N/A" and level_2 = "N/A" and level_3 = "N/A"
                else (
                  (upper(level_1) = upper(:cohort) and level_2 = "N/A" and level_3 = "N/A")
                  or
                  (level_1 = "N/A" and upper(level_2) = upper(:cohort) and level_3 = "N/A")
                  or
                  (level_1 = "N/A" and level_2 = "N/A" and upper(level_3) = upper(:cohort))
                )
      end
)

SELECT 
    maturity
  , version_id
  , CASE
        WHEN country_iso_code_3 = 'ABI' THEN 'Global'
        ELSE country_iso_code_3
    END AS country_iso_code_3
  , segment
  , ac
  , ac_vs_ly
  , CASE 
      WHEN version_id=1006 or (version_id=1005 and country_iso_code_3 <> 'ABI') then 'Total ABI'
      WHEN ((version_id=1005 or version_id=1007 or version_id=1008) and segment = 'Megabrands') then 'Megabrands'
      WHEN ((version_id=1005 or version_id=1007 or version_id=1008) and segment = 'Expansion') then 'Expansion'
      WHEN ((version_id=1005 or version_id=1007 or version_id=1008) and segment = 'Sustain') then 'Sustain'
      WHEN ((version_id=1005 or version_id=1007 or version_id=1008) and segment = 'Tail') then 'Tail'
      else null
    end as type
  , dt_ini
  , dt_end

FROM CTE_DATES

WHERE 1=1
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

ORDER BY    
    CASE
        WHEN version_id = 1006 then 1
        WHEN version_id = 1005 and segment='N/A' then 2
        WHEN version_id = 1008 and segment='Megabrands' then 3
        WHEN version_id = 1007 and segment='Megabrands' then 4
        WHEN version_id = 1008 and segment='Expansion' then 5
        WHEN version_id = 1007 and segment='Expansion' then 6
        WHEN version_id = 1008 and segment='Sustain' then 7
        WHEN version_id = 1007 and segment='Sustain' then 8
        WHEN version_id = 1008 and segment='Tail' then 9
        WHEN version_id = 1007 and segment='Tail' then 10
        else 11
    end,

    CASE 
        WHEN segment = 'N/A' THEN 1
        WHEN segment = 'Megabrands' THEN 2
        WHEN segment = 'Expansion' THEN 3
        WHEN segment = 'Sustain' THEN 4
        WHEN segment = 'Tail' THEN 5
        ELSE 6 
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
    maturity,
    country_iso_code_3 ASC,
    level_4;