/*ENV_[OWR] Brand Analysis - Brand Power - BIP*/
WITH CTE_MAX_DT AS (
  SELECT 
    COUNTRY_ISO_CODE_3,
    ABI_ZONE,
    RAW_GEOGRAPHY,
    AC_VS_LY as COMP_VALUE,
    AC as VALUE,
    DT_INI,
    DT_END,
    LEVEL_1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    RAW_BRAND,
    MAX(DT_END) OVER() AS max_end
  from {{KPI_TABLE}}
  where 1=1
    /* fixed filters */
    /* ANNA - 2025-07-02 - Removed level_4 filter */
    AND KPI_NAME = 'BIP'
    AND LEVEL_1 IN ('ABI', 'COMP')
    AND VERSION_ID = 61
    /* parameters */
    AND COUNTRY_ISO_CODE_3 = :country
    AND (LEVEL_3 = CASE WHEN :sub_brand = 'All' then 'N/A' else :sub_brand end
        or  LEVEL_3 = CASE WHEN :sub_brand_comp = 'All' then 'N/A' else :sub_brand_comp end) 
    /* ANNA - 2025-07-02 - CHANGE FILTER - Has to be "where not null" because BIP can have negative values*/
    AND ac is not null
    AND ac <> 0
)


SELECT
    YEAR_VALUE,
    max_end,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    LEVEL_1,
    LEVEL_2,
    RAW_BRAND,
    SUB_BRAND,
    LEVEL_4,
    RAW_GEOGRAPHY,
    VALUE,
    COMP_VALUE,
    DT_INI,
    DT_END
FROM (
    SELECT
        YEAR(DT_INI) AS YEAR_VALUE,
        MAX(max_end) OVER() AS max_end,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        LEVEL_1,
        LEVEL_2,
        LEVEL_3,
        RAW_BRAND,
        CASE WHEN LEVEL_3 = 'N/A' THEN 'All' ELSE LEVEL_3 END AS SUB_BRAND,
        LEVEL_4,
        RAW_GEOGRAPHY,
        VALUE,
        COMP_VALUE,
        DT_INI,
        DT_END
        FROM CTE_MAX_DT
    )
 
    /* THOR MARINHO - 2025-08-26 - date filter suffered changes to get only YTD ranges */
    WHERE year(DT_INI) = year(max_end)
    AND month(DT_INI) = 1
    AND DT_END = max_end
    order by LEVEL_4, DT_INI, LEVEL_1 ASC;