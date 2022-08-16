"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedFrom = void 0;
function cachedFrom(fn) {
    const cache = new Map();
    return function (v) {
        if (cache.has(v))
            return cache.get(v);
        const result = fn(v);
        cache.set(v, result);
        return result;
    };
}
exports.cachedFrom = cachedFrom;
//# sourceMappingURL=cache.js.map