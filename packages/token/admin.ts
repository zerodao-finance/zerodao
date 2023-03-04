import { ethers } from 'ethers';
import * as hre from "hardhat";
import { ZeroHeroNFT } from './typechain-types';
import { ZHERO_META_CID } from './deploy/2_deploy_zero_hero';

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.blastapi.io/${process.env.BLASTAPI_GOERLI_ID}`)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nftcontract = await hre.deployments.get("ZeroHeroNFT");
  const contract = new ethers.Contract(
    nftcontract.address,
    nftcontract.abi,
    wallet
  ) as ZeroHeroNFT;
  
  await contract.connect(wallet).setBaseTokenURI(`ipfs://${ZHERO_META_CID}/`)
  // const tokenUri = await contract.connect(wallet).tokenURI(0);
  // console.log(tokenUri);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1)
})