/*
 * Category Home - Drill Down - Big Numbers
 *
 * Input variables:
 *   :viewtype  - Scope of the view: 'country' | 'global' | 'zone'
 *   :country   - Country ISO code (e.g. USA, GBR) for filtering
 *   :category  - Product type: 'Beer' | 'Beyond Beer' | 'Beer + Beyond Beer'
 *   :year      - End date for the period (e.g. 2025, 2024)
 */
WITH CTE_BASE_ABI AS (
    SELECT
        *,
        CASE 
            WHEN kpi_name = 'p4w' THEN LEVEL_4
            ELSE LEVEL_1
        END AS CATEGORY
    FROM {{KPI_TABLE}}
    WHERE
        1=1
        AND CASE :viewtype
                WHEN 'country' THEN VERSION_ID IN (1, 1001)
                WHEN 'global' THEN VERSION_ID IN (2, 1002)
                WHEN 'zone' THEN VERSION_ID IN (18, 1018)
            END
        AND YEAR(DT_END) = YEAR(:year)
        AND MONTH(DT_INI) = 1
        AND MONTH(DT_END) = 12
        AND kpi_name IN ('cat_health_volume', 'cat_health_icl', 'cat_health_sot', 'wmtbb', 'p4w')
        AND CASE 
                WHEN kpi_name = 'p4w' THEN 
                    (LEVEL_1 = 'N/A' AND LEVEL_2 = 'N/A' AND LEVEL_3 = 'N/A' AND LEVEL_4 IN ('Beer', 'Beyond Beer', 'Beer + Beyond Beer'))
                ELSE LEVEL_1 IN ('Beer', 'Beyond Beer', 'Beer + Beyond Beer')
            END
        AND COUNTRY_ISO_CODE_3 = :country
)

SELECT 
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    KPI_NAME,
    CATEGORY,
    UNIT_OF_MEASURE,
    COMP_UNIT_OF_MEASURE,
    AC,
    AC_VS_LY
FROM CTE_BASE_ABI
WHERE 1=1
    AND CASE
            WHEN :category = 'Beer'                         THEN CATEGORY = 'Beer'
            WHEN :category = 'Beyond Beer'                  THEN CATEGORY = 'Beyond Beer'
            WHEN :category = 'Beer + Beyond Beer'           THEN CATEGORY = 'Beer + Beyond Beer'
        END
ORDER BY
  DT_INI, DT_END
