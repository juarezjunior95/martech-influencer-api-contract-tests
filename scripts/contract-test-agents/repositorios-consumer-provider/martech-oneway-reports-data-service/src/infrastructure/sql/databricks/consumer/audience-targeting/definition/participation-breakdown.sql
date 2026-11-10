/*[OWR] Audience Targeting - Table*/

WITH base_data_cte AS (
  SELECT
  DISTINCT
    * EXCEPT (price_tier)
    , MAX(DT_INI) OVER (PARTITION BY kpi_name, version_id) AS MAX_INI
    , MAX(DT_END) OVER (PARTITION BY kpi_name, version_id) AS MAX_END
    , CASE
        WHEN level_1 != 'N/A' AND level_2 = 'N/A' AND level_3 = 'N/A' THEN level_1
        WHEN level_1 = 'N/A' AND level_2 != 'N/A' AND level_3 = 'N/A' THEN level_2
        WHEN level_1 = 'N/A' AND level_2 = 'N/A' AND level_3 != 'N/A' THEN level_3
      END AS cohort_level
    , CASE
        WHEN price_tier = 'N/A' AND upper(raw_brand) = 'BRUTAL FRUIT' AND country_iso_code_3 = 'ZAF'
          THEN 'PREMIUM CO'
        ELSE price_tier
      END AS price_tier
  FROM {{KPI_TABLE}}
  WHERE
    country_iso_code_3 = :country
    AND kpi_name = 'profile'
    AND version_id IN ('1001','1016','91','92')
    AND (
        (level_1 != "N/A" AND  level_2 = "N/A" AND  level_3 = "N/A")
        OR (level_1 = "N/A" AND  level_2 != "N/A" AND  level_3 = "N/A")
        OR (level_1 = "N/A" AND  level_2 = "N/A" AND  level_3 != "N/A")
    )
),
sorted_result AS(
  SELECT
    dt_ini,
    dt_end,
    version_id,
    country_iso_code_3,
    cohort_level,
    level_4 AS raw_category,
    raw_brand,
    price_tier,
    ac,
    level_1,
    level_2,
    level_3
  FROM base_data_cte
  WHERE 1=1
    AND LEAST(TO_DATE(:dt_end), MAX_END) = dt_end
    AND YEAR(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = YEAR(DT_INI)
    AND MONTH(ADD_MONTHS(LEAST(TO_DATE(:dt_end), MAX_END), -11)) = MONTH(DT_INI)
    AND cohort_level NOT IN ('Non-binary or gender fluid', 'Prefer not to answer')
),
category_cte(
SELECT
  dt_ini,
  dt_end,
  version_id,
  country_iso_code_3,
  cohort_level,
  raw_category,
  ac
FROM sorted_result
WHERE
  version_id = '1001'
  AND raw_category = 'Beer'
),
price_tier_cte (
SELECT
  dt_ini,
  dt_end,
  version_id,
  country_iso_code_3,
  cohort_level,
  price_tier,
  ac
FROM sorted_result
WHERE
version_id = '1016'
),
brand_cte(
 SELECT
    dt_ini,
    dt_end,
    version_id,
    country_iso_code_3,
    cohort_level,
    raw_brand,
    split(replace(replace(price_tier, 'N/A;', ''), ';N/A', ''), ';')[0] AS price_tier,
    ac
  FROM (
    SELECT
      dt_ini,
      dt_end,
      version_id,
      country_iso_code_3,
      cohort_level,
      raw_brand,
      split(replace(replace(price_tier, 'N/A;', ''), ';N/A', ''), ';')[0] AS price_tier,
      ac,
      ROW_NUMBER() OVER (ORDER BY version_id ASC) AS rn
    FROM sorted_result
    WHERE
      version_id IN ('91','92')
      AND upper(translate(raw_brand, 'ñ', 'n')) = upper(translate(:brand, 'ñ', 'n'))
  ) ranked
  WHERE
    rn = 1
    OR version_id = (
      SELECT MIN(version_id)
      FROM sorted_result
      WHERE
        version_id IN ('91','92')
        AND upper(translate(raw_brand, 'ñ', 'n')) = upper(translate(:brand, 'ñ', 'n')))
),
competitor_cte(
 SELECT
    dt_ini,
    dt_end,
    version_id,
    country_iso_code_3,
    cohort_level,
    raw_brand,
    split(replace(replace(price_tier, 'N/A;', ''), ';N/A', ''), ';')[0] AS price_tier,
    ac
  FROM (
    SELECT
      dt_ini,
      dt_end,
      version_id,
      country_iso_code_3,
      cohort_level,
      raw_brand,
      split(replace(replace(price_tier, 'N/A;', ''), ';N/A', ''), ';')[0] AS price_tier,
      ac,
      ROW_NUMBER() OVER (ORDER BY version_id ASC) AS rn
    FROM sorted_result
    WHERE
      version_id IN ('91','92')
      AND upper(translate(raw_brand, 'ñ', 'n')) = upper(translate(:competitor, 'ñ', 'n'))
  ) ranked
  WHERE
    rn = 1
    OR version_id = (
      SELECT MIN(version_id)
      FROM sorted_result
      WHERE
        version_id IN ('91','92')
        AND upper(translate(raw_brand, 'ñ', 'n')) = upper(translate(:competitor, 'ñ', 'n')))
),
result_cte (
SELECT
    initcap(base_category_brand_price_tier.brand) as brand,
    initcap(base_category_brand_price_tier.competitor) as competitor,
    base_category_brand_price_tier.dt_ini,
    base_category_brand_price_tier.dt_end,
    base_category_brand_price_tier.country_iso_code_3,
    base_category_brand_price_tier.price_tier,
    base_category_brand_price_tier.cohort_level,
    round(category_ac, 1) as category_ac,
    round(price_tier_cte.ac, 1) as price_tier_ac,
    round((price_tier_cte.ac / category_ac) * 100, 0) AS price_tier_index,
    round(brand_ac, 1) as brand_ac,
    round((brand_ac / price_tier_cte.ac) * 100, 0) AS brand_index,
    round(competitor_ac, 1) as competitor_ac,
    round((competitor_ac / price_tier_cte.ac) * 100, 0) AS competitor_index
FROM
  (SELECT
    brand_cte.raw_brand as brand,
    competitor_cte.raw_brand as competitor,
    category_cte.dt_ini,
    category_cte.dt_end,
    category_cte.country_iso_code_3,
    brand_cte.price_tier,
    category_cte.cohort_level,
    category_cte.ac as category_ac,
    brand_cte.ac AS brand_ac,
    competitor_cte.ac AS competitor_ac
  FROM category_cte
  LEFT JOIN brand_cte
    ON category_cte.dt_ini = brand_cte.dt_ini
      AND category_cte.dt_end = brand_cte.dt_end
      AND category_cte.country_iso_code_3 = brand_cte.country_iso_code_3
      AND category_cte.cohort_level = brand_cte.cohort_level
  LEFT JOIN competitor_cte
    ON category_cte.dt_ini = competitor_cte.dt_ini
      AND category_cte.dt_end = competitor_cte.dt_end
      AND category_cte.country_iso_code_3 = competitor_cte.country_iso_code_3
      AND category_cte.cohort_level = competitor_cte.cohort_level
  ) AS base_category_brand_price_tier
  LEFT JOIN price_tier_cte
      ON price_tier_cte.dt_ini = base_category_brand_price_tier.dt_ini
      AND price_tier_cte.dt_end = base_category_brand_price_tier.dt_end
      AND price_tier_cte.country_iso_code_3 = base_category_brand_price_tier.country_iso_code_3
      AND price_tier_cte.cohort_level = base_category_brand_price_tier.cohort_level
      AND price_tier_cte.price_tier = base_category_brand_price_tier.price_tier
  ORDER BY
    CASE
      WHEN cohort_level = 'Male' THEN 1
      WHEN cohort_level = 'Female' THEN 2
      WHEN cohort_level = 'LDA - 24' THEN 3
      WHEN cohort_level = '25-34' THEN 4
      WHEN cohort_level = '35-44' THEN 5
      WHEN cohort_level = '45-54' THEN 6
      WHEN cohort_level = '55+' THEN 7
      WHEN cohort_level = 'High Income' THEN 8
      WHEN cohort_level = 'Medium Income' THEN 9
      WHEN cohort_level = 'Low Income' THEN 10
      ELSE 999
    END
)
SELECT * FROM result_cte;
