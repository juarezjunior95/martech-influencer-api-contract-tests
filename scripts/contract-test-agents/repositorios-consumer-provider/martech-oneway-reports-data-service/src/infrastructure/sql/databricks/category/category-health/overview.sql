/* Cateogry Health - Overview */
SELECT
    DT_INI
  , DT_END
  , ABI_ZONE
  , COUNTRY_ISO_CODE_3
  , MATURITY
  , KPI_NAME
  , CASE
        WHEN
            KPI_NAME IN ('cat_health_volume' , 'cat_health_icl' , 'cat_health_sot' , 'wmtbb')
        THEN LEVEL_1
        WHEN
            KPI_NAME = 'p4w'
        THEN LEVEL_4
    END AS CATEGORY
  , UNIT_OF_MEASURE
  , COMP_UNIT_OF_MEASURE
  , AC
  , AC_VS_LY
FROM
  {{KPI_TABLE}}
WHERE
    KPI_NAME IN ('cat_health_volume' , 'cat_health_icl' , 'cat_health_sot' , 'wmtbb', 'p4w')
AND COUNTRY_ISO_CODE_3 IN ('ABI' , 'USA' , 'GBR' , 'CAN'
                         , 'KOR' , 'BEL' , 'CHN' , 'BRA'
                         , 'MEX' , 'ZAF' , 'COL' , 'ARG'
                         , 'PER' , 'DOM' , 'IND' , 'NGA'
                         , 'ECU' )
AND DT_INI = to_date(concat(:year,'-01-01'))
AND DT_END = to_date(concat(:year,'-12-01'))
AND (
    (
        KPI_NAME IN ('cat_health_volume' , 'cat_health_icl' , 'cat_health_sot', 'wmtbb')
        AND LEVEL_1 = :category
    )
    OR (
        KPI_NAME    = 'p4w'
        AND LEVEL_4 = :category
    )
)
AND (
  KPI_NAME <> 'p4w'
  OR (
          LEVEL_1 = 'N/A'
      AND LEVEL_2 = 'N/A'
      AND LEVEL_3 = 'N/A'
  )
)
AND (
    (
        KPI_NAME IN ('cat_health_volume' , 'cat_health_icl' , 'cat_health_sot' )
        /* The version ID for global must be only the 2 */
        AND CASE WHEN COUNTRY_ISO_CODE_3 = 'ABI' AND MATURITY = 'N/A' THEN VERSION_ID = 2 ELSE VERSION_ID IN (1, 35) END
    )
    OR (
        KPI_NAME = 'wmtbb'
        AND VERSION_ID IN (1)
    )
    OR (
        KPI_NAME = 'p4w'
        AND VERSION_ID IN (1001, 1002, 1003)
    )
)
ORDER BY
  CASE KPI_NAME
    WHEN 'cat_health_volume' THEN 1
    WHEN 'cat_health_icl' THEN 2
    WHEN 'cat_health_sot' THEN 3
    WHEN 'p4w' THEN 4
    WHEN 'wmtbb' THEN 5
    ELSE 6
  END,
  CASE MATURITY
    WHEN 'N/A' THEN 1
    WHEN 'M3' THEN 2
    WHEN 'M2' THEN 3
    WHEN 'M1' THEN 4
    ELSE 5
  END,
  CASE
    WHEN COUNTRY_ISO_CODE_3 = 'ABI' THEN 1
    WHEN COUNTRY_ISO_CODE_3 = 'USA' THEN 2
    WHEN COUNTRY_ISO_CODE_3 = 'GBR' THEN 3
    WHEN COUNTRY_ISO_CODE_3 = 'CAN' THEN 4
    WHEN COUNTRY_ISO_CODE_3 = 'KOR' THEN 5
    WHEN COUNTRY_ISO_CODE_3 = 'BEL' THEN 6
    WHEN COUNTRY_ISO_CODE_3 = 'CHN' THEN 7
    WHEN COUNTRY_ISO_CODE_3 = 'BRA' THEN 8
    WHEN COUNTRY_ISO_CODE_3 = 'MEX' THEN 9
    WHEN COUNTRY_ISO_CODE_3 = 'ZAF' THEN 10
    WHEN COUNTRY_ISO_CODE_3 = 'COL' THEN 11
    WHEN COUNTRY_ISO_CODE_3 = 'ARG' THEN 12
    WHEN COUNTRY_ISO_CODE_3 = 'PER' THEN 13
    WHEN COUNTRY_ISO_CODE_3 = 'DOM' THEN 14
    WHEN COUNTRY_ISO_CODE_3 = 'IND' THEN 15
    WHEN COUNTRY_ISO_CODE_3 = 'NGA' THEN 16
    WHEN COUNTRY_ISO_CODE_3 = 'ECU' THEN 17
    ELSE 18
  END
;
