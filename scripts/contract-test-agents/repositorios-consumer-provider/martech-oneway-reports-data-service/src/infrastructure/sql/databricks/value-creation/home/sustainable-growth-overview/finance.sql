/* HOME VALUE CREATION - BIG NUMBER - VOLUME - CORES - NR */
/* MARCELO KOMATSU - 2026.02.27 - ADJUST CHANGE MEASURES */
/* KAREN KRAMEK   - 2026.05.04 - ADD PERIOD TYPE COLUMN FOR MOBILE DEVELOPMENT */
/* RAFAEL DIAS    - 2026.05.19 - MARTLH-11186: ac -> ac_lyam (LY AM); bu_vs_ly na linha BU */
/* RAFAEL DIAS    - 2026.06.01 - MARTLH-11702: bu_vs_ly -> bu_vs_lyam (denominador LY AM, paridade Brand P&L) */
/* BRUNO SASAKI   - 2026.08.14 - APPLY ZONE FILTER FOR EUROPE SCOPE */

WITH base_volume AS (

    SELECT
        ini_date AS dt_ini,
        end_date AS dt_end,
        'volume' AS kpi_name,

        CASE period_type
            WHEN 'MTH' THEN 'MTD'
            WHEN 'R3M' THEN 'L3M'
            ELSE period_type
        END AS period_type_raw,

        CONCAT(
            period_type,
            "'",
            date_format(to_date(end_date), 'yy')
        ) AS period_type,

        MEASURE(volume_ac_lyam) AS ac,
        MEASURE(volume_bu) AS bu,
        MEASURE(volume_ac_vs_ly) AS ac_vs_ly,
        MEASURE(volume_ac_vs_bu) AS ac_vs_bu,
        MEASURE(volume_bu_vs_lyam) AS bu_vs_lyam

    FROM gold_common.owr_finance_mv

    WHERE 1 = 1

      AND :kpi_name = 'volume'

      AND period_type = CASE
            WHEN :period = 'YTD' THEN 'YTD'
            WHEN :period = 'L3M' THEN 'R3M'
            WHEN :period = 'MTD' THEN 'MTH'
            ELSE :period
          END

      AND MONTH(end_date) = MONTH(TO_DATE(:dt_end))

      AND TO_DATE(end_date) >
          ADD_MONTHS(TO_DATE(:dt_end), -48)

      AND YEAR(end_date) <= YEAR(:dt_end)

      /* COUNTRY FILTER */
      AND CASE
            WHEN :country != 'ABI'
                THEN country_iso_code_3 = :country
            ELSE TRUE
          END

      /* FIX - ZONE FILTER */
      AND CASE
            WHEN :zone != 'ABI'
                THEN zone = :zone
            ELSE TRUE
          END

      AND CASE :growth_lever
            WHEN 'Lead Premium'
                THEN is_lead_premium_growth_lever = TRUE
            WHEN 'Superior Core'
                THEN is_superior_core_growth_lever = TRUE
            WHEN 'Beyond Beer'
                THEN is_beyond_beer_growth_lever = TRUE
            WHEN 'Balanced Choices'
                THEN is_balanced_choice_growth_lever = TRUE
            ELSE TRUE
          END

    GROUP BY ALL

    HAVING
        MEASURE(volume_ac_vs_ly) IS NOT NULL
        OR (
            MEASURE(volume_ac_vs_ly) IS NULL
            AND MEASURE(volume_ac_lyam) > 0
        )
),

base_nr AS (

    SELECT
        ini_date AS dt_ini,
        end_date AS dt_end,
        'nr' AS kpi_name,

        CASE period_type
            WHEN 'MTH' THEN 'MTD'
            WHEN 'R3M' THEN 'L3M'
            ELSE period_type
        END AS period_type_raw,

        CONCAT(
            period_type,
            "'",
            date_format(to_date(end_date), 'yy')
        ) AS period_type,

        MEASURE(nr_ac_lyam) AS ac,
        MEASURE(nr_bu) AS bu,
        MEASURE(nr_ac_vs_ly) AS ac_vs_ly,
        MEASURE(nr_ac_vs_bu) AS ac_vs_bu,
        MEASURE(nr_bu_vs_lyam) AS bu_vs_lyam

    FROM gold_common.owr_finance_mv

    WHERE 1 = 1

      AND :kpi_name = 'finance'

      AND period_type = CASE
            WHEN :period = 'YTD' THEN 'YTD'
            WHEN :period = 'L3M' THEN 'R3M'
            WHEN :period = 'MTD' THEN 'MTH'
            ELSE :period
          END

      AND MONTH(end_date) = MONTH(TO_DATE(:dt_end))

      AND TO_DATE(end_date) >
          ADD_MONTHS(TO_DATE(:dt_end), -48)

      AND YEAR(end_date) <= YEAR(:dt_end)

      /* COUNTRY FILTER */
      AND CASE
            WHEN :country != 'ABI'
                THEN country_iso_code_3 = :country
            ELSE TRUE
          END

      /* FIX - ZONE FILTER */
      AND CASE
            WHEN :zone != 'ABI'
                THEN zone = :zone
            ELSE TRUE
          END

      AND CASE :growth_lever
            WHEN 'Lead Premium'
                THEN is_lead_premium_growth_lever = TRUE
            WHEN 'Superior Core'
                THEN is_superior_core_growth_lever = TRUE
            WHEN 'Beyond Beer'
                THEN is_beyond_beer_growth_lever = TRUE
            WHEN 'Balanced Choices'
                THEN is_balanced_choice_growth_lever = TRUE
            ELSE TRUE
          END

    GROUP BY ALL

    HAVING
        MEASURE(nr_ac_vs_ly) IS NOT NULL
        OR (
            MEASURE(nr_ac_vs_ly) IS NULL
            AND MEASURE(nr_ac_lyam) > 0
        )
),

base_cores AS (

    SELECT
        ini_date AS dt_ini,
        end_date AS dt_end,
        'cores' AS kpi_name,

        CASE period_type
            WHEN 'MTH' THEN 'MTD'
            WHEN 'R3M' THEN 'L3M'
            ELSE period_type
        END AS period_type_raw,

        CONCAT(
            period_type,
            "'",
            date_format(to_date(end_date), 'yy')
        ) AS period_type,

        MEASURE(cores_ac_lyam) AS ac,
        MEASURE(cores_bu) AS bu,
        MEASURE(cores_ac_vs_ly) AS ac_vs_ly,
        MEASURE(cores_ac_vs_bu) AS ac_vs_bu,
        MEASURE(cores_bu_vs_lyam) AS bu_vs_lyam

    FROM gold_common.owr_finance_mv

    WHERE 1 = 1

      AND :kpi_name = 'finance'

      AND period_type = CASE
            WHEN :period = 'YTD' THEN 'YTD'
            WHEN :period = 'L3M' THEN 'R3M'
            WHEN :period = 'MTD' THEN 'MTH'
            ELSE :period
          END

      AND MONTH(end_date) = MONTH(TO_DATE(:dt_end))

      AND TO_DATE(end_date) >
          ADD_MONTHS(TO_DATE(:dt_end), -48)

      AND YEAR(end_date) <= YEAR(:dt_end)

      /* COUNTRY FILTER */
      AND CASE
            WHEN :country != 'ABI'
                THEN country_iso_code_3 = :country
            ELSE TRUE
          END

      /* FIX - ZONE FILTER */
      AND CASE
            WHEN :zone != 'ABI'
                THEN zone = :zone
            ELSE TRUE
          END

      AND CASE :growth_lever
            WHEN 'Lead Premium'
                THEN is_lead_premium_growth_lever = TRUE
            WHEN 'Superior Core'
                THEN is_superior_core_growth_lever = TRUE
            WHEN 'Beyond Beer'
                THEN is_beyond_beer_growth_lever = TRUE
            WHEN 'Balanced Choices'
                THEN is_balanced_choice_growth_lever = TRUE
            ELSE TRUE
          END

    GROUP BY ALL

    HAVING
        MEASURE(cores_ac_vs_ly) IS NOT NULL
        OR (
            MEASURE(cores_ac_vs_ly) IS NULL
            AND MEASURE(cores_ac_lyam) > 0
        )
),

base AS (

    SELECT
        dt_ini,
        dt_end,
        kpi_name,
        period_type_raw,
        period_type,
        ac,
        bu,
        ac_vs_ly,
        ac_vs_bu,
        bu_vs_lyam
    FROM base_volume

    UNION ALL

    SELECT
        dt_ini,
        dt_end,
        kpi_name,
        period_type_raw,
        period_type,
        ac,
        bu,
        ac_vs_ly,
        ac_vs_bu,
        bu_vs_lyam
    FROM base_nr

    UNION ALL

    SELECT
        dt_ini,
        dt_end,
        kpi_name,
        period_type_raw,
        period_type,
        ac,
        bu,
        ac_vs_ly,
        ac_vs_bu,
        bu_vs_lyam
    FROM base_cores
),

ranked AS (

    SELECT
        *,

        ROW_NUMBER() OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS rn,

        FIRST_VALUE(dt_ini) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS dt_ini_first,

        FIRST_VALUE(dt_end) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS dt_end_first,

        FIRST_VALUE(period_type) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS period_type_first,

        FIRST_VALUE(ac) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS ac_latest,

        FIRST_VALUE(bu) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
        ) AS bu_first,

        NTH_VALUE(ac, 4) OVER (
            PARTITION BY kpi_name
            ORDER BY dt_end DESC
            ROWS BETWEEN UNBOUNDED PRECEDING
                     AND UNBOUNDED FOLLOWING
        ) AS ac_l3y

    FROM base
),

final_base AS (

    SELECT
        dt_ini,
        dt_end,
        kpi_name,
        period_type_raw,
        period_type,

        ROUND(ac, 1) AS ac,
        ROUND(ac_vs_ly, 1) AS ac_vs_ly,
        ROUND(ac_vs_bu, 1) AS ac_vs_bu,

        CASE
            WHEN ac_l3y IS NULL
              OR ac_l3y = 0
                THEN NULL
            ELSE ROUND(
                (
                    POWER(
                        ac_latest / ac_l3y,
                        1 / 3
                    ) - 1
                ) * 100,
                1
            )
        END AS cagr,

        '%' AS unit_of_measure,
        '%' AS comp_unit_of_measure

    FROM ranked
),

bu_rows AS (

    SELECT
        dt_ini_first AS dt_ini,
        dt_end_first AS dt_end,
        kpi_name,

        'BU' AS period_type_raw,

        CONCAT(
            "BU'",
            date_format(
                to_date(dt_end_first),
                'yy'
            )
        ) AS period_type,

        ROUND(bu_first, 1) AS ac,

        ROUND(
            bu_vs_lyam,
            1
        ) AS ac_vs_ly,

        CAST(NULL AS DOUBLE) AS ac_vs_bu,

        CASE
            WHEN ac_l3y IS NULL
              OR ac_l3y = 0
                THEN NULL
            ELSE ROUND(
                (
                    POWER(
                        ac_latest / ac_l3y,
                        1 / 3
                    ) - 1
                ) * 100,
                1
            )
        END AS cagr,

        '%' AS unit_of_measure,
        '%' AS comp_unit_of_measure

    FROM ranked

    WHERE rn = 1
)

SELECT
    dt_ini,
    dt_end,
    kpi_name,
    period_type_raw AS period_type,
    period_type AS period,
    ac,
    ac_vs_ly,
    ac_vs_bu,
    cagr AS average_line,
    unit_of_measure,
    comp_unit_of_measure

FROM (

    SELECT *
    FROM final_base

    UNION ALL

    SELECT *
    FROM bu_rows
)

ORDER BY
    dt_end ASC,
    CASE
        WHEN period_type_raw = 'BU' THEN 0
        ELSE 1
    END,
    dt_ini ASC;
