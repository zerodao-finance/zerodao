'use strict';
const libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const WS = require('libp2p-websockets');
const Mplex = require('libp2p-mplex');
const SECIO = require('libp2p-secio');
const KadDHT = require('libp2p-kad-dht');
const Bootstrap = require('libp2p-bootstrap');
const PeerInfo = require('peer-info');
const GossipSub = require('libp2p-gossipsub');
const WStar = require('libp2p-webrtc-star');
const isBrowser = require('is-browser');
const returnOp = (v) => v;
const presets = {
    lendnet: '/dns4/lendnet.0confirmation.com/tcp/443/wss/p2p-webrtc-star/',
    zeronet: '/dns4/zeronet.0confirmation.com/tcp/443/wss/p2p-webrtc-star/'
};
const fromPresetOrMultiAddr = (multiaddr) => presets[multiaddr] || multiaddr;
const wrtc = require('wrtc');
module.exports = {
    createNode: async (options) => {
        const peerInfo = options.peerInfo || await PeerInfo.create();
        const multiaddr = fromPresetOrMultiAddr(options.multiaddr);
        peerInfo.multiaddrs.add(multiaddr);
        const dhtEnable = typeof options.dht === 'undefined' || options.dht === true;
        const socket = await libp2p.create({
            peerInfo,
            modules: {
                transport: [TCP, WS, WStar],
                streamMuxer: [Mplex],
                connEncryption: [SECIO],
                pubsub: GossipSub,
                peerDiscovery: [Bootstrap],
                dht: dhtEnable ? KadDHT : undefined
            },
            config: {
                peerDiscovery: {
                    bootstrap: {
                        enabled: true,
                        list: [options.multiaddr + '/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64']
                    }
                },
                transport: {
                    [WStar.prototype[Symbol.toStringTag]]: {
                        upgrader: {
                            localPeer: peerInfo.id,
                            upgradeInbound: returnOp,
                            upgradeOutbound: returnOp
                        },
                        wrtc: isBrowser ? undefined : wrtc
                    }
                },
                dht: {
                    enabled: dhtEnable,
                    kBucketSize: 20
                },
                pubsub: {
                    enabled: true,
                    emitSelf: false
                }
            }
        });
        await socket.start();
        socket.pubsub.start();
        socket.multiaddr = multiaddr;
        return socket;
    },
};
//# sourceMappingURL=node.js.map