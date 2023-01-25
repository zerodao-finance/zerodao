import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZERO } from "../typechain-types";
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

  await deployments.save("ZERO", deployedZero);
  const zero = new ethers.Contract(
    deployedZero.address,
    deployedZero.abi,
    signer
  ) as ZERO;

  // Merkle Tree Creation
  console.log('\n\n---- Merkle Tree Started ----');
  const merkleDir = path.join(__dirname, '..', 'merkle', process.env.TEST ? 'localhost' : 'mainnet');
  const merkleInput = require(path.join(merkleDir, 'input'));
  const merkleTree = useMerkleGenerator(merkleInput);
  console.log(merkleTree);
  await fs.writeFileSync(path.join(merkleDir, 'airdrop.json'), JSON.stringify(merkleTree, null, 2));
  console.log('---- Merkle Tree Created ----');

  // Distribution For Stake Test
  console.log('\n\n---- ZERO Distribution Started ----');
  const wallet = new _ethers.Wallet(process.env.WALLET || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'); // Defaults to 'Account #1'
  const tx = await zero.approve(wallet.address, ethers.utils.parseEther("1000000"));
  const tx2 = await zero.connect(signer).transfer(wallet.address, ethers.utils.parseEther("10000"))
  console.log(`Sending ZERO to ${wallet.address} TX:`, tx2.hash);
  console.log('---- ZERO Distribution Completed ----\n\n');
};

export default deploy;
