"use strict";

// importing from node_modules for webpack: @libp2p
import { mplex } from "../../../node_modules/@libp2p/mplex/dist/src/index";
import { kadDHT } from "../../../node_modules/@libp2p/kad-dht/dist/src/index";
import { webRTCStar } from "../../../node_modules/@libp2p/webrtc-star/dist/src/index";
import crypto from "../../../node_modules/@libp2p/crypto/dist/src/index";
import { bootstrap } from "../../../node_modules/@libp2p/bootstrap/dist/src/index";

// importing from node_modules for webpack: libp2p
import type { Libp2pInit, Libp2pOptions } from "libp2p";
import * as RelayConstants from "../../../node_modules/libp2p/dist/src/circuit/constants";
import { Libp2pNode as Libp2p } from "../../../node_modules/libp2p/dist/src/libp2p";
import { validateConfig } from "../../../node_modules/libp2p/dist/src/config";

// importing from node_modules for webpack: @chainsafe
import { noise } from "../../../node_modules/@chainsafe/libp2p-noise/dist/src/index";
import { GossipSub } from "../../../node_modules/@chainsafe/libp2p-gossipsub/dist/src/index";

import { hexlify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/solidity";
import { Signer } from "@ethersproject/abstract-signer";

import PeerId from "peer-id";
import cryptico from "cryptico-js";
import globalObject from "the-global-object";
import { Buffer } from "buffer";
import { mapValues } from "lodash";
import base64url from "base64url";

import { createLogger, Logger } from "@zerodao/logger";
import { fromBufferToJSON } from "@zerodao/buffer";

const returnOp = (v) => v;
const logger = createLogger("@zerodao/p2p");

globalObject.Buffer = globalObject.Buffer || Buffer;

const mapToBuffers = (o) =>
  mapValues(o, (v) =>
    (base64url as any)(
      (v.toByteArray && Buffer.from(v.toByteArray())) ||
        Buffer.from(hexlify(v).substr(2), "hex")
    )
  );

const cryptoFromSeed = async function (seed) {
  const key = mapToBuffers(await cryptico.generateRSAKey(seed, 2048));
  key.dp = key.dmp1;
  key.dq = key.dmq1;
  key.qi = key.coeff;
  return crypto.keys.supportedKeys.rsa.unmarshalRsaPrivateKey(
    (
      new (crypto.keys.supportedKeys.rsa.RsaPrivateKey as any)(key, key) as any
    ).marshal()
  );
};

const coerceBuffersToHex = (v) => {
  if (v instanceof Uint8Array || Buffer.isBuffer(v)) return hexlify(v);
  if (Array.isArray(v)) return v.map(coerceBuffersToHex);
  if (typeof v === "object") {
    return Object.keys(v).reduce((r, key) => {
      r[key] = coerceBuffersToHex(v[key]);
      return r;
    }, {});
  }
  return v;
};

const coerceHexToBuffers = (v) => {
  if (typeof v === "string" && v.substr(0, 2) === "0x")
    return Buffer.from(v.substr(2), "hex");
  if (Array.isArray(v)) return v.map(coerceHexToBuffers);
  if (typeof v === "object") {
    return Object.keys(v).reduce((r, key) => {
      r[key] = coerceHexToBuffers(v[key]);
      return r;
    }, {});
  }
  return v;
};

interface ZeroP2POptions extends Libp2pOptions {
  multiaddr: "dev-mainnet" | "mainnet";
  signer: any;
}

export class ZeroP2P extends Libp2p {
  public _keepers: Array<string>;
  public logger: Logger;
  public signer: Signer;
  public addressPromise: Promise<string>;
  static PRESETS = {
    MAINNET: "/dns4/p2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/",
    "DEV-MAINNET": "/dns4/devp2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/",
  };
  static fromPresetOrMultiAddr(multiaddr) {
    return (
      this.PRESETS[(multiaddr || "").toUpperCase() || "MAINNET"] || multiaddr
    );
  }
  static toMessage(password) {
    return (
      "/zerop2p/1.0.0/" + keccak256(["string"], ["/zerop2p/1.0.0/" + password])
    );
  }
  static async peerIdFromSeed(seed) {
    return await PeerId.createFromPrivKey((await cryptoFromSeed(seed)).bytes);
  }
  static async fromSeed({ signer, seed, multiaddr }) {
    return new this({
      //@ts-ignore
      peerId: await this.peerIdFromSeed(seed),
      multiaddr,
      signer,
    });
  }
  static async fromPassword({ signer, multiaddr, password }) {
    return await this.fromSeed({
      signer,
      multiaddr,
      seed: await signer.signMessage(this.toMessage(password)),
    });
  }
  async start() {
    await super.start();
    //@ts-ignore
    this.pubsub.start();
  }
  setSigner(signer) {
    this.signer = signer;
    this.addressPromise = this.signer.getAddress();
  }

  constructor(options: ZeroP2POptions) {
    const multiaddr = ZeroP2P.fromPresetOrMultiAddr(
      options.multiaddr || "mainnet"
    );
    const opts: Libp2pInit = {
      ...validateConfig({
        peerId: options.peerId,
        connectionManager: {
          minConnections: 25,
        },
        relay: {
          enabled: true,
          advertise: {
            bootDelay: RelayConstants.ADVERTISE_BOOT_DELAY,
            enabled: false,
            ttl: RelayConstants.ADVERTISE_TTL,
          },
          hop: {
            enabled: false,
            active: false,
          },
          autoRelay: {
            enabled: false,
            maxListeners: 2,
          },
        },
        addresses: {
          listen: [multiaddr],
        },
        transports: [webRTCStar()],
        streamMuxers: [mplex()],
        connectionEncryption: [noise()],
        //@ts-ignore
        pubsub: [() => new GossipSub({ enabled: true, emitSelf: false })],
        dht: kadDHT({ kBucketSize: 20 }),
      }),
      peerDiscovery: [
        bootstrap({
          list: [multiaddr + "QmXRimgxFGd8FEFRX8FvyzTG4jJTJ5pwoa3N5YDCrytASu"],
        }),
        webRTCStar().discovery,
      ],
    };
    super(opts);
    this._keepers = [];
    this.logger = logger;
    this.logger.debug("listening on", multiaddr);
    this.setSigner(options.signer);
  }
  async subscribeKeepers() {
    await (this.pubsub as any).subscribe(
      "zero.keepers",
      async (message: any) => {
        const { data, from } = message;
        const { address } = fromBufferToJSON(data);
        if (!this._keepers.includes(from)) {
          this._keepers.push(from);
          //@ts-ignore
          this.emit("keeper:discovery", from);
        }
      }
    );
  }
  async unsubscribeKeepers() {
    await this.pubsub.unsubscribe("zero.keepers");
    this._keepers = [];
  }
}
