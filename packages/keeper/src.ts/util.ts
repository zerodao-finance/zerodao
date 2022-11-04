import { arrayify } from "@ethersproject/bytes";
import lp from "it-length-prefixed";
import pipe from "it-pipe";

const KEEPER_INTERVAL = 30000;

export function fromJSONtoBuffer(o) {
  return arrayify(Buffer.from(JSON.stringify(o), "utf8"));
}

import { createLogger } from "@zerodao/logger";
const logger = createLogger(require("../package").name);

export async function advertiseAsKeeper(p2p) {
  const interval = setInterval(async () => {
    try {
      await p2p.pubsub.publish(
        "zero.keepers",
        fromJSONtoBuffer({ address: await p2p.addressPromise })
      );
    } catch (e) {
      console.error(e);
    }
  }, KEEPER_INTERVAL);
  return function unsubscribe() {
    clearInterval(interval);
  };
}

export async function pipeToString(stream) {
  return await new Promise((resolve, reject) => {
    pipe(stream.source, lp.decode(), async (rawData) => {
      const string = [];
      try {
        for await (const msg of rawData) {
          string.push(msg.toString());
        }
      } catch (e) {
        return reject(e);
      }
      resolve(string.join(""));
    });
  });
}

export async function pipeToBuffer(stream) {
  return await new Promise((resolve, reject) => {
    pipe(stream.source, lp.decode(), async (rawData) => {
      const buffers = [];
      try {
        for await (const msg of rawData) {
          buffers.push(msg);
        }
      } catch (e) {
        return reject(e);
      }
      resolve(Buffer.concat(buffers.map((v) => Buffer.from(v))));
    });
  });
}

export function handleRequestsV1(p2p) {
  p2p.handle("/zero/1.1.0/dispatch", async (duplex) => {
    try {
      p2p.emit("zero:request:1.1.0", await pipeToString(duplex.stream));
    } catch (e) {
      p2p.emit("error", e);
    }
  });
}

export function handleRequestsV2(p2p) {
  p2p.handle("/zero/2.0.0/dispatch", async (duplex) => {
    try {
      p2p.emit("zero:request:2.0.0", await pipeToString(duplex.stream));
    } catch (e) {
      p2p.emit("error", e);
    }
  });
}

export function handleRequestsV21(p2p) {
  p2p.handle("/zero/2.1.0/dispatch", async (duplex) => {
    try {
      p2p.emit("zero:request:2.1.0", await pipeToBuffer(duplex.stream));
    } catch (e) {
      p2p.emit("error", e);
    }
  });
}

export function serializeToJSON(request) {
  return JSON.stringify(request.constructor.FIELDS.reduce((r, v) => {
    r[v] = request[v];
    return r;
  }, {}));
}
