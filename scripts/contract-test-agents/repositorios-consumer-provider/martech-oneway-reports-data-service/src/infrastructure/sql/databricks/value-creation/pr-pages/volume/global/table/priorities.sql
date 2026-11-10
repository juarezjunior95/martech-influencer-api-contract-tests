/* =================== DON´T FORGET =========================================== */
/* UAT - gold_common.tlh_kpis_agg                                               */
/* PRD - gold_common.tlh_kpis_freeze_agg                                        */
/*------------------------ CREATED BY ----------------------------------------- */
/* 2025.12.01 - THOR MARINHO - VOLUME FOR MONTH, L3M AND YTD - COUNTRY / GLOBAL */
/*------------------------ PARAMETERS ----------------------------------------- */
/* :country --> if global --> ABI else country_iso_code_3                       */
/* :viewtype --> global or country                                              */
/*------------------------ CHANGES -------------------------------------------- */
/* 2025.12.01 - ALAN SILVA - UPDATED CODE VOLUME FOR MONTH, L3M AND YTD -        */
/* COUNTRY / GLOBAL                                                             */
/* 2026.01.30 - ALAN SILVA - L3M cross-year support: changed MONTH diff to DATEDIFF for L3M */
/*------------------------ CHANGES -------------------------------------------- */

WITH CTE_MAX_DT AS (
    SELECT
        *
        , MAX(DT_END) OVER() AS max_end
    FROM {{KPI_TABLE}}
    WHERE 1=1
        AND kpi_name = 'volume'
        AND VERSION_ID IN (131,132,160,149,161) 
),
CTE_PERIOD as (
    /*-- M*/
    SELECT *, 'M' as PERIOD
    FROM CTE_MAX_DT
    WHERE DT_END = DT_INI

    UNION ALL
    
    /*-- L3M*/
    SELECT *, 'L3M' as PERIOD
    FROM CTE_MAX_DT
    WHERE DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63

    UNION ALL

    /*-- YTD*/
    SELECT *, 'YTD' as PERIOD
    FROM CTE_MAX_DT
    WHERE MONTH(DT_INI) = 1 /*AND MONTH(DT_END) <> 1*/
),
CET_PRIORITIES AS(
  SELECT 
    DT_INI,
    DT_END,
    PERIOD,
    'ABI' AS COUNTRY_ISO_CODE_3,
    VERSION_ID,
    CASE
      WHEN (price_tier = 'Core Superiority' AND version_id = 131) THEN 'Superior Core'
      WHEN (price_tier = 'Premiumization' AND version_id = 131) THEN 'Lead Premium'
      WHEN (price_tier = 'Beyond Beer' AND version_id = 131) THEN 'Beyond Beer'
      WHEN (price_tier = 'NAB' AND version_id = 132) THEN 'Non Alc Beer'
      WHEN (/*price_tier = 'N/A' AND*/ version_id = 161) THEN 'Global Brands'
    END AS Priorities,
    KPI_NAME,
    ROUND(sum(ac),1) AS AC,
    ROUND(try_divide(sum(ac)-sum(ly),sum(ly))*100,1) AS AC_VS_LY
  FROM CTE_PERIOD
  WHERE TRUE
    AND dt_end = :dt_end
    --AND price_tier NOT IN ('')
  GROUP BY ALL
  HAVING  Priorities IS NOT NULL
)
SELECT *
FROM CET_PRIORITIES
ORDER BY
    CASE period
      WHEN 'M' THEN 1
      WHEN 'L3M' THEN 2
      WHEN 'YTD' THEN 3
      ELSE 4
    END,
    CASE Priorities
      WHEN 'Superior Core' THEN 1
      WHEN 'Lead Premium' THEN 2
      WHEN 'Global Brands' THEN 3
      WHEN 'Non Alc Beer' THEN 4
      WHEN 'Beyond Beer' THEN 5
      ELSE 6
    END