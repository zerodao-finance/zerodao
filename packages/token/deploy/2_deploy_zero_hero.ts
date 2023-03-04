import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { ethers as _ethers } from "ethers";
import { useMerkleGenerator } from "../merkle/use-merkle";
import path from "path";
import fs from 'fs';

export const ZHERO_META_CID = 'QmVA6z3aXF99HuGLDtS1qMUXSjsY4KG2nNndE3V58n3mou';

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

  // Merkle Trees
  const merkleDir = path.join(__dirname, '..', 'merkle', process.env.TEST ? 'localhost' : 'mainnet');

  // Private Merkle tree
  const privateMerkleInput = require(path.join(merkleDir, 'zhero-privatelist-input'));
  const privateMerkleTree = useMerkleGenerator(privateMerkleInput);
  fs.writeFileSync(path.join(merkleDir, 'zhero-privatelist.json'), JSON.stringify(privateMerkleTree, null, 2));
  await zeroHero.setPrivateMerkleRoot(privateMerkleTree.merkleRoot);
  console.log('\n---- NFT PRIVATE MERKLE CONFIGURED ----');

  // Whitelist Merkle tree
  const whitelistMerkleInput = require(path.join(merkleDir, 'zhero-whitelist-input'));
  const whitelistMerkleTree = useMerkleGenerator(whitelistMerkleInput);
  fs.writeFileSync(path.join(merkleDir, 'zhero-whitelist.json'), JSON.stringify(whitelistMerkleTree, null, 2));
  await zeroHero.setWhitelistMerkleRoot(whitelistMerkleTree.merkleRoot);
  console.log('\n---- NFT WHITELIST MERKLE CONFIGURED ----');

  zeroHero.setBaseTokenURI(`ipfs://${ZHERO_META_CID}/`)
  console.log("\n---- SET METADATA URI ----")
  
  if(process.env.PRIVATE_MINT) {
    await zeroHero.startPrivateMint();
    console.log("\n---- PRIVATE MINT STARTED ----")
  }

  if(process.env.WHITELIST_MINT) {
    await zeroHero.startWhitelistMint();
    console.log("\n---- WHITELIST MINT STARTED ----")
  }

  if(process.env.PUBLIC_MINT) {
    await zeroHero.startPublicMint();
    console.log("\n---- PUBLIC MINT STARTED ----")
  }
};

export default deploy;
