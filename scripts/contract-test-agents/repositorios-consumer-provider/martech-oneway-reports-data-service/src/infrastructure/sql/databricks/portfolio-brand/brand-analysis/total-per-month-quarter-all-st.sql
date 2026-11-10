/*ENV_Brand Analysis - Chart Total Per Month/Quarter*/
/* MARCELO KOMATSU - 2025.07.18 */
/* LEVEL_1 DE MARKET_SHARE PARA OS INDICADORES 61 E 62 ESTAO PREENCHIDOS COM BEER, ADJ */
/* MARCELO KOMATSU - 2025-01-21 - INSERIDO TABELA DE FILTRO PARA MINIMIZAR O MIN MAX NA QUERY E RETORNAR SEMPRE O ULTIMO DADO EXISTENTE*/

with cte_filter as (
    select 
            dt_end,
            version_id, 
            kpi_name
    from gold_common.owr_kpis_min_max_dates_lk
    where
        ((power_filter = 'ABI' AND KPI_NAME = 'power')
          OR (KPI_NAME IN ('market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco'))
        )
        and VERSION_ID = CASE WHEN :country = 'ABI' and :zone = 'ABI' then 2
                          WHEN :country = 'ABI' then 4
                          WHEN :brand = 'All' and :sub_brand = 'All' then 1
                          WHEN :brand <> 'All' and :sub_brand = 'All' then 62
                          else 61
                      end
)
, 
PERIOD_BASE AS (
  SELECT
    ft.KPI_NAME,
    ft.VERSION_ID,
    DT_INI,
    ft.DT_END,
    COUNTRY_ISO_CODE_3,
    ABI_ZONE,
    RAW_BRAND,
    LEVEL_3,
    AC,
    LY,
    AC_VS_LY,
    YEAR(DT_INI) AS YEAR_INI,
    MONTH(DT_INI) AS MONTH_INI,
    year(lk.dt_end) MAX_YEAR,
    lk.dt_end MAX_INI,
    lk.dt_end MAX_END,
    year(ft.DT_END) DT_END_Y,
    QUARTER(ft.DT_END) DT_END_Q,
    month(ft.DT_END) DT_END_M
  FROM {{KPI_TABLE}} ft
  inner join cte_filter lk 
    on  ft.version_id = lk.version_id
    and ft.kpi_name = lk.kpi_name
  WHERE ft.VERSION_ID = CASE WHEN :country = 'ABI' and :zone = 'ABI' then 2
                          WHEN :country = 'ABI' then 4
                          WHEN :brand = 'All' and :sub_brand = 'All' then 1
                          WHEN :brand <> 'All' and :sub_brand = 'All' then 62
                          else 61
                      end
    AND case when :country = 'ABI' then abi_zone = :zone else 1=1 end
    AND country_iso_code_3 = :country
    AND raw_brand = case when :brand = 'All' then 'N/A' else :brand end
    AND AC is not null
    AND level_3 = case when :sub_brand = 'All' then 'N/A' else :sub_brand end
    AND (
      (LEVEL_1 = 'ABI' AND ft.KPI_NAME = 'power')
      OR (ft.KPI_NAME IN ('power', 'market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco'))
    )
    and ((ft.KPI_NAME = 'power' AND LEVEL_1 = 'ABI')
        OR (ft.KPI_NAME = 'market_share')
        OR (ft.KPI_NAME NOT IN ('power', 'market_share') and LEVEL_1 = 'N/A'))
)

SELECT
  KPI_NAME,
  VERSION_ID,
  DT_INI,
  DT_END,
  COUNTRY_ISO_CODE_3,
  ABI_ZONE,
  RAW_BRAND,
  LEVEL_3,
  ROUND(AC, 1) AS AC,
  ROUND(LY, 1) AS LY,
  ROUND(AC_VS_LY, 1) AS AC_VS_LY,
  YEAR_INI,
  MONTH_INI,
  MAX_YEAR
FROM PERIOD_BASE
WHERE (
    kpi_name <> 'power'
    AND DT_END <= :dt_end
    AND DT_END = DT_INI
    AND (
      (
        YEAR(DT_INI) = YEAR(:dt_end)
      ) OR (
        YEAR_INI BETWEEN YEAR(:dt_end) - 1 AND YEAR(:dt_end)
      )
    )
  ) OR (
    kpi_name = 'power'
    AND (
      (
        YEAR(DT_INI) = YEAR(:dt_end) - 1
      ) OR (
        YEAR(DT_INI) = YEAR(:dt_end)
        AND DT_END_Q <= QUARTER(:dt_end)
      )
    )
    AND MONTH(DT_END) - MONTH(DT_INI) = 2
    AND MONTH(DT_INI) IN (1, 4, 7, 10)
  )
ORDER BY KPI_NAME, DT_INI, DT_END;
-- select * from mrt_am.gold_ai_martech.ai_insights_pos_lead_category