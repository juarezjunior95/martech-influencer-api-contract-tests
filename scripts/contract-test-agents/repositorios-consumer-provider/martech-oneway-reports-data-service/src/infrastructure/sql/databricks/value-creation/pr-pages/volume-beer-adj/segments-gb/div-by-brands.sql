/* [OWR]  PR Pages - Segments + GB - by Brands */
with qry_base as
(
    SELECT  dt_ini,
            dt_end,
            :period as period,
            country_iso_code_3,
            raw_brand,
            price_tier,
            ac,
            ly,
            ac_vs_ly,
            og_ly,
            kpi_name,
            version_id
    from {{KPI_TABLE}}
    where
        (
            (
                VERSION_ID in (171, 131)
                AND (
                    (:page_type = "Superior Core" AND price_tier = "Core Superiority")
                    OR (:page_type = "Beyond Beer" AND price_tier = "Beyond Beer")
                    OR (:page_type = "Premium Co" AND price_tier = "Premiumization")
                )
            )
            OR
            (
                VERSION_ID in (172, 132)
                AND (
                    (:page_type = "Non Alc" AND price_tier = "NAB")
                )
            )
        )
    and year(dt_ini) = year(:dt_end)
    and kpi_name in ("volume")
)
,
qry_top as
(
    select  dt_ini,
            dt_end,
            country_iso_code_3,
            raw_brand,
            ac,
            row_number() over (partition by dt_ini, dt_end order by ac desc) _rank
    from qry_base
    where kpi_name = "volume"
    and  version_id in (171, 172)
    and   case when period = 'YTD' then month(dt_ini) = 1 else month(dt_ini) = month(:dt_end) end
    and   month(dt_end) = month(:dt_end)
),
qry_ac_total
(
    select 
        sum(ac) ac_total,
        sum(ly) ly_total
    from qry_base
    where   1=1
    and     case when period = 'YTD' then month(dt_ini) = 1 else month(dt_ini) = month(:dt_end) end
    and     month(dt_end) = month(:dt_end)
    and     version_id in (131, 132)
),
qry_top_15 as
(
    select  country_iso_code_3,
            raw_brand,
            _rank
    from qry_top
    where _rank <= 15
)
,
qry_top_15_monthly as
(
    select
            coalesce(top._rank, 16) _rank,
            bas.dt_ini,
            bas.dt_end,
            case when top._rank is null then "Others" else bas.country_iso_code_3 end   country_iso_code_3,
            case when top._rank is null then "Others" else bas.raw_brand end            raw_brand,
            sum(bas.ac) ac,
            sum(bas.ly) ly,
            sum(bas.og_ly) og_ly,
            sum(bas.ac_vs_ly) ac_vs_ly,
            (sum(bas.ac) / act.ac_total) * 100 volume_weight,
            ac_total
    from qry_base bas
    inner join qry_top_15 top
        on bas.country_iso_code_3 = top.country_iso_code_3
        and bas.raw_brand = top.raw_brand
    cross join qry_ac_total act
    where 1=1
        and   case when period = 'YTD' then month(dt_ini) = 1 else month(dt_ini) = month(:dt_end) end
        and month(dt_end) = month(:dt_end)  
        and kpi_name = "volume"
        and version_id in (171, 172)
    group by            
            coalesce(top._rank, 16) ,
            bas.dt_ini,
            bas.dt_end,
            case when top._rank is null then "Others" else bas.country_iso_code_3 end,
            case when top._rank is null then "Others" else bas.raw_brand end,
            act.ac_total
 
),
qry_others as (
    select
        16 as _rank,
        dt_ini,
        dt_end,
        "Others"   country_iso_code_3,
        "Others"   raw_brand,
        t.ac_total - sum(m.ac) as ac,
        t.ly_total - sum(m.ly) as ly,
        (t.ac_total - sum(m.ac)) - (t.ly_total - sum(m.ly)) as og_ly,
        ((t.ac_total - sum(m.ac)) - (t.ly_total - sum(m.ly) )) / (t.ly_total - sum(m.ly)) * 100 as ac_vs_ly,
        (t.ac_total - sum(m.ac)) / t.ac_total * 100 as volume_weight,
        t.ac_total
    from qry_top_15_monthly m
    cross join qry_ac_total t
    group by
        dt_ini,
        dt_end,
        t.ac_total,
        t.ly_total
)

select
    :period as period_type,
        dt_ini,
        dt_end,
        country_iso_code_3,
        raw_brand,
        round(ac, 1) ac,
        round(ac_vs_ly, 1) ac_vs_ly,
        round(og_ly, 1) delta,
        "volume" kpi_name,
        round(ac_total, 1) ac_total,
        _rank
from qry_top_15_monthly
union all
select
    :period as period_type,
        dt_ini,
        dt_end,
        country_iso_code_3,
        raw_brand,
        round(ac, 1) ac,
        round(ac_vs_ly, 1) ac_vs_ly,
        round(og_ly, 1) delta,
        "volume" kpi_name,
        round(ac_total, 1) ac_total,
        _rank
from qry_others
union all
select
    :period as period_type,
        dt_ini,
        dt_end,
        country_iso_code_3,
        raw_brand,
        round(volume_weight, 1) ac,
        null ac_vs_ly,
        null delta,
        "volume_weight" kpi_name,
        round(ac_total, 1) ac_total,
        _rank
from qry_top_15_monthly
union all
select
    :period as period_type,
        dt_ini,
        dt_end,
        country_iso_code_3,
        raw_brand,
        round(volume_weight, 1) ac,
        null ac_vs_ly,
        null delta,
        "volume_weight" kpi_name,
        round(ac_total, 1) ac_total,
        _rank
from qry_others
order by kpi_name, _rank
 