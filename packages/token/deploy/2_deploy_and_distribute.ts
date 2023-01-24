import { DeployFunction } from "hardhat-deploy/types";
import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZERO, SZERO } from "../typechain-types";
import { ethers as _ethers } from "ethers";

const deploy: DeployFunction = async (hre) => {
  if(!process.env.TEST) return;
  
  //@ts-ignore
  const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
  //@ts-ignore
  const deployments = hre.deployments;
  const [signer, signer2] = await ethers.getSigners();
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

  console.log("Treasury ZERO Balance:", await zero.balanceOf(deployedSZero.address))
  console.log("Signer ZERO Balance:", await zero.balanceOf(signer.address))

  // Distribution For Stake Test
  console.log(`\n\nZERO: ${zero.address} | ${await zero.decimals()} | ${await zero.name()}`);
    const wallet = new _ethers.Wallet(process.env.WALLET || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'); // Defaults to 'Account #1'
    console.log(`\n\nBEFORE --- Wallet (${wallet.address}) Balance:`, (await zero.balanceOf(wallet.address)).toString())
    const tx = await zero.approve(wallet.address, ethers.utils.parseEther("1000000"));
    console.log("\n\nApproving TX:", tx.hash);
    const tx2 = await zero.connect(signer).transfer(wallet.address, ethers.utils.parseEther("10000"))
    console.log(`\n\nSending ZERO to ${wallet.address} TX:`, tx2.hash);
    console.log(`\n\nAFTER --- Wallet (${wallet.address}) Balance:`, (await zero.balanceOf(wallet.address)).toString())
};

export default deploy;
