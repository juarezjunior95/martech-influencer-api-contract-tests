/*-----------------------------------------------------------------------------------------------*/
/* ENV_mustwintable - Volume Pages                                                               */
/*-----------------------------------------------------------------------------------------------*/

/* --------------------------------------------------------------------------------------------- */
/* country: WIN                                                                                  */
/* dt_end: period                                                                                */
/* page_type: Global,
case  when :page_type = "Global" then 1=1  -- Global
            when :page_type = 'Lead Premium' then is_lead_premium_growth_lever = TRUE -- Lead Premium
            when :page_type = 'Superior Core' then is_superior_core_growth_lever = TRUE -- Superior Core
            when :page_type = 'Non Alc Beer' then is_non_alc = TRUE -- Non Alc Beer
            when :page_type = 'Beyond Beer' then is_beyond_beer_growth_lever = TRUE -- Beyond Beer
            when :page_type in ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') then brand_family = :page_type
            when :page_type = 'Corona Cero' then brand_family = 'Corona' */

/*---------------------------- Changes ----------------------------------------------------------*/
/* Marcelo Komatsu - 2026.03.23 - New Development                                                */
/* Marcelo Komatsu - 2026.03.24 - Coluna com paises                                              */
/* Marcelo Komatsu - 2026.04.06 - Filter Correctio to show correct data Europe                   */
/* Marcelo Komatsu - 2026.05.06 - Filter Correctio to show correct data Europe (zone)            */
/*-----------------------------------------------------------------------------------------------*/

with cte_final
as
(
    SELECT
          ini_date AS dt_ini
        , end_date AS dt_end
        , CASE
            WHEN period_type = 'MTH' THEN 'M'
            WHEN period_type = 'R3M' THEN 'L3M'
            ELSE period_type
          END AS period
        , CASE  WHEN country_iso_code_3 IN ('BRA' , 'USA', 'MEX', 'CHN', 'ZAF') THEN 'Must Win'
                WHEN country_iso_code_3 IN ('KOR', 'CAN')   THEN 'Stable/Mature'
                WHEN zone = 'EUR'                           THEN 'Stable/Mature'
                WHEN country_iso_code_3 IN ('COL', 'ARG', 'PER', 'NGA', 'IND', 'DOM', 'ECU') THEN 'High Growth'
          end priorities
        , CASE  WHEN country_iso_code_3 IN ('BRA' , 'USA', 'MEX', 'CHN', 'ZAF') THEN 'BRA;USA;MEX;CHN;ZAF'
                WHEN country_iso_code_3 IN ('KOR', 'CAN')   THEN 'EUR;KOR;CAN'
                WHEN zone = 'EUR'                           THEN 'EUR;KOR;CAN'
                WHEN country_iso_code_3 IN ('COL', 'ARG', 'PER', 'NGA', 'IND', 'DOM', 'ECU') THEN 'COL;ARG;PER;NGA;IND;DOM;ECU'
          end countries
        , CASE :kpi WHEN 'volume' THEN ROUND(measure(volume_ac), 1) ELSE 0 END ac
        , CASE :kpi WHEN 'volume' THEN ROUND(measure(volume_ac_vs_ly), 1) ELSE 0 END ac_vs_ly

    FROM gold_common.owr_finance_mv
    WHERE end_date = :dt_end
    and product_type in ("BEER", "ADJ")
    and   (case  when :country not in ('ABI', 'WIN') then country_iso_code_3 = :country
                when :country = 'WIN' THEN country_iso_code_3 in ('BRA', 'USA', 'MEX', 'CHN', 'ZAF', 'KOR', 'CAN', 'COL', 'ARG', 'PER', 'NGA', 'IND', 'DOM', 'ECU')
            else 1=1 end
            or 
            case when :country not in ('ABI', 'WIN') then country_iso_code_3 = :country
                 when :country = 'WIN' then zone = 'EUR' 
            else 1=1 end)
    and case  when :page_type = "Global" then 1=1  -- Global
              when :page_type = 'Lead Premium' then is_lead_premium_growth_lever = TRUE -- Lead Premium
              when :page_type = 'Superior Core' then is_superior_core_growth_lever = TRUE -- Superior Core
              when :page_type = 'Non Alc Beer' then is_non_alc = TRUE -- Non Alc Beer
              when :page_type = 'Beyond Beer' then is_beyond_beer_growth_lever = TRUE -- Beyond Beer
              when :page_type = 'Balanced Choices' then is_balanced_choice_growth_lever = TRUE
              when :page_type in ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser', 'Flying Fish') then brand_level_1 = :page_type
              when :page_type = 'Corona Cero' then brand_level_1 = 'Corona'
              when :page_type = 'SubBrand' then 1=1
          end
      and case when :page_type = 'Corona Cero' then product_type = 'BEER' and is_non_alc = TRUE
              when :page_type in ('Corona', 'Michelob Ultra', 'Stella Artois', 'Budweiser') then  product_type = 'BEER' and is_global_brand = TRUE
              else 1=1
    end

    GROUP BY ALL

)
select
      dt_ini,
      dt_end,
      period,
      priorities,
      countries,
      ac,
      ac_vs_ly,
      "%" as comp_unit_of_measure
from cte_final
  ORDER BY
      CASE period
        WHEN 'M' THEN 1
        WHEN 'L3M' THEN 2
        WHEN 'YTD' THEN 3
        ELSE 4
      END,
      case  when priorities = 'Must Win' then 1
            when priorities = "Stable/Mature" then 2
            when priorities = "High Growth" then 3
            else 4 end
 