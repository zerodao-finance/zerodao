import * as hre from "hardhat";
import { ethers as _ethers } from "ethers";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import type { DeploymentsExtension } from "hardhat-deploy/types";
//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
//@ts-ignore
const deployments: DeploymentsExtension = hre.deployments;

async function deploy() {
  const [signer] = await ethers.getSigners();
  const tx = await deployments.deploy("ZeroSuiteDeployer", {
    from: signer.address,
    args: [],
    skipIfAlreadyDeployed: false,
  });
  const deployer = await deployments.get("ZeroSuiteDeployer");
  const iface = new ethers.utils.Interface(deployer.abi);
  const logs = tx.receipt.logs.reduce((a, d) => {
    try {
      return [...a, iface.parseLog(d)];
    } catch (e) {
      return a;
    }
  }, []);
  const zero = new ethers.Contract(
    logs[0].args.proxy,
    (await ethers.getContractFactory("ZERO")).interface,
    signer
  );
  const zerofrost = new ethers.Contract(
    logs[1].args.proxy,
    (await ethers.getContractFactory("ZEROFROST")).interface,
    signer
  );
  const sZero = new ethers.Contract(
    logs[2].args.proxy,
    (await ethers.getContractFactory("sZERO")).interface,
    signer
  );
  const gov = new ethers.Contract(
    logs[3].args.proxy,
    (await ethers.getContractFactory("ZeroGovernor")).interface,
    signer
  );
  await hre.deployments.save("ZERO", {
    address: zero.address,
    abi: JSON.parse(
      zero.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    implementation: logs[0].args.impl,
  });
  await hre.deployments.save("sZERO", {
    address: sZero.address,
    abi: JSON.parse(
      sZero.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    implementation: logs[2].args.impl,
  });
  await hre.deployments.save("ZEROFROST", {
    address: sZero.address,
    abi: JSON.parse(
      zerofrost.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    implementation: logs[1].args.impl,
  });
  await hre.deployments.save("ZeroGovernor", {
    address: gov.address,
    abi: JSON.parse(
      gov.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    implementation: logs[3].args.impl,
  });
}

deploy()
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
