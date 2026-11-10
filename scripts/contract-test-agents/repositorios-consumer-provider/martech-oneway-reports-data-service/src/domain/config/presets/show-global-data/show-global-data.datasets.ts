import {
  DataItem,
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION,
  SHOW_GLOBAL_DATA_SUBJECTS,
  ShowGlobalDataKpi,
  showGlobalDatasetIdForSubject,
} from "@domain/config/presets/show-global-data/show-global-data.types";

const OWR_RESULT_QUERY_SP = "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";

/**
 * Mirrors {@link EnvironmentConfigService.env} (`NODE_ENV` with default `production`).
 * Preset handlers are instantiated outside Nest DI, so this repeats the same contract.
 */
function nodeEnv(): string {
  return process.env.NODE_ENV ?? "production";
}

/** Active Databricks column for show-global flags (MARTLH-12326). */
export function showGlobalDataFlagColumn(): "flag_uat" | "flag_prd" {
  return nodeEnv() === "uat" ? "flag_uat" : "flag_prd";
}

function subjectProcedureConfig(
  subject: ShowGlobalDataKpi,
): DeltalakeFetchDataConfig {
  return {
    type: RepositoryType.deltalake,
    executionType: DeltalakeExecutionType.procedure,
    procedure: `
        CALL ${OWR_RESULT_QUERY_SP}(
          '${SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION}',
          '{"subject": "${subject}"}'
        );
      `,
  };
}

/** One Databricks dataset config for a fixed `subject` (pos | power). */
export function buildShowGlobalDataDatasetConfig(
  subject: ShowGlobalDataKpi,
): DatasetConfig {
  return {
    id: showGlobalDatasetIdForSubject(subject),
    config: subjectProcedureConfig(subject),
  };
}

/** Distinct dataset configs for the given KPI subjects (stable order: pos before power). */
export function collectShowGlobalDataDatasetConfigs(
  subjects: Iterable<ShowGlobalDataKpi>,
): DatasetConfig[] {
  const seen = new Set<ShowGlobalDataKpi>();
  const order: ShowGlobalDataKpi[] = [];
  for (const s of subjects) {
    if (!seen.has(s)) {
      seen.add(s);
      order.push(s);
    }
  }
  const rank = (a: ShowGlobalDataKpi, b: ShowGlobalDataKpi) =>
    SHOW_GLOBAL_DATA_SUBJECTS.indexOf(a) - SHOW_GLOBAL_DATA_SUBJECTS.indexOf(b);
  order.sort(rank);
  return order.map((subject) => buildShowGlobalDataDatasetConfig(subject));
}

/**
 * Reads a cell from a Databricks row ({@link DataItem}), matching column name
 * case-insensitively when needed.
 */
function readRowValue(
  row: DataItem,
  canonicalKey: string,
): DataItem[string] | undefined {
  if (Object.prototype.hasOwnProperty.call(row, canonicalKey)) {
    return row[canonicalKey];
  }
  const target = canonicalKey.toLowerCase();
  for (const k of Object.keys(row)) {
    if (k.toLowerCase() === target) {
      return row[k];
    }
  }
  return undefined;
}

/** Databricks returns only `y` or `n` for show-global flags. */
function coerceYn(value: unknown): boolean | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const t = value.trim().toLowerCase();
  if (t === "y") {
    return true;
  }
  if (t === "n") {
    return false;
  }
  return undefined;
}

/**
 * Whether global data is enabled for `subject` in the current env column
 * (`flag_uat` vs `flag_prd`). Missing or empty dataset → `false`.
 */
export function hasGlobalDataForSubject(
  datasets: Dataset[] | undefined,
  subject: ShowGlobalDataKpi,
): boolean {
  const id = showGlobalDatasetIdForSubject(subject);
  const dataset = datasets?.find((d) => d.id === id);
  const head = dataset?.data?.[0];
  if (!head) {
    return false;
  }

  const flagKey = showGlobalDataFlagColumn();
  const rawFlag = readRowValue(head, flagKey);
  return coerceYn(rawFlag) ?? false;
}
