/*ENV_[OWR] POS Book - Category Overview - Participation By Maturity*/

WITH CTE_DATES AS (
  select
    *,
    max(DT_INI) over (partition by kpi_name, version_id) MAX_INI,
    max(DT_END) over (partition by kpi_name, version_id) MAX_END
  from
    {{KPI_TABLE}}
  where
    version_id in (1002, 1003)
    AND CASE :pos_kpi WHEN 'participation' THEN kpi_name = 'p4w'
                      WHEN 'occasions' THEN kpi_name = 'occasion'
                      ELSE kpi_name = 'serving' END
)
select
  :pos_kpi as kpi_name,
  maturity,
  country_iso_code_3,
  level_4 as category,
  ac,
  ly,
  ac_vs_ly,
  level_1 as gender,
  level_2 as age,
  level_3 as socio_economic_level,
  case
    when maturity = 'N/A' then ''
    else 'Maturity'
  end as `group`
from
  CTE_DATES
where 1=1
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
order by
  case maturity
    when 'N/A' then 1
    when 'M3' then 2
    when 'M2' then 3
    when 'M1' then 4
    else 5
  end,
  country_iso_code_3 asc,
  level_4;