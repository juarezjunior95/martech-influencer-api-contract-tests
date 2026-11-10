/*ENV_Brand Analysis - Chart Total Per Year Full*/
/* MARCELO KOMATSU - 2025.07.18 */
/* MARCELO KOMATSU - 2025-01-21 - INSERIDO TABELA DE FILTRO PARA MINIMIZAR O MIN MAX NA QUERY E RETORNAR SEMPRE O ULTIMO DADO EXISTENTE*/
/* ALISSON KASCHER - 2026-02-26
Analyze and fix volume queries to display the correct data after refresh.

Try to use filter table + parameter to show the correct data after refresh.*/
/* MARCELO KOMATSU - 2026-03-20 - Correct to show max_year - 4 (2022 --> ) */

WITH cte_filter AS (
SELECT 
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_ini
            ELSE dt_ini_last
        END AS dt_ini,
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
            ELSE dt_end_last
        END AS dt_end,
        dt_ini_last,
        dt_end_last,
        version_id,
        kpi_name,
        CONCAT(CAST(YEAR(dt_end) AS STRING), '-01-01') AS dt_ini_year,
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
            ELSE dt_end_last
        END AS dt_ref
    FROM gold_common.owr_kpis_min_max_dates_lk
WHERE (
        kpi_name IN ('market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco')
        OR (kpi_name = 'power' AND power_filter = 'ABI')
      )
  AND version_id = CASE
                       WHEN :country = 'ABI' AND :zone  = 'ABI'         THEN 2
                       WHEN :country = 'ABI'                             THEN 4
                       WHEN :brand   = 'All' AND :sub_brand = 'All'      THEN 1
                       WHEN :brand  <> 'All' AND :sub_brand = 'All'      THEN 62
                       ELSE 61
                   END
GROUP BY
    all
),

PERIOD_BASE AS (
    SELECT 
        ft.KPI_NAME,
        ft.VERSION_ID,
        ft.DT_INI,
        ft.DT_END,
        ft.COUNTRY_ISO_CODE_3,
        ft.ABI_ZONE,
        ft.RAW_BRAND,
        ft.LEVEL_3,
        ROUND(ft.AC, 1)       AS AC,
        ROUND(ft.AC_VS_LY, 1) AS AC_VS_LY,
        YEAR(ft.DT_INI)       AS YEAR_INI,
        max(YEAR(lk.dt_end)) over ()    AS MAX_YEAR
    FROM cte_filter lk 
    INNER JOIN {{KPI_TABLE}} ft 
        ON  ft.kpi_name   = lk.kpi_name
        AND ft.version_id = lk.version_id
        AND ft.dt_end <= lk.dt_end
    WHERE ft.KPI_NAME IN ('power', 'market_share', 'volume', 'nr', 'cores', 'nr_per_hl', 'maco_per_hl', 'sm_per_hl', 'sm_of_maco')
      AND ft.VERSION_ID = CASE
                              WHEN :country = 'ABI' AND :zone  = 'ABI'       THEN 2
                              WHEN :country = 'ABI'                           THEN 4
                              WHEN :brand   = 'All' AND :sub_brand = 'All'    THEN 1
                              WHEN :brand  <> 'All' AND :sub_brand = 'All'    THEN 62
                              ELSE 61
                          END
      AND CASE WHEN :country = 'ABI' THEN abi_zone = :zone ELSE 1 = 1 END
      AND ((LEVEL_3 = 'N/A' AND :sub_brand = 'All') OR LEVEL_3 = :sub_brand)
      AND country_iso_code_3 = :country
      AND raw_brand          = CASE WHEN :brand = 'All' THEN 'N/A' ELSE :brand END
      AND ac IS NOT NULL
      AND level_3            = CASE WHEN :sub_brand = 'All' THEN 'N/A' ELSE :sub_brand END
      AND DATE_FORMAT(ft.DT_INI, 'MM-dd') = '01-01'
      AND DATE_FORMAT(ft.DT_END, 'MM-dd') = '12-01'
      AND (
              (ft.KPI_NAME = 'power'        AND LEVEL_1 = 'ABI')
           OR (ft.KPI_NAME = 'market_share')
           OR (ft.KPI_NAME NOT IN ('power', 'market_share') AND LEVEL_1 = 'N/A')
          )
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
    AC,
    AC_VS_LY,
    YEAR_INI
FROM PERIOD_BASE
WHERE YEAR_INI BETWEEN MAX_YEAR - 4 AND MAX_YEAR
ORDER BY YEAR_INI ASC;