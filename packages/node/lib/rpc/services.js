"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = void 0;
function createService(handler, impl) {
    return [handler, function (call, callback) { }, {
            callback() { },
        }(message), {
            return: impl()
        }];
}
exports.createService = createService;
;
//# sourceMappingURL=services.js.map