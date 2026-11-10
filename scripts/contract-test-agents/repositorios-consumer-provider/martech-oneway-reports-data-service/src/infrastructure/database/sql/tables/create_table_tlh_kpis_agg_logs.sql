-- Table: tlh_kpis_agg_logs
-- Description: Log table for ETL processes related to tlh_kpis_agg
-- Purpose: Track execution history, errors, and status of stored procedures

CREATE TABLE IF NOT EXISTS tlh_kpis_agg_logs (
    id                  BIGSERIAL       PRIMARY KEY,
    execution_id        UUID            NOT NULL,
    process_name        TEXT            NOT NULL,
    kpi_names           TEXT[],
    status              TEXT            NOT NULL,
    message             TEXT            NOT NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          TEXT            DEFAULT current_user
);

-- Indexes for better query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_logs_execution_id ON tlh_kpis_agg_logs(execution_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_logs_process_name ON tlh_kpis_agg_logs(process_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_logs_kpi_names ON tlh_kpis_agg_logs USING GIN(kpi_names);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_logs_status ON tlh_kpis_agg_logs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tlh_kpis_agg_logs_created_at ON tlh_kpis_agg_logs(created_at DESC);