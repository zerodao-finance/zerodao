import * as hre from "hardhat";
import type { DeploymentsExtension } from "hardhat-deploy/types";
import { ethers as _ethers } from "ethers";
import { ZERO, ZEROFROST, SZERO, ZeroGovernor } from "../typechain-types";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { toEIP712 } from "../src.ts";
import {
  mine,
  time,
  impersonateAccount,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { rmSync } from "fs";
//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
//@ts-ignore
const deployments: DeploymentsExtension = hre.deployments;

async function makeSigners(n: number = 5) {
  return await Array.from(new Array(n)).reduce(async (d, i) => {
    const arr = await d;
    let wallet = ethers.Wallet.createRandom();
    const [signer] = await ethers.getSigners();
    wallet = wallet.connect(signer.provider);
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
  delete payload.types.EIP712Domain;
  return await signer._signTypedData(
    payload.domain,
    payload.types,
    payload.message
  );
}

describe("sZERO", () => {
  let zero: ZERO, sZero: SZERO, zerofrost: ZEROFROST, gov: ZeroGovernor;
  describe("contracts stuff", () => {
    beforeEach(async () => {
      await deployments.fixture();
      zero = (await ethers.getContract("ZERO")) as ZERO;
      sZero = (await ethers.getContract("sZERO")) as SZERO;
      zerofrost = (await ethers.getContract("ZEROFROST")) as ZEROFROST;
    });

    it("should check basics", async () => {
      const s = await makeSigners(1)[1];
      expect(await sZero.name()).to.be.equal("sZERO");
      expect(await sZero.decimals()).to.be.equal(18);
      expect(await sZero.zero()).to.be.equal(
        ethers.utils.getAddress(zero.address)
      );
      await expect(
        sZero.connect(s).enterStaking(ethers.utils.parseEther("5000"))
      ).to.be.reverted;
      await expect(
        sZero.connect(s).leaveStaking(ethers.utils.parseEther("5000"))
      ).to.be.reverted;
    });
    it("should check if rewards are being correctly minted and redeemed", async () => {
      const signers = await makeSigners(5);
      const s = signers[0];
      const balance = await zero.balanceOf(s.address);
      const amt = ethers.utils.parseEther("1000");
      const signature = await signEIP712({
        signer: s as any,
        owner: s.address,
        spender: sZero.address,
        value: amt,
        zero,
      });
      let tx = sZero.connect(s).enterStakingWithPermit(amt, signature);
      await expect(tx)
        .to.emit(sZero, "Transfer")
        .withArgs(ethers.constants.AddressZero, s.address, amt);
      await expect(tx)
        .to.emit(zero, "Transfer")
        .withArgs(s.address, sZero.address, amt);
      await mine(1);
      const pending = await sZero.pendingZero(0, s.address);
      let mathPending = amt.div(5e7);
      expect(pending).to.be.equal(mathPending);
      tx = sZero.connect(s).leaveStaking(sZero.balanceOf(s.address));
      await expect(tx).to.emit(zero, "Transfer");
      await expect(tx)
        .to.emit(sZero, "Transfer")
        .withArgs(s.address, ethers.constants.AddressZero, amt);
      expect(await zero.balanceOf(s.address)).to.be.gte(amt);
      expect(await sZero.pendingZero(0, s.address)).to.be.equal(0);
      await zero.connect(s).approve(sZero.address, amt);
      await sZero.connect(s).enterStaking(amt);
      await zero.connect(signers[1]).approve(sZero.address, amt);
      await sZero.connect(signers[1]).enterStaking(amt);
      // because approve and stake take up one block each
      mathPending = amt.div(5e7).mul(2);
      expect(await sZero.pendingZero(0, s.address)).to.be.equal(mathPending);
      // expect
      expect(
        (await sZero.pendingZero(0, s.address)).lt(
          amt.div(5e7).mul(2).add(amt.mul(2).div(5e7))
        )
      ).to.be.equal(true);
      tx = sZero.connect(s).redeem();
      //sub 1e9 to account for math issues on masterchef
      const redeemAmt = mathPending.add(mathPending.div(2));

      await expect(tx)
        .to.emit(zero, "Transfer")
        .withArgs(sZero.address, s.address, redeemAmt);
      await sZero.connect(signers[1]).redeem();
      await mine(1);
      await sZero.connect(s).leaveStaking(await sZero.balanceOf(s.address));
      await sZero
        .connect(signers[1])
        .leaveStaking(await sZero.balanceOf(signers[1].address));
    });
    it("should test whether votes are calculated correctly", async () => {
      const signers = await makeSigners(5);
      const s = signers[0];
      const s2 = signers[1];
      const balance = await zero.balanceOf(s.address);
      const signature2 = await signEIP712({
        signer: s2 as any,
        owner: s2.address,
        spender: sZero.address,
        value: balance,
        zero,
      });
      const signature = await signEIP712({
        signer: s as any,
        owner: s.address,
        spender: sZero.address,
        value: balance,
        zero,
      });
      await sZero.connect(s).enterStakingWithPermit(balance, signature);
      const votes = await sZero.getVotes(s.address);
      expect(votes).to.be.lte(await sZero.balanceOf(s.address));
      const t = (await zerofrost.epochLength()).div(2);
      await time.increase(t);
      expect(await sZero.getVotes(s.address)).to.be.lt(
        await sZero.balanceOf(s.address)
      );

      await time.increase(t);

      expect(await sZero.getVotes(s.address)).to.be.equal(
        await sZero.balanceOf(s.address)
      );
      await sZero.connect(s2).enterStakingWithPermit(balance, signature2);
      expect(await sZero.getVotes(s2.address)).to.be.equal(0);
      await time.increase(t);
      expect(await sZero.getVotes(s2.address)).to.be.equal(
        (await sZero.balanceOf(s2.address)).div(2)
      );
    });
  });

  describe("deployer script stuff", async () => {
    before(async () => {
      try {
        rmSync("deployments/hardhat/ZeroSuiteDeployer.json");
      } catch (e) {}
      const sig = (await ethers.getSigners())[0];
      const tx = await deployments.deploy("ZeroSuiteDeployer", {
        from: sig.address,
        args: [],
        skipIfAlreadyDeployed: false,
      });

      const multisig = "0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC";
      await sig.sendTransaction({
        value: ethers.utils.parseEther("2"),
        to: multisig,
      });
      const iface = (await ethers.getContract("ZeroSuiteDeployer")).interface;
      const logs = tx.receipt.logs.reduce((a, d) => {
        try {
          return [...a, iface.parseLog(d)];
        } catch (e) {
          return a;
        }
      }, []);
      zero = new ethers.Contract(
        logs[0].args.proxy,
        (await ethers.getContractFactory("ZERO")).interface,
        sig
      ) as ZERO;
      zerofrost = new ethers.Contract(
        logs[1].args.proxy,
        (await ethers.getContractFactory("ZEROFROST")).interface,
        sig
      ) as ZEROFROST;
      sZero = new ethers.Contract(
        logs[2].args.proxy,
        (await ethers.getContractFactory("sZERO")).interface,
        sig
      ) as SZERO;
      gov = new ethers.Contract(
        logs[3].args.proxy,
        (await ethers.getContractFactory("ZeroGovernor")).interface,
        sig
      ) as ZeroGovernor;
    });
    it("should test the deploy script", async () => {
      const multisig = "0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC";
      expect(await zero.balanceOf(multisig)).to.be.equal(
        ethers.utils.parseEther((88e6).toString())
      );
      const sig = (await ethers.getSigners())[0];
      await zero.transferOwnership(gov.address);
      await impersonateAccount(multisig);
      (await ethers.getSigners())[0].sendTransaction({
        to: multisig,
        value: ethers.utils.parseEther("2"),
      });
      const signer = await ethers.getSigner(multisig);
      await zero
        .connect(signer)
        .approve(sZero.address, ethers.utils.parseEther("10000000"));
      await sZero.connect(signer).enterStaking(ethers.utils.parseEther("5000"));
      await time.increase(await zerofrost.epochLength());

      const descriptionHash = ethers.utils.id("vote");
      const data = zero.interface.encodeFunctionData("mint", [
        multisig,
        ethers.utils.parseEther("5000"),
      ]);
      const prop = await (
        await gov.connect(signer).propose([zero.address], [0], [data], "vote")
      ).wait();
      const id = prop.events[0].args.proposalId;
      await mine(7200);
      let t: any = await gov.connect(signer).castVote(id, 1);
      await mine(50400);
      await gov
        .connect(signer)
        .execute([zero.address], [0], [data], descriptionHash);
      expect(await zero.balanceOf(multisig)).to.be.equal(
        ethers.utils.parseEther((88e6).toString())
      );
      await sZero.connect(signer).delegate(sig.address);
      const block = await hre.network.provider.send("eth_blockNumber", []);
      await mine(1);
      expect(await sZero.getPastVotes(sig.address, block)).to.equal(
        ethers.utils.parseEther("5000")
      );
      expect(await sZero.getPastVotes(signer.address, block)).to.equal(0);
    });
  });
});
