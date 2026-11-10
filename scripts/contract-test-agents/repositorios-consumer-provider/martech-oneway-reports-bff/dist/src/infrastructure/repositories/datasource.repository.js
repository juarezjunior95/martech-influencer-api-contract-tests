"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DataRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRepository = void 0;
const common_1 = require("@nestjs/common");
const data_service_client_1 = require("../services/data-service.client");
const rxjs_1 = require("rxjs");
let DataRepository = DataRepository_1 = class DataRepository {
    constructor(dataServiceClient) {
        this.dataServiceClient = dataServiceClient;
        this.logger = new common_1.Logger(DataRepository_1.name);
    }
    async getData(datasource, filters) {
        try {
            const queryParams = this.convertFiltersToQueryParams(filters);
            const response = await (0, rxjs_1.firstValueFrom)(this.dataServiceClient.get(`/datasources/${datasource}`, queryParams));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get data from datasource '${datasource}': ${error.message}`);
            throw error;
        }
    }
    convertFiltersToQueryParams(filters) {
        if (!filters || filters.length === 0) {
            return {};
        }
        const queryParams = {};
        filters.forEach((filter) => {
            queryParams[`filter[${filter.name}]`] = filter.value;
        });
        return queryParams;
    }
};
exports.DataRepository = DataRepository;
exports.DataRepository = DataRepository = DataRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_service_client_1.DataServiceClient])
], DataRepository);
//# sourceMappingURL=datasource.repository.js.map