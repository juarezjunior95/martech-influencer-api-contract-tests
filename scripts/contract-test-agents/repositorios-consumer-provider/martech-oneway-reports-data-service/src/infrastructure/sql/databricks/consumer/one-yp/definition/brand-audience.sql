WITH DATE_LIMIT AS (
    SELECT
        CAST(datelimit AS DATE) AS datelimit
    FROM silver_common.sharepoint_tlh_datelimit_slv 
    WHERE indicador = 'POS'
    ORDER BY created DESC
    LIMIT 1
),

/* DIVIDEND */
CTE_DIVIDEND_BASE AS (
    SELECT
        t.PERIOD_TYPE,
        t.LABEL_PERIOD,
        f.ABI_ZONE,
        f.COUNTRY_ISO_CODE_3,
        f.RAW_GEOGRAPHY,
        f.REFERENCE_DATE,
        f.LEVEL_1,
        f.LEVEL_5 AS AGE,
        f.LEVEL_6 AS GENDER,
        f.LEVEL_7 AS SOCIO_ECONOMIC_LEVEL,
        f.KPI_NAME,
        f.VERSION,
        f.DATA_DOMAIN,
        f.LEVEL_9 AS RAW_CATEGORY,
        f.VALUE
    FROM gold_market_research.pos_fact_kpis_agg f
    JOIN gold_market_research.pos_time_lk t
        ON concat(substring(f.REFERENCE_DATE, 1, 4), substring(f.REFERENCE_DATE, 6, 2)) = t.year_month
    CROSS JOIN DATE_LIMIT dl
    WHERE  
        f.KPI_NAME = 'volume_per_brandoccasion'
        AND f.VERSION = 'MTH'
        AND f.DATA_DOMAIN = 'PFI'
        AND t.PERIOD_TYPE = 'R12M'
        AND to_date(cast(t.DATE_REF AS string), 'yyyyMMdd') <= dl.datelimit

        AND f.LEVEL_9 = CASE 
            WHEN :product_type = 'Beyond Beer' THEN 'RTD/Cider'
            WHEN :product_type = 'Beer + Beyond Beer' THEN 'Beer + BB'
            ELSE 'Beer'
        END

        AND UPPER(f.LEVEL_1) = UPPER(:brand)
        AND f.COUNTRY_ISO_CODE_3 = :country
),

dividend AS (
    SELECT
        PERIOD_TYPE,
        LABEL_PERIOD,
        MAX(REFERENCE_DATE) AS DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        RAW_GEOGRAPHY,
        LEVEL_1,
        RAW_CATEGORY,
        SUM(VALUE) AS dividend
    FROM CTE_DIVIDEND_BASE
    WHERE
        (:age = 'All' OR array_contains(transform(split(:age, ','), x -> upper(trim(x))), upper(AGE)))
        AND (:gender = 'All' OR array_contains(transform(split(:gender, ','), x -> upper(trim(x))), upper(GENDER)))
        AND (:socio_economic_level = 'All' OR array_contains(transform(split(:socio_economic_level, ','), x -> upper(trim(x))), regexp_replace(upper(SOCIO_ECONOMIC_LEVEL), ' INCOME', '')))
    GROUP BY ALL
),

/* DIVIDER */
CTE_DIVIDER_BASE AS (
    SELECT
        t.PERIOD_TYPE,
        t.LABEL_PERIOD,
        f.ABI_ZONE,
        f.COUNTRY_ISO_CODE_3,
        f.RAW_GEOGRAPHY,
        f.REFERENCE_DATE,
        f.LEVEL_1,
        f.LEVEL_9 AS RAW_CATEGORY,
        f.VALUE,
        f.KPI_NAME
    FROM gold_market_research.pos_fact_kpis_agg f
    JOIN gold_market_research.pos_time_lk t
        ON concat(substring(f.REFERENCE_DATE, 1, 4), substring(f.REFERENCE_DATE, 6, 2)) = t.year_month
    CROSS JOIN DATE_LIMIT dl
    WHERE  
        f.KPI_NAME = 'volume_per_brandoccasion' 
        AND f.VERSION = 'MTH' 
        AND f.DATA_DOMAIN = 'PFI' 
        AND t.PERIOD_TYPE = 'R12M'
        AND to_date(cast(t.DATE_REF AS string), 'yyyyMMdd') <= dl.datelimit

        AND f.LEVEL_9 = CASE
            WHEN :product_type = 'Beyond Beer' THEN 'RTD/Cider'
            WHEN :product_type = 'Beer + Beyond Beer' THEN 'Beer + BB'
            ELSE 'Beer'
        END

        AND UPPER(f.LEVEL_1) = UPPER(:brand)
        AND f.COUNTRY_ISO_CODE_3 = :country
),

divider AS (
    SELECT
        PERIOD_TYPE,
        LABEL_PERIOD,
        MAX(REFERENCE_DATE) AS DT_END,
        ABI_ZONE,
        COUNTRY_ISO_CODE_3,
        RAW_GEOGRAPHY,
        LEVEL_1,
        RAW_CATEGORY,
        SUM(VALUE) AS divider
    FROM CTE_DIVIDER_BASE
    GROUP BY ALL
)
SELECT
    dd.PERIOD_TYPE,
    dd.LABEL_PERIOD,
    dd.dt_end,
    dd.ABI_ZONE,
    dd.COUNTRY_ISO_CODE_3,
    dd.RAW_GEOGRAPHY,
    dd.LEVEL_1,
    :product_type as RAW_CATEGORY,
    ROUND(COALESCE(dd.dividend, 0) / COALESCE(dr.divider, 0) * 100, 1) AS ac
FROM dividend dd
FULL OUTER JOIN divider dr
    ON dd.PERIOD_TYPE <=> dr.PERIOD_TYPE
    AND dd.LABEL_PERIOD <=> dr.LABEL_PERIOD
    AND dd.COUNTRY_ISO_CODE_3 <=> dr.COUNTRY_ISO_CODE_3
    AND dd.ABI_ZONE <=> dr.ABI_ZONE
    AND dd.RAW_GEOGRAPHY <=> dr.RAW_GEOGRAPHY
    AND dd.LEVEL_1 <=> dr.LEVEL_1
    AND dd.RAW_CATEGORY <=> dr.RAW_CATEGORY
WHERE :dt_end = dd.dt_end