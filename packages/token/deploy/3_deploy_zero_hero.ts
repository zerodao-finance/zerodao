import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { ethers as _ethers } from "ethers";
import { useMerkleGenerator } from "../merkle/use-merkle";
import path from "path";
import fs from 'fs';

export const ZHERO_META_CID = 'Qmeba5aAeUQeGMkxRYgh2H4Xt9ySXsy74KX2W3vN5to8fh';

const deploy: DeployFunction = async (hre) => {  
  if(!process.env.NFT_ONLY && process.env.TOKEN_ONLY) return;

  //@ts-ignore
  const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
  //@ts-ignore
  const deployments = hre.deployments;
  const [signer] = await ethers.getSigners();

  const deployedZeroHero = await deployments.deploy("ZeroHeroNFT", {
    from: signer.address,
  });
  const zeroHero = new ethers.Contract(
    deployedZeroHero.address,
    deployedZeroHero.abi,
    signer
  ) as ZeroHeroNFT;

  console.log("\n---- DEPLOYED ZERO HEROES ----")
  console.log("Address:", zeroHero.address);

  // Merkle tree creation
  const merkleDir = path.join(__dirname, '..', 'merkle', process.env.TEST ? 'localhost' : 'mainnet');
  const merkleInput = require(path.join(merkleDir, 'zhero-input'));
  const merkleTree = useMerkleGenerator(merkleInput);
  await fs.writeFileSync(path.join(merkleDir, 'zhero-whitelist.json'), JSON.stringify(merkleTree, null, 2));
  await zeroHero.setPresaleMerkleRoot(merkleTree.merkleRoot);
  console.log('\n---- ZHERO MERKLE TREE CONFIGURED ----');

  zeroHero.setBaseTokenURI(`ipfs://${ZHERO_META_CID}/`)
  console.log("\n---- SET METADATA URI ----")
  
  if(process.env.PRIVATE_MINT) {
    await zeroHero.startPrivateMint();
    console.log("\n---- PRIVATE MINT STARTED ----")
  }

  if(process.env.PUBLIC_MINT) {
    await zeroHero.startPublicMint();
    console.log("\n---- PUBLIC MINT STARTED ----")
  }
};

export default deploy;
