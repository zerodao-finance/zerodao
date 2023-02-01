"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Base Reactor handles incoming p2p messages
 * Base Reactor implements message filter and topic
 *
 */
class BaseReactor {
    constructor(p2p, service) {
        super();
        this.service = service;
        this.p2p = p2p;
    }
    addTopicHandler(topic, handler) {
        this.p2p.pubsub.subscribe(topic, handler);
        this.topicHandlers.add(topic);
    }
    removeTopicHandler(topic) {
        if (!topicHandlers.has(topic))
            return;
        this.p2p.pubsub.unsubscribe(topic);
        this.topicHandler.delete(topic);
    }
    addHandler(protocol, handler) {
        this.p2p.handle(protocol, handler);
        this.protocolHandlers.add(protocol);
    }
    removeHandler(protocol) {
        this.p2p.unhandle(protocol);
        this.protocolHandlers.delete(protocol);
    }
    findProviders(cid) {
        let providers = this.p2p.contentRouting.findProviders(cid);
        return providers;
    }
}
//# sourceMappingURL=reactor.js.map