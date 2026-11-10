WITH
params AS (
  SELECT
    upper(regexp_replace(:brand,   '[\\s\\xa0]', '')) AS brand,
    upper(:brand)                                      AS brand_raw,
    upper(:competitor)                                 AS competitor_raw,
    upper(regexp_replace(:country, '[\\s\\xa0]', '')) AS country,
    CAST(:dt_end AS DATE)                             AS dt_end,
    CASE
    WHEN lower(:kpi_name) IN ('occasion', 'occasions') THEN 'occasion'
    ELSE lower(:kpi_name)
  END AS kpi_name
),

brand_audience AS (
  SELECT DISTINCT
    regexp_replace(core_age,    '[\\s\\xa0]', '') AS core_age,
    regexp_replace(core_gender, '[\\s\\xa0]', '') AS core_gender,
    regexp_replace(core_income, '[\\s\\xa0]', '') AS core_income,
    regexp_replace(halo_age,    '[\\s\\xa0]', '') AS halo_age,
    regexp_replace(halo_gender, '[\\s\\xa0]', '') AS halo_gender,
    regexp_replace(halo_income, '[\\s\\xa0]', '') AS halo_income
  FROM gold_common.sharepoint_tlh_audience_definition_gld a
  CROSS JOIN params p
  WHERE upper(regexp_replace(translate(a.megabrand, 'ñ', 'n'), '[\\s\\xa0]', '')) = p.brand
    AND upper(regexp_replace(a.country, '[\\s\\xa0]', ''))                         = p.country
),

base AS (
  SELECT t.*, p.brand_raw AS p_brand_raw, p.competitor_raw AS p_competitor_raw
  FROM {{KPI_TABLE}} t
  CROSS JOIN params p
  WHERE t.version_id               IN (91, 92, 100, 104, 1001, 106, 1016)
    AND t.kpi_name                  = p.kpi_name
    AND upper(t.country_iso_code_3) = p.country
    AND t.dt_end                    = p.dt_end
    AND t.dt_ini                    = ADD_MONTHS(p.dt_end, -11)
),

brand AS (
  SELECT *
  FROM base
  WHERE version_id IN (91, 92, 100)
    AND upper(raw_brand) IN (p_brand_raw, p_competitor_raw)
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY kpi_name, dt_ini, dt_end, raw_brand, level_1, level_2, level_3
    ORDER BY version_id
  ) = 1
),

entities AS (
  SELECT kpi_name, dt_ini, dt_end,
    CASE WHEN upper(raw_brand) = p_brand_raw THEN 'Brand' ELSE 'Competitor' END AS entity_type,
    raw_brand AS entity_name, level_1, level_2, level_3, ac, ac_vs_ly
  FROM brand
  UNION ALL
  SELECT kpi_name, dt_ini, dt_end, 'Beer'    AS entity_type, 'Beer'    AS entity_name,
    level_1, level_2, level_3, ac, ac_vs_ly
  FROM base WHERE version_id IN (104, 1001) AND upper(level_4) = 'BEER'
  UNION ALL
  SELECT kpi_name, dt_ini, dt_end, 'Core Co' AS entity_type, 'Core Co' AS entity_name,
    level_1, level_2, level_3, ac, ac_vs_ly
  FROM base WHERE version_id IN (106, 1016) AND upper(price_tier) = 'CORE CO'
),

pivoted AS (
  SELECT kpi_name, dt_ini, dt_end, entity_type, entity_name,
    MAX(CASE WHEN audience_type = 'core'  THEN ac       END) AS core_ac,
    MAX(CASE WHEN audience_type = 'core'  THEN ac_vs_ly END) AS core_vs_ly,
    MAX(CASE WHEN audience_type = 'halo'  THEN ac       END) AS halo_ac,
    MAX(CASE WHEN audience_type = 'halo'  THEN ac_vs_ly END) AS halo_vs_ly,
    MAX(CASE WHEN audience_type = 'total' THEN ac       END) AS total_ac,
    MAX(CASE WHEN audience_type = 'total' THEN ac_vs_ly END) AS total_vs_ly
  FROM (
    SELECT e.*, 'core'  AS audience_type FROM entities e INNER JOIN brand_audience ba
      ON regexp_replace(e.level_1, '[\\s\\xa0]', '') = ba.core_age
     AND regexp_replace(e.level_2, '[\\s\\xa0]', '') = ba.core_gender
     AND regexp_replace(e.level_3, '[\\s\\xa0]', '') = ba.core_income
    UNION ALL
    SELECT e.*, 'halo'  AS audience_type FROM entities e INNER JOIN brand_audience ba
      ON regexp_replace(e.level_1, '[\\s\\xa0]', '') = ba.halo_age
     AND regexp_replace(e.level_2, '[\\s\\xa0]', '') = ba.halo_gender
     AND regexp_replace(e.level_3, '[\\s\\xa0]', '') = ba.halo_income
    UNION ALL
    SELECT e.*, 'total' AS audience_type FROM entities e
      WHERE upper(e.level_1) = 'N/A'
        AND upper(e.level_2) = 'N/A'
        AND upper(e.level_3) = 'N/A'
  )
  GROUP BY kpi_name, dt_ini, dt_end, entity_type, entity_name
)

SELECT
  p.kpi_name,
  CASE p.kpi_name
    WHEN 'p4w'      THEN 'Participation'
    WHEN 'occasion' THEN 'Occasions'
    WHEN 'power'    THEN 'Brand Power'
  END                                                                          AS nm_group,
  p.dt_ini,
  p.dt_end,
  p.entity_type,
  p.entity_name,
  CAST(round(p.core_ac,                                  1) AS DECIMAL(10,1)) AS core_ac,
  CAST(round(p.core_vs_ly,                               1) AS DECIMAL(10,1)) AS core_vs_ly,
  CAST(round(p.core_ac  / NULLIF(p.total_ac, 0) * 100,  1) AS DECIMAL(10,1)) AS core_index,
  CAST(round(p.halo_ac,                                  1) AS DECIMAL(10,1)) AS halo_ac,
  CAST(round(p.halo_vs_ly,                               1) AS DECIMAL(10,1)) AS halo_vs_ly,
  CAST(round(p.halo_ac  / NULLIF(p.total_ac, 0) * 100,  1) AS DECIMAL(10,1)) AS halo_index,
  CAST(round(p.total_ac,                                 1) AS DECIMAL(10,1)) AS total_ac,
  CAST(round(p.total_vs_ly,                              1) AS DECIMAL(10,1)) AS total_vs_ly,
  CASE
    WHEN p.entity_type = 'Beer' THEN NULL
    ELSE CAST(round(
      p.total_ac / NULLIF(
        MAX(CASE WHEN entity_type = 'Beer' THEN total_ac END)
          OVER (PARTITION BY p.kpi_name, p.dt_ini, p.dt_end),
        0) * 100, 1) AS DECIMAL(10,1))
  END                                                                          AS total_index
FROM pivoted p
ORDER BY nm_group, entity_type, entity_name, dt_ini