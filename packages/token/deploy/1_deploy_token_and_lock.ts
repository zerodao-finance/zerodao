import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZERO, SZERO } from "../typechain-types";
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
  console.log(Number(await hre.network.provider.send("eth_blockNumber", [])));
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
  await deployments.save("ZeroLock", deployedZeroLock);
  await deployments.save("sZERO", deployedSZero);

  await zero.mint(signer.address, ethers.utils.parseEther("100000"));
  await zero.approve(deployedSZero.address, ethers.utils.parseEther("1000000"));
  await zero.transferOwnership(deployedSZero.address);
};

export default deploy;
