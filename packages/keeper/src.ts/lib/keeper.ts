import { ethers } from 'ethers'

const KEEPER_INTERVAL = 30000;

function fromJSONtoBuffer(o) {
  return ethers.utils.arrayify(Buffer.from(JSON.stringify(o), 'utf8'));
}

const { createLogger } = require('@zerodao/logger');
const logger = createLogger(require('../package').name);

export const advertiseAsKeeper = async (p2p) => {
  const interval = setInterval(async () => {
    try {
      await p2p.pubsub.publish('zero.keepers', fromJSONtoBuffer({ address: (await p2p.addressPromise) }));
    } catch (e) { console.error(e); }
  }, KEEPER_INTERVAL);
  return function unsubscribe() { clearInterval(interval) };
};
const lp = require('it-length-prefixed');
const pipe = require('it-pipe');

const pipeToString = async (stream) => {
  return await new Promise((resolve, reject) => {
    pipe(stream.source, lp.decode(), async (rawData) => {
      const string: string[] = [];
      try {
        for await (const msg of rawData) {
          string.push(msg.toString());
        }
      } catch (e) { return reject(e); }
      resolve(string.join(''));
    });
  });
};

export const handleRequests = (p2p) => {
   p2p.handle('/zero/1.1.0/dispatch', async (duplex) => {
    try { 
      p2p.emit('zero:request', (await pipeToString(duplex.stream)));
    } catch (e) { p2p.emit('error', e); }
   });
};

