/*------------------------------------------------------------------------------------------*/
/* Volume / NR Pages - Top and Bottom                                                       */
/*------------------------------------------------------------------------------------------*/

/*--------------------------------------- Changes ----------------------------------------- */
/* Marcelo Komatsu - 2026.04.06 - Change Structure Query                                    */
/* Thor Marinho    - 2026.04.10 - Parameterized kpi_name (volume / nr)                      */
/*                              - Added cte_total_ly for LY ac_vs_ly/ac_vs_bu               */
/* Marcelo Komatsu - 2026.04.17 - Add NR_PER_HL_VS_LY except otther                         */
/* Marcelo Komatsu - 2026.04.20 - Add otther but we need validate                           */
/* Marcelo Komatsu - 2026.04.20 - Removing Tail Filter                                      */
/* Marcelo Komatsu - 2026.04.20 - Removing Segment                                          */
/* Marcelo Komatsu - 2026.04.22 - Changing Delta Calculation NR                             */
/* Ramon Silva     - 2026.04.28 - Update Growth Lever filters for Global Brands/Megabrands  */
/* Marcelo Komatsu - 2026.06.08 - Remove Filter Megabrands / Global Brands                  */
/*                                Country Others and Brand <> Others                        */
/* Marcelo Komatsu - 2026.07.14 - Global Brands - Correction                                */
/*                              - New Filter reporttype = "TOTAL" / "BEER+ADH"              */
/*--------------------------------------- Changes ------------------------------------------*/

with cte_total
(
  select
       ini_date,
       end_date,
       CASE LOWER(:kpi) WHEN 'volume' THEN measure(volume_ac)     ELSE measure(nr_ac)     END ac,
       CASE LOWER(:kpi) WHEN 'volume' THEN measure(volume_ac_vs_ly) ELSE measure(nr_ac_vs_ly) END ac_vs_ly,
       CASE :kpi WHEN 'volume' THEN measure(volume_am_bu)  ELSE 0                  END am_bu,
       CASE :kpi WHEN 'volume' THEN measure(volume_og_bu)  ELSE measure(nr_og_bu)  END og_bu,
       CASE :kpi WHEN 'volume' THEN measure(volume_ac_vs_bu) ELSE measure(nr_ac_vs_bu) END ac_vs_bu,
       CASE :kpi WHEN 'volume' THEN measure(volume_ly)     ELSE measure(nr_ly)     END ly,
       CASE :kpi WHEN 'volume' THEN measure(volume_bu)     ELSE measure(nr_bu)     END bu,
       CASE :kpi WHEN 'volume' THEN measure(volume_ac_vs_ly)     ELSE measure(nr_per_hl_vs_ly)     END per_hl_vs_ly,

       /* Calculo cd NR vs LY */
       cast ( measure(mv.nr_og_ly ) as double) as nr_og_vly,
       cast ( measure(mv.nr_ly ) as double) as nr_am_vly,
       cast ( measure(mv.volume_og_ly ) as double) as volume_og_vly,
       cast ( measure(mv.volume_ly ) as double) as volume_am_vly

  from gold_common.owr_finance_mv mv
     WHERE mv.period_type IN ('YTD', 'MTH')
       AND case when :reporttype = 'TOTAL' then true else product_type in ("BEER", "ADJ") END
       AND (
           CASE WHEN :period = 'MTD' THEN 'MTH'
               ELSE :period
           END
       ) = mv.period_type
--        AND (
--           (mv.period_type = 'MTH' AND trunc(mv.end_date, 'MM') = trunc(to_date(:dt_end), 'MM'))
--           OR
--           (mv.period_type = 'YTD' AND mv.ini_date = to_date(concat(year(to_date(:dt_end)), '-01-01')))
--       )
       AND mv.end_date = to_date(:dt_end)

       AND CASE    WHEN :view_level = 'Growth Levers Global' THEN TRUE
                   WHEN :view_level = 'Growth Levers Country' THEN mv.country_iso_code_3 = :country
        END

       -- Filtros de Growth Lever
       AND CASE :growth_lever

           -- Superior Core: NÃO mostra Global Brands
           WHEN 'Superior Core' THEN
               mv.is_superior_core_growth_lever = TRUE
    --            AND COALESCE(mv.is_global_brand, FALSE) = FALSE
          -- Lead Premium: mostra Global Brands
           WHEN 'Lead Premium' THEN
               mv.is_lead_premium_growth_lever = TRUE
               AND (
                   COALESCE(mv.is_global_brand, FALSE) = TRUE
                   OR (
                       COALESCE(mv.is_global_brand, FALSE) = FALSE
                       AND mv.price_tier IN ('Core+', 'Premium', 'Super Premium')
                   )
               )
           -- Beyond Beer: NÃO mostra Global Brands
           WHEN 'Beyond Beer' THEN
               mv.is_beyond_beer_growth_lever = TRUE
--               AND COALESCE(mv.is_global_brand, FALSE) = FALSE

           -- Non Alc Beer: NÃO mostra Global Brands
           WHEN 'Non Alc Beer' THEN
               mv.is_non_alc = TRUE
           -- caso venha com hífen
           WHEN 'Non-Alc Beer' THEN
               mv.is_non_alc = TRUE
           -- Balanced Choices: NÃO mostra Global Brands
           WHEN 'Balanced Choices' THEN
               mv.is_balanced_choice_growth_lever = TRUE
    --            AND COALESCE(mv.portfolio, '') NOT IN ('Megabrands', 'Global Brands')
           -- Global view: mostra tudo, incluindo Global Brands
           ELSE TRUE
     END
     GROUP BY ALL
),
cte_total_ly
(
/* Fetch prior year period totals to get comparison metrics (ac_vs_ly, ac_vs_bu) for the LY summary row */
  select
       ini_date,
       end_date,
       CASE :kpi WHEN 'volume' THEN measure(volume_ac_vs_ly) ELSE measure(nr_ac_vs_ly) END ac_vs_ly,
       CASE :kpi WHEN 'volume' THEN measure(volume_ac_vs_bu) ELSE measure(nr_ac_vs_bu) END ac_vs_bu,
       CASE :kpi WHEN 'volume' THEN 0 ELSE measure(nr_per_hl_vs_ly) END per_hl_vs_ly
  from gold_common.owr_finance_mv mv
     WHERE mv.period_type IN ('YTD', 'MTH')
       AND case when :reporttype = 'TOTAL' then true else product_type in ("BEER", "ADJ") END
       AND (
           CASE WHEN :period = 'MTD' THEN 'MTH'
               ELSE :period
           END
       ) = mv.period_type
--        AND (
--           (mv.period_type = 'MTH' AND trunc(mv.end_date, 'MM') = trunc(ADD_MONTHS(to_date(:dt_end), -12), 'MM'))
--           OR
--           (mv.period_type = 'YTD' AND mv.ini_date = to_date(concat(year(to_date(:dt_end)) - 1, '-01-01')))
--       )
       AND mv.end_date = ADD_MONTHS(to_date(:dt_end), -12)

       AND CASE    WHEN :view_level = 'Growth Levers Global' THEN TRUE
                   WHEN :view_level = 'Growth Levers Country' THEN mv.country_iso_code_3 = :country
        END

       -- Filtros de Growth Lever
       AND CASE :growth_lever
           -- Superior Core: NÃO mostra Global Brands
           WHEN 'Superior Core' THEN
               mv.is_superior_core_growth_lever = TRUE
--               AND COALESCE(mv.is_global_brand, FALSE) = FALSE
           -- Lead Premium: mostra Global Brands
           WHEN 'Lead Premium' THEN
               mv.is_lead_premium_growth_lever = TRUE
               AND (
                   COALESCE(mv.is_global_brand, FALSE) = TRUE
                   OR (
                       COALESCE(mv.is_global_brand, FALSE) = FALSE
                       AND mv.price_tier IN ('Core+', 'Premium', 'Super Premium')
                   )
               )
           -- Beyond Beer: NÃO mostra Global Brands
           WHEN 'Beyond Beer' THEN
               mv.is_beyond_beer_growth_lever = TRUE
--               AND COALESCE(mv.is_global_brand, FALSE) = FALSE
           -- Non Alc Beer: NÃO mostra Global Brands
           WHEN 'Non Alc Beer' THEN
               mv.is_non_alc = TRUE
           -- caso venha com hífen
           WHEN 'Non-Alc Beer' THEN
               mv.is_non_alc = TRUE
           -- Balanced Choices: NÃO mostra Global Brands
           WHEN 'Balanced Choices' THEN
               mv.is_balanced_choice_growth_lever = TRUE
       -- Global view: mostra tudo, incluindo Global Brands
       ELSE TRUE
     END
     GROUP BY ALL
),
cte_last_period
(
  select
     :period                   as period_type,
     0                         as rank,
     tot.ini_date              as dt_ini,
     tot.end_date              as dt_end,
     'ABI'                     as country_iso_code_3,
     case when :period = 'YTD'
               then 'ABI LAST YEAR'
               else 'ABI LY SAME MONTH'
     end                   as raw_brand,
     '-'                   as segment,
     tot.ly                as ac,
     ly.ac_vs_ly           as ac_vs_ly,
     ly.ac_vs_bu           as ac_vs_bu,
     ly                    as delta,
     :kpi                  as kpi_name,
     ly.per_hl_vs_ly       as per_hl_vs_ly
from cte_total tot
cross join cte_total_ly ly
),
cte_curre_period
(
  select
     :period             as period_type,
     17                   as rank,
     ini_date            as dt_ini,
     end_date            as dt_end,
     'ABI'               as country_iso_code_3,
     case when :period = 'YTD'
               then 'ABI CURRENT YEAR'
               else 'ABI CURRENT MONTH'
     end                 as raw_brand,
     '-'                 as segment,
     ac                  as ac,
     ac_vs_ly            as ac_vs_ly,
     ac_vs_bu            as ac_vs_bu,
     ac                  as delta,
     :kpi           as kpi_name,
     ly                  as ly,
     bu                  as bu,
     per_hl_vs_ly        as per_hl_vs_ly,
       /* calculo de others */
       /* Calculo cd NR vs LY */
     nr_og_vly           as nr_og_vly,
     nr_am_vly           as nr_am_vly,
     volume_og_vly       as volume_og_vly,
     volume_am_vly       as volume_am_vly

from cte_total
),
cte_global
(
   SELECT
       mv.ini_date AS dt_ini,
       mv.end_date AS dt_end,
       :kpi AS kpi_name,
       CASE WHEN mv.product_type = ''
            THEN 'BEER' ELSE mv.product_type END AS level_1,

       CASE
           WHEN :growth_lever in ('Lead Premium', 'All') and mv.country_iso_code_3_global_brands = 'ABI' THEN 'ABI'
           ELSE COALESCE(NULLIF(mv.country_iso_code_3, ''), 'Others')
       END AS country_iso_code_3,

       CASE WHEN mv.brand_level_1 = ''
            THEN 'NOBRAND'
            ELSE mv.brand_level_1
       END AS raw_brand,

       CASE
           WHEN :growth_lever in ('Lead Premium', 'All') and mv.country_iso_code_3_global_brands = 'ABI'
           THEN 'Global Brands'
           ELSE case when :view_level = 'Growth Levers Global' then 'Others' else COALESCE(NULLIF(mv.portfolio, ''), 'Others') end
       END AS segment,

       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_ac)     ELSE MEASURE(mv.nr_ac)     END AS double) AS ac,
       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_ly)     ELSE MEASURE(mv.nr_ly)     END AS double) AS ly,
       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_bu)     ELSE MEASURE(mv.nr_bu)     END AS double) AS bu,
       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_og_ly)  ELSE MEASURE(mv.nr_og_ly)  END AS double) AS og_ly,
       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_ac_vs_ly) ELSE MEASURE(mv.nr_ac_vs_ly) END AS double) AS ac_vs_ly,
       CAST(CASE :kpi WHEN 'volume' THEN MEASURE(mv.volume_ac_vs_bu) ELSE MEASURE(mv.nr_ac_vs_bu) END AS double) AS ac_vs_bu,
       CAST(CASE :kpi WHEN 'volume' THEN 0                           ELSE MEASURE(mv.nr_per_hl_vs_ly) END AS double) AS per_hl_vs_ly,

       /* Calculo cd NR vs LY */
       cast ( measure(mv.nr_og_ly ) as double) as nr_og_vly,
       cast ( measure(mv.nr_ly ) as double) as nr_am_vly,
       cast ( measure(mv.volume_og_ly ) as double) as volume_og_vly,
       cast ( measure(mv.volume_ly ) as double) as volume_am_vly

   FROM gold_common.owr_finance_mv mv
   WHERE mv.period_type IN ('YTD', 'MTH')
     AND case when :reporttype = 'TOTAL' then true else product_type in ("BEER", "ADJ") END
     AND (
         CASE WHEN :period = 'MTD' THEN 'MTH'
              ELSE :period
         END
     ) = mv.period_type
--      AND (
--          (mv.period_type = 'MTH' AND trunc(mv.end_date, 'MM') = trunc(to_date(:dt_end), 'MM'))
--          OR
--          (mv.period_type = 'YTD' AND mv.ini_date = to_date(concat(year(to_date(:dt_end)), '-01-01')))
--      )
     AND mv.end_date = to_date(:dt_end)

     AND case  when :view_level = 'Growth Levers Global'    then true
                when :view_level = 'Growth Levers Country'   then mv.country_iso_code_3 = :country
        end
     -- Filtros de Growth Lever
     AND CASE :growth_lever
           WHEN 'Superior Core'
                 THEN mv.is_superior_core_growth_lever = TRUE
           WHEN 'Lead Premium' THEN
               mv.is_lead_premium_growth_lever = TRUE
               AND (mv.is_global_brand = TRUE OR
                    (mv.is_global_brand = FALSE AND mv.price_tier IN ('Core+', 'Premium', 'Super Premium')))
           WHEN 'Beyond Beer' THEN mv.is_beyond_beer_growth_lever = TRUE
           WHEN 'Non Alc Beer' THEN mv.is_non_alc = TRUE
           WHEN 'Balanced Choices' THEN mv.is_balanced_choice_growth_lever = TRUE
           ELSE TRUE
         END
   GROUP BY ALL
),
cte_top_bottom_global
(
   select
       row_number() over (partition by ctg.kpi_name order by abs(og_ly) desc) rank,
       :period period_type,
       ctg.dt_ini,
       ctg.dt_end,
       ctg.country_iso_code_3,
       ctg.raw_brand,
       ctg.segment,
       ctg.ac,
       ctg.ac_vs_ly,
       ctg.ac_vs_bu,
       round(ctg.og_ly, 1) delta,
       ctg.kpi_name,
       ctg.ac / ccp.ac * 100.0  volume_weight,
       ctg.ly,
       ctg.bu,
       ctg.per_hl_vs_ly,
       ctg.nr_og_vly,
       ctg.nr_am_vly,
       ctg.volume_og_vly,
       ctg.volume_am_vly

   from cte_global ctg
   cross join cte_curre_period ccp
   where case  when :page_type = 'top' then og_ly > 0
               when :page_type = 'bottom' then og_ly < 0
       end
       and ctg.segment = 'Global Brands'
       and COALESCE(:growth_lever, '') IN ('', 'All', 'Lead Premium')
),
cte_qtd_reg
(
   select coalesce(max(rank), 0) qtd
   from cte_top_bottom_global
),
cte_top_brand
(
   select *
   from
   (
       select
           row_number() over (partition by ctg.kpi_name order by abs(ctg.og_ly) desc) + qtd.qtd rank,
           :period period_type,
           ctg.dt_ini,
           ctg.dt_end,
           ctg.country_iso_code_3,
           ctg.raw_brand,
           ctg.segment,
           ctg.ac,
           ctg.ac_vs_ly,
           ctg.ac_vs_bu,
           round(ctg.og_ly, 1) delta,
           ctg.kpi_name,
           ctg.ac / ccp.ac * 100.0 volume_weight,
           ctg.ly,
           ctg.bu,
           ctg.per_hl_vs_ly,
           ctg.nr_og_vly,
           ctg.nr_am_vly,
           ctg.volume_og_vly,
           ctg.volume_am_vly
       from cte_global ctg
       cross join cte_qtd_reg qtd
       cross join cte_curre_period ccp
       where case  when :page_type = 'top' then og_ly > 0
                   when :page_type = 'bottom' then og_ly < 0
           end
           and case when COALESCE(:growth_lever, '') IN ('', 'All', 'Lead Premium') then ctg.segment not in ('Global Brands', 'Megabrands')
                    else true end
           and ctg.raw_brand <> 'NOBRAND'
           and ctg.raw_brand not like 'All Other%'
           and ctg.country_iso_code_3 not like 'Others%'
    ) q
    where rank  <= 15
)
,
cte_union_top_volume
(
   select
       dt_ini,
       dt_end,
       sum(ac) ac,
       sum(ly) ly,
       sum(bu) bu,
       sum(nr_og_vly) nr_og_vly,
       sum(nr_am_vly) nr_am_vly,
       sum(volume_og_vly) volume_og_vly,
       sum(volume_am_vly) volume_am_vly
   from
   (
       select
           dt_ini,
           dt_end,
           ac,
           ly,
           bu,
           /*calculo de others */
           nr_og_vly,
           nr_am_vly,
           volume_og_vly,
           volume_am_vly

       from cte_top_bottom_global
       union all
       select
           dt_ini,
           dt_end,
           ac,
           ly,
           bu,
           /* calculo de others */
           nr_og_vly,
           nr_am_vly,
           volume_og_vly,
           volume_am_vly
      from cte_top_brand
   ) query
   group by all
)
,
cte_others
(
   select
       16 rank,
       :period period_type,
       bas.dt_ini,
       bas.dt_end,
       'Others' country_iso_code_3,
       'Others' raw_brand,
       'Others' segment,
       tot.ac - coalesce(bas.ac, 0) ac,
       tot.ly - coalesce(bas.ly, 0) ly,
       tot.bu - coalesce(bas.bu, 0) bu,
       100.0 * try_divide((tot.ac - coalesce(bas.ac, 0)) - (tot.ly - coalesce(bas.ly, 0)), (tot.ly - coalesce(bas.ly, 0))) ac_vs_ly,
       100.0 * try_divide((tot.ac - coalesce(bas.ac, 0)) - (tot.bu - coalesce(bas.bu, 0)), (tot.bu - coalesce(bas.bu, 0))) ac_vs_bu,
       case when :kpi = 'volume'  then (tot.ac - coalesce(bas.ac, 0)) - (tot.ly - coalesce(bas.ly, 0))
            when :kpi = 'nr'      then (tot.nr_og_vly - coalesce(bas.nr_og_vly, 0))
       end og_ly,
       :kpi   kpi_name,
       ((tot.ac - coalesce(bas.ac, 0)) / tot.ac) * 100.0  volume_weight,
       ((1 + (tot.nr_og_vly - coalesce(bas.nr_og_vly, 0) / NULLIF(ABS(tot.nr_am_vly - coalesce(bas.nr_am_vly, 0)), 0))) /
        (1 + (tot.volume_og_vly - coalesce(bas.volume_og_vly, 0) / NULLIF(ABS(tot.volume_am_vly - coalesce(bas.volume_am_vly, 0)), 0)))
       - 1) * 100 as per_hl_vs_ly

   from cte_union_top_volume bas
   cross join cte_curre_period tot
)
/* KPI data rows */
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(ac, 1)        ac,
   round(ac_vs_ly, 1)  ac_vs_ly,
   round(ac_vs_bu, 1)  ac_vs_bu,
   round(delta, 1)     delta,
   kpi_name,
   round(per_hl_vs_ly, 1) per_hl_vs_ly
from cte_last_period
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(ac, 1)        ac,
   round(ac_vs_ly, 1)  ac_vs_ly,
   round(ac_vs_bu, 1)  ac_vs_bu,
   round(delta, 1)     delta,
   kpi_name,
   round(per_hl_vs_ly, 1) per_hl_vs_ly
from cte_curre_period
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(ac, 1)        ac,
   round(ac_vs_ly, 1)  ac_vs_ly,
   round(ac_vs_bu, 1)  ac_vs_bu,
   round(delta, 1)     delta,
   kpi_name,
   round(per_hl_vs_ly, 1) per_hl_vs_ly
from cte_top_bottom_global
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(ac, 1)        ac,
   round(ac_vs_ly, 1)  ac_vs_ly,
   round(ac_vs_bu, 1)  ac_vs_bu,
   round(delta, 1)     delta,
   kpi_name,
   round(per_hl_vs_ly, 1) per_hl_vs_ly
from cte_top_brand
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(ac, 1)        ac,
   round(ac_vs_ly, 1)  ac_vs_ly,
   round(ac_vs_bu, 1)  ac_vs_bu,
   round(og_ly, 1)     delta,
   kpi_name,
   round(per_hl_vs_ly, 1) per_hl_vs_ly
from cte_others
/* Weight rows */
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(100, 1)        ac,
   null  ac_vs_ly,
   null  ac_vs_bu,
   null     delta,
   :kpi || '_weight' kpi_name,
   null  per_hl_vs_hly
from cte_curre_period
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(volume_weight, 1)        ac,
   null  ac_vs_ly,
   null  ac_vs_bu,
   null     delta,
   :kpi || '_weight' kpi_name,
   null  per_hl_vs_hly
from cte_top_bottom_global
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(volume_weight, 1)        ac,
   null  ac_vs_ly,
   null  ac_vs_bu,
   null     delta,
   :kpi || '_weight'  kpi_name,
   null  per_hl_vs_hly
from cte_top_brand
union all
select
   period_type,
   rank,
   dt_ini,
   dt_end,
   country_iso_code_3,
   raw_brand,
   segment,
   round(volume_weight, 1)        ac,
   null  ac_vs_ly,
   null  ac_vs_bu,
   null     delta,
   :kpi || '_weight' kpi_name,
   null  per_hl_vs_hly
from cte_others
order by kpi_name,
rank