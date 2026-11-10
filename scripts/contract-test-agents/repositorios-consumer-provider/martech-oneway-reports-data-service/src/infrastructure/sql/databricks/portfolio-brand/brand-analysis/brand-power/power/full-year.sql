/*ENV_[OWR] Brand Analysis - Brand Power - Brand Power Per Year Full*/

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
FROM {{KPI_TABLE}}
    WHERE KPI_NAME = 'power'
    AND LEVEL_1 IN ('ABI', 'COMP')
    AND VERSION_ID IN (1, 2, 4, 61, 62)
    AND MONTH(DT_INI) = 1
    AND (
        MONTH(DT_END) = 12 
        OR (
            DT_END = (
                SELECT MAX(DT_END)
                FROM {{KPI_TABLE}} 
                WHERE 
                    KPI_NAME = 'power'
                    AND VERSION_ID IN (1, 2, 4, 61, 62)
                    AND YEAR(DT_END) = YEAR(:dt_end)
            )
        )
    )
    AND (YEAR(DT_END) <= YEAR(:dt_end))
    AND (YEAR(DT_INI) >= YEAR(:dt_end) - 4)
    AND YEAR(DT_INI) = YEAR(DT_END)
    AND (
        (:viewtype = 'global' AND COUNTRY_ISO_CODE_3 = 'ABI' AND LEVEL_1 = 'ABI' AND VERSION_ID = 2)
        OR (:viewtype = 'zone' AND ABI_ZONE = :zone AND LEVEL_1 = 'ABI' AND VERSION_ID = 4)
        OR (:viewtype = 'country' AND COUNTRY_ISO_CODE_3 = :country AND LEVEL_1 = 'ABI' AND VERSION_ID = 1)
        OR (:viewtype = 'brand' AND ABI_ZONE = :zone AND COUNTRY_ISO_CODE_3 = :country
            AND (LEVEL_3 = CASE WHEN :sub_brand = 'All' then 'N/A' else :sub_brand end 
                or LEVEL_3 = CASE WHEN :sub_brand_comp = 'All' then 'N/A' else :sub_brand_comp end)
                AND VERSION_ID = 61)

    )
    ORDER BY DT_INI, LEVEL_1 ASC;