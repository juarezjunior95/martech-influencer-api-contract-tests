/* Category Home - Consumer Behavior - Big Numbers (Beer Participation e ABI Participation) */
WITH CTE_FILTER_ABI_UAT AS (
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        CASE :viewtype
            WHEN 'country' THEN 1005
            WHEN 'global' THEN 1006
            WHEN 'zone' THEN 1018
        END     version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_gld
    where datelimit_name = 'POS'
    AND :environment = 'UAT'
)
,
CTE_FILTER_ABI_PRD AS (
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        CASE :viewtype
            WHEN 'country' THEN 1005
            WHEN 'global' THEN 1006
            WHEN 'zone' THEN 1018
        END     version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_freeze_gld
    where datelimit_name = 'POS'
    AND :environment = 'PRD'
)
,
CTE_FILTER_ABI
(
    SELECT 
        DT_INI,
        DT_END,
        version_id,
        kpi_name,
        DT_INI_YEAR,
        PERIOD,
        DT_INI_R12M
    from cte_filter_abi_uat
    union all 
    SELECT 
        DT_INI,
        DT_END,
        version_id,
        kpi_name,
        DT_INI_YEAR,
        PERIOD,
        DT_INI_R12M
    from cte_filter_abi_prd
)
,
CTE_BASE_ABI AS (
    SELECT
        ft.*,
        lk.dt_ini AS max_ini,
        lk.dt_end AS max_end
    FROM CTE_FILTER_ABI lk
    INNER JOIN  {{KPI_TABLE}} ft
        ON ft.version_id = lk.version_id
        AND ft.kpi_name  = lk.kpi_name
        AND ft.dt_end    = lk.dt_end
        AND ft.dt_ini    = CASE
            WHEN lk.period = 'YTD' THEN lk.dt_ini_year
            WHEN lk.period = 'MTD' THEN lk.dt_ini
            ELSE lk.dt_ini_r12m
        END
    WHERE
        LEVEL_1 = 'N/A'
        AND LEVEL_2 = 'N/A'
        AND LEVEL_3 = 'N/A'
        AND LEVEL_4 = 'ABINBEV'
        AND COUNTRY_ISO_CODE_3 = :country
),
CTE_ABI as (
    SELECT
        DT_INI,
        DT_END,
        AC,
        AC_VS_LY,
        UNIT_OF_MEASURE,
        COMP_UNIT_OF_MEASURE,
        'ABI_PARTICIPATION' as CARD_VIEW
    FROM CTE_BASE_ABI
    ORDER BY DT_INI
),
CTE_FILTER_BEER_UAT AS (
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        '1001'  version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_gld
    WHERE   datelimit_name = 'POS'
    and :environment = 'UAT'
    UNION ALL 
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        '1002'  version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_gld
    WHERE   datelimit_name = 'POS'
    and :environment = 'UAT'
),
CTE_FILTER_BEER_PRD AS (
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        '1001'  version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_freeze_gld
    WHERE   datelimit_name = 'POS'
    and :environment = 'PRD'
    UNION ALL 
    SELECT 
        case when :timeperiod = 'YTD' then CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01')
            else cast(dateadd(month, -2, dt_limit_current ) as date)
            end DT_INI,
        dt_limit_current DT_END,
        '1002'  version_id,
        'p4w'   kpi_name,
        CONCAT(CAST(YEAR(dt_limit_current) AS STRING), '-01-01') AS DT_INI_YEAR,
        :timeperiod AS PERIOD,
        cast(dateadd(month, - 11, dt_limit_current)as date) as DT_INI_R12M
    FROM gold_common.owr_datelimit_freeze_gld
    WHERE   datelimit_name = 'POS'
    and :environment = 'PRD'
),
CTE_FILTER_BEER
(
    SELECT 
        DT_INI,
        DT_END,
        version_id,
        kpi_name,
        DT_INI_YEAR,
        PERIOD,
        DT_INI_R12M
    FROM CTE_FILTER_BEER_UAT
    UNION ALL 
    SELECT 
        DT_INI,
        DT_END,
        version_id,
        kpi_name,
        DT_INI_YEAR,
        PERIOD,
        DT_INI_R12M
    FROM CTE_FILTER_BEER_PRD
),

CTE_DATES_BEER AS (
    SELECT
        gd.*
    FROM CTE_FILTER_BEER fil
    INNER JOIN {{KPI_TABLE}} gd
        ON fil.version_id = gd.version_id
        AND fil.kpi_name  = gd.kpi_name
        AND fil.dt_end    = gd.dt_end
        AND gd.dt_ini    = CASE
            WHEN fil.period = 'YTD' THEN fil.dt_ini_year
            WHEN fil.period = 'MTD' THEN fil.dt_ini
            ELSE fil.dt_ini_r12m
        END
),
CTE_BEER AS (
    SELECT
        DT_INI,
        DT_END,
        AC,
        AC_VS_LY,
        UNIT_OF_MEASURE,
        COMP_UNIT_OF_MEASURE,
        'BEER_PARTICIPATION' as CARD_VIEW
    FROM
        CTE_DATES_BEER
    WHERE
        1 = 1
        AND country_iso_code_3 = :country
        AND level_1 = 'N/A'
        AND level_2 = 'N/A'
        AND level_3 = 'N/A'
        AND level_4 = 'Beer'
)
SELECT
    DT_INI,
    DT_END,
    :timeperiod AS PERIOD,
    AC,
    AC_VS_LY,
    UNIT_OF_MEASURE,
    COMP_UNIT_OF_MEASURE AS MEASURE,
    CARD_VIEW,
    CASE CARD_VIEW
        WHEN 'ABI_PARTICIPATION' THEN 'ABI Participation'
        WHEN 'BEER_PARTICIPATION' THEN 'Beer Participation'
    END AS KPI_NAME
FROM CTE_ABI
UNION ALL
SELECT
    DT_INI,
    DT_END,
    :timeperiod AS PERIOD,
    AC,
    AC_VS_LY,
    UNIT_OF_MEASURE,
    COMP_UNIT_OF_MEASURE AS MEASURE,
    CARD_VIEW,
    CASE CARD_VIEW
        WHEN 'ABI_PARTICIPATION' THEN 'ABI Participation'
        WHEN 'BEER_PARTICIPATION' THEN 'Beer Participation'
    END AS KPI_NAME
FROM CTE_BEER