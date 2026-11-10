WITH CTE_DATES AS (
  SELECT
    *,
    MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI,
    MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM
    {{KPI_TABLE}}
  WHERE
    version_id IN (91, 92, 100, 101)
    AND kpi_name IN ('p4w', 'occasion', 'power')
),
qry_audience_definition as (
  select distinct
    megabrand,
    country,
    core_age,
    core_gender,
    core_income
  from gold_common.sharepoint_tlh_audience_definition_gld
), 
custom_cohort as (
select 
  t.*
from CTE_DATES t
inner join qry_audience_definition s2
  on upper(regexp_replace(translate(s2.megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) = upper(regexp_replace(t.raw_brand, '[\\s\\xa0]', ''))
  and upper(regexp_replace(s2.country, '[\\s\\xa0]', '')) = upper(regexp_replace(t.country_iso_code_3, '[\\s\\xa0]', ''))
  and regexp_replace(s2.core_age, '[\\s\\xa0]', '') = regexp_replace(t.level_1, '[\\s\\xa0]', '')
  and regexp_replace(s2.core_gender, '[\\s\\xa0]', '') = regexp_replace(t.level_2, '[\\s\\xa0]', '')
  and regexp_replace(s2.core_income, '[\\s\\xa0]', '') = regexp_replace(t.level_3, '[\\s\\xa0]', '')
),
total as (
select 
  t.*
from CTE_DATES t
inner join qry_audience_definition s2
  on upper(regexp_replace(translate(s2.megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) = upper(regexp_replace(t.raw_brand, '[\\s\\xa0]', ''))
  and upper(regexp_replace(s2.country, '[\\s\\xa0]', '')) = upper(regexp_replace(t.country_iso_code_3, '[\\s\\xa0]', ''))
  and upper(t.level_1) = 'N/A'
  and upper(t.level_2) = 'N/A'
  and upper(t.level_3) = 'N/A'
)

select
  cc.dt_ini,
  cc.dt_end,
  cc.raw_brand as brand,
  cc.kpi_name,
  round(cc.ac, 1) as CoreAudience,
  round(cc.ac_vs_ly, 1) as CoreVsLY,
  round(cc.ac / tt.ac * 100, 1) as CoreAudienceVsTotal,
  round(tt.ac, 1) as TotalAudience,
  round(tt.ac_vs_ly, 1) as BrandVsLY,
  CASE cc.kpi_name
    WHEN 'p4w' THEN 'Participation'
    WHEN 'occasion' THEN 'Occasions'
    WHEN 'power' THEN 'Brand Power'
  END as nm_group,
  row_number() over (partition by cc.dt_ini, cc.dt_end, cc.country_iso_code_3, cc.raw_brand, cc.kpi_name order by cc.version_id, tt.version_id) rn
from custom_cohort cc
inner join total tt
  on cc.dt_ini = tt.dt_ini
  and cc.dt_end = tt.dt_end
  and upper(cc.country_iso_code_3) = upper(tt.country_iso_code_3)
  and upper(cc.raw_brand) = upper(tt.raw_brand)
  and cc.kpi_name = tt.kpi_name

where 1=1

  AND YEAR(LEAST(TO_DATE(:dt_end), cc.MAX_END)) = YEAR(cc.DT_END)
  AND QUARTER(LEAST(TO_DATE(:dt_end), cc.MAX_END)) = QUARTER(cc.DT_END)
  AND YEAR(ADD_MONTHS(LEAST(TO_DATE(:dt_end), cc.MAX_END), -11)) = YEAR(cc.DT_INI)
  AND MONTH(ADD_MONTHS(LEAST(TO_DATE(:dt_end), cc.MAX_END), -11)) = MONTH(cc.DT_INI)
  
  and upper(cc.raw_brand) = upper(:brand)
  and upper(cc.country_iso_code_3) = upper(:country)

  qualify rn <= 1
