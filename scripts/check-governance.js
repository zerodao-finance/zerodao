'use strict';

const { createGetGasPrice } = require('ethers-polygongastracker');

const getGasPrice = createGetGasPrice();

const hre = require('hardhat');
const { BaseProvider } = hre.ethers.providers;

BaseProvider.prototype.getGasPrice = async () => {
  const p = await getGasPrice();
  return p.mul(15);
};

const main = async () => {

  const controller = await hre.ethers.getContract('ZeroController');
  console.log(await controller.setGovernance("0x4A423AB37d70c00e8faA375fEcC4577e3b376aCa"));
};

main().then(() => { console.log('done'); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); });
