/*ENV_[OWR] Brand Analysis - Brand Power - Brand Power Per Year*/

WITH CTE_DATES AS (
    SELECT *
    , max(DT_INI) over(partition by kpi_name, version_id) MAX_INI
    , max(DT_END) over(partition by kpi_name, version_id) MAX_END
    FROM {{KPI_TABLE}}
    /* fixed filters */
    where 1=1
    AND LEVEL_1 IN ('ABI', 'COMP')
    AND VERSION_ID IN (1, 2, 4, 61, 62)
    AND (
        (:viewtype = 'global' AND COUNTRY_ISO_CODE_3 = 'ABI' AND LEVEL_1 = 'ABI' AND VERSION_ID = 2)
        OR (:viewtype = 'zone' AND ABI_ZONE = :zone AND LEVEL_1 = 'ABI' AND VERSION_ID = 4)
        OR (:viewtype = 'country' AND COUNTRY_ISO_CODE_3 = :country AND LEVEL_1 = 'ABI' AND VERSION_ID = 1)
        OR (:viewtype = 'brand' AND ABI_ZONE = :zone AND COUNTRY_ISO_CODE_3 = :country
        AND ((LEVEL_3 =  case when :sub_brand = 'All' then 'N/A'  else :sub_brand end) or (LEVEL_3 =  case when :sub_brand_comp = 'All' then 'N/A'  else :sub_brand_comp end)) AND VERSION_ID = 61) 

    )
)
SELECT
    YEAR(DT_INI) AS YEAR_VALUE,
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    RAW_BRAND,
    CASE WHEN LEVEL_3 = 'N/A' THEN 'All' ELSE LEVEL_3 END AS SUB_BRAND,
    RAW_GEOGRAPHY,
    ROUND(AC, 1) AS AC,
    ROUND(AC_VS_LY, 1) AS AC_VS_LY,
    COMP_UNIT_OF_MEASURE
  FROM CTE_DATES
  WHERE KPI_NAME = 'power'
    and quarter(DT_INI) = 1
    and quarter(least(to_date(:dt_end), MAX_END)) = quarter(DT_END)
    AND (YEAR(DT_END) <= YEAR(:dt_end))
    AND (YEAR(DT_INI) >= YEAR(:dt_end) - 1)
    AND YEAR(DT_INI) = YEAR(DT_END)
    ORDER BY DT_INI, LEVEL_1 ASC;