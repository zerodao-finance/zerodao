import * as hre from "hardhat";
import type { DeploymentsExtension } from "hardhat-deploy/types";
import { ethers as _ethers } from "ethers";
import { ZERO, ZeroLock } from "../typechain-types";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { toEIP712 } from "../src.ts";
//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
//@ts-ignore
const deployments: DeploymentsExtension = hre.deployments;

describe("ZeroLock", () => {
  let zero: ZERO, zeroLock: ZeroLock;
  beforeEach(async () => {
    await deployments.fixture();
    zero = (await ethers.getContract("ZERO")) as ZERO;
    zeroLock = (await ethers.getContract("ZeroLock")) as ZeroLock;
  });

  it("should lock tokens", async () => {
    const [signer] = await ethers.getSigners();
    //@ts-ignore
    const balance = await zero.balanceOf(await signer.getAddress());
    await zero.approve(zeroLock.address, balance);
    const payload = toEIP712(zero.address, {
      owner: signer.address,
      spender: zeroLock.address,
      deadline: ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ["address", "address", "uint256", "uint256"],
          [
            signer.address,
            zeroLock.address,
            balance,
            await zero.nonces(signer.address),
          ]
        )
      ),
      nonce: await zero.nonces(signer.address),
      value: balance,
    });
    delete payload.types.EIP712Domain;
    const signature = await signer._signTypedData(
      payload.domain,
      payload.types,
      payload.message
    );
    await zeroLock.deposit(balance, signature);
  });
});
