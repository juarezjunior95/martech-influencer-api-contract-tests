-- Table: tlh_kpis_agg_shadow
-- Description: Partitioned shadow table for tlh_kpis_agg (copy structure from main table)
-- Purpose: Used for ETL workflow to load data before moving to main table

CREATE TABLE IF NOT EXISTS tlh_kpis_agg_shadow (LIKE tlh_kpis_agg INCLUDING ALL) PARTITION BY LIST (kpi_name);

-- Create default partition to catch all kpi_names that don't have a specific partition
-- This allows inserting data without needing to prepare partitions in advance
-- Data will be moved from default partition to specific partition during replace operation
CREATE TABLE IF NOT EXISTS tlh_kpis_agg_shadow_default PARTITION OF tlh_kpis_agg_shadow DEFAULT;

-- Create index on kpi_name in default partition for better performance when querying and moving data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_shadow_default_kpi_name ON tlh_kpis_agg_shadow_default (kpi_name);