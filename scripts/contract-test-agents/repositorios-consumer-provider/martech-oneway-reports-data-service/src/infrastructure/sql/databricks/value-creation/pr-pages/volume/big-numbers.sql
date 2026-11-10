/*ENV_[OWR] Labels*/

/* =================== DON´T FORGET ======================================== */
/* UAT - gold_common.tlh_kpis_agg                                            */
/* PRD - gold_common.tlh_kpis_freeze_agg                                     */

/*------------------------ CREATED BY ----------------------------------------- */
/* 2025.09.01 - MARCELO KOMATSU - VOLUME FOR L3M, MONTH, YTD - COUNTRY / GLOBAL */

/*------------------------ PARAMETERS ----------------------------------------- */
/* :dt_end --> date to analysis                                                 */
/* :country --> if global --> ABI else country_iso_code_3                       */
/* :page_type --> price, gb                                                      */
/* :price_tier --> NAB, Beyond Beer, Premiumization, Core Superiority, GN        */

/*------------------------ CHANGES ---------------------------------------- */
/*------------------------ CHANGES ---------------------------------------- */


/* QUERY PRINCIPAL */
WITH QRY_PRINCIPAL (
    SELECT  DT_INI,
            DT_END,
            AC,
            LY,
            AC_VS_LY,
            COUNTRY_ISO_CODE_3,
            VERSION_ID,
            price_tier,
            max(DT_INI) over (partition by COUNTRY_ISO_CODE_3, VERSION_ID) MAX_INI,
            max(DT_END) over (partition by COUNTRY_ISO_CODE_3, VERSION_ID) MAX_END
    FROM    {{KPI_TABLE}}
    WHERE   KPI_NAME IN ('volume')
      AND   YEAR(DT_END) = year(:dt_end)
)
,
/* QUERY CALCULANDO OS PERIODOS */
QRY_DATE (
    SELECT 
        CASE WHEN DATEDIFF(DT_END, DT_INI) BETWEEN 58 AND 63 THEN 'L3M'
             WHEN DT_END = DT_INI THEN 'M' 
             WHEN MONTH(DT_INI) = 1 AND MONTH(DT_END) <> 1 THEN 'YTD' 
        END PERIOD,
        DT_INI,
        DT_END,
        AC,
        LY,
        AC_VS_LY,
        COUNTRY_ISO_CODE_3,
        CASE
          WHEN PRICE_TIER = 'Core Superiority' THEN 'Superior Core'
          WHEN PRICE_TIER = 'Premiumization' THEN 'Lead Premium'
          WHEN PRICE_TIER = 'NAB' THEN 'Non Alc Beer'
          ELSE PRICE_TIER
        END AS PRICE_TIER
    FROM QRY_PRINCIPAL
    WHERE CASE WHEN :page_type = 'Global'       then VERSION_ID = 2
               WHEN :page_type = 'global moves' then VERSION_ID = 2 /* aguardar o version_id oficial */
               WHEN :page_type = 'price'        
                    AND :price_tier = 'NAB'
                                                then VERSION_ID = 46   AND price_tier = :price_tier 
               WHEN :page_type = 'price'        then VERSION_ID = 131  AND price_tier = :price_tier 
               WHEN :page_type = 'gb'           then VERSION_ID = 149
               WHEN :page_type = 'country'      then VERSION_ID = 1   AND COUNTRY_ISO_CODE_3 = :country
          END
    AND DT_END = MAX_END
    union 
    SELECT 
        CASE WHEN MONTH(DT_INI) = 1 THEN 'YTD' 
        END PERIOD,
        DT_INI,
        DT_END,
        AC,
        LY,
        AC_VS_LY,
        COUNTRY_ISO_CODE_3,
        CASE
          WHEN PRICE_TIER = 'Core Superiority' THEN 'Superior Core'
          WHEN PRICE_TIER = 'Premiumization' THEN 'Lead Premium'
          WHEN PRICE_TIER = 'NAB' THEN 'Non Alc Beer'
          ELSE PRICE_TIER
        END AS PRICE_TIER
    FROM QRY_PRINCIPAL
    WHERE CASE WHEN :page_type = 'Global'       then VERSION_ID = 2
               WHEN :page_type = 'global moves' then VERSION_ID = 2 /* aguardar o version_id oficial */
               WHEN :page_type = 'price'        
                    AND :price_tier = 'NAB'
                                                then VERSION_ID = 46   AND price_tier = :price_tier 
               WHEN :page_type = 'price'        then VERSION_ID = 131  AND price_tier = :price_tier 
               WHEN :page_type = 'gb'           then VERSION_ID = 149
               WHEN :page_type = 'country'      then VERSION_ID = 1   AND COUNTRY_ISO_CODE_3 = :country
          END
    AND DT_END = MAX_END
    and month(dt_end) = 1

)
/* QUERY FINAL */
SELECT  PERIOD,
        DT_INI,
        DT_END,
        round(AC, 1) AC,
        ROUND(LY, 1) LY,
        ROUND(AC_VS_LY, 1) AC_VS_LY,
        COUNTRY_ISO_CODE_3,
        price_tier
FROM QRY_DATE
WHERE PERIOD IS NOT NULL;