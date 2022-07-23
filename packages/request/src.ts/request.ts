import { ZeroP2P } from '@zerodao/p2p';
import peerId = require('peer-id');
import lp from 'it-length-prefixed';
import pipe from 'it-pipe';

export abstract class Request {
    static PROTOCOL = "/zero/1.1.0/dispatch";
    constructor() {

    }

    abstract serialize(): string;

    async publish(peer: ZeroP2P): Promise<void> {
        const request = this.serialize();

        if (peer.keepers.length === 0) {
            console.error(`Cannot publish request if no keepers are found`);
        }

        try {
            for (const keeper of peer.keepers) {
                try {
                    const _peerId = await peerId.createFromB58String(keeper);
                    const { stream } = await peer.dialProtocol(_peerId, this.constructor().PROTOCOL);
                    pipe(request, lp.encode(), stream.sink);
                    console.info(`Published request to ${keeper}. Waiting for keeper confirmation.`);
                } catch (e: any) {
                    console.error(`Failed dialing keeper: ${keeper} for txDispatch`);
                    console.error(e.stack);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

}