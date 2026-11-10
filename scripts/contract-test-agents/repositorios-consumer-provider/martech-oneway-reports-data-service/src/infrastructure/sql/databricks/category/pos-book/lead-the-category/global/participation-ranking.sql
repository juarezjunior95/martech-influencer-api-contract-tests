/*ENV_[OWR] POS Book - Brand Participation Ranking - Global*/

WITH CTE_DATES AS (
  select
      *
    , max(DT_INI) over(partition by kpi_name, version_id) MAX_INI
    , max(DT_END) over(partition by kpi_name, version_id) MAX_END
  FROM {{KPI_TABLE}} 
  where version_id in (91) and kpi_name='p4w'
)
select
  maturity
, country_iso_code_3
, raw_brand
, ac
, ac_vs_ly
, level_1 as gender
, level_2 as age
, level_3 as socio_economic_level
, CASE WHEN level_4 = 'ABINBEV' THEN 'ABI' ELSE 'COMPETITOR' END as abi_comp
, 'pp' as comp_unit_of_mesure
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
and case :cohort when 'All' then level_1 = "N/A" and level_2 = "N/A" and level_3 = "N/A"
                else (
                  (upper(level_1) = upper(:cohort) and level_2 = "N/A" and level_3 = "N/A")
                  or
                  (level_1 = "N/A" and upper(level_2) = upper(:cohort) and level_3 = "N/A")
                  or
                  (level_1 = "N/A" and level_2 = "N/A" and upper(level_3) = upper(:cohort))
                )
      end
and (
  (country_iso_code_3 = 'CHN' and raw_brand in ('BUDWEISER','HARBIN'))
  or (country_iso_code_3 = 'USA' and raw_brand in ('BUD LIGHT', 'MICHELOB ULTRA'))
  or (country_iso_code_3 = 'BRA' and raw_brand in ('BRAHMA','SKOL','BUDWEISER'))
  or (country_iso_code_3 = 'COL' and raw_brand in ('AGUILA'))
  or (country_iso_code_3 = 'MEX' and raw_brand in ('CORONA'))
  or (country_iso_code_3 = 'KOR' and raw_brand in ('CASS'))
  or (country_iso_code_3 = 'ARG' and raw_brand in ('QUILMES'))
  or (country_iso_code_3 = 'ZAF' and raw_brand in ('CARLING BLACK LABEL'))
)
order by 
  ac desc
, ac_vs_ly desc
, case maturity when 'N/A' then 1 when 'M3' then 2 when 'M2' then 3 when 'M1' then 4 else 5 end
, country_iso_code_3 asc
, raw_brand;