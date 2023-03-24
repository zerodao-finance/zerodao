import { ethers } from 'ethers';
import * as hre from "hardhat";
import { ZeroHeroNFT } from '../typechain-types';
import { ZHERO_META_CID } from '../deploy/2_deploy_zero_hero';
import path from 'path';
import fs from 'fs';
import { useMerkleGenerator } from '../merkle/use-merkle';

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.blastapi.io/${process.env.BLASTAPI_GOERLI_ID}`)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nftcontract = await hre.deployments.get("ZeroHeroNFT");
  const contract = new ethers.Contract(
    nftcontract.address,
    nftcontract.abi,
    wallet
  ) as ZeroHeroNFT;
  
  // Start sales
  if(process.env.START_PRIVATE_SALE) await contract.connect(wallet).startPrivateMint();
  if(process.env.START_WHITELIST_SALE) await contract.connect(wallet).startWhitelistMint();
  if(process.env.START_PUBLIC_SALE) await contract.connect(wallet).startPublicMint();

  // Utils
  if(process.env.SET_TOKEN_URI) await contract.connect(wallet).setBaseTokenURI(`ipfs://${ZHERO_META_CID}/`);
  if(process.env.CHECK_TOKEN_URI) console.log(await contract.connect(wallet).tokenURI(0));

  // Merkle Configuration
  const merkleDir = path.join(__dirname, '..', 'merkle', 'mainnet');
  
  if(process.env.SET_PRIVATE_MERKLE) {
    const privateMerkleInput = require(path.join(merkleDir, 'zhero-privatelist-input'));
    const privateMerkleTree = useMerkleGenerator(privateMerkleInput);
    fs.writeFileSync(path.join(merkleDir, 'zhero-privatelist.json'), JSON.stringify(privateMerkleTree, null, 2));
    await contract.setPrivateMerkleRoot(privateMerkleTree.merkleRoot);
  }
  if(process.env.SET_WHITELIST_MERKLE) {
    const whitelistMerkleInput = require(path.join(merkleDir, 'zhero-whitelist-input'));
    const whitelistMerkleTree = useMerkleGenerator(whitelistMerkleInput);
    fs.writeFileSync(path.join(merkleDir, 'zhero-whitelist.json'), JSON.stringify(whitelistMerkleTree, null, 2));
    await contract.setWhitelistMerkleRoot(whitelistMerkleTree.merkleRoot);
  }

  // Withdraw
  if(process.env.WITHDRAW) {
    await contract.withdraw();
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1)
})