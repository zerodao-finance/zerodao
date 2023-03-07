import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZERO } from "../typechain-types";
import { ethers as _ethers } from "ethers";

const deploy: DeployFunction = async function (hre) {
  if(process.env.NFT_ONLY && !process.env.TOKEN_ONLY) return;

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
  await deployments.save("ZEROFROST", deployedZeroFrost);
  await deployments.save("ZERO", deployedZero);
  const zero = new ethers.Contract(
    deployedZero.address,
    deployedZero.abi,
    signer
  ) as ZERO;
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
            ethers.utils.parseEther("1").div(ethers.utils.parseUnits("5", 7)),
            /*bonus end block*/
            await hre.network.provider.send("eth_blockNumber", []),
          ],
        },
      },
    },
  });
  await deployments.save("sZERO", deployedSZero);

  const deployerGov = await deployments.deploy("ZeroGovernor", {
    from: signer.address,
    proxy: {
      owner: signer.address,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [deployedSZero.address],
        },
      },
    },
  });

  await deployments.save("ZeroGovernor", deployerGov);
  const nft = await deployments.deploy("ZeroHeroNFT", {
    from: signer.address,
    args: [],
  });
  await deployments.save("ZeroHeroNFT", nft);
  await zero.mint(signer.address, ethers.utils.parseEther("100000"));
  await zero.approve(deployedSZero.address, ethers.utils.parseEther("1000000"));
  await zero.changeSZero(deployedSZero.address);
};

export default deploy;
