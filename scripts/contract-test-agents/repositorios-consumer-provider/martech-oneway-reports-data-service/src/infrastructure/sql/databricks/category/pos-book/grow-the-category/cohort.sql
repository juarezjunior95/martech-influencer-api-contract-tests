/*ENV_[OWR] POS Book - Category Overview - Participation By Cohort*/

WITH CTE_DATES AS (
  select
      *
    , max(DT_INI) over(partition by kpi_name, version_id) MAX_INI
    , max(DT_END) over(partition by kpi_name, version_id) MAX_END
    from 
      {{KPI_TABLE}}
    where 
      version_id in (1001, 1002, 1004) 
    AND CASE :pos_kpi WHEN 'participation' THEN kpi_name = 'p4w'
                      WHEN 'occasions' THEN kpi_name = 'occasion'
                      ELSE kpi_name = 'serving' END
      AND level_2 IN ('Male', 'Female', 'N/A') 
      AND level_3 IN ('Low Income', 'Medium Income', 'High Income', 'N/A')
  )
select 
  maturity
, country_iso_code_3
, level_4 as category
, CAST(ac as STRING) AS ac
, CAST(ac_vs_ly as STRING) AS ac_vs_ly
, case when level_1 = 'N/A' and level_2 = 'N/A' and level_3 = 'N/A' AND :country != 'ABI' then 'Overall'
       when level_1 = 'N/A' and level_2 = 'N/A' and level_3 = 'N/A' AND :country = 'ABI' then 'Global'
       when level_1 != 'N/A' and level_2 = 'N/A' and level_3 = 'N/A' then level_1 
       when level_1 = 'N/A' and level_2 != 'N/A' and level_3 = 'N/A' then level_2 
       when level_1 = 'N/A' and level_2 = 'N/A' and level_3 != 'N/A' then level_3 
  end as cohort_level
, dt_ini
, dt_end
, kpi_name
from CTE_DATES
where 1=1
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
and (
  level_1 = "N/A" and level_2 = "N/A" and level_3 = "N/A"
  or (
    (level_1 != "N/A" and level_2 = "N/A" and level_3 = "N/A")
    or
    (level_1 = "N/A" and level_2 != "N/A" and level_3 = "N/A")
    or
    (level_1 = "N/A" and level_2 = "N/A" and level_3 != "N/A")
  )
)
and 
  case 
    when :viewtype = 'country' then country_iso_code_3 = :country 
    else raw_geography = 'TOTAL_GLOBAL'
  end
order by 
  case abi_zone when 'ABI' then 1 else 2 end
, level_4
, case when cohort_level = 'Global' then 1
       when cohort_level = 'Overall' then 1
       when cohort_level = 'Male' then 2
       when cohort_level = 'Female' then 3
       when cohort_level = 'LDA - 24' then 4
       when cohort_level = '25-34' then 5
       when cohort_level = '35-44' then 6
       when cohort_level = '45-54' then 7
       when cohort_level = '55+' then 8
       when cohort_level = 'High Income' then 9
       when cohort_level = 'Medium Income' then 10
       when cohort_level = 'Low Income' then 11
       else 99 end;