import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { ethers as _ethers } from "ethers";

const deploy: DeployFunction = async (hre) => {
  if(!process.env.TEST) return;
  
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
  await zeroHero.startPublicMint();
  console.log("\n---- PUBLIC MINT STARTED ----")
};

export default deploy;
