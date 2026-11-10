/**
 * Manual mock for @databricks/sql module
 * This mock is used in Jest tests to avoid loading native dependencies (lz4)
 */

export class DBSQLParameter {
  value: any;

  constructor(config: { value: any }) {
    this.value = config.value;
  }
}

export class DBSQLClient {
  connect = jest.fn();
  close = jest.fn();
}

export default {
  DBSQLClient,
  DBSQLParameter,
};
