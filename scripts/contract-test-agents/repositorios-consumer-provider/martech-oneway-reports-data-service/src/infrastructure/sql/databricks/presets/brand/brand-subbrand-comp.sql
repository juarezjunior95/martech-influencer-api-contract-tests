/* Thor - 2025-08-28 - Filtro de Data - fixing - 24 para trazer apenas as marcas com valores de ate 24 meses */
/* OBS.: estava trazendo os primeiros 36 meses ao invés de apenas 24 */

with cte_max_date as (
    select  max(dt_end) max_end,
            cast(dateadd(year, -1, cast(max(dt_end) as date)) as date) max_dt_ini
    FROM gold_common.tlh_kpis_freeze_agg
    WHERE KPI_NAME = 'power'
        AND LEVEL_1 IN ('ABI', 'COMP')
        and VERSION_ID = 61
)
SELECT DISTINCT
    COUNTRY_ISO_CODE_3    as country_iso_code_3,
    LEVEL_1               as level_1, 
    RAW_BRAND             as brand_family,
    LEVEL_3               as sub_brand,
    max_end,
    max_dt_ini
FROM gold_common.tlh_kpis_freeze_agg a
cross join cte_max_date b 
WHERE KPI_NAME = 'power'
    AND LEVEL_1 IN ('ABI', 'COMP')
    /* Komatsu - 2025-06-25 -- Change Filter */
    and VERSION_ID = 61
    and dt_ini >= max_dt_ini
    and dt_end <= max_end
    and coalesce(ac, 0) <> 0
ORDER BY country_iso_code_3, level_1, brand_family, sub_brand;