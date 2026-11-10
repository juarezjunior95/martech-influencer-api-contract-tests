/* ALISSON KASCHER - 2026-02-26
Analyze and fix volume queries to display the correct data after refresh.

Try to use filter table + parameter to show the correct data after refresh.*/
/*ENV_Brand Analysis - Overview Tooltip*/
/* MARCELO KOMATSU - 2025.07.18 */
/* LEVEL_1 DE MARKET_SHARE PARA OS INDICADORES 61 E 62 ESTAO PREENCHIDOS COM BEER, ADJ */
/* MARCELO KOMATSU - 2025-01-21 - INSERIDO TABELA DE FILTRO PARA MINIMIZAR O MIN MAX NA QUERY E RETORNAR SEMPRE O ULTIMO DADO EXISTENTE*/

with cte_filter as(
    select   
          CASE
          WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
          ELSE dt_end_last
          END AS dt_end,
          kpi_name,
          VERSION_ID
    from gold_common.owr_kpis_min_max_dates_lk
    where (kpi_name  IN ('market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco')
    or (kpi_name = 'power' and power_filter = 'ABI' ))
    AND VERSION_ID = CASE WHEN :country = 'ABI' and :zone = 'ABI' then 2
                          WHEN :country = 'ABI' then 4
                          WHEN :brand = 'All' and :sub_brand = 'All' then 1
                          WHEN :brand <> 'All' and :sub_brand = 'All' then 62
                        else 61
                    end
)
,
 CTE_DATES AS (
  SELECT 
    ft.*,
    CASE 
      WHEN month(lk.dt_end) <> 12 THEN year(lk.dt_end) - 1 
      ELSE year(lk.dt_end) 
    END AS max_year
  FROM cte_filter lk
    inner join  {{KPI_TABLE}} ft
      ON  ft.dt_end <= lk.dt_end
      AND lk.kpi_name = ft.kpi_name
      and lk.VERSION_ID = ft.VERSION_ID
 WHERE ft.KPI_NAME IN ('volume', 'market_share', 'nr', 'cores', 'sm', 'power')
    AND ft.VERSION_ID = CASE WHEN :country = 'ABI' and :zone = 'ABI' then 2
                          WHEN :country = 'ABI' then 4
                          WHEN :brand = 'All' and :sub_brand = 'All' then 1
                          WHEN :brand <> 'All' and :sub_brand = 'All' then 62
                        else 61
                    end
    AND COUNTRY_ISO_CODE_3 = :country
    AND case when :country = 'ABI' then abi_zone = :zone else 1=1 end
    AND raw_brand = case when :brand = 'All' then 'N/A' else :brand end
    and LEVEL_3 = case when :sub_brand = 'All' then 'N/A' else :sub_brand end
    and :dt_end = :dt_end
    and ((ft.KPI_NAME = 'power' AND LEVEL_1 = 'ABI')
        OR (ft.KPI_NAME = 'market_share')
        OR (ft.KPI_NAME NOT IN ('power', 'market_share') and LEVEL_1 = 'N/A'))
),
PERIOD_BASE AS (
  SELECT
    KPI_NAME,
    VERSION_ID,
    DT_INI,
    DT_END,
    COUNTRY_ISO_CODE_3,
    ABI_ZONE,
    RAW_BRAND,
    LEVEL_3,
    AC,
    YEAR(DT_INI) AS YEAR_INI,
    MAX_YEAR,
    CASE
      WHEN (YEAR(DT_END) = MAX_YEAR AND MONTH(DT_END) = 12) THEN DT_END ELSE null END AS max_dt,
    'CURRENT' AS PERIOD
  FROM CTE_DATES
),
PREVIOUS_PERIOD AS (
  SELECT
    KPI_NAME,
    VERSION_ID,
    DT_INI,
    DT_END,
    COUNTRY_ISO_CODE_3,
    ABI_ZONE,
    RAW_BRAND,
    LEVEL_3,
    AC,
    YEAR(DT_INI) AS YEAR_INI,
    'PREVIOUS' AS PERIOD,
    ROW_NUMBER() OVER (PARTITION BY KPI_NAME, VERSION_ID, COUNTRY_ISO_CODE_3, RAW_BRAND, LEVEL_3 ORDER BY DT_INI) AS RN
  FROM CTE_DATES
  WHERE year(DT_INI) BETWEEN max_year - 3 AND max_year
    AND year(DT_END) BETWEEN max_year - 3 AND max_year
    AND MONTH(DT_INI) = 1
    AND MONTH(DT_END) = 12
)
SELECT
  pb.MAX_DT,
  pb.KPI_NAME AS KPI_NAME,
  pb.VERSION_ID AS VERSION_ID,
  pb.DT_INI AS DT_INI_CURRENT,
  pb.DT_END AS DT_END_CURRENT,
  pp.DT_INI AS DT_INI_PREVIOUS,
  pp.DT_END AS DT_END_PREVIOUS,
  pb.COUNTRY_ISO_CODE_3 AS COUNTRY_ISO_CODE_3,
  pb.ABI_ZONE AS ABI_ZONE,
  pb.RAW_BRAND AS RAW_BRAND,
  pb.LEVEL_3 AS LEVEL_3,
  pb.AC AS AC_CURRENT,
  pp.AC AS AC_PREVIOUS,
  CASE
    WHEN pb.KPI_NAME IN ('market_share', 'power') THEN ROUND(pb.AC - pp.AC, 1)
    ELSE ROUND(((pb.AC - pp.AC)/NULLIF(ABS(pp.AC), 0))*100, 1)
  END AS AC_VS_LY
FROM PERIOD_BASE pb
LEFT JOIN (
  SELECT * 
  FROM PREVIOUS_PERIOD 
  WHERE RN = 1
) pp
  ON pb.KPI_NAME = pp.KPI_NAME
  AND pb.VERSION_ID = pp.VERSION_ID
  AND pb.COUNTRY_ISO_CODE_3 = pp.COUNTRY_ISO_CODE_3
  AND pb.ABI_ZONE = pp.ABI_ZONE
  AND pb.RAW_BRAND = pp.RAW_BRAND
  AND pb.LEVEL_3 = pp.LEVEL_3
WHERE MAX_YEAR = YEAR(pb.DT_END)
  AND pb.MAX_DT IS NOT NULL
  AND MONTH(pb.DT_INI) = 1
ORDER BY pb.KPI_NAME, pb.DT_INI, pb.DT_END;