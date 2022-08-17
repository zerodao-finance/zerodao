"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.createLogger = void 0;
require("setimmediate");
const winston_1 = require("winston");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return winston_1.Logger; } });
const customLevels = {
    error: 0,
    warn: 1,
    data: 2,
    info: 3,
    debug: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
};
const customColors = {
    error: 'red',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    debug: 'red',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'blue',
};
const createLogger = (userType) => {
    (0, winston_1.addColors)(customColors);
    const logger = (0, winston_1.createLogger)({
        defaultMeta: {
            service: userType ?? "zero.user",
        },
        levels: customLevels,
        transports: [new winston_1.transports.Console({
                level: 'verbose',
                format: winston_1.format.combine(winston_1.format.colorize({
                    all: true,
                }), winston_1.format.splat(), winston_1.format.simple())
            })],
    });
    return logger;
};
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map