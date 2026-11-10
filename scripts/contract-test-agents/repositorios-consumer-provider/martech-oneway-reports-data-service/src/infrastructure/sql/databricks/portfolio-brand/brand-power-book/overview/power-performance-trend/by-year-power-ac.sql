/*ENV_[OWR] Brand Power Book - Power Performance - Trend Year By Year Power Ac*/
/* 2025-04-14 - ANNA GOUVEA - Add the 'Others' option in page_filter parameter */

WITH CTE_MAX_DT AS (
  select *
    , max(DT_INI) over(partition by KPI_NAME, VERSION_ID) MAX_INI
    , max(DT_END) over(partition by KPI_NAME, VERSION_ID) MAX_END
  from {{KPI_TABLE}}
  where 1=1
  and KPI_NAME = 'power'
  and case when :viewtype = 'global'  and :page_filter = 'All'
              then VERSION_ID = 2 and COUNTRY_ISO_CODE_3 = 'ABI'

           when :viewtype = 'global'  and :page_filter in ('Megabrands', 'Expansion', 'Sustain', 'Tail')
              then VERSION_ID = 5  and COUNTRY_ISO_CODE_3 = 'ABI' and segment = :page_filter

           when :viewtype = 'global'  and :page_filter in ('Mainstream', 'Core+', 'Premiumization', 'Beyond Beer', 'Others')
              then VERSION_ID = 30 and COUNTRY_ISO_CODE_3 = 'ABI' and price_tier = :page_filter

           when :viewtype = 'global'  and :page_filter in ('All Global Brands')
               then VERSION_ID = 120 and COUNTRY_ISO_CODE_3 = 'ABI'

           when :viewtype = 'global'  and :page_filter in ('Budweiser', 'Corona', 'Stella Artois', 'Michelob Ultra', 'Heineken')
               then VERSION_ID = 119 and COUNTRY_ISO_CODE_3 = 'ABI' and RAW_BRAND = case when :page_filter = 'Michelob Ultra' then 'Michelob' else :page_filter end

           when :viewtype = 'country' and :page_filter = 'All'
               then VERSION_ID = 1 and COUNTRY_ISO_CODE_3 = :country

           when :viewtype = 'country'  and :page_filter in ('Megabrands', 'Expansion', 'Sustain', 'Tail')
              then VERSION_ID = 6  and COUNTRY_ISO_CODE_3 = :country and segment = :page_filter

           when :viewtype = 'country'  and :page_filter in ('Mainstream', 'Core+', 'Premiumization', 'Beyond Beer', 'Others')
              then VERSION_ID = 29 and COUNTRY_ISO_CODE_3 = :country and price_tier = :page_filter

           when :viewtype = 'country'  and :page_filter in ('All Global Brands')
              then VERSION_ID = 121 and COUNTRY_ISO_CODE_3 = :country

           when :viewtype = 'country'  and :page_filter in ('Budweiser', 'Corona', 'Stella Artois', 'Michelob Ultra', 'Heineken')
              then VERSION_ID = 128 and COUNTRY_ISO_CODE_3 = :country and RAW_BRAND = case when :page_filter = 'Michelob Ultra' then 'Michelob' else :page_filter end

          when :viewtype = 'zone' and :page_filter = 'All'
               then VERSION_ID = 4 and ABI_ZONE = :zone

          when :viewtype = 'zone' and :page_filter in ('Megabrands', 'Expansion', 'Sustain', 'Tail')
               then VERSION_ID = 9 and ABI_ZONE = :zone and segment = :page_filter
      end
  and (case when :page_filter = 'Heineken' then LEVEL_1 = 'COMP' else LEVEL_1 = 'ABI' end)
),
CTE_YTD_QUARTER AS (
   select *
   from CTE_MAX_DT c
   where 1=1
   and (
      (quarter(DT_INI) = 1 and quarter(DT_END) = 4) /* Yearly */
      or (year(least(to_date(:dt_end), MAX_END)) = year(DT_END) and quarter(DT_INI) = 1) and DT_END = :dt_end /* YTD quarter */

   )
), CTE_PREVIOUS_YEAR AS (
  select *
  from CTE_MAX_DT
  where 1=1
    and quarter(DT_INI) = 1
    and quarter(DT_END) = 4
)
select
  c.DT_INI
, c.DT_END
, c.VERSION_ID
, c.ABI_ZONE
, c.COUNTRY_ISO_CODE_3
, c.PRICE_TIER
, c.SEGMENT
, c.RAW_BRAND
, ROUND(c.AC, 1) as AC
, ROUND(c.AC_VS_LY, 1) as AC_VS_LY
, ROUND(c.AC - p.AC, 1) as AC_VS_PREVIOUS_YEAR
from CTE_YTD_QUARTER c
LEFT JOIN CTE_PREVIOUS_YEAR p
  ON c.VERSION_ID = p.VERSION_ID
  AND c.COUNTRY_ISO_CODE_3 = p.COUNTRY_ISO_CODE_3
  AND year(c.DT_END) - 1 = year(p.DT_END)
order by c.DT_INI asc;