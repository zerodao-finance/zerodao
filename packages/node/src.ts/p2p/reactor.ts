import { EventEmitter } from "events";
/*
 * Base Reactor handles incoming p2p messages
 * Base Reactor implements message filter and topic
 *
 */

abstract class BaseReactor implements EventEmitter {
	topicHandlers: Set; 
	protocolHandler: Set;
	p2p: ZeroP2P;
	service: unknown;

	constructor(p2p: ZeroP2P, service: unknown) {
		super();
		this.service = service;
		this.p2p = p2p;
	}

	addTopicHandler( topic: string, handler: any ) {
		this.p2p.pubsub.subscribe(topic, handler);
		this.topicHandlers.add(topic);
	}

	removeTopicHandler( topic: string ) {
		if (!topicHandlers.has(topic)) return;
		this.p2p.pubsub.unsubscribe(topic);
		this.topicHandler.delete(topic);
	}

	addHandler(protocol: string, handler: any) {
		this.p2p.handle(protocol, handler);				
		this.protocolHandlers.add(protocol);
	}

	removeHandler(protocol: string) {
		this.p2p.unhandle(protocol);
		this.protocolHandlers.delete(protocol);
	}

	findProviders (cid: string) {
		let providers = this.p2p.contentRouting.findProviders(cid);
		return providers;
	}

}
