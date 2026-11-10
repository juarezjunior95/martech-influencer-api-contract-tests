-- Stored Procedure: sp_create_tlh_kpis_agg_shadow_partition_indexes
-- Description: Creates indexes on shadow partition table (version_id, country, brand, dt_ini, dt_end)
-- Purpose: Helper procedure to create indexes before moving partition from shadow to main table
-- 
-- Usage: 
--   CALL sp_create_tlh_kpis_agg_shadow_partition_indexes('brand_awareness', 'execution-uuid-here');
-- 
-- This procedure creates the following indexes:
--   - idx_tlh_kpis_agg_<kpi_name>_version_id: index on version_id column
--   - idx_tlh_kpis_agg_<kpi_name>_country_iso_code_3: index on country_iso_code_3 column
--   - idx_tlh_kpis_agg_<kpi_name>_raw_brand: index on raw_brand column
--   - idx_tlh_kpis_agg_<kpi_name>_dt_ini: index on dt_ini column (for date range queries)
--   - idx_tlh_kpis_agg_<kpi_name>_dt_end: index on dt_end column (for date range queries)
-- 
-- The procedure creates indexes on the shadow partition (tlh_kpis_agg_shadow_<kpi_name>)
-- but uses the main partition name (tlh_kpis_agg_<kpi_name>) for index naming.
-- This ensures that after the partition is renamed from shadow to main, the indexes
-- will have the correct names matching the main partition.
-- The execution_id is inherited from the parent procedure to maintain log correlation.

CREATE OR REPLACE PROCEDURE sp_create_tlh_kpis_agg_shadow_partition_indexes(
    p_kpi_name TEXT,
    p_execution_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_partition_name_shadow TEXT;
    v_partition_name_main TEXT;
    v_index_name TEXT;
    v_column_name TEXT;
    v_full_index_name TEXT;
    v_index_definitions TEXT[][] := ARRAY[
        ARRAY['version_id', 'version_id'],
        ARRAY['country_iso_code_3', 'country_iso_code_3'],
        ARRAY['raw_brand', 'raw_brand'],
        ARRAY['dt_ini', 'dt_ini'],
        ARRAY['dt_end', 'dt_end']
    ];
    v_index_def TEXT[];
    v_indexes_created INTEGER := 0;
    v_indexes_failed INTEGER := 0;
    v_process_name TEXT := 'sp_create_tlh_kpis_agg_shadow_partition_indexes';
BEGIN
    -- Build partition names
    v_partition_name_shadow := 'tlh_kpis_agg_shadow_' || p_kpi_name;
    v_partition_name_main := 'tlh_kpis_agg_' || p_kpi_name;

    -- Log process start
    INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
    VALUES (
        p_execution_id,
        v_process_name,
        ARRAY[p_kpi_name],
        'info',
        'Starting index creation',
        NOW()
    );

    -- Loop through all index definitions
    FOREACH v_index_def SLICE 1 IN ARRAY v_index_definitions
    LOOP
        v_index_name := v_index_def[1];
        v_column_name := v_index_def[2];
        v_full_index_name := 'idx_' || v_partition_name_main || '_' || v_index_name;

        BEGIN
            EXECUTE format(
                'CREATE INDEX CONCURRENTLY IF NOT EXISTS %I ON %I (%I)',
                v_full_index_name,
                v_partition_name_shadow,
                v_column_name
            );
            v_indexes_created := v_indexes_created + 1;
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                p_execution_id,
                v_process_name,
                ARRAY[p_kpi_name],
                'info',
                format('Index created: %s', v_full_index_name),
                NOW()
            );
        EXCEPTION
            WHEN OTHERS THEN
                v_indexes_failed := v_indexes_failed + 1;
                INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                VALUES (
                    p_execution_id,
                    v_process_name,
                    ARRAY[p_kpi_name],
                    'error',
                    format('Error creating index %s: %s', v_full_index_name, SQLERRM),
                    NOW()
                );
        END;
    END LOOP;

    -- Log process completion
    INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
    VALUES (
        p_execution_id,
        v_process_name,
        ARRAY[p_kpi_name],
        'info',
        format('Index creation completed: %s created, %s failed', v_indexes_created, v_indexes_failed),
        NOW()
    );
END;
$$;