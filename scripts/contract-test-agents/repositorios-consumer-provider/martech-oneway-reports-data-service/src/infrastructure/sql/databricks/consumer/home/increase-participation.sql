/*ENV_[OWR] Consumer Overview - Increase Participation*/
/* Parametrização: :timeperiod → YTD | R12M | R3M */

/* MARCELO KOMATSU - 2025-02-12 - LAST 8 QTRS WITH LAST INCLUDED */


WITH CTE_CANDIDATE_DATES AS (
    SELECT
        MAX(CAST(dt_end AS DATE)) AS dt_end,
        MAX_BY(CAST(dt_end_last AS DATE), dt_end) AS dt_end_last,
        version_id
    FROM gold_common.owr_kpis_min_max_dates_lk
    WHERE kpi_name = 'p4w'
      AND VERSION_ID = CASE :viewtype
                           WHEN 'country' THEN 1005
                           WHEN 'global'  THEN 1006
                           WHEN 'zone'    THEN 1018
        END
    GROUP BY version_id
),

     CTE_DATES_ANCHOR AS (
         SELECT
             LEAST(TO_DATE(:dt_end),
                   CASE
                       WHEN EXISTS (
                           SELECT 1
                           FROM {{KPI_TABLE}} ft
                           WHERE ft.kpi_name = 'p4w'
                             AND ft.version_id = c.version_id
                             AND ft.dt_end = c.dt_end
                             AND ft.level_4 = 'ABINBEV'
                       )
                           THEN c.dt_end
                       ELSE c.dt_end_last
                       END
             ) AS MAX_DT_END,
             c.version_id
         FROM CTE_CANDIDATE_DATES c
     ),

     CTE_PERIOD_GENERATOR AS (

         /* ---------- 8 CLOSED QUARTERS ---------- */
         SELECT
             CAST(ADD_MONTHS(DATE_TRUNC('QUARTER', MAX_DT_END), -(pos * 3)) AS DATE) AS DT_INI,
             CAST(ADD_MONTHS(DATE_TRUNC('QUARTER', MAX_DT_END), -(pos * 3) + 2) AS DATE) AS DT_END,
             CONCAT('Q', QUARTER(ADD_MONTHS(DATE_TRUNC('QUARTER', MAX_DT_END), -(pos * 3))),
                    '-', RIGHT(YEAR(ADD_MONTHS(DATE_TRUNC('QUARTER', MAX_DT_END), -(pos * 3))),2)
        ) AS PERIOD_LABEL,
             pos AS SORT_ORDER
         FROM CTE_DATES_ANCHOR
                  LATERAL VIEW EXPLODE(SEQUENCE(0,7)) AS pos

UNION ALL

/* ---------- BIG NUMBER (dinâmico) ---------- */
SELECT
    CASE
        WHEN :timeperiod = 'R12M' THEN ADD_MONTHS(MAX_DT_END, -11)
        WHEN :timeperiod = 'R3M'  THEN ADD_MONTHS(MAX_DT_END, -2)
        WHEN :timeperiod = 'YTD'  THEN DATE_TRUNC('YEAR', MAX_DT_END)
        END AS DT_INI,

    MAX_DT_END AS DT_END,

    :timeperiod AS PERIOD_LABEL,

    99 AS SORT_ORDER

FROM CTE_DATES_ANCHOR
    ),

CTE_BASE AS (
  SELECT
    ft.ABI_ZONE,
    ft.COUNTRY_ISO_CODE_3,
    ft.RAW_GEOGRAPHY,
    pg.DT_INI,
    pg.DT_END,
    pg.PERIOD_LABEL,
    pg.SORT_ORDER,
    ft.AC_VS_LY,
    ft.COMP_UNIT_OF_MEASURE,
    ft.AC,
    ft.UNIT_OF_MEASURE
  FROM {{KPI_TABLE}} ft
    INNER JOIN CTE_PERIOD_GENERATOR pg
      ON ft.DT_INI = pg.DT_INI
      AND ft.DT_END = pg.DT_END
    INNER JOIN CTE_DATES_ANCHOR lk
      ON ft.VERSION_ID = lk.VERSION_ID
  WHERE ft.KPI_NAME = 'p4w'
    AND ft.LEVEL_1 = 'N/A'
    AND ft.LEVEL_2 = 'N/A'
    AND ft.LEVEL_3 = 'N/A'
    AND ft.LEVEL_4 = 'ABINBEV'
    AND (
      (:viewtype = 'country' AND ft.COUNTRY_ISO_CODE_3 = :country)
   OR (:viewtype = 'zone'    AND ft.ABI_ZONE = :zone)
   OR (:viewtype = 'global'  AND ft.ABI_ZONE = 'ABI' AND ft.COUNTRY_ISO_CODE_3 = 'ABI')
)
)

SELECT
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    RAW_GEOGRAPHY,
    cast(DT_INI as date) DT_INI,
    DT_END,
    PERIOD_LABEL,
    AC_VS_LY,
    COMP_UNIT_OF_MEASURE,
    AC,
    UNIT_OF_MEASURE
FROM CTE_BASE
ORDER BY DT_END ASC, DT_INI DESC;