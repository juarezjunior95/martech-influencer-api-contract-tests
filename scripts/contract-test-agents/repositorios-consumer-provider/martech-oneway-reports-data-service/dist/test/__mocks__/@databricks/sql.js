"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSQLClient = exports.DBSQLParameter = void 0;
class DBSQLParameter {
    constructor(config) {
        this.value = config.value;
    }
}
exports.DBSQLParameter = DBSQLParameter;
class DBSQLClient {
    constructor() {
        this.connect = jest.fn();
        this.close = jest.fn();
    }
}
exports.DBSQLClient = DBSQLClient;
exports.default = {
    DBSQLClient,
    DBSQLParameter,
};
//# sourceMappingURL=sql.js.map