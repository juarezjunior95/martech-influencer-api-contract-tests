/*ENV_[OWR] Performance Tool - Market Share - Waterfall */
WITH base AS (
    SELECT
        DT_INI, DT_END
         , COUNTRY_ISO_CODE_3 AS step_name
         , AC, LY, AC_VS_LY
    FROM {{KPI_TABLE}}
    WHERE :waterfall_filter = 'country'
      AND :zone = 'ABI'
      AND KPI_NAME = 'market_share'
      AND VERSION_ID = CASE
                           WHEN EXISTS (
                               SELECT 1
                               FROM {{KPI_TABLE}} v
                               WHERE v.KPI_NAME = 'market_share'
                                 AND v.VERSION_ID = 212
                                 AND v.DT_END = :dt_end
                                 AND (
                                   (:period_type = 'YTD' AND MONTH(v.DT_INI) = 1 AND YEAR(v.DT_INI) = YEAR(v.DT_END)
                --AND NOT (DATEDIFF(v.DT_END, v.DT_INI) BETWEEN 58 AND 63)
                )
              OR (:period_type = 'L3M' AND DATEDIFF(v.DT_END, v.DT_INI) BETWEEN 58 AND 63)
              OR (:period_type = 'MTD' AND v.DT_END = v.DT_INI)
            )
                           ) THEN 212
                           ELSE 204
        END
      AND (
        (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
    OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
    AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT
    DT_INI, DT_END
     , COUNTRY_ISO_CODE_3 AS step_name
     , AC, LY, AC_VS_LY
FROM {{KPI_TABLE}}
WHERE :waterfall_filter = 'country'
  AND :zone != 'ABI'
    AND KPI_NAME = 'market_share'
    AND VERSION_ID = 1
    AND ABI_ZONE = :zone
    AND (
      (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
        --AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
        )
      OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
      OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
    AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT
    DT_INI, DT_END
     , CASE
           WHEN :country = 'ABI' THEN RAW_BRAND || CHR(10) || COUNTRY_ISO_CODE_3
           ELSE RAW_BRAND
    END AS step_name
     , AC, LY, AC_VS_LY
FROM {{KPI_TABLE}}
WHERE :waterfall_filter = 'brand'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = 213
  AND CASE WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country ELSE TRUE END
  AND CASE WHEN :zone != 'ABI' THEN ABI_ZONE = :zone ELSE TRUE END
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT
    DT_INI, DT_END
     , CASE
           WHEN UPPER(TRIM(COALESCE(LEVEL_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_3)
           WHEN UPPER(TRIM(COALESCE(LEVEL_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_2)
           WHEN UPPER(TRIM(COALESCE(LEVEL_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(LEVEL_1)
           ELSE 'N/A'
    END AS step_name
     , AC, LY, AC_VS_LY
FROM gold_common.tlh_kpis_brand_share_agg
WHERE :waterfall_filter = 'sub_brand'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = 209
  AND CASE WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country ELSE TRUE END
  AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
    ),
    parent_base_raw AS (
SELECT AC, LY, AC_VS_LY, DT_END
FROM {{KPI_TABLE}}
WHERE :waterfall_filter = 'country'
  AND :zone = 'ABI'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = 2
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT AC, LY, AC_VS_LY, DT_END
FROM {{KPI_TABLE}}
WHERE :waterfall_filter = 'country'
  AND :zone != 'ABI'
  AND :country = 'ABI'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = 144
  AND ABI_ZONE = :zone
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT AC, LY, AC_VS_LY, DT_END
FROM {{KPI_TABLE}}
WHERE :waterfall_filter = 'brand'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = CASE
    WHEN :country = 'ABI' AND :zone = 'ABI' THEN 2
    WHEN :country != 'ABI' AND :zone != 'EUR' THEN 1
    WHEN :country != 'ABI' AND :zone = 'EUR' THEN 1
    WHEN :country = 'ABI' AND :zone = 'EUR' THEN 212
    END
  AND CASE
    WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country
    WHEN :country = 'ABI' AND :zone = 'EUR' THEN COUNTRY_ISO_CODE_3 = :zone
    ELSE TRUE
    END
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
UNION ALL
SELECT AC, LY, AC_VS_LY, DT_END
FROM gold_common.tlh_kpis_brand_share_agg
WHERE :waterfall_filter = 'sub_brand'
  AND KPI_NAME = 'market_share'
  AND VERSION_ID = 213
  AND CASE WHEN :country != 'ABI' THEN COUNTRY_ISO_CODE_3 = :country ELSE TRUE END
  AND CASE WHEN :brand != 'All' THEN RAW_BRAND = :brand ELSE TRUE END
  AND (
    (:period_type = 'YTD' AND MONTH(DT_INI) = 1 AND YEAR(DT_INI) = YEAR(DT_END)
--AND NOT (DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
    )
   OR (:period_type = 'L3M' AND DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63)
   OR (:period_type = 'MTD' AND DT_END = DT_INI)
    )
  AND DT_END IN (:dt_end, ADD_MONTHS(:dt_end, -12))
    ),
    parent_base AS (
SELECT
    SUM(CASE WHEN DT_END = :dt_end THEN AC END) AS AC
        , SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC_VS_LY END) AS LY_VS_LY
        , SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC END) AS LY
        , SUM(CASE WHEN DT_END = :dt_end THEN AC_VS_LY END) AS AC_VS_LY
        , SUM(CASE WHEN DT_END = :dt_end THEN AC END)
    - COALESCE(SUM(CASE WHEN DT_END = ADD_MONTHS(:dt_end, -12) THEN AC END), 0) AS DELTA
FROM parent_base_raw
    ),
    step_agg AS (
SELECT
    cur.step_name
        , cur.ac
        , cur.ly
        , cur.ac_vs_ly
        , cur.ac - COALESCE(py.ac, 0) AS delta
FROM (
    SELECT
    step_name
        , SUM(AC) AS ac
        , SUM(LY) AS ly
        , SUM(AC_VS_LY) AS ac_vs_ly
    FROM base
    WHERE DT_END = :dt_end
    GROUP BY step_name
    ) cur
    LEFT JOIN (
    SELECT
    step_name
        , SUM(AC) AS ac
    FROM base
    WHERE DT_END = ADD_MONTHS(:dt_end, -12)
    GROUP BY step_name
    ) py
ON cur.step_name = py.step_name
    ),
    fixed_countries_abi AS (
SELECT 'USA' AS step_name, 1 AS rnk
UNION ALL SELECT 'BRA', 2
UNION ALL SELECT 'MEX', 3
UNION ALL SELECT 'CHN', 4
UNION ALL SELECT 'ZAF', 5
UNION ALL SELECT 'EUR', 6
UNION ALL SELECT 'CAN', 7
UNION ALL SELECT 'KOR', 8
UNION ALL SELECT 'COL', 9
UNION ALL SELECT 'PER', 10
UNION ALL SELECT 'ARG', 11
UNION ALL SELECT 'DOM', 12
UNION ALL SELECT 'IND', 13
UNION ALL SELECT 'NGA', 14
UNION ALL SELECT 'ECU', 15
    ),
    step_ranked AS (
SELECT
    *
        , ROW_NUMBER() OVER (
    ORDER BY
    CASE WHEN
    TRIM(REPLACE(COALESCE(step_name, ''), CHR(10), '')) = ''
    OR LEFT(step_name, 1) = CHR(10)
    OR RIGHT(step_name, 1) = CHR(10)
    OR UPPER(TRIM(COALESCE(step_name, ''))) IN ('N/A', 'NA', 'NULL', 'NONE')
    OR CONTAINS(step_name, 'Others')
    THEN CASE WHEN :waterfall_filter = 'country' AND :zone = 'ABI' THEN 16
    ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 1 END
    END
        , CASE WHEN :waterfall_filter = 'country' AND :zone = 'ABI' THEN
    CASE step_name
    WHEN 'USA' THEN 1
    WHEN 'BRA' THEN 2
    WHEN 'MEX' THEN 3
    WHEN 'CHN' THEN 4
    WHEN 'ZAF' THEN 5
    WHEN 'EUR' THEN 6
    WHEN 'CAN' THEN 7
    WHEN 'KOR' THEN 8
    WHEN 'COL' THEN 9
    WHEN 'PER' THEN 10
    WHEN 'ARG' THEN 11
    WHEN 'DOM' THEN 12
    WHEN 'IND' THEN 13
    WHEN 'NGA' THEN 14
    WHEN 'ECU' THEN 15
    ELSE 18
    END
    END
        , CASE WHEN :waterfall_filter = 'country' AND :zone = 'EUR' THEN
    CASE step_name
    WHEN 'NLD' THEN 1
    WHEN 'ITA' THEN 2
    WHEN 'DEU' THEN 3
    WHEN 'FRA' THEN 4
    WHEN 'GBR' THEN 5
    WHEN 'BEL' THEN 6
    ELSE 18
    END
    END
        , CASE WHEN :waterfall_filter IN ('brand', 'sub_brand')
    OR (:waterfall_filter = 'country' AND :zone NOT IN ('ABI', 'EUR'))
    THEN ac
    END DESC
    ) AS rnk
FROM step_agg
    ),
    top_steps AS (
SELECT
    f.step_name
        , COALESCE(s.ac, 0) AS ac
        , COALESCE(s.ly, 0) AS ly
        , COALESCE(s.ac_vs_ly, 0) AS ac_vs_ly
        , COALESCE(s.delta, 0) AS delta
        , f.rnk
FROM fixed_countries_abi f
    LEFT JOIN step_agg s
ON s.step_name = f.step_name
WHERE :waterfall_filter = 'country'
  AND :zone = 'ABI'
UNION ALL
SELECT step_name, ac, ly, ac_vs_ly, delta, rnk
FROM step_ranked
WHERE NOT (:waterfall_filter = 'country' AND :zone = 'ABI')
  AND rnk <= COALESCE(NULLIF(:max_ranked, ''), 15)
  AND TRIM(REPLACE(COALESCE(step_name, ''), CHR(10), '')) != ''
  AND UPPER(TRIM(COALESCE(step_name, ''))) NOT IN ('N/A', 'NA', 'NULL', 'NONE')
  AND NOT CONTAINS(COALESCE(step_name, ''), 'Others')
    ),
    vol_step_data AS (
SELECT
    country_iso_code_3_eur AS step_name
        , MEASURE(volume_ac) AS vol_ac
        , MEASURE(volume_ly) AS vol_ly
        , MEASURE(volume_og_ly) AS vol_og_ly
FROM gold_common.owr_finance_mv
WHERE :waterfall_filter = 'country' AND :zone = 'ABI'
  AND upper(product_type) = 'BEER'
  AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
  AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
GROUP BY country_iso_code_3_eur
UNION ALL
SELECT
    country_iso_code_3_finance_scope AS step_name
        , MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
FROM gold_common.owr_finance_mv
WHERE :waterfall_filter = 'country' AND :zone != 'ABI'
  AND upper(product_type) = 'BEER'
  AND zone = :zone
  AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
  AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
GROUP BY country_iso_code_3_finance_scope
UNION ALL
SELECT
    CASE WHEN :country = 'ABI' THEN brand_level_1_taxonomy || CHR(10) || country_iso_code_3_finance_scope
    ELSE brand_level_1_taxonomy END AS step_name
        , MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
FROM gold_common.owr_finance_mv
WHERE :waterfall_filter = 'brand'
  AND upper(product_type) = 'BEER'
  AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
  AND CASE WHEN :zone != 'ABI' THEN zone = :zone ELSE TRUE END
  AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
  AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
GROUP BY ALL
UNION ALL
SELECT
    CASE
    WHEN UPPER(TRIM(COALESCE(brand_level_3, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_3)
    WHEN UPPER(TRIM(COALESCE(brand_level_2, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_2)
    WHEN UPPER(TRIM(COALESCE(brand_level_1, ''))) NOT IN ('', 'N/A', 'NA', 'NULL', 'NONE') THEN TRIM(brand_level_1)
    ELSE 'N/A'
    END AS step_name
        , MEASURE(volume_ac), MEASURE(volume_ly), MEASURE(volume_og_ly)
FROM gold_common.owr_finance_mv
WHERE :waterfall_filter = 'sub_brand'
  AND upper(product_type) = 'BEER'
  AND CASE WHEN :country != 'ABI' THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
  AND CASE WHEN :brand != 'All' THEN brand_level_1 = :brand ELSE TRUE END
  AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
  AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
GROUP BY ALL
    ),
    vol_step_agg AS (
SELECT
    step_name
        , SUM(vol_ac) AS vol_ac
        , SUM(vol_ly) AS vol_ly
        , SUM(vol_og_ly) AS vol_og_ly
FROM vol_step_data
GROUP BY step_name
    ),
    vol_parent_data AS (
SELECT
    MEASURE(volume_ac) AS vol_ac
        , MEASURE(volume_ly) AS vol_ly
        , MEASURE(volume_og_ly) AS vol_og_ly
FROM gold_common.owr_finance_mv
WHERE upper(product_type) = 'BEER'
  AND period_type = CASE :period_type WHEN 'YTD' THEN 'YTD' WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' END
  AND YEAR(end_date) = YEAR(:dt_end) AND MONTH(end_date) = MONTH(:dt_end)
  AND CASE WHEN :waterfall_filter = 'country' AND :zone != 'ABI'
    THEN zone = :zone ELSE TRUE END
  AND CASE WHEN :waterfall_filter IN ('brand', 'sub_brand') AND :country != 'ABI'
    THEN country_iso_code_3_finance_scope = :country ELSE TRUE END
  AND CASE WHEN :waterfall_filter = 'sub_brand' AND :brand != 'All'
    THEN brand_level_1 = :brand ELSE TRUE END
    ),
    vol_lookup AS (
SELECT
    ts.step_name
        , CASE
    WHEN ABS(COALESCE(va.vol_ly, 0)) > 0
    THEN CASE
    WHEN ABS(COALESCE(va.vol_og_ly, 0) / va.vol_ly * 100) > 1000000000 THEN 100.0
    ELSE COALESCE(va.vol_og_ly, 0) / ABS(va.vol_ly) * 100
    END
    ELSE NULL
    END AS vol_vs_ly
        , va.vol_ac
FROM top_steps ts
    LEFT JOIN vol_step_agg va ON ts.step_name = va.step_name
UNION ALL
SELECT
    'Others' AS step_name
        , CASE
    WHEN ABS(p.vol_ly - COALESCE(s.total_vol_ly, 0)) > 0
    THEN CASE
    WHEN ABS(
    (p.vol_og_ly - COALESCE(s.total_vol_og_ly, 0))
    / (p.vol_ly - COALESCE(s.total_vol_ly, 0)) * 100
    ) > 1000000000 THEN 100.0
    ELSE (p.vol_og_ly - COALESCE(s.total_vol_og_ly, 0))
    / ABS(p.vol_ly - COALESCE(s.total_vol_ly, 0)) * 100
    END
    ELSE NULL
    END AS vol_vs_ly
        , p.vol_ac - COALESCE(s.vol_ac, 0) AS vol_ac
FROM vol_parent_data p
    CROSS JOIN (
    SELECT
    COALESCE(SUM(va.vol_ly), 0) AS total_vol_ly
        , COALESCE(SUM(va.vol_og_ly), 0) AS total_vol_og_ly
        , COALESCE(SUM(va.vol_ac), 0) AS vol_ac
    FROM top_steps ts
    LEFT JOIN vol_step_agg va ON ts.step_name = va.step_name
    ) s
UNION ALL
SELECT
    :period_type || "'" || DATE_FORMAT(:dt_end, 'yy') AS step_name
        , CASE
    WHEN ABS(COALESCE(p.vol_ly, 0)) > 0
    THEN CASE
    WHEN ABS(COALESCE(p.vol_og_ly, 0) / p.vol_ly * 100) > 1000000000 THEN 100.0
    ELSE COALESCE(p.vol_og_ly, 0) / ABS(p.vol_ly) * 100
    END
    ELSE NULL
    END AS vol_vs_ly
        , p.vol_ac
FROM vol_parent_data p
    ),
    others_bar AS (
SELECT
    'Others' AS step_name
        , p.ac - COALESCE(s.total_ac, 0) AS ac
        , p.ly - COALESCE(s.total_ly, 0) AS ly
        , p.ac_vs_ly - COALESCE(s.total_vs_ly, 0) AS ac_vs_ly
        , p.delta - COALESCE(s.total_delta, 0) AS delta
        , CASE WHEN :waterfall_filter = 'country' AND :zone = 'ABI' THEN 16
    ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 1 END AS rnk
FROM parent_base p
    CROSS JOIN (
    SELECT
    COALESCE(SUM(ac), 0) AS total_ac
        , COALESCE(SUM(ly), 0) AS total_ly
        , COALESCE(SUM(ac_vs_ly), 0) AS total_vs_ly
        , COALESCE(SUM(delta), 0) AS total_delta
    FROM top_steps
    ) s
    ),
    final AS (
SELECT
    step_name
        , ROUND(ac, 1) AS ac
        , ROUND(delta, 1) AS delta
        , ROUND(ac_vs_ly, 1) AS ac_vs_ly
        , rnk
FROM top_steps
UNION ALL
SELECT
    step_name
        , ROUND(ac, 1) AS ac
        , ROUND(delta, 1) AS delta
        , ROUND(ac_vs_ly, 1) AS ac_vs_ly
        , rnk
FROM others_bar
UNION ALL
SELECT
    :period_type || "'" || DATE_FORMAT(ADD_MONTHS(:dt_end, -12), 'yy') AS step_name
        , ROUND(LY, 1) AS ac
        , ROUND(LY_VS_LY, 1) AS delta
        , ROUND(LY_VS_LY, 1) AS ac_vs_ly
        , 0 AS rnk
FROM parent_base
UNION ALL
SELECT
    :period_type || "'" || DATE_FORMAT(:dt_end, 'yy') AS step_name
        , ROUND(AC, 1) AS ac
        , ROUND(DELTA, 1) AS delta
        , ROUND(AC_VS_LY, 1) AS ac_vs_ly
        , CASE WHEN :waterfall_filter = 'country' AND :zone = 'ABI' THEN 17
    ELSE COALESCE(NULLIF(:max_ranked, ''), 15) + 2 END AS rnk
FROM parent_base
    ),
    result AS (
SELECT
    f.step_name AS labels
        , CASE
    WHEN LEFT(f.step_name, 3) = :period_type THEN
    CASE WHEN :waterfall_filter = 'sub_brand' THEN :brand ELSE '' END
    WHEN :waterfall_filter = 'brand' AND :country = 'ABI' THEN get(split(f.step_name, CHR(10)), 0)
    WHEN :waterfall_filter = 'brand' AND :country != 'ABI' THEN f.step_name
    ELSE ''
    END AS raw_brand
        , CASE
    WHEN LEFT(f.step_name, 3) = :period_type THEN
    CASE
    WHEN :country != 'ABI' THEN :country
    WHEN :zone != 'ABI' THEN :zone
    ELSE 'ABI'
    END
    WHEN :waterfall_filter = 'country' THEN f.step_name
    WHEN :waterfall_filter = 'brand' AND :country = 'ABI' THEN get(split(f.step_name, CHR(10)), 1)
    WHEN :waterfall_filter = 'brand' AND :country != 'ABI' THEN :country
    ELSE ''
    END AS country_iso_code_3
        , CASE
    WHEN LEFT(f.step_name, 3) = :period_type THEN ''
    WHEN :waterfall_filter = 'sub_brand' THEN f.step_name
    ELSE ''
    END AS product_type
        , f.ac
        , f.delta
        , f.ac_vs_ly AS vs_ly
        , CASE
    WHEN f.rnk = 0 THEN CAST(NULL AS DECIMAL(10,1))
    ELSE ROUND(vl.vol_vs_ly, 1)
    END AS vol_vs_ly
        , vl.vol_ac / SUM(
    CASE
    WHEN vl.step_name != :period_type || "'" || DATE_FORMAT(:dt_end, 'yy')
    THEN vl.vol_ac
    END
    ) OVER() * 100 AS vol_weight
        , '%' AS unit_of_measure
        , 'pp' AS comp_unit_of_measure
        , :dt_end AS filter_dt_end
        , :period_type AS filter_period_type
        , :waterfall_filter AS filter_waterfall_filter
        , :country AS filter_country
        , :zone AS filter_zone
        , :brand AS filter_brand
        , COALESCE(NULLIF(:max_ranked, ''), 15) AS filter_max_ranked
        , f.rnk
FROM final f
    LEFT JOIN vol_lookup vl
ON f.step_name = vl.step_name
    )
--SELECT * FROM vol_lookup
SELECT *
FROM result
WHERE
    NOT (/*LOF 2026-04-08: This block remove zeroed labels*/
        LEFT(labels, 3) != :period_type
        AND COALESCE(AC, 0) = 0
        AND COALESCE(DELTA, 0) = 0
        AND COALESCE(VS_LY, 0) = 0
        )
  AND :country NOT IN('ZMB', 'URY', 'GTM') /*LOF 2026-04-20: Force empty state for these countries because they isn't any brand for these in the brand source.*/
ORDER BY rnk;