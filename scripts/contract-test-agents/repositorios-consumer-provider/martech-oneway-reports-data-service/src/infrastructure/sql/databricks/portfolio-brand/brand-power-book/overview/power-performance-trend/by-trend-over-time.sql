/*ENV_[OWR] Brand Power Book - Power Performance Trend - By Trend Over Time*/
/* 2025-04-14 - ANNA GOUVEA - Add the 'Others' option in page_filter parameter */

WITH CTE_MAX_DT_LIMIT AS (
  select *
  from {{KPI_TABLE}}
  where DT_END <= :dt_end
),
CTE_MAX_DT AS (
  select *
    , max(DT_INI) over(partition by KPI_NAME, VERSION_ID) MAX_INI
    , max(DT_END) over(partition by KPI_NAME, VERSION_ID) MAX_END
  from CTE_MAX_DT_LIMIT
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
from CTE_MAX_DT c
where 1=1
  and quarter(DT_INI) = quarter(DT_END)
order by DT_INI asc;