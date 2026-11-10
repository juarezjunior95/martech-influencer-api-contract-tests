-- Table: tlh_kpis_agg
-- Description: Partitioned table by kpi_name to store aggregated KPIs
-- Purpose: Used for ETL workflow to store aggregated KPI data

CREATE TABLE IF NOT EXISTS tlh_kpis_agg (
    dt_ini                date            NOT NULL,
    dt_end                date            NOT NULL,
    version_id            integer         NOT NULL,
    kpi_name              text            NOT NULL,
    abi_zone              text,
    country_iso_code_3    text            NOT NULL,
    raw_geography         text,
    raw_brand             text,
    price_tier            text,
    segment               text,
    maturity              text,
    level_1               text,
    level_2               text,
    level_3               text,
    level_4               text,
    unit_of_measure       text,
    comp_unit_of_measure  text,
    ac                    double precision,
    bu                    double precision,
    ly                    double precision,
    og_ly                 double precision,
    og_bu                 double precision,
    ac_vs_ly              double precision,
    ac_vs_bu              double precision,
    bu_vs_ly              double precision,
    le                    double precision,
    le_ly                 double precision,
    le_vs_ly              double precision,
    le_vs_bu              double precision
) PARTITION BY LIST (kpi_name);