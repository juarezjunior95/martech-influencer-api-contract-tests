/*ENV_Brand Analysis - Chart Total Per Year*/
/* MARCELO KOMATSU - 2025.07.18 */
/* LEVEL_1 DE MARKET_SHARE PARA OS INDICADORES 61 E 62 ESTAO PREENCHIDOS COM BEER, ADJ */
/* MARCELO KOMATSU - 2025-01-21 - INSERIDO TABELA DE FILTRO PARA MINIMIZAR O MIN MAX NA QUERY E RETORNAR SEMPRE O ULTIMO DADO EXISTENTE*/

with cte_base as(
    select distinct  
          dt_end,
          kpi_name
    from gold_common.owr_kpis_min_max_dates_lk
    where kpi_name  IN ('market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco')
    or (kpi_name = 'power' and power_filter = 'ABI' )
)
,
 PERIOD_BASE AS (
  SELECT
    ft.KPI_NAME,
    VERSION_ID,
    DT_INI,
    ft.DT_END,
    COUNTRY_ISO_CODE_3,
    ABI_ZONE,
    RAW_BRAND,
    LEVEL_3,
    AC,
    AC_VS_LY,
    lk.dt_end MAX_INI,
    lk.dt_end MAX_END,
    year(ft.DT_END) AS DT_END_Y,
    quarter(ft.DT_END) DT_END_Q,
    month(ft.DT_END) DT_END_M,
    YEAR(ft.DT_INI) AS YEAR_INI,
    MONTH(ft.DT_INI) AS MONTH_INI,
    MAX(YEAR(ft.DT_INI)) OVER () AS MAX_YEAR
  FROM {{KPI_TABLE}} ft
  inner join cte_base lk
      on ft.kpi_name = lk.kpi_name
  WHERE ft.KPI_NAME IN ('power', 'market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco')
    AND VERSION_ID = CASE WHEN :country = 'ABI' and :zone = 'ABI' then 2
                          WHEN :country = 'ABI' then 4
                          WHEN :brand = 'All' and :sub_brand = 'All' then 1
                          WHEN :brand <> 'All' and :sub_brand = 'All' then 62
                          else 61
                      end
    AND case when :country = 'ABI' then abi_zone = :zone else 1=1 end
    AND country_iso_code_3 = :country
    AND raw_brand = case when :brand = 'All' then 'N/A' else :brand end
    AND ac is not null
    AND level_3 = case when :sub_brand = 'All' then 'N/A' else :sub_brand end
    AND year(ft.dt_end) >= year(lk.dt_end)-1

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
  ROUND(AC_VS_LY, 1) AS AC_VS_LY,
  YEAR_INI,
  MONTH_INI,
  DATE_FORMAT(DATEADD(YEAR, -1, DT_END), 'yyyy-MM-dd') AS PREVIOUS_DT_END
FROM PERIOD_BASE
WHERE (
    year(MAX_END) = DT_END_Y
    AND MONTH(DT_INI) = 1
    AND (
      (kpi_name =  'power' AND quarter(MAX_END) = DT_END_Q)
      OR
      (kpi_name <> 'power' AND month(MAX_END) = DT_END_M)
    )
  ) OR (
    year(MAX_END) - 1 = DT_END_Y
    AND MONTH(DT_INI) = 1
    AND (
      (kpi_name =  'power' AND quarter(MAX_END) = DT_END_Q)
      OR
      (kpi_name <> 'power' AND month(MAX_END) = DT_END_M)
    )
  )
ORDER BY KPI_NAME, YEAR_INI, MONTH_INI;
-- select * from mrt_am.gold_ai_martech.ai_insights_pos_lead_category