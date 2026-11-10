/*------------------------------------------------------------------------------------------------------*/
/* BarChart - Brand Subbrand - MarketSare PR Pages                                                      */
/*------------------------------------------------------------------------------------------------------*/

/* Parameters: 

  brand: Corona, Corona Cero, Budweiser, Flying Fish, Stella Artois, Michelob (não ultra)
  page_type: para Corona Cero será subbrand, para os demais será brand                                   */

/*------------------------------------------------------------------------------------------------------*/
/* Marcelo Komatsu - 2026-04-20 - Query Creation                                                        */
/*------------------------------------------------------------------------------------------------------*/

select  dt_ini,
        dt_end,
        year(dt_end) year,
        ac,
        bu,
        ly,
        ac_vs_ly
from {{KPI_TABLE}}
where year(dt_end) between year(:dt_end) - 4 and year(:dt_end)
and  month(dt_end) = month(:dt_end)
and  month(dt_ini) = 1
and  kpi_name = 'market_share'
and  version_id = case when :page_type = 'Brand' then 220 else 221 end
and  case when :page_type = 'Brand' then raw_brand = :brand else 1=1 end
and  case when :page_type = 'Subbrand' then level_3 = :brand else 1=1 end
order by year
