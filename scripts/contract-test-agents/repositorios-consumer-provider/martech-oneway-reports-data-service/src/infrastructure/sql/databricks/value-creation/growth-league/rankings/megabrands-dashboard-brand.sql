/*UAT_[OWR] Value Creation - Growth League - Megabrands BRAND Dashboard*/ 

/* 2025-08-07 - MARCELO KOMATSU / THOR MARINHO - FIRST VERSION */
/* 2025-08-13 - MARCELO KOMATSU - CHANGE KPI_NAME TO BE EQUAL MEGABRANDS COUNTRY */
/* 2025-08-13 - MARCELO KOMATSU - TUNNING */
/* 2025-08-18 - MARCELO KOMATSU - ADDING BRAND FAMILY */

/* QUERY TAXNOMY */
WITH QRY_TAX  AS
(
    select distinct brand_level_1, brand_level_2, brand_level_3, row_number() over (partition by brand_level_3 order by brand_level_1) linha from gold_common.mkt_brand_taxonomy_d
    where year = 2025
)
,
/* QUERY BASE */
 QRY_BASE AS (
  select
    d.*,
    max(d.DT_INI) over (partition by d.level_3, d.version_id) MAX_INI,
    max(d.DT_END) over (partition by d.level_3, d.version_id) MAX_END,
    coalesce(tax.brand_level_1, raw_brand) as brand_family
  from
    /* UAT TABLE */
    /* gold_common.tlh_kpis_agg*/ {{KPI_TABLE}} d
    /* PRD TABLE */
/*    gold_common.tlh_kpis_freeze_agg d */
    left join (select distinct brand_level_1, brand_level_2, brand_level_3 from QRY_TAX
                where linha = 1) tax on upper(d.raw_brand) = upper(tax.brand_level_3)

  where
    1 = 1 /* fixed filters */
    and kpi_name = 'growth_league'
    and level_1 = 'megabrands_ranking'
    and version_id = 107
    AND level_4 = 'N/A'
)
,
/* MB_TOTAL */
QRY_DET_OVER
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'mb_total'
)
,
/* POWER */
QRY_DET_POWER
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    cast(case when month(dt_end) % 3 = 0  then dt_end else dateadd(month, (month(dt_end) % 3) * -1, dt_end ) end as date) dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'power'
)
,
/* MARKET_SHARE */
QRY_DET_MKTSHARE
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'market_share'
)
,
/* CORES */
QRY_DET_CORES
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'cores'
)
,
/* NR */
QRY_DET_NR
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'nr_hl'
)
,
/* participation_lda_plus */
QRY_DET_PARTICIPATION
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    cast(case when month(dt_end) % 3 = 0  then dt_end else dateadd(month, (month(dt_end) % 3) * -1, dt_end ) end as date) dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'participation_lda_plus'
),
/* VOLUME */
QRY_DET_VOLUME
(
SELECT
    raw_brand,
    raw_geography   as country_iso_code_3,
    dt_end,
    level_2         as country_ranking,
    case
        when level_3 = 'mb_total' then 'overall_result'
        when level_3 = 'power' then 'brand_power'
        when level_3 = 'market_share' then 'market_share'
        when level_3 = 'cores' then 'cores'
        when level_3 = 'nr_hl' then 'net_revenue'
        when level_3 = 'participation_lda_plus' then 'participation'
        when level_3 = 'volume' then 'volume'
        end         as kpi_variation,
    level_1         as cup,
    level_4         as cup_breakdown,
    round(ac, 1)    as score,
    brand_family,
    dt_ini
FROM
    QRY_BASE
where
    1 = 1
    and year(least(to_date(:dt_ini), MAX_INI)) = year(DT_INI)
    and year(least(to_date(:dt_end), MAX_END)) = year(DT_END)
    and month(least(to_date(:dt_ini), MAX_INI)) = month(DT_INI)
    and month(least(to_date(:dt_end), MAX_END)) = month(DT_END)
    AND level_3 = 'volume'
)
,
/* RESULTADO */
QRY_RESULT
(
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_OVER
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_POWER
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_MKTSHARE
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_CORES
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_NR
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_PARTICIPATION
    UNION ALL
    SELECT
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
    FROM QRY_DET_VOLUME
)

SELECT 
        raw_brand,
        country_iso_code_3,
        dt_end,
        country_ranking,
        kpi_variation,
        cup,
        cup_breakdown,
        score,
        brand_family,
        dt_ini
FROM QRY_RESULT
order by CAST(country_ranking AS INT)