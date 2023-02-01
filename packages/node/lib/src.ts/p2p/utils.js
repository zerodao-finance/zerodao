"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function markAsValidator(p2p) {
}
function advertiseAsValidator(p2p) {
    p2p.pubsub.publish('zero.network.validator', {});
}
//# sourceMappingURL=utils.js.map