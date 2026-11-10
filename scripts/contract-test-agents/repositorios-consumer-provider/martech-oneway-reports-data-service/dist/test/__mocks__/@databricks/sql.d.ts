export declare class DBSQLParameter {
    value: any;
    constructor(config: {
        value: any;
    });
}
export declare class DBSQLClient {
    connect: jest.Mock<any, any, any>;
    close: jest.Mock<any, any, any>;
}
declare const _default: {
    DBSQLClient: typeof DBSQLClient;
    DBSQLParameter: typeof DBSQLParameter;
};
export default _default;
