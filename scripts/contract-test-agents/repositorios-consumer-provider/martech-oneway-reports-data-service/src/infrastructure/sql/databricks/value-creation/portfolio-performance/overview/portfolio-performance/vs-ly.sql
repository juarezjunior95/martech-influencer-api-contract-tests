/*ENV_[OWR] Value Creation - Overview - Portfolio Performance - Vs LY*/
 
/* MARCELO KOMATSU 2025-07-22 - INCLUINDO TOTAL CALCULADO PARA SM_WEIGHT E REMOVENDO DA QUERY O TOTAL JÁ CALCULADO    */
/* MARCELO KOMATSU 2025-08-13 - CORRIGIDO - NÃO ESTAVA TRAZENDO DADOS DE POWER QUANDO NÃO ERA MES FECHADO DE QUARTER  */
/* MARCELO KOMATSU 2026-01-08 - CORRIGIDO - POWER - ESTAVA RETORNANDO DADOS ERRADOS POR CAUSA DE UM FILTRO - LEVEL_1 = ABI  */
/* MARCELO KOMATSU 2026-01-14 - CORRIGIDO - POWER RETORNANDO DADOS YTD OU MTD CONFORME FILTRO E UTILIZANDO NOVA ESTRUTURA COM TABELA E REMOVENDO MIN E MAX  */
/* RAMON SILVA  - 2026-02-03 - CHANGE FILTER LOGIC - ADD ROW NUMBER AND FILTERS */
 
/* MARCELO KOMATSU 2026-02-23 - RECEIVING PARAMETER :period to control YTD e MTD  */
/* LEANDRO DE OLIVEIRA FIGUEIREDO (LOF) 2026-03-02 - FIXED: THE ROW NUMBER WAS ENUMERATING POWER KPI RANDOMLY BECAUSE MULTIPLE RECORDS IN THE SAME PARTITION HAD THE SAME DATE. ADDED A SECONDARY SORT LEVEL*/
 
WITH qry_filter AS (
    SELECT DISTINCT
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
        CONCAT(CAST(YEAR(        
          CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
            ELSE dt_end_last
            END) AS STRING), '-01-01') AS dt_ini_year,
        CASE
            WHEN :period = 'YTD' THEN 'YTD'
            ELSE 'MTD'
        END AS period,
        CASE
            WHEN dt_end <= CAST(:dt_end AS DATE) THEN dt_end
            ELSE dt_end_last
        END AS max_dt
    FROM gold_common.owr_kpis_min_max_dates_lk
    WHERE
        (
            kpi_name IN ('nr', 'cores', 'market_share', 'sm_of_maco', 'sm_weight', 'power')
            AND version_id IN (5, 6, 9, 51, 90, 16)
        )
        OR (
            kpi_name = 'power'
            AND version_id IN (1, 2, 4)
            AND power_filter = 'ABI'
        )
)
,
QRY_BASE AS (
    SELECT
        fat.*,
        lk.max_dt AS MAX_END,
        ROW_NUMBER() OVER (
            PARTITION BY fat.version_id, fat.country_iso_code_3, fat.abi_zone, fat.kpi_name, fat.segment
            ORDER BY
                    fat.dt_end DESC
                    , CASE WHEN fat.kpi_name = 'power' AND fat.level_1 = 'ABI' THEN 1 ELSE 2 END /*LOF 2026-03-02: This sorting level fix prioritize level_1 ABI whenefer the kpi_name is power.*/
        ) AS line
    FROM qry_filter lk
    INNER JOIN {{KPI_TABLE}} fat
        ON  fat.version_id = lk.version_id
        AND fat.kpi_name   = lk.kpi_name
        AND (
            CASE
                WHEN lk.period = 'YTD'
                    THEN fat.dt_ini = lk.dt_ini_year
                ELSE fat.dt_ini IN (lk.dt_ini, lk.dt_ini_last)
            END
        )
        AND fat.dt_end = lk.max_dt
    WHERE
        (
            fat.version_id IN (5, 6, 9, 51, 90, 16)
            AND (
                fat.kpi_name IN ('nr', 'cores', 'market_share', 'sm_of_maco', 'power')
                OR (fat.kpi_name = 'sm_weight' AND TRIM(fat.segment) <> 'N/A')
            )
        )
        OR
        (
            fat.version_id IN (1, 2, 4)
            AND fat.kpi_name = 'power'
            AND fat.level_1 = 'ABI'
        )
)
, QRY_BASE_POWER AS (
    SELECT
        DT_INI,
        DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        CASE WHEN SEGMENT = 'N/A' THEN 'TOTAL' ELSE SEGMENT END AS SEGMENT,
        KPI_NAME,
        CAST(ROUND(AC, 1) AS DOUBLE) AS AC,
        CAST(ROUND(AC_VS_LY, 1) AS DOUBLE) AS AC_VS_LY,
        version_id
    FROM QRY_BASE BAS
    WHERE
        BAS.line = 1
        AND KPI_NAME = 'power'
        AND LEVEL_1 = 'ABI'
        AND SEGMENT <> ''
        AND (
            (:viewtype = 'global'  AND VERSION_ID IN (5, 2)) OR
            (:viewtype = 'zone'    AND VERSION_ID IN (9, 4)) OR
            (:viewtype = 'country' AND VERSION_ID IN (6, 1))
        )
        AND CASE WHEN :viewtype = 'zone'    THEN ABI_ZONE = :zone ELSE 1=1 END
        AND CASE WHEN :viewtype = 'country' THEN COUNTRY_ISO_CODE_3 = :country ELSE 1=1 END
) --SELECT * FROM QRY_BASE_POWER WHERE kpi_name = 'power'
,
QRY_DET_POWER AS (
    SELECT
        DT_INI,
        DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        SEGMENT,
        KPI_NAME,
        AC,
        AC_VS_LY,
        version_id
    FROM QRY_BASE_POWER
),
QRY_DET_OTHERS AS (
    SELECT
        DT_INI,
        DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        CASE WHEN SEGMENT = 'N/A' THEN 'TOTAL' ELSE SEGMENT END AS SEGMENT,
        KPI_NAME,
        CAST(ROUND(AC, 1) AS DOUBLE) AS AC,
        CAST(ROUND(AC_VS_LY, 1) AS DOUBLE) AS AC_VS_LY,
        version_id
    FROM QRY_BASE
    WHERE
        line = 1
        AND (
            (KPI_NAME = 'sm_weight' AND TRIM(SEGMENT) <> 'NA')
            OR KPI_NAME IN ('nr','cores','market_share','sm_of_maco')
        )
        AND (
            (:viewtype = 'global'  AND VERSION_ID IN (5, 51, 2)) OR
            (:viewtype = 'zone'    AND VERSION_ID IN (9, 90, 4)) OR
            (:viewtype = 'country' AND VERSION_ID IN (6, 16, 1))
        )
        AND CASE WHEN :viewtype = 'zone'    THEN ABI_ZONE = :zone ELSE 1=1 END
        AND CASE WHEN :viewtype = 'country' THEN COUNTRY_ISO_CODE_3 = :country ELSE 1=1 END
),
QRY_TOT_SM_WEIGHT AS (
    SELECT
        DT_INI,
        DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        'TOTAL' AS SEGMENT,
        KPI_NAME,
        CASE
            WHEN CAST(ROUND(SUM(ROUND(AC, 5)), 0) AS DOUBLE) BETWEEN 99.5 AND 101.5 THEN 100
            ELSE CAST(ROUND(SUM(ROUND(AC, 5)), 0) AS DOUBLE)
        END AS AC,
        CAST(ROUND(AVG(ROUND(AC_VS_LY, 5)), 0) AS DOUBLE) AS AC_VS_LY,
        version_id
    FROM QRY_BASE
    WHERE
        line = 1
        AND KPI_NAME = 'sm_weight'
        AND (
            (:viewtype = 'global'  AND VERSION_ID IN (5, 51, 2)) OR
            (:viewtype = 'zone'    AND VERSION_ID IN (9, 90, 4)) OR
            (:viewtype = 'country' AND VERSION_ID IN (6, 16, 1))
        )
        AND CASE WHEN :viewtype = 'zone'    THEN ABI_ZONE = :zone ELSE 1=1 END
        AND CASE WHEN :viewtype = 'country' THEN COUNTRY_ISO_CODE_3 = :country ELSE 1=1 END
    GROUP BY
        DT_INI,
        DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        KPI_NAME,
        version_id
)
SELECT
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    SEGMENT,
    KPI_NAME,
    AC,
    AC_VS_LY,
    version_id
FROM QRY_DET_POWER
 
UNION ALL
 
SELECT
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    SEGMENT,
    KPI_NAME,
    AC,
    AC_VS_LY,
    version_id
FROM QRY_DET_OTHERS
 
UNION ALL
 
SELECT
    DT_INI,
    DT_END,
    ABI_ZONE,
    COUNTRY_ISO_CODE_3,
    SEGMENT,
    KPI_NAME,
    AC,
    AC_VS_LY,
    version_id
FROM QRY_TOT_SM_WEIGHT
ORDER BY
  CASE SEGMENT
    WHEN 'Megabrands' THEN 1
    WHEN 'Expansion'  THEN 2
    WHEN 'Sustain'    THEN 3
    WHEN 'Tail'       THEN 4
    ELSE 5
  END; 