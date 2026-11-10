"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidacaoParametrosPipe = void 0;
const common_1 = require("@nestjs/common");
class ValidacaoParametrosPipe {
    transform(value, metadata) {
        if (!value) {
            throw new common_1.BadRequestException(`O valor do parametro ${metadata.data} deve ser informado`);
        }
        return value;
    }
}
exports.ValidacaoParametrosPipe = ValidacaoParametrosPipe;
//# sourceMappingURL=validation-param.pipe.js.map