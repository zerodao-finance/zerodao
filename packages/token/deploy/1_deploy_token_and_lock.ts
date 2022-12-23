import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZERO } from "../typechain-types";
import { ethers as _ethers } from "ethers";

const deploy: DeployFunction = async (hre) => {
  //@ts-ignore
  const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
  //@ts-ignore
  const deployments = hre.deployments;
  const [signer] = await ethers.getSigners();
  const defaultProxyOptions = {
    owner: signer.address,
    methodName: "initialize",
    proxyContract: "OpenZeppelinTransparentProxy",
  };

  const deployedZero = await deployments.deploy("ZERO", {
    from: signer.address,
    proxy: defaultProxyOptions,
  });
  await deployments.save("ZERO", deployedZero);
  const zero = new ethers.Contract(
    deployedZero.address,
    deployedZero.abi,
    signer
  ) as ZERO;
  const deployedZeroLock = await deployments.deploy("ZeroLock", {
    from: signer.address,
    proxy: {
      owner: signer.address,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [zero.address],
        },
      },
    },
  });
  await deployments.save("ZeroLock", deployedZeroLock);

  await zero.mint(signer.address, ethers.utils.parseEther("1000"));
};

export default deploy;
