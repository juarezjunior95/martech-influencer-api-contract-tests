WITH params AS (
  SELECT
    TO_DATE(:dt_end) AS target_dt_end,
    ADD_MONTHS(TO_DATE(:dt_end), -11) AS target_dt_ini,
    upper(regexp_replace(translate(:brand, 'ñ', 'n'), '[\\s\\xa0]', '')) AS brand_norm,
    upper(regexp_replace(:country, '[\\s\\xa0]', '')) AS country_norm
),
audience_definition AS (
  SELECT DISTINCT
    upper(regexp_replace(translate(megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) AS megabrand,
    upper(regexp_replace(country, '[\\s\\xa0]', '')) AS country,
    upper(regexp_replace(core_age, '[\\s\\xa0]', '')) AS age,
    upper(regexp_replace(core_gender, '[\\s\\xa0]', '')) AS gender,
    upper(regexp_replace(core_income, '[\\s\\xa0]', '')) AS income,
    'Core' AS audience_type
  FROM gold_common.sharepoint_tlh_audience_definition_gld
  CROSS JOIN params p
  WHERE upper(regexp_replace(translate(megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) = p.brand_norm
    AND upper(regexp_replace(country, '[\\s\\xa0]', '')) = p.country_norm

  UNION ALL

  SELECT DISTINCT
    upper(regexp_replace(translate(megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) AS megabrand,
    upper(regexp_replace(country, '[\\s\\xa0]', '')) AS country,
    upper(regexp_replace(halo_age, '[\\s\\xa0]', '')) AS age,
    upper(regexp_replace(halo_gender, '[\\s\\xa0]', '')) AS gender,
    upper(regexp_replace(halo_income, '[\\s\\xa0]', '')) AS income,
    'Halo' AS audience_type
  FROM gold_common.sharepoint_tlh_audience_definition_gld
  CROSS JOIN params p
  WHERE upper(regexp_replace(translate(megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) = p.brand_norm
    AND upper(regexp_replace(country, '[\\s\\xa0]', '')) = p.country_norm
),
filtered_kpis AS (
  SELECT
    t.dt_ini,
    t.dt_end,
    t.raw_brand AS brand,
    t.country_iso_code_3,
    t.version_id,
    t.level_2 AS gender,
    t.level_1 AS age,
    t.level_3 AS income,
    round(t.ac, 1) AS audience_index,
    upper(regexp_replace(translate(t.raw_brand, 'ñ', 'n'), '[\\s\\xa0]', '')) AS brand_norm,
    upper(regexp_replace(t.country_iso_code_3, '[\\s\\xa0]', '')) AS country_norm,
    upper(regexp_replace(t.level_1, '[\\s\\xa0]', '')) AS age_norm,
    upper(regexp_replace(t.level_2, '[\\s\\xa0]', '')) AS gender_norm,
    upper(regexp_replace(t.level_3, '[\\s\\xa0]', '')) AS income_norm
  FROM gold_common.tlh_kpis_pos_agg t
  CROSS JOIN params p
  WHERE t.version_id IN (91, 92)
    AND t.kpi_name = 'profile'
    AND upper(regexp_replace(translate(t.raw_brand, 'ñ', 'n'), '[\\s\\xa0]', '')) = p.brand_norm
    AND upper(regexp_replace(t.country_iso_code_3, '[\\s\\xa0]', '')) = p.country_norm
    AND t.dt_end = p.target_dt_end
),
ranked_result AS (
  SELECT
    k.dt_ini,
    k.dt_end,
    k.brand,
    k.gender,
    k.age,
    k.income,
    k.audience_index,
    d.audience_type,
    'Profile' AS nm_group,
    row_number() OVER (
      PARTITION BY k.dt_ini, k.dt_end, k.country_iso_code_3, k.brand, d.audience_type
      ORDER BY k.version_id
    ) AS rn
  FROM filtered_kpis k
  INNER JOIN audience_definition d
    ON d.megabrand = k.brand_norm
    AND d.country = k.country_norm
    AND d.age = k.age_norm
    AND d.gender = k.gender_norm
    AND d.income = k.income_norm
  CROSS JOIN params p
  WHERE YEAR(k.dt_ini) = YEAR(p.target_dt_ini)
    AND MONTH(k.dt_ini) = MONTH(p.target_dt_ini)
)
SELECT
  dt_ini,
  dt_end,
  brand,
  gender,
  age,
  income,
  audience_index,
  audience_type,
  nm_group
FROM ranked_result
WHERE rn = 1
ORDER BY audience_type