"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = require("winston");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return winston_1.Logger; } });
const createLogger = (userType) => (0, winston_1.createLogger)({
    level: process?.env.NODE_ENV === 'test' || process?.env.REACT_APP_TEST ? 'debug' : 'info',
    defaultMeta: {
        service: userType ?? 'zero.user',
    },
    transports: [new winston_1.transports.Console()],
});
exports.default = createLogger;
//# sourceMappingURL=index.js.map