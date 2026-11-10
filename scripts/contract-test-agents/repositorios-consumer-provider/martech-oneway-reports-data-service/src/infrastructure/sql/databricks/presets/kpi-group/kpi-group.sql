select  slv.kpi_group_name      as kpi_name,
        case
            when slv.kpi_group_name in ('category_health_full_years_start', 'category_health_full_years_end')
                then cast(year(gld.dt_limit_current) as string)    
        else RIGHT(cast(gld.dt_limit_current as string), 2) || '-' || LEFT(RIGHT(cast(gld.dt_limit_current as string), 5), 2) || '-' || LEFT(cast(gld.dt_limit_current as string), 4) end as time_frame
from silver_common.sharepoint_freeze_process_load_ctrl_slv slv
inner join gold_common.{{KPI_GROUP_TABLE}} gld
    on slv.datelimit_name = gld.datelimit_name
where slv.kpi_group_name is not null;
 