SELECT cohort,
       country,
       dt_end,
       full_key,
       insight_see_more,
       insight_wo_see_more,
       page,
       price_segment,
       timeperiod,
       trend,
       scope,
       viewtype,
       brand,
       dt_ini,
       page_filter,
       sub_brand,
       zone,
       pos_kpi,
       refresh_datetime,
       period,
       growth_lever,
       competitor,
       period_type,
       kpi,
       waterfall_filter,
       product_scope
FROM mrt_am.gold_ai_martech.ai_products_one_way_summaries
WHERE page = :page 
  AND cohort <=> COALESCE(NULLIF(:cohort, ''), cohort)
  AND country <=> COALESCE(NULLIF(:country, ''), country)
  AND price_segment <=> COALESCE(NULLIF(:price_segment, ''), price_segment)
  AND viewtype <=> COALESCE(NULLIF(:viewtype, ''), viewtype)
  AND timeperiod <=> COALESCE(NULLIF(:timeperiod, ''), timeperiod)
  AND scope <=> COALESCE(NULLIF(:scope, ''), scope)
  AND pos_kpi <=> COALESCE(NULLIF(:pos_kpi, ''), pos_kpi)
  AND brand <=> COALESCE(NULLIF(:brand, ''), brand)
  AND page_filter <=> COALESCE(NULLIF(:page_filter, ''), page_filter)
  AND sub_brand <=> COALESCE(NULLIF(:sub_brand, ''), sub_brand)
  AND zone <=> COALESCE(NULLIF(:zone, ''), zone)
  AND period <=> COALESCE(NULLIF(:period, ''), period)
  AND growth_lever <=> COALESCE(NULLIF(:growth_lever, ''), growth_lever)
  AND competitor <=> COALESCE(NULLIF(:competitor, ''), competitor)
  AND period_type <=> COALESCE(NULLIF(:period_type, ''), period_type)
  AND kpi <=> COALESCE(NULLIF(:kpi, ''), kpi)
  AND waterfall_filter <=> COALESCE(NULLIF(:waterfall_filter, ''), waterfall_filter)
  AND product_scope <=> NULLIF(:product_scope, '')
QUALIFY ROW_NUMBER() OVER (ORDER BY refresh_datetime DESC) = 1;