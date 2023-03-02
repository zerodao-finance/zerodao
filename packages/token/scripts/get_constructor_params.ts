import * as hre from "hardhat";
import { ethers as _ethers } from "ethers";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import type { DeploymentsExtension } from "hardhat-deploy/types";
//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
//@ts-ignore
const deployments: DeploymentsExtension = hre.deployments;

async function deploy() {
  const multisig = "0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC";
  const admin = "0xFF727BDFa7608d7Fd12Cd2cDA1e7736ACbfCdB7B";
  const [signer] = await ethers.getSigners();
  const zero = await deployments.get("ZERO");
  const szero = await deployments.get("sZERO");
  const zerofrost = await deployments.get("ZEROFROST");
  const gov = await deployments.get("ZeroGovernor");
  const proxyAbi = await hre.artifacts.readArtifact(
    "TransparentUpgradeableProxy"
  );
  const ifaceP = new ethers.utils.Interface(proxyAbi.abi);
  const ifaceZero = new ethers.utils.Interface(zero.abi);
  const ifaceSZero = new ethers.utils.Interface(szero.abi);
  const ifaceZerofrost = new ethers.utils.Interface(zerofrost.abi);
  const ifacegov = new ethers.utils.Interface(gov.abi);

  console.log(
    zero.address,
    zero.implementation,
    admin,
    ifaceZero.encodeFunctionData("initialize", [])
  );
  console.log(
    szero.address,
    szero.implementation,
    admin,
    ifaceSZero.encodeFunctionData("initialize", [
      zero.address,
      zerofrost.address,
      multisig,

      ethers.utils.parseEther("1").div(ethers.utils.parseUnits("5", 7)),
      0,
    ])
  );
  console.log(
    zerofrost.address,
    zerofrost.implementation,
    admin,
    ifaceZerofrost.encodeFunctionData("initialize", [])
  );
  console.log(
    gov.address,
    gov.implementation,
    admin,
    ifacegov.encodeFunctionData("initialize", [szero.address])
  );
}

deploy()
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
