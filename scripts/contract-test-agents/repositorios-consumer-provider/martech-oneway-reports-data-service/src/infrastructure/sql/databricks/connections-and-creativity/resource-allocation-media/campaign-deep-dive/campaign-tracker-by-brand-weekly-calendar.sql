/*ENV_[OWR] Resource Allocation - Campaign Deep Dive - Weekly Calendar*/
WITH CTE_DATES AS (
  select *
    , max(DT_INI) over(partition by kpi_name, version_id) MAX_INI
    , max(DT_END) over(partition by kpi_name, version_id) MAX_END
  from {{KPI_TABLE}}
  where 1=1
  /* fixed filters */
  and kpi_name = 'media'
  /* param filters */
  and version_id = 224
  and country_iso_code_3 = :country
)
,CTE_BRAND_ORDER AS (
  select
    dt_ini,
    dt_end,
    raw_brand,
    max(ac) as max_campaign_spend_ac
  from CTE_DATES
  where 1=1
    and kpi_name = 'media'
    and level_2 = 'campaign_spend'
    and version_id = 223
    and country_iso_code_3 = :country
  group by dt_ini, dt_end, raw_brand
),CTE_WEEK (
    select
          dt_ini
        , dt_end
        , country_iso_code_3
        , raw_geography
        , raw_brand
        , segment
        , level_1 as campaign
        , kpi_name
        , MAX_INI
        , MAX_END
        , CAST(level_3 AS INT) as week_number
        , case when sum(AC) = 2 then 'qwoa' WHEN sum(AC) = 1 then 'woa' else NULL end as week_type
    from CTE_DATES
    GROUP BY ALL
)
select
  d.dt_ini
, d.dt_end
, d.country_iso_code_3
, d.raw_geography
, d.raw_brand
, d.segment /* 'Megabrands' or 'Others' */
, d.campaign
, d.kpi_name
, d.week_number
, d.week_type
from CTE_WEEK d
left join CTE_BRAND_ORDER bo
  on d.raw_brand = bo.raw_brand
  and d.dt_ini = bo.dt_ini
  and d.dt_end = bo.dt_end
where 1=1
  /* fixed params */
  and year(least(to_date(:dt_ini), d.MAX_INI)) = year(d.DT_INI)
  and month(least(to_date(:dt_ini), d.MAX_INI)) = month(d.DT_INI)
  and d.week_type is not null
  and d.raw_brand is not null
ORDER BY CASE
    WHEN segment = 'Megabrands' THEN 1
    WHEN segment = 'Expansion' THEN 2
    WHEN segment = 'Sustain' THEN 3
    WHEN segment = 'Tail' THEN 4
    ELSE 99 END
    , bo.max_campaign_spend_ac desc nulls last, d.raw_brand, d.campaign, d.week_number
;