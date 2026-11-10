/*--------------------------------------------------------------------------------------------------------------- */
/* ENV_TOP_BOTTOM_CHARTS_PERFORMANCE_TOOL_MARKET_SHARE                                                            */
/*--------------------------------------------------------------------------------------------------------------- */
 
/*------------------------------------ Changes ------------------------------------------------------------------ */
/* LEANDRO FIGUEIREDO - 2026-04-20 - CREATION                                                                     */
/*------------------------------------ Changes ------------------------------------------------------------------ */

WITH param AS(
SELECT
    --All visions are Brand in a country
    CASE
        WHEN LCASE(COALESCE(:growth_lever, '')) IN('', 'all', 'abi') AND LCASE(COALESCE(:country, '')) IN('', 'all', 'abi') THEN 215 --Default
        WHEN LCASE(COALESCE(:growth_lever, '')) IN('', 'all', 'abi') AND LCASE(COALESCE(:country, '')) NOT IN('', 'all', 'abi') THEN 215 --Filter by country
        WHEN LCASE(COALESCE(:growth_lever, '')) NOT IN('', 'all', 'abi') AND LCASE(COALESCE(:country, '')) IN('', 'all', 'abi') THEN 226 --Enable filter by growth_lever
    END version_id
    , :period_type period_type
    , CASE :period_type
          WHEN  'MTD' THEN :dt_end
          WHEN 'YTD' THEN DATE_TRUNC('YEAR', :dt_end)
      END dt_ini
    , :dt_end dt_end
    , CASE :growth_lever
            WHEN 'Superior Core' THEN 'Core Superiority'
            WHEN 'Lead Premium' THEN 'Premiumization'
            ELSE COALESCE(:growth_lever, '')
    END growth_lever
    , COALESCE(:country, '') country
    , UCASE(COALESCE(:direction, '')) direction
) --SELECT * FROM param
, base AS(
SELECT
      agg.dt_ini
      , agg.dt_end
      , :period_type period_type
      , agg.raw_brand
      , agg.country_iso_code_3
      , agg.ac
      , agg.ac_vs_ly
      , ROW_NUMBER() OVER(ORDER BY agg.ac_vs_ly) RNK_BOTTOM
      , ROW_NUMBER() OVER(ORDER BY agg.ac_vs_ly DESC) RNK_TOP
      , agg.version_id
FROM  {{KPI_TABLE}} agg
INNER JOIN param
      ON agg.version_id = param.version_id
      AND agg.dt_end = param.dt_end
      AND agg.dt_ini = param.dt_ini
WHERE
      agg.country_iso_code_3 != 'ABI'
      AND agg.kpi_name = 'market_share'
      AND agg.raw_brand IS NOT NULL /*LOF 2026-04-14: Remove NULL brands*/
      AND CASE
        WHEN param.country IN('', 'All', 'ABI') THEN TRUE
        ELSE agg.country_iso_code_3 = param.country
      END
      AND CASE
        WHEN param.growth_lever IN('', 'All') THEN TRUE
        ELSE agg.price_tier = param.growth_lever
      END
)
, top AS(
SELECT
      dt_ini
      , dt_end
      , period_type
      , raw_brand
      , country_iso_code_3
      , ac
      , ac_vs_ly
      , RNK_TOP RNK
      , version_id
FROM  base
WHERE
      RNK_TOP <= 15
)
, bottom AS(
SELECT
      dt_ini
      , dt_end
      , period_type
      , raw_brand
      , country_iso_code_3
      , ac
      , ac_vs_ly
      , RNK_BOTTOM RNK
      , version_id
FROM  base
WHERE
      RNK_BOTTOM <= 15
)
, final AS(
SELECT top.*, 'TOP' DIRECTION
FROM  top
CROSS JOIN param
WHERE param.direction IN('', 'ALL', 'TOP')
UNION ALL
SELECT bottom.*, 'BOTTOM' DIRECTION
FROM  bottom
CROSS JOIN param
WHERE param.direction IN('', 'ALL', 'BOTTOM')
)
, volume AS(
SELECT
      ini_date dt_ini
      , end_date dt_end
      , period_type period_type
      , brand_level_1_taxonomy brand
      , country_iso_code_3
      , MEASURE(volume_ac) AS vol_ac, MEASURE(volume_ly) AS vol_ly, MEASURE(volume_og_ly) AS vol_og_ly
FROM  gold_common.owr_finance_mv mv
WHERE 
      period_type = CASE :period_type WHEN 'MTD' THEN 'MTH' WHEN 'L3M' THEN 'R3M' ELSE :period_type END
      AND end_date = :dt_end
      AND CASE
        WHEN LCASE(COALESCE(:country, '')) IN('', 'all', 'abi') THEN TRUE
        ELSE country_iso_code_3 = :country
      END
GROUP BY ALL
)

SELECT
      final.*
      , volume.vol_ac
      , volume.vol_ly
      , volume.vol_og_ly
FROM  final
LEFT  JOIN volume
      ON final.dt_end = volume.dt_end
      AND final.dt_ini = volume.dt_ini
      AND final.raw_brand = volume.brand
      AND final.country_iso_code_3 = volume.country_iso_code_3
ORDER BY direction DESC, RNK