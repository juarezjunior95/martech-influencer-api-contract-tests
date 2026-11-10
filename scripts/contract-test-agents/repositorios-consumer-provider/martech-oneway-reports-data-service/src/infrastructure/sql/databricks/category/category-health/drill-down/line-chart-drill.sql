/*Category Health - Drill Down - Line Charts*/
WITH CTE_BASE_ABI AS (
SELECT
	*,
	CASE
		WHEN kpi_name = 'p4w' THEN LEVEL_4
		ELSE LEVEL_1
	END AS CATEGORY
FROM
	{{KPI_TABLE}}
WHERE
	1 = 1
	AND CASE
		:viewtype
WHEN 'country' THEN VERSION_ID IN (1, 1001)
		WHEN 'global' THEN VERSION_ID IN (2, 1002)
		WHEN 'zone' THEN VERSION_ID IN (18, 1018)
	END
	AND MONTH(DT_INI) = 1
	AND MONTH(DT_END) = 12
	AND kpi_name IN ('cat_health_volume', 'cat_health_icl', 'cat_health_sot', 'wmtbb', 'p4w', 'lda_size')
	AND CASE
		WHEN kpi_name = 'p4w' THEN
(LEVEL_1 = 'N/A'
			AND LEVEL_2 = 'N/A'
			AND LEVEL_3 = 'N/A'
			AND LEVEL_4 IN ('Beer', 'Beyond Beer', 'Beer + Beyond Beer'))
		WHEN kpi_name = 'lda_size' THEN
(LEVEL_1 = 'N/A')
		ELSE LEVEL_1 IN ('Beer', 'Beyond Beer', 'Beer + Beyond Beer', 'Spirits', 'Wine')
	END
	AND COUNTRY_ISO_CODE_3 = :country
),

CTE_WITH_PREV AS (
SELECT
	*,
	LAG(AC) OVER (
PARTITION BY COUNTRY_ISO_CODE_3,
	KPI_NAME,
	CATEGORY,
	VERSION_ID
ORDER BY
	DT_INI
) AS PREV_YEAR_AC
FROM
	CTE_BASE_ABI
)
SELECT
	DT_INI,
	DT_END,
	ABI_ZONE,
	COUNTRY_ISO_CODE_3,
	AC,
	-- vs LY: show NULL ("-") when either current or prior year lacks real data for the category
CASE
		WHEN AC = 0
		OR PREV_YEAR_AC IS NULL
		OR PREV_YEAR_AC = 0 THEN NULL
		ELSE AC_VS_LY
	END AS AC_VS_LY,
	UNIT_OF_MEASURE,
	COMP_UNIT_OF_MEASURE,
	CATEGORY,
	KPI_NAME
FROM
	CTE_WITH_PREV
WHERE
	1 = 1
	-- Filtro de KPI_NAME baseado no parâmetro :kpi_name
	AND CASE
		:kpi_name
WHEN 'volume' THEN KPI_NAME IN ('cat_health_volume', 'cat_health_icl', 'lda_size')
		WHEN 'icl' THEN KPI_NAME IN ('cat_health_icl')
		WHEN 'sot' THEN KPI_NAME IN ('cat_health_sot')
		WHEN 'participation' THEN KPI_NAME IN ('p4w')
		WHEN 'wmtbb' THEN KPI_NAME IN ('wmtbb')
		ELSE FALSE
	END
	-- Filtro de CATEGORY por KPI_NAME
	AND CASE
		-- Para 'cat_health_sot': NÃO aplica filtro de categoria
WHEN KPI_NAME = 'cat_health_sot'
		AND :category in ('Beer', 'Beyond Beer') THEN TRUE
		WHEN KPI_NAME = 'cat_health_sot'
		AND :category = 'Beer + Beyond Beer' THEN CATEGORY IN ('Beer + Beyond Beer', 'Spirits', 'Wine')
		-- Para 'wmtbb' com category 'Beer': CATEGORY deve ser 'N/A'
		WHEN KPI_NAME = 'wmtbb'
		AND :category = 'Beer' THEN CATEGORY = 'Beer'
		-- Para 'wmtbb' com outras categorias: não retorna resultado
		WHEN KPI_NAME = 'wmtbb'
		AND :category != 'Beer' THEN FALSE
		-- Para 'cat_health_volume', 'cat_health_icl', 'lda_size' (usa LEVEL_1/CATEGORY)
		WHEN KPI_NAME IN ('cat_health_volume', 'cat_health_icl')
		AND :category = 'Beer' THEN CATEGORY = 'Beer'
		WHEN KPI_NAME IN ('cat_health_volume', 'cat_health_icl')
		AND :category = 'Beyond Beer' THEN CATEGORY = 'Beyond Beer'
		WHEN KPI_NAME IN ('cat_health_volume', 'cat_health_icl')
		AND :category = 'Beer + Beyond Beer' THEN CATEGORY IN ('Beer + Beyond Beer')
		WHEN KPI_NAME IN ('lda_size') THEN CATEGORY = 'N/A'
		-- Para 'p4w' (usa LEVEL_4/CATEGORY)
		WHEN KPI_NAME = 'p4w'
		AND :category = 'Beer' THEN CATEGORY = 'Beer'
		WHEN KPI_NAME = 'p4w'
		AND :category = 'Beyond Beer' THEN CATEGORY = 'Beyond Beer'
		WHEN KPI_NAME = 'p4w'
		AND :category = 'Beer + Beyond Beer' THEN CATEGORY IN ('Beer + Beyond Beer')
		ELSE FALSE
	END
ORDER BY
	CASE
		kpi_name
WHEN 'cat_health_volume' THEN 1
		WHEN 'cat_health_icl' THEN 2
		WHEN 'lda_size' THEN 3
		WHEN 'cat_health_sot' THEN 4
		WHEN 'p4w' THEN 5
		WHEN 'wmtbb' THEN 6
		ELSE 7
	END,
	DT_INI,
	DT_END,
	CATEGORY
;