-- Simple Postgres test with parameters
-- Parameters: $viewtype, $page_filter, $zone, $country, $dt_end
SELECT 
    'Postgres OK' as status,
    NOW() as timestamp,
    $viewtype as viewtype,
    $page_filter as page_filter,
    $zone as zone,
    $country as country,
    $dt_end as dt_end;
