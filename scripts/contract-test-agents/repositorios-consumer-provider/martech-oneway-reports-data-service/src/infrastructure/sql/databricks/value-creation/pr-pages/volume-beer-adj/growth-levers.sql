/*----------------------------------------------------------------------------------------------------*/
/* Priorities Table - NR + Volume                                                                     */
/*----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------*/
/* Iara Bellodi - 2026.04 - Adding NR                                                                 */
/* Marcelo Komatsu - 2026-04-20 - Correcting NR to show by kpi                                        */
/* Marcelo Komatsu - 2026-05-06 - Adding country filter + Product type beer + adj - nonalc and beyond */
/*----------------------------------------------------------------------------------------------------*/

with final as
(
    -- SUPERIOR CORE PAGE
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , price_tier as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Superior Core'
      and end_date = :dt_end
      and price_tier in ('Value', 'Core')
      and product_type in ("BEER", "ADJ")    
    group by all
    union all

    -- LEAD PREMIUM / GLOBAL BRAND
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , case
            when is_global_brand = true then 'Global Brands'
          end as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Lead Premium'
      and end_date = :dt_end
      and is_lead_premium_growth_lever = true
      and is_global_brand = true
      and product_type in ("BEER", "ADJ")    
    group by all
    union all

    -- LEAD PREMIUM / OTHERS
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , case
            when  price_tier = 'Core+' then 'Local Core Plus'
            when  price_tier in ('Premium', 'Super Premium') then 'Local Prem/SP'
          end as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Lead Premium'
      and end_date = :dt_end
      and is_lead_premium_growth_lever = true
      AND product_type = 'BEER'
    group by all
    union all

    -- LEAD PREMIUM / OTHERS
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , case
            when  price_tier = 'Core+' then 'Local Core Plus'
            when  price_tier in ('Premium', 'Super Premium') then 'Local Prem/SP'
          end as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Lead Premium'
      and end_date = :dt_end
      and is_lead_premium_growth_lever = true
      AND product_type = 'BEER'
    group by all
    union all

    -- GROWTH LEVERS PAGES (GLOBAL / COUNTRY)
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , case
            when :page_type = 'Growth Levers Global' then 'ABI'
            when :page_type = 'Growth Levers Country' then case when :country = 'EUR' then country_iso_code_3_eur else country_iso_code_3 end
          end as country_iso_code_3
        , 'Superior Core' as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type in ('Growth Levers Global', 'Growth Levers Country')
      and end_date = :dt_end
      and is_superior_core_growth_lever = true
      and case when :page_type = 'Growth Levers Country' 
            then    case when :country = 'EUR' 
                        then country_iso_code_3_eur = :country 
                    else country_iso_code_3 = :country end
            else 1=1 end 
      and product_type in ("BEER", "ADJ")    
    group by all
    union all
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , case
            when :page_type = 'Growth Levers Global' then 'ABI'
            when :page_type = 'Growth Levers Country' then case when :country = 'EUR' then country_iso_code_3_eur else country_iso_code_3 end
          end as country_iso_code_3
        , 'Lead Premium' as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type in ('Growth Levers Global', 'Growth Levers Country')
      and end_date = :dt_end
      and is_lead_premium_growth_lever = true
      and case when :page_type = 'Growth Levers Country' 
            then    case when :country = 'EUR' 
                        then country_iso_code_3_eur = :country 
                    else country_iso_code_3 = :country end
            else 1=1 end 
      and product_type in ("BEER", "ADJ")    
    group by all
    union all
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , case
            when :page_type = 'Growth Levers Global' then 'ABI'
            when :page_type = 'Growth Levers Country' then case when :country = 'EUR' then country_iso_code_3_eur else country_iso_code_3 end
          end as country_iso_code_3
        , 'Balanced Choices' as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type in ('Growth Levers Global', 'Growth Levers Country')
      and end_date = :dt_end
      and is_balanced_choice_growth_lever = true
      and case when :page_type = 'Growth Levers Country' 
            then    case when :country = 'EUR' 
                        then country_iso_code_3_eur = :country 
                    else country_iso_code_3 = :country end
            else 1=1 end 
      and product_type in ("BEER", "ADJ")    
    group by all
    union all
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , case
            when :page_type = 'Growth Levers Global' then 'ABI'
            when :page_type = 'Growth Levers Country' then case when :country = 'EUR' then country_iso_code_3_eur else country_iso_code_3 end
          end as country_iso_code_3
        , 'Beyond Beer' as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type in ('Growth Levers Global', 'Growth Levers Country')
      and end_date = :dt_end
      and is_beyond_beer_growth_lever = true
      and case when :page_type = 'Growth Levers Country' 
            then    case when :country = 'EUR' 
                        then country_iso_code_3_eur = :country 
                    else country_iso_code_3 = :country end
            else 1=1 end 
      and product_type in ("BEER", "ADJ")    
    group by all
    union all
    -- BEYOND BEER PAGE - BRANDS
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , case
            when brand_family = 'Skol' then 'Beats'
            else brand_family
          end as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Beyond Beer'
      and end_date = :dt_end
      and is_beyond_beer_growth_lever = true
      and brand_family in ('Skol', 'Brutal Fruit', 'Cutwater', 'Flying Fish', "Mike's", 'Nutrl')
    group by all
    union all
    -- BEYOND BEER PAGE - TOTAL
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , 'Total' as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Beyond Beer'
      and end_date = :dt_end
      and is_beyond_beer_growth_lever = true
      and brand_family in ('Skol', 'Brutal Fruit', 'Cutwater', 'Flying Fish', "Mike's", 'Nutrl')
    group by all
    union all
    -- NON ALCOHOLIC PAGE
    select
          :page_type as page_type
        , ini_date as dt_ini
        , end_date as dt_end
        , case
            when period_type = 'MTH' then 'M'
            when period_type = 'R3M' then 'L3M'
            else period_type
          end as period
        , 'ABI' as country_iso_code_3
        , case
            when brand_family = 'Stella Artois' then 'Stella Zero'
            when brand_family = 'Michelob Ultra' then 'Michelob Ultra Zero'
            when brand_family = 'Budweiser' then 'Budweiser Zero'
            when brand_family = 'Corona' then 'Corona Cero'
          end as priorities
        , round(case  when :kpi = 'volume'  then measure(volume_ac)
                      when :kpi = 'nr'      then measure(nr_ac) end, 1) as ac
        , round(case  when :kpi = 'volume'  then measure(volume_ac_vs_ly)
                      when :kpi = 'nr'      then measure(nr_ac_vs_ly) end, 1) ac_vs_ly
        , :kpi kpi_name
    from gold_common.owr_finance_mv
    where :page_type = 'Non Alcoholic'
      and end_date = :dt_end
      and is_non_alc = true
      and brand_family in ('Stella Artois', 'Michelob Ultra', 'Budweiser', 'Corona')
    group by all
)
select *
from final
where priorities is not null
order by
    case period
      when 'M' then 1
      when 'L3M' then 2
      when 'YTD' then 3
      else 4
    end,
    case
      when page_type in ('Growth Levers Global', 'Growth Levers Country') then
        case priorities
          when 'Superior Core' then 1
          when 'Lead Premium' then 2
          when 'Global Brands' then 3
          when 'Non Alc Beer' then 4
          when 'Balanced Choices' then 4
          when 'Beyond Beer' then 5
          else 99
        end
      when page_type = 'Lead Premium' then
        case priorities
          when 'Global Brands' then 1
          when 'Local Core Plus' then 2
          when 'Local Prem/SP' then 3
          else 99
        end
      when page_type = 'Superior Core' then
        case priorities
          when 'Value' then 1
          when 'Core' then 2
          else 99
        end
      when page_type = 'Beyond Beer' then
        case priorities
          when 'Flying Fish' then 1
          when 'Brutal Fruit' then 2
          when 'Cutwater' then 3
          when 'Beats' then 4
          when 'Nutrl' then 5
          when "Mike's" then 6
          when 'Total' then 7
          else 99
        end
      when page_type = 'Non Alcoholic' then
        case priorities
          when 'Corona Cero' then 1
          when 'Michelob Ultra Zero' then 2
          when 'Stella Zero' then 3
          when 'Budweiser Zero' then 4
          else 99
        end
      else 99
    end