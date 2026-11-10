/* Bees Distribution - Card Chart - Big Number */
/* ------------------------------------------------------------------------------------------------------ */
/* Marcelo Komatsu - 2025-01-16 - When we refresh Data with new SKU File, Megabrand changed to Mega Brand */
/* Marcelo Komatsu - 2025-02-23 - Change to bring data for Big Number when month dt_end = 1              */
with cte_filter as (
    select
        version_id,
        kpi_name,
        dt_end_last,
        dt_end,
        CAST(dateadd(month, -6, dt_end_last) AS DATE) dt_ini,
        cast(concat(year(dt_end), '-01-01') as date) dt_ini_year
    from gold_common.owr_kpis_min_max_dates_lk
    where version_id in (1, 2, 53, 64)
      and CASE
              WHEN :pageview = 'distribution' THEN (KPI_NAME = 'distribution')
              WHEN :pageview = 'bees buyers' THEN (KPI_NAME = 'bees buyers')
              WHEN :pageview = 'sku per poc' THEN (KPI_NAME = 'sku per poc')
        END
)
   ,
    BASE_QUERY AS(
        SELECT
            fat.*,
            fil.dt_end dt_end_last
        FROM CTE_FILTER fil
                 inner join {{KPI_TABLE}} fat
                            ON  fil.version_id  = fat.version_id
                                and fil.kpi_name    = fat.kpi_name
                                and  ((fat.dt_ini   = fat.dt_end
                                    and fat.dt_end      between fil.dt_ini and fil.dt_end)
                                    or (fil.dt_ini_year   = fat.dt_ini
                                        and fil.dt_end    = fat.dt_end))
        WHERE
            fat.VERSION_ID IN (1,2,53,64)
          AND
            CASE
                WHEN :viewtype = 'global' THEN (fat.COUNTRY_ISO_CODE_3 = 'ABI')
                WHEN :viewtype = 'country' THEN (fat.COUNTRY_ISO_CODE_3 = :country)
                END
          AND
            CASE
                WHEN :scope = 'megabrand' THEN (fat.SEGMENT in ('Megabrand', "Mega Brand"))
                ELSE fat.SEGMENT = 'N/A'
                END
          AND
            CASE
                WHEN :pageview = 'distribution' THEN (fat.KPI_NAME = 'distribution')
                WHEN :pageview = 'bees buyers' THEN (fat.KPI_NAME = 'bees buyers')
                WHEN :pageview = 'sku per poc' THEN (fat.KPI_NAME = 'sku per poc')
                END
    )
   ,
    CTE_PRE_PROC AS (
        SELECT
            dt_ini,
            dt_end,
            dt_end_last MAX_END,
            version_id,
            kpi_name,
    YEAR(dt_end) AS year,
    country_iso_code_3,
    ROUND(ac,1) AS ac,
    ROUND(ly,1) AS ly,
    ROUND(ac_vs_ly,1) AS ac_vs_ly,
    unit_of_measure,
    comp_unit_of_measure,
    segment
FROM BASE_QUERY bq
union all
SELECT
    dt_ini,
    dt_end,
    dt_end_last MAX_END,
    version_id,
    kpi_name,
    YEAR(dt_end) AS year,
    country_iso_code_3,
    ROUND(ac,1) AS ac,
    ROUND(ly,1) AS ly,
    ROUND(ac_vs_ly,1) AS ac_vs_ly,
    unit_of_measure,
    comp_unit_of_measure,
    segment
FROM BASE_QUERY bq
where month(dt_end_last) = 1
  and   dt_end = dt_end_last
    )
SELECT
    dt_ini,
    dt_end,
    version_id,
    kpi_name,
    country_iso_code_3,
    CASE
        WHEN ac IS NULL THEN NULL
        WHEN ABS(ac) < 1000 THEN CAST(ROUND(ac, 1) AS STRING)
        WHEN ABS(ac) >= 1000000 THEN CAST(ROUND(ac / 1000000, 1) AS STRING)
        ELSE CAST(ROUND(ac / 1000, 1) AS STRING)
        END AS ac,
    ac_vs_ly AS ac_vs_ly,
    unit_of_measure,
    comp_unit_of_measure,
    case when segment = 'Mega Brand' then 'Megabrands' else 'All' end segment
FROM CTE_PRE_PROC
ORDER BY
    version_id,
    dt_end,
    dt_ini desc
