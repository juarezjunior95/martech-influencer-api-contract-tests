-- Stored Procedure: sp_replace_tlh_kpis_agg_partition
-- Description: Replace partitions from shadow table to main table and removes the old ones
-- Purpose: Post-step after inserting data in the ETL process
-- 
-- Usage: 
--   CALL sp_replace_tlh_kpis_agg_partition(ARRAY['brand_awareness', 'market_share', 'customer_satisfaction']);
--   CALL sp_replace_tlh_kpis_agg_partition(ARRAY['brand_awareness']);
-- 
-- This procedure must be called AFTER inserting data into the shadow table.
-- Data can be inserted into the default partition (tlh_kpis_agg_shadow_default) without needing to prepare partitions.
-- For each kpi_name, it:
-- STEP 0: Checks if shadow partition exists - if yes, uses it; if no, creates it from default partition data
-- STEP 1: Detaches and renames the old partition from main table to "old" (if exists)
-- STEP 2: Creates indexes on the shadow partition using sp_create_tlh_kpis_agg_shadow_partition_indexes
-- STEP 3: Detaches the partition from the shadow table
-- STEP 4: Renames the shadow table to the main partition name
-- STEP 5: Attaches the new partition to the main table
-- STEP 6: Drops the old partition
-- STEP 7: Prepares the partition in shadow table for the next ETL cycle (for performance)
-- 

CREATE OR REPLACE PROCEDURE sp_replace_tlh_kpis_agg_partition(
    p_kpi_names TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_kpi_name TEXT;
    v_partition_name_shadow TEXT;
    v_partition_name_main TEXT;
    v_partition_name_old TEXT;
    v_old_partition_exists BOOLEAN;
    v_count INTEGER := 0;
    v_error_count INTEGER := 0;
    v_process_name TEXT := 'sp_replace_tlh_kpis_agg_partition';
    v_execution_id UUID;
BEGIN
    -- Generate unique execution ID for this procedure run
    v_execution_id := gen_random_uuid();

    -- Validation: array cannot be NULL or empty
    IF p_kpi_names IS NULL OR array_length(p_kpi_names, 1) IS NULL THEN
        INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
        VALUES (
            v_execution_id,
            v_process_name,
            NULL,
            'error',
            'List of kpi_names cannot be NULL or empty',
            NOW()
        );
        RETURN;
    END IF;

    -- Log process start
    INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
    VALUES (
        v_execution_id,
        v_process_name,
        p_kpi_names,
        'info',
        format('Starting replacement of %s partition(s) from shadow table to main table', array_length(p_kpi_names, 1)),
        NOW()
    );

    -- Iterate over each kpi_name in the list
    FOREACH v_kpi_name IN ARRAY p_kpi_names
    LOOP
        -- Validation: kpi_name cannot be NULL or empty
        IF v_kpi_name IS NULL OR TRIM(v_kpi_name) = '' THEN
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                NULL,
                'error',
                format('Empty or NULL kpi_name ignored at position %s', v_count + 1),
                NOW()
            );
            CONTINUE;
        END IF;

        -- Validate kpi_name format: must contain only lowercase letters (a-z), numbers (0-9), and underscores (_)
        -- This ensures the partition name follows PostgreSQL naming conventions and is safe to use in identifiers
        IF v_kpi_name !~ '^[a-z0-9_]+$' THEN
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                ARRAY[v_kpi_name],
                'error',
                format('Invalid kpi_name format: %s. kpi_names must contain only lowercase letters (a-z), numbers (0-9), and underscores (_). Example: "brand_awareness"', v_kpi_name),
                NOW()
            );
            v_error_count := v_error_count + 1;
            CONTINUE;
        END IF;

        -- Partition names
        v_partition_name_shadow := 'tlh_kpis_agg_shadow_' || v_kpi_name;
        v_partition_name_main := 'tlh_kpis_agg_' || v_kpi_name;
        v_partition_name_old := 'tlh_kpis_agg_old_' || v_kpi_name;

        -- Process each kpi_name partition
        BEGIN
            -- STEP 0: Check if shadow partition exists, if not create from default partition
            DECLARE
                v_specific_partition_exists BOOLEAN;
                v_has_data BOOLEAN;
            BEGIN
                -- Check if specific partition exists
                v_specific_partition_exists := EXISTS (
                    SELECT 1
                    FROM pg_tables
                    WHERE schemaname = current_schema()
                    AND tablename = v_partition_name_shadow
                );

                -- If shadow partition exists, use it
                IF v_specific_partition_exists THEN
                    INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                    VALUES (
                        v_execution_id,
                        v_process_name,
                        ARRAY[v_kpi_name],
                        'info',
                        format('Using existing shadow partition: %s', v_partition_name_shadow),
                        NOW()
                    );
                ELSE
                    -- Check if data exists in default partition
                    EXECUTE format(
                        'SELECT EXISTS(SELECT 1 FROM tlh_kpis_agg_shadow_default WHERE kpi_name = %L)',
                        v_kpi_name
                    ) INTO v_has_data;

                    -- Create partition from default partition data if data exists
                    IF v_has_data THEN
                        DECLARE
                            v_temp_table_name TEXT;
                        BEGIN
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                format('Creating shadow partition from default partition'),
                                NOW()
                            );

                            -- Create temporary table name following shadow table naming pattern
                            v_temp_table_name := 'temp_tlh_kpis_agg_shadow_' || v_kpi_name;

                            -- STEP 0.1: Create temporary table without indexes for better insert performance
                            EXECUTE format(
                                'CREATE TEMP TABLE %I (LIKE tlh_kpis_agg_shadow_default EXCLUDING INDEXES)',
                                v_temp_table_name
                            );
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                format('Temporary table created: %s', v_temp_table_name),
                                NOW()
                            );

                            -- STEP 0.2: Move data from default partition to temporary table
                            EXECUTE format(
                                'INSERT INTO %I SELECT * FROM tlh_kpis_agg_shadow_default WHERE kpi_name = %L',
                                v_temp_table_name,
                                v_kpi_name
                            );
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                'Moved data from default partition to temporary table',
                                NOW()
                            );

                            -- STEP 0.3: Delete data from default partition
                            EXECUTE format(
                                'DELETE FROM tlh_kpis_agg_shadow_default WHERE kpi_name = %L',
                                v_kpi_name
                            );
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                'Deleted data from default partition',
                                NOW()
                            );

                            -- STEP 0.4: Create the specific partition empty
                            EXECUTE format(
                                'CREATE TABLE IF NOT EXISTS %I PARTITION OF tlh_kpis_agg_shadow FOR VALUES IN (%L)',
                                v_partition_name_shadow,
                                v_kpi_name
                            );
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                format('Created empty shadow partition: %s', v_partition_name_shadow),
                                NOW()
                            );

                            -- STEP 0.5: Insert data from temporary table to new partition
                            EXECUTE format(
                                'INSERT INTO %I SELECT * FROM %I',
                                v_partition_name_shadow,
                                v_temp_table_name
                            );
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                'Inserted data from temporary table to shadow partition',
                                NOW()
                            );

                            -- STEP 0.6: Drop temporary table
                            EXECUTE format('DROP TABLE %I', v_temp_table_name);
                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                format('Dropped temporary table: %s', v_temp_table_name),
                                NOW()
                            );

                            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                            VALUES (
                                v_execution_id,
                                v_process_name,
                                ARRAY[v_kpi_name],
                                'info',
                                format('Shadow partition created from default partition and data cleaned'),
                                NOW()
                            );
                        END;
                    ELSE
                        -- No partition and no data - create empty partition to allow process to continue
                        INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                        VALUES (
                            v_execution_id,
                            v_process_name,
                            ARRAY[v_kpi_name],
                            'info',
                            format('Creating empty shadow partition: %s (no data found in default partition)', v_partition_name_shadow),
                            NOW()
                        );

                        -- Create empty partition to allow the process to continue normally
                        EXECUTE format(
                            'CREATE TABLE IF NOT EXISTS %I PARTITION OF tlh_kpis_agg_shadow FOR VALUES IN (%L)',
                            v_partition_name_shadow,
                            v_kpi_name
                        );

                        INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                        VALUES (
                            v_execution_id,
                            v_process_name,
                            ARRAY[v_kpi_name],
                            'info',
                            format('Empty shadow partition created: %s', v_partition_name_shadow),
                            NOW()
                        );
                    END IF;
                END IF;
            END;

            -- Check if old partition exists in main table
            v_old_partition_exists := EXISTS (
                SELECT 1 
                FROM pg_tables 
                WHERE schemaname = current_schema()
                AND tablename = v_partition_name_main
            );

            -- STEP 1: Detach and rename old partition from main table (if exists)
            -- This approach minimizes lock time on the main table
            IF v_old_partition_exists THEN
                -- Detach old partition from main table
                EXECUTE format(
                    'ALTER TABLE tlh_kpis_agg DETACH PARTITION %I',
                    v_partition_name_main
                );
                INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                VALUES (
                    v_execution_id,
                    v_process_name,
                    ARRAY[v_kpi_name],
                    'info',
                    format('Old partition detached from main table: %s', v_partition_name_main),
                    NOW()
                );

                -- Rename old partition to "old" suffix
                -- After DETACH, the table is independent and can be renamed without affecting main table
                EXECUTE format(
                    'ALTER TABLE %I RENAME TO %I',
                    v_partition_name_main,
                    v_partition_name_old
                );
                INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                VALUES (
                    v_execution_id,
                    v_process_name,
                    ARRAY[v_kpi_name],
                    'info',
                    format('Old partition renamed to: %s', v_partition_name_old),
                    NOW()
                );
            END IF;

            -- STEP 2: Create indexes on shadow partition before detaching
            -- Calls the helper procedure to create indexes
            CALL sp_create_tlh_kpis_agg_shadow_partition_indexes(
                v_kpi_name,
                v_execution_id
            );

            -- STEP 3: Detach partition from shadow table before attaching to main
            -- This is necessary because a table cannot be a partition of two tables at the same time
            EXECUTE format(
                'ALTER TABLE tlh_kpis_agg_shadow DETACH PARTITION %I',
                v_partition_name_shadow
            );
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                ARRAY[v_kpi_name],
                'info',
                format('Partition detached from shadow table: %s', v_partition_name_shadow),
                NOW()
            );

            -- STEP 4: Rename the shadow table to the main partition name
            -- After DETACH, the table becomes independent and can be renamed
            EXECUTE format(
                'ALTER TABLE %I RENAME TO %I',
                v_partition_name_shadow,
                v_partition_name_main
            );
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                ARRAY[v_kpi_name],
                'info',
                format('Partition renamed to: %s', v_partition_name_main),
                NOW()
            );

            -- STEP 5: Attach new partition to main table
            EXECUTE format(
                'ALTER TABLE tlh_kpis_agg ATTACH PARTITION %I FOR VALUES IN (%L)',
                v_partition_name_main,
                v_kpi_name
            );
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                ARRAY[v_kpi_name],
                'info',
                format('Partition attached to main table: %s', v_partition_name_main),
                NOW()
            );

            -- STEP 6: Drop the old partition (now independent, no lock on main table)
            -- This DROP is safe because the table is no longer attached to the main table
            IF v_old_partition_exists THEN
                EXECUTE format('DROP TABLE IF EXISTS %I', v_partition_name_old);
                INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                VALUES (
                    v_execution_id,
                    v_process_name,
                    ARRAY[v_kpi_name],
                    'info',
                    format('Old partition dropped: %s', v_partition_name_old),
                    NOW()
                );
            END IF;

            -- STEP 7: Prepare the partition in shadow table for the next ETL cycle
            -- This ensures the next replace operation will be performatic (partition already exists)
            -- Create empty partition if it doesn't exist
            EXECUTE format(
                'CREATE TABLE IF NOT EXISTS %I PARTITION OF tlh_kpis_agg_shadow FOR VALUES IN (%L)',
                v_partition_name_shadow,
                v_kpi_name
            );
            INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
            VALUES (
                v_execution_id,
                v_process_name,
                ARRAY[v_kpi_name],
                'info',
                format('Partition prepared in shadow table: %s', v_partition_name_shadow),
                NOW()
            );

            v_count := v_count + 1;

        EXCEPTION
            WHEN OTHERS THEN
                INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
                VALUES (
                    v_execution_id,
                    v_process_name,
                    ARRAY[v_kpi_name],
                    'error',
                    format('Error replacing partition %s: %s', v_partition_name_main, SQLERRM),
                    NOW()
                );
                v_error_count := v_error_count + 1;
        END;
    END LOOP;

    -- Log process completion
    INSERT INTO tlh_kpis_agg_logs (execution_id, process_name, kpi_names, status, message, created_at)
    VALUES (
        v_execution_id,
        v_process_name,
        p_kpi_names,
        'info',
        format('Process completed: %s partition(s) replaced successfully, %s error(s)', v_count, v_error_count),
        NOW()
    );
END;
$$;