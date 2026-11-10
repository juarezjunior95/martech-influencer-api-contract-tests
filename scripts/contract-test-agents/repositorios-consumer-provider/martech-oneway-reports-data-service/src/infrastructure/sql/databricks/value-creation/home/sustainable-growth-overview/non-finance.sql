/*--------------------------------------------------------------------------------------------------------------- */
/* Query BG Home Value Creation                                                                                   */
/* Market Share / Power                                                                                           */
/* Global: country = ABI / zone = ABI                                                                             */
/* Europe: country = ABI / zone = EUR                                                                             */
/* AC_VS_LY uses official value from tlh_kpis_agg                                                                 */
/*--------------------------------------------------------------------------------------------------------------- */

WITH RAW_BASE AS (

    SELECT
          src.DT_INI
        , src.DT_END
        , src.COUNTRY_ISO_CODE_3
        , src.ABI_ZONE
        , src.KPI_NAME
        , src.LEVEL_1
        , src.PRICE_TIER
        , src.UNIT_OF_MEASURE
        , src.COMP_UNIT_OF_MEASURE
        , src.AC
        , src.AC_VS_LY

    FROM {{KPI_TABLE}} src

    WHERE 1 = 1

      /*---------------------------------------------------------------------------------------------------------*/
      /* COUNTRY                                                                                                 */
      /* Europe and Global both arrive with country = ABI. Zone differentiates them.                            */
      /*---------------------------------------------------------------------------------------------------------*/
      AND src.COUNTRY_ISO_CODE_3 =
            CASE

                /* EUROPE */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                 AND UPPER(TRIM(:country)) = 'ABI'
                 AND UPPER(TRIM(:zone)) = 'EUR'
                 AND :growth_lever = 'All'
                    THEN 'EUR'

                /* GLOBAL */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                    THEN 'ABI'

                /* COUNTRY */
                ELSE UPPER(TRIM(:country))

            END


      /*---------------------------------------------------------------------------------------------------------*/
      /* KPI                                                                                                     */
      /*---------------------------------------------------------------------------------------------------------*/
      AND src.KPI_NAME = :kpi_name

      AND (
            :kpi_name = 'market_share'

            OR (
                :kpi_name = 'power'
                AND src.LEVEL_1 = 'ABI'
            )
          )


      /*---------------------------------------------------------------------------------------------------------*/
      /* VERSION ID                                                                                              */
      /*---------------------------------------------------------------------------------------------------------*/
      AND src.VERSION_ID =
            CASE

                /* EUROPE - MARKET SHARE */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                 AND UPPER(TRIM(:country)) = 'ABI'
                 AND UPPER(TRIM(:zone)) = 'EUR'
                 AND :growth_lever = 'All'
                 AND :kpi_name = 'market_share'
                    THEN 212

                /* EUROPE - POWER */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                 AND UPPER(TRIM(:country)) = 'ABI'
                 AND UPPER(TRIM(:zone)) = 'EUR'
                 AND :growth_lever = 'All'
                 AND :kpi_name = 'power'
                    THEN 179

                /* GLOBAL - ALL */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                 AND :growth_lever = 'All'
                    THEN 2

                /* GLOBAL - GROWTH LEVER */
                WHEN LOWER(TRIM(:viewtype)) = 'global'
                 AND :growth_lever IN (
                        'Lead Premium',
                        'Superior Core',
                        'Beyond Beer'
                     )
                    THEN 12

                /* COUNTRY - ALL */
                WHEN LOWER(TRIM(:viewtype)) = 'country'
                 AND :growth_lever = 'All'
                    THEN 1

                /* COUNTRY - GROWTH LEVER */
                WHEN LOWER(TRIM(:viewtype)) = 'country'
                 AND :growth_lever IN (
                        'Lead Premium',
                        'Superior Core',
                        'Beyond Beer'
                     )
                    THEN 11

            END


      /*---------------------------------------------------------------------------------------------------------*/
      /* EUROPE ZONE FILTER                                                                                      */
      /* Only applies to Europe aggregate. Other countries preserve existing behavior.                          */
      /*---------------------------------------------------------------------------------------------------------*/
      AND CASE

            WHEN LOWER(TRIM(:viewtype)) = 'global'
             AND UPPER(TRIM(:country)) = 'ABI'
             AND UPPER(TRIM(:zone)) = 'EUR'
             AND :growth_lever = 'All'
                THEN src.ABI_ZONE = 'EUR'

            ELSE TRUE

          END


      /*---------------------------------------------------------------------------------------------------------*/
      /* GROWTH LEVER                                                                                            */
      /*---------------------------------------------------------------------------------------------------------*/
      AND (
            :growth_lever = 'All'

            OR src.PRICE_TIER =
                CASE

                    WHEN :growth_lever = 'Superior Core'
                        THEN 'Core Superiority'

                    WHEN :growth_lever = 'Lead Premium'
                        THEN 'Premiumization'

                    WHEN :growth_lever = 'Beyond Beer'
                        THEN 'Beyond Beer'

                END
          )


      /*---------------------------------------------------------------------------------------------------------*/
      /* FOUR YEARS DISPLAYED                                                                                    */
      /*---------------------------------------------------------------------------------------------------------*/
      AND YEAR(src.DT_END)
            BETWEEN YEAR(CAST(:dt_end AS DATE)) - 3
                AND YEAR(CAST(:dt_end AS DATE))


      /*---------------------------------------------------------------------------------------------------------*/
      /* PERIOD                                                                                                  */
      /*---------------------------------------------------------------------------------------------------------*/
      AND (

            /* YTD */
            (
                :period = 'YTD'

                AND MONTH(src.DT_INI) = 1

                AND MONTH(src.DT_END) =
                    MONTH(CAST(:dt_end AS DATE))

                AND YEAR(src.DT_INI) =
                    YEAR(src.DT_END)
            )


            OR


            /* L3M */
            (
                :period = 'L3M'

                AND DATEDIFF(
                        src.DT_END,
                        src.DT_INI
                    ) BETWEEN 58 AND 63

                AND MONTH(src.DT_END) =
                    MONTH(CAST(:dt_end AS DATE))
            )


            OR


            /* MTD - POWER */
            (
                :period = 'MTD'

                AND :kpi_name = 'power'

                AND DATEDIFF(
                        src.DT_END,
                        src.DT_INI
                    ) BETWEEN 58 AND 63

                AND MONTH(src.DT_END) =
                    MONTH(CAST(:dt_end AS DATE))
            )


            OR


            /* MTD - MARKET SHARE */
            (
                :period = 'MTD'

                AND :kpi_name <> 'power'

                AND MONTH(src.DT_INI) =
                    MONTH(CAST(:dt_end AS DATE))

                AND MONTH(src.DT_END) =
                    MONTH(CAST(:dt_end AS DATE))

                AND YEAR(src.DT_INI) =
                    YEAR(src.DT_END)
            )

          )
),

PERIOD_BASE AS (

    SELECT *
    FROM RAW_BASE

),

CTE_AVERAGE_LINE AS (

    SELECT
          sub.COUNTRY_ISO_CODE_3
        , sub.KPI_NAME
        , sub.LEVEL_1

        , ROUND(
              COALESCE(
                  SUM(
                      CASE
                          WHEN YEAR(sub.DT_END) = sub.MAX_YEAR
                              THEN sub.AC
                      END
                  ),
                  0
              )
              -
              COALESCE(
                  SUM(
                      CASE
                          WHEN YEAR(sub.DT_END) = sub.MIN_YEAR
                              THEN sub.AC
                      END
                  ),
                  0
              ),
              1
          ) AS AVERAGE_LINE

    FROM (

        SELECT
              COUNTRY_ISO_CODE_3
            , KPI_NAME
            , LEVEL_1
            , DT_END
            , AC

            , MIN(YEAR(DT_END)) OVER (
                PARTITION BY
                      COUNTRY_ISO_CODE_3
                    , KPI_NAME
                    , LEVEL_1
              ) AS MIN_YEAR

            , MAX(YEAR(DT_END)) OVER (
                PARTITION BY
                      COUNTRY_ISO_CODE_3
                    , KPI_NAME
                    , LEVEL_1
              ) AS MAX_YEAR

        FROM PERIOD_BASE

    ) sub

    WHERE YEAR(sub.DT_END) IN (
          sub.MIN_YEAR
        , sub.MAX_YEAR
    )

    GROUP BY
          sub.COUNTRY_ISO_CODE_3
        , sub.KPI_NAME
        , sub.LEVEL_1
)

SELECT
      pb.DT_INI
    , pb.DT_END

    , :period AS PERIOD

    , pb.COUNTRY_ISO_CODE_3
    , pb.ABI_ZONE
    , pb.KPI_NAME

    , CASE

        WHEN pb.PRICE_TIER = 'Superior Core'
            THEN 'Core Superiority'

        WHEN pb.PRICE_TIER = 'Lead Premium'
            THEN 'Premiumization'

        ELSE pb.PRICE_TIER

      END AS GROWTH_LEVERS

    , pb.UNIT_OF_MEASURE
    , pb.COMP_UNIT_OF_MEASURE

    , CAST(
        ROUND(pb.AC, 1)
        AS DECIMAL(18,1)
      ) AS AC

    /* OFFICIAL AC_VS_LY FROM SOURCE */
    , CAST(
        ROUND(pb.AC_VS_LY, 1)
        AS DECIMAL(18,1)
      ) AS AC_VS_LY

    , CAST(
        al.AVERAGE_LINE
        AS DECIMAL(18,1)
      ) AS AVERAGE_LINE

FROM PERIOD_BASE pb

INNER JOIN CTE_AVERAGE_LINE al
    ON  pb.COUNTRY_ISO_CODE_3 = al.COUNTRY_ISO_CODE_3
    AND pb.KPI_NAME            = al.KPI_NAME
    AND pb.LEVEL_1             = al.LEVEL_1

ORDER BY
      pb.KPI_NAME
    , pb.PRICE_TIER
    , pb.DT_INI
    , pb.DT_END
;
