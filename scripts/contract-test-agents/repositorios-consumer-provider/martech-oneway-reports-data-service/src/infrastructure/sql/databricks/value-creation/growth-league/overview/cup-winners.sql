/* UAT_[OWR][Growth League] Overview Cup Winners */

/* -------------------------- CHANGES ----------------------------------- */
/* QUERY UPDATED BY THOR - AT 04/08/2025, 15:00 BRT (BRASILIA)            */
/* KOMATSU - 2025.08.07 - ADDING MEGABRANDS - RANKING BY COUNTRY          */
/* KOMATSU - 2025.08.12 - ADDING KA CUP LEAGUES                           */
/* KOMATSU - 2026.03.31 - REMOVE FILTERS LEVEL_4 = 'tier_1' AND LEVEL_4 = 'tier_2'/ ALTER FILTER KPI_NAME = 'health_index' TO KPI_NAME = 'acceleration_index'*/

/* QUERY DE TRABALHO */
WITH QRY_DATA AS (
  select
    d.* EXCEPT (d.level_1, d.level_4),
    case d.level_1
      when 'megabrands_cup' then 'mega_brands_cup'
      when 'megabrands_ranking' then 'mega_brands_cup'
      when 'channels_cup' then 'channel_cup'
      else d.level_1
    end as level_1,
    case d.level_1  when 'megabrands_cup' then 'country'
                    when 'megabrands_ranking' then raw_brand
    else d.level_4 end level_4,
    level_2 as rank,
    max(d.DT_INI) over (partition by d.level_1, d.level_3, d.version_id) MAX_INI,
    max(d.DT_END) over (partition by d.level_1, d.level_3, d.version_id) MAX_END
  from 
    /* UAT TABLE - uncomment/comment to use it or to not use it */
    {{KPI_TABLE}} d
    /* PRD TABLE - uncomment/comment to use it or to not use it */
    /* gold_common.tlh_kpis_freeze_agg d */
  where
    1 = 1
    and version_id = 107
    and level_3 in ('overall_result', 'total_achievement', 'mb_total', 'total_abi')
    and level_2 <= 3
    and (
      (
        level_1 = 'bees_cup'
        AND level_4 = 'maturity_index'
      )
      OR (
        level_1 = 'bees_cup'
        AND level_4 = 'acceleration_index'
      )
      OR (
        level_1 = 'megabrands_cup'
        AND level_4 = 'N/A'
      )
      OR (
        level_1 = 'dtc_cup'
      )
      OR (
        level_1 = 'megabrands_ranking'
        AND level_4 = 'N/A'
      )
      OR (
        level_1 = 'ka_cup'
        AND level_4 = 'league_a'
      )
      OR (
        level_1 = 'ka_cup'
        AND level_4 = 'league_b'
      )
     
    )
)

/* QUERY DE SAIDA */ 
SELECT
  raw_geography,
  version_id,
  level_4 as division,
  level_1 as cup_name,
  rank as ranking,
  ac
FROM
  QRY_DATA
WHERE 1=1
  and rank <= 3
  and year(MAX_INI) = year(DT_INI)
  and year(MAX_END) = year(DT_END)
  and month(MAX_INI) = month(DT_INI)
  and month(MAX_END) = month(DT_END)
ORDER BY
  cup_name,
  case when cup_name = 'mega_brands_cup' and division <> 'country' then 'brand' else division end,
  CAST(rank as INT) ASC,
  raw_geography;