/*[OWR] Audience Targeting - Big Numbers*/
 
WITH CTE_DATES AS (
  SELECT
    *,
    MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI,
    MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
  FROM
    {{KPI_TABLE}}
  WHERE
    version_id IN (91, 92, 100, 101)
    AND kpi_name = 'p4w'
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
),
qry_final as
(
select
  cc.dt_ini,
  cc.dt_end,
  cc.raw_brand as brand,
  round(cc.ac, 1) as CoreAudience,
  round(cc.ac / tt.ac * 100, 1) as CoreAudienceVsTotal,
  round(tt.ac, 1) as total,
  cc.country_iso_code_3,
  'Participation' as nm_group,
  row_number() over (partition by cc.dt_ini, cc.dt_end, cc.country_iso_code_3, cc.raw_brand order by cc.version_id, tt.version_id) rn
from custom_cohort cc
inner join total tt
  on cc.dt_ini = tt.dt_ini
  and cc.dt_end = tt.dt_end
  and upper(cc.country_iso_code_3) = upper(tt.country_iso_code_3)
  and upper(cc.raw_brand) = upper(tt.raw_brand)
 
where 1=1
 
  AND YEAR(LEAST(TO_DATE(:dt_end), cc.MAX_END)) = YEAR(cc.DT_END)
  AND QUARTER(LEAST(TO_DATE(:dt_end), cc.MAX_END)) = QUARTER(cc.DT_END)
  AND YEAR(ADD_MONTHS(LEAST(TO_DATE(:dt_end), cc.MAX_END), -11)) = YEAR(cc.DT_INI)
  AND MONTH(ADD_MONTHS(LEAST(TO_DATE(:dt_end), cc.MAX_END), -11)) = MONTH(cc.DT_INI)
 
  qualify rn <= 1
)
select
  DT_INI,
  DT_END,
  round(avg(coreaudience), 1) as CORE_AUDIENCE,
  round(avg(coreaudiencevstotal), 1) as CORE_AUDIENCE_VS_TOTAL,
  round(avg(total), 1) as TOTAL,
  case when :country = 'ABI' then 'ABI' else country_iso_code_3 end as COUNTRY_ISO_CODE_3
from qry_final
where case when :country = 'ABI' THEN 1=1 ELSE country_iso_code_3 = :country END
group by dt_ini, dt_end, case when :country = 'ABI' then 'ABI' else country_iso_code_3 end
 
 