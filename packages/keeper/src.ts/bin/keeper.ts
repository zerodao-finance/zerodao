const { ZeroP2P } = require('@zerodao/p2p');
const { advertiseAsKeeper, handleRequests } = require('../lib/keeper');
const Redis = require('ioredis');
const redis = new Redis()
// const redis = require('ioredis')(process.env.REDIS_URI);
import { ethers } from 'ethers';

const RPC_ENDPOINTS = {
  ARBITRUM: 'https://arb1.arbitrum.io/rpc',
  MATIC: 'https://polygon-mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2',
  ETHEREUM: 'https://mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2',
  AVALANCHE: '',
  local: 'http://localhost:8545'
};

const packageJson = require('../package');
const util = require('util');
const { createLogger } = require('@zerodao/logger');

const logger = createLogger(packageJson.name);

const CONTROLLER_DEPLOYMENTS = {
  "0x9880fCd5d42e8F4c2148f2c1187Df050BE3Dbd17": 42161,
  "0x951E0dDe1fbe4AD1E9C027F46b653BAD2D99828d": 137,
  "0xa8BD3FfEbF92538b3b830DD5B2516A5111DB164D": 1,
  "0x1ec2Abe3F25F5d48567833Bf913f030Ec7a948Ba": 43114
};

const getChainId = (request) => {
  return CONTROLLER_DEPLOYMENTS[ethers.utils.getAddress(request.contractAddress)] || (() => { throw Error('no controller found: ' + request.contractAddress); })();
};


const encodeBurnRequest = (request) => {
  const contractInterface = new ethers.utils.Interface(['function burn(address, address, uint256, uint256, bytes, bytes, bytes)']);
  return contractInterface.encodeFunctionData('burn', [request.owner, request.asset, request.amount, request.deadline, request.data, request.destination, request.signature ]);
};

(async () => {
  logger.info("keeper process started")
  const signer = new ethers.Wallet(process.env.WALLET as any).connect(new ethers.providers.InfuraProvider('mainnet', RPC_ENDPOINTS.ETHEREUM));
  console.log(process.env.SIGNALLING_SERVER)
  const peer = await ZeroP2P.fromPassword({
    signer,
    password: await signer.getAddress(), 
    multiaddr: process.env.SIGNALLING_SERVER || "MAINNET"
  })
  
  await peer.start()
  handleRequests(peer);
  peer.on('peer:discovery', (peerInfo) => {
    logger.info('peer:discovery');
    logger.info(JSON.stringify(peerInfo, null, 2));
  });
  peer.on('zero:request', async (data) => {
    try {
      const request = JSON.parse(data);
      logger.info(util.inspect(request, { colors: true, depth: 2 }));
      if (typeof request.destination === 'string') {
        await redis.lpush('/zero/dispatch', JSON.stringify({
          to: ethers.utils.getAddress(request.contractAddress),
          chainId: getChainId(request),
          data: encodeBurnRequest(request),
        }, null, 2));
      } else {
        await redis.lpush('/zero/pending', JSON.stringify(request, null, 2));
      }
      await redis.lpush('/zero/request', data);
    } catch (e) {
      console.error(e);
    }
  });
  peer.on('error', logger.error.bind(logger));
  advertiseAsKeeper(peer);
})().catch(logger.error.bind(logger));
	
