import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { SZERO, ZERO } from "../typechain-types";
import { ethers as _ethers } from "ethers";
import path from "path";
import fs from 'fs';
import { useMerkleGenerator } from "../merkle/use-merkle";

const deploy: DeployFunction = async (hre) => {
  if(!process.env.TEST) return;
  
  //@ts-ignore
  const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
  //@ts-ignore
  const deployments = hre.deployments;
  const [signer] = await ethers.getSigners();

  const deployedZero = await deployments.deploy("ZERO", {
    from: signer.address,
    proxy: {
      owner: signer.address,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
      },
    },
  });
  const deployedZeroFrost = await deployments.deploy("ZEROFROST", {
    from: signer.address,
    proxy: {
      owner: signer.address,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
      },
    },
  });
  const deployedSZero = await deployments.deploy("sZERO", {
    from: signer.address,
    proxy: {
      owner: signer.address,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            deployedZero.address,
            /*zerofrost*/
            deployedZeroFrost.address,
            /*devaddr*/
            signer.address,
            /*zero per block*/
            ethers.utils.parseEther("2000"),
            /*bonus end block*/
            await hre.network.provider.send("eth_blockNumber", []),
          ],
        },
      },
    },
  });

  const zero = new ethers.Contract(
    deployedZero.address,
    deployedZero.abi,
    signer
  ) as ZERO;
  const sZero = new ethers.Contract(
    deployedSZero.address,
    deployedSZero.abi,
    signer
  ) as SZERO

  // Merkle tree creation
  console.log('\n\n---- ZERO Merkle Tree Started ----');
  const merkleDir = path.join(__dirname, '..', 'merkle', process.env.TEST ? 'localhost' : 'mainnet');
  const merkleInput = require(path.join(merkleDir, 'zero-input'));
  const merkleTree = useMerkleGenerator(merkleInput);
  console.log(merkleTree);
  await fs.writeFileSync(path.join(merkleDir, 'zero-airdrop.json'), JSON.stringify(merkleTree, null, 2));
  console.log('---- ZERO Merkle Tree Created ----');

  // Distribution for staking tests
  console.log('\n\n---- ZERO Distribution Started ----');
  const wallet = new _ethers.Wallet(process.env.WALLET || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'); // Defaults to 'Account #1'
  const tx = await zero.approve(wallet.address, ethers.utils.parseEther("1000000"));
  const tx2 = await zero.connect(signer).transfer(wallet.address, ethers.utils.parseEther("10000"))
  console.log(`Sending ZERO to ${wallet.address} TX:`, tx2.hash);
  console.log('---- ZERO Distribution Completed ----\n\n');
};

export default deploy;
