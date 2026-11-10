WITH CTE_DATA AS (
SELECT
    CASE
        WHEN MONTH(DT_INI) = 1 AND MONTH(DT_END) = 3 THEN 'Q1'
        WHEN MONTH(DT_INI) = 4 AND MONTH(DT_END) = 6 THEN 'Q2'
        WHEN MONTH(DT_INI) = 7 AND MONTH(DT_END) = 9 THEN 'Q3'
        WHEN MONTH(DT_INI) = 10 AND MONTH(DT_END) = 12 THEN 'Q4'
    END AS QUARTER,
    CASE
        WHEN MONTH(DT_INI) = 1 AND MONTH(DT_END) = 3 THEN CONCAT('Q1 ', YEAR(DT_INI))
            WHEN MONTH(DT_INI) = 4 AND MONTH(DT_END) = 6 THEN CONCAT('Q2 ', YEAR(DT_INI))
            WHEN MONTH(DT_INI) = 7 AND MONTH(DT_END) = 9 THEN CONCAT('Q3 ', YEAR(DT_INI))
            WHEN MONTH(DT_INI) = 10 AND MONTH(DT_END) = 12 THEN CONCAT('Q4 ', YEAR(DT_INI))
    END AS QUARTER_YEAR,
    YEAR(DT_INI) AS YEAR,
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    RAW_BRAND,
    CASE WHEN LEVEL_3 = 'N/A' THEN 'All' ELSE LEVEL_3 END AS SUB_BRAND,
    RAW_GEOGRAPHY,
    AC,
    AC_VS_LY,
    COMP_UNIT_OF_MEASURE,
    LEVEL_1
FROM {{KPI_TABLE}}
WHERE KPI_NAME = 'meaningful'
    AND LEVEL_1 IN ('ABI', 'COMP')
    AND VERSION_ID IN (61, 62)
	AND DT_END <= :dt_end
	AND (
		(MONTH(:dt_end) IN (3, 6, 9, 12) AND DT_INI > DATE_TRUNC('QUARTER', ADD_MONTHS(:dt_end, -24)))
	 OR (MONTH(:dt_end) NOT IN (3, 6, 9, 12) AND DT_INI >= DATE_TRUNC('QUARTER', ADD_MONTHS(:dt_end, -24)))
	)
    AND QUARTER(DT_INI) = QUARTER(DT_END)
    AND COUNTRY_ISO_CODE_3 = :country
    AND (LEVEL_3 = CASE WHEN :sub_brand = 'All' then 'N/A' else :sub_brand end
    or  LEVEL_3 = CASE WHEN :sub_brand_comp = 'All' then 'N/A' else :sub_brand_comp end)
), CTE_BRAND AS (
  SELECT DISTINCT cd1.raw_brand,cd1.sub_brand,cd1.abi_zone,cd1.sub_brand,cd1.raw_geography,cd1.comp_unit_of_measure,cd1.level_1,cd1.COUNTRY_ISO_CODE_3,cd2.* from CTE_DATA cd1
  CROSS JOIN (
  SELECT DISTINCT 
  QUARTER,
    QUARTER_YEAR,
    YEAR,
    DT_INI,
    DT_END from CTE_DATA) cd2
)
SELECT
    cb.QUARTER,
    cb.QUARTER_YEAR,
    YEAR(cb.DT_INI) AS YEAR,
    cb.DT_INI,
    cb.DT_END,
    cb.ABI_ZONE,
    cb.COUNTRY_ISO_CODE_3,
    cb.RAW_BRAND,
    cb.SUB_BRAND,
    cb.RAW_GEOGRAPHY,
    coalesce(AC,0) as AC,
    coalesce(AC_VS_LY,0) as AC_VS_LY,
    cb.COMP_UNIT_OF_MEASURE
FROM CTE_BRAND cb
LEFT JOIN CTE_DATA cd
  ON cb.raw_brand = cd.raw_brand
  AND cb.dt_ini = cd.dt_ini
ORDER BY cb.dt_ini ASC, cb.level_1 ASC