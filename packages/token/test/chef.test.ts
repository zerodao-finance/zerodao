import * as hre from "hardhat";
import type { DeploymentsExtension } from "hardhat-deploy/types";
import { ethers as _ethers } from "ethers";
import { ZERO, ZeroLock, SZERO } from "../typechain-types";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { toEIP712 } from "../src.ts";
//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
//@ts-ignore
const deployments: DeploymentsExtension = hre.deployments;

async function makeSigners(n: number = 5) {
  return await Array.from(new Array(n)).reduce(async (d, i) => {
    const arr = await d;
    const wallet = ethers.Wallet.createRandom();
    const [signer] = await ethers.getSigners();
    await signer.sendTransaction({
      value: ethers.utils.parseEther("2"),
      to: wallet.address,
    });
    const z = (await ethers.getContract("ZERO")) as ZERO;
    z.transfer(wallet.address, ethers.utils.parseEther("5000"));
    arr.push(wallet);
  }, Promise.resolve([]));
}

describe("sZERO", () => {
  let zero: ZERO, sZero: SZERO;
  beforeEach(async () => {
    await deployments.fixture();
    zero = (await ethers.getContract("ZERO")) as ZERO;
    sZero = (await ethers.getContract("sZERO")) as SZERO;
  });

  it("should stake tokens", async () => {
    const [signer] = await ethers.getSigners();
    //@ts-ignore
    const balance = await zero.balanceOf(await signer.getAddress());

    const payload = toEIP712(zero.address, {
      owner: signer.address,
      spender: sZero.address,
      deadline: ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ["address", "address", "uint256", "uint256"],
          [
            signer.address,
            sZero.address,
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
    await sZero.enterStakingWithPermit(balance, signature);
  });
  it("should test token mechanics", async () => {
    const signers = await makeSigners(5);
  });
});
