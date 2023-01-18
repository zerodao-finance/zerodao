import * as hre from "hardhat";
import type { DeploymentsExtension } from "hardhat-deploy/types";
import { ethers as _ethers } from "ethers";
import { ZERO, ZeroLock, SZERO } from "../typechain-types";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { toEIP712 } from "../src.ts";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
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
    return arr;
  }, Promise.resolve([]));
}

async function signEIP712({
  signer,
  value,
  zero,
  owner,
  spender,
}: {
  signer: _ethers.Wallet;
  value: _ethers.BigNumber;
  zero: ZERO;
  owner: string;
  spender: string;
}) {
  const payload = toEIP712(zero.address, {
    owner,
    spender,
    deadline: ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["address", "address", "uint256", "uint256"],
        [owner, spender, value, await zero.nonces(owner)]
      )
    ),
    nonce: await zero.nonces(owner),
    value,
  });
  console.log(payload);
  delete payload.types.EIP712Domain;
  return await signer._signTypedData(
    payload.domain,
    payload.types,
    payload.message
  );
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
    const signature = await signEIP712({
      signer: signer as any,
      owner: signer.address,
      spender: sZero.address,
      value: balance,
      zero,
    });
    await sZero.enterStakingWithPermit(balance, signature);
  });
  it("should test token mechanics", async () => {
    const signers = await makeSigners(5);
    await signers.reduce(async (_a: any, s) => {
      await _a;
      const balance = await zero.balanceOf(s.address);
      const signature = await signEIP712({
        signer: s as any,
        owner: s.address,
        spender: sZero.address,
        value: balance,
        zero,
      });
      await sZero.enterStakingWithPermit(balance, signature);
    }, Promise.resolve());
    await mine(5);
    const sZeroSigner1 = sZero.connect(signers[0]);
    console.log(sZeroSigner1.pendingZero(0, signers[0].address));
  });
});
