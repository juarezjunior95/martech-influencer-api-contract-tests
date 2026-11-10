WITH vol AS (
  SELECT
      brand_level_1_taxonomy AS brand,
      CASE 
        WHEN :country = 'EUR' THEN country_iso_code_3_eur 
        ELSE country_iso_code_3 
      END AS country,
      MEASURE(volume_ly)       AS vol_ly,
      MEASURE(volume_og_ly)    AS vol_og_ly,
      MEASURE(volume_ac_vs_ly) AS vol_ac_vs_ly
  FROM gold_common.owr_finance_mv
  WHERE UPPER(product_type) = 'BEER'
    AND period_type = CASE 
                        WHEN :period_type = 'YTD' THEN 'YTD'
                        WHEN :period_type = 'MTD' THEN 'MTH'
                      END
    AND YEAR(end_date) = YEAR(:dt_end)
    AND MONTH(end_date) = MONTH(:dt_end)
    AND country_iso_code_3_finance_scope NOT IN ('JPN', 'VNM', 'URY', 'ZMB', 'GTM')
  GROUP BY ALL
)

SELECT DISTINCT
    CASE 
      WHEN :country = 'EUR' THEN A.level_2 
      ELSE A.COUNTRY_ISO_CODE_3 
    END AS country,
    A.RAW_BRAND,
    B.brand,
    A.segment AS segment,
    A.AC,
    A.AC_VS_LY AS vs_ly_pp,
    B.vol_ac_vs_ly,
    :period_type AS period_type
FROM {{KPI_TABLE}} A
LEFT JOIN vol B 
  ON (
      CASE 
        WHEN :country = 'EUR' THEN A.level_2 
        ELSE A.COUNTRY_ISO_CODE_3 
      END
     ) = B.country
AND A.raw_brand = B.brand
WHERE A.KPI_NAME = 'market_share'
  AND (
        (:country = 'EUR' AND A.VERSION_ID = 225)
        OR (:country <> 'EUR' AND A.VERSION_ID = 224)
      )
  AND (
        (A.VERSION_ID = 225 AND A.level_2 = 'EUR')
        OR (A.VERSION_ID <> 225 AND A.COUNTRY_ISO_CODE_3 = :country)
      )
  AND (
        (:period_type = 'YTD'
          AND MONTH(A.DT_INI) = 1
          AND YEAR(A.DT_INI) = YEAR(A.DT_END))
--          AND NOT (DATEDIFF(A.DT_END, A.DT_INI) BETWEEN 58 AND 63))
        OR (:period_type = 'MTD' AND A.DT_END = A.DT_INI)
      )
  AND A.DT_END = :dt_end
  AND A.COUNTRY_ISO_CODE_3 NOT IN ('JPN', 'VNM', 'URY', 'ZMB', 'GTM')
ORDER BY
  CASE segment
    WHEN 'Mega Brand' THEN 1
    WHEN 'Expansion Brand' THEN 2
    WHEN 'Sustain Brand' THEN 3
    ELSE 4
  END,
  AC DESC