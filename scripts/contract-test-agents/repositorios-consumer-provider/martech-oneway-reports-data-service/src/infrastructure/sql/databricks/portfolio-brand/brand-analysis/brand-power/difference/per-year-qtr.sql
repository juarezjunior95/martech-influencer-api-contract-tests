/*ENV_[OWR] Brand Analysis - Brand Power - Difference Per Year QTR*/

/*=======================================================================================*/
/* [OWR] Brand Analysis - Brand Power - Difference Per Year QTR                           */
/*=======================================================================================*/

/*=======================================================================================*/
/*                          Changes                                                      */
/*=======================================================================================*/


/*=======================================================================================*/
/* Author: Marcelo Komatsu                                                               */
/* Date: 2025-06-24                                                                      */
/* Description: Change Filter                                                            */
/*      Filter only SubBrand, because all customers don´t know about our hierarchy       */
/*=======================================================================================*/
/* KOMATSU - 2025-06-24 - CHANGE FILTER */



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
        COMP_UNIT_OF_MEASURE
FROM {{KPI_TABLE}}
WHERE KPI_NAME = 'difference'
    AND LEVEL_1 IN ('ABI', 'COMP')
    /* KOMATSU - 2025-06-24 - CHANGE FILTER */
--    AND VERSION_ID IN (61, 62)
    AND VERSION_ID = 61
	AND DT_END <= :dt_end
	AND (
		(MONTH(:dt_end) IN (3, 6, 9, 12) AND DT_INI > DATE_TRUNC('QUARTER', ADD_MONTHS(:dt_end, -24)))
	 OR (MONTH(:dt_end) NOT IN (3, 6, 9, 12) AND DT_INI >= DATE_TRUNC('QUARTER', ADD_MONTHS(:dt_end, -24)))
	)
    AND QUARTER(DT_INI) = QUARTER(DT_END)
    AND COUNTRY_ISO_CODE_3 = :country
    /* KOMATSU - 2025-06-24 - CHANGE FILTER */
--    AND ((RAW_BRAND = :brand AND ((LEVEL_3 = 'N/A' AND :sub_brand = 'All') OR LEVEL_3 = :sub_brand)) or (RAW_BRAND = :brand_comp AND ((LEVEL_3 = 'N/A' AND :sub_brand = 'All') OR LEVEL_3 = :sub_brand_comp)))
        AND (LEVEL_3 = CASE WHEN :sub_brand = 'All' then 'N/A' else :sub_brand end
            or  LEVEL_3 = CASE WHEN :sub_brand_comp = 'All' then 'N/A' else :sub_brand_comp end)

ORDER BY DT_INI, LEVEL_1 ASC;