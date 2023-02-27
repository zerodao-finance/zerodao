import * as hre from "hardhat";
import { expect } from "chai";
import { ethers as _ethers } from "ethers";
import { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import { ZeroHeroNFT } from "../typechain-types";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import path from 'path';
import fs from 'fs';
import { useMerkleGenerator } from "../merkle/use-merkle";

//@ts-ignore
const ethers: typeof _ethers & HardhatEthersHelpers = hre.ethers;
const NFT_COST = 0.3;
const whitelistClaims = require("../merkle/localhost/zhero-whitelist.json").claims;

describe("ZeroHeroNFT - Dev mint", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
  });

  it("Should mint the correct amount of nfts for the owner", async function () {
    await contract.devMint(2);

    expect(await contract.balanceOf(owner.address)).to.equal(2);
  });

  it("Should be only callable by the owner", async function () {
    const tx = contract.connect(buyer1).devMint(2);

    await expect(tx).to.be.reverted;
  });

  it("Should not be able to mint more than the reserved supply", async function () {
    const tx = contract.devMint(150);
    await expect(tx).to.be.revertedWith("ExceedSupply");
  });
});

describe("ZeroHeroNFT - Minting before start", function () {
  let contract: ZeroHeroNFT;
  let buyer1: SignerWithAddress, buyer2: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    let [signer, _buyer1, _buyer2] = await ethers.getSigners();
    buyer1 = _buyer1;
    buyer2 = _buyer2;
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      signer
    ) as ZeroHeroNFT;
  });

  it("Public mint - Should not be able to mint before sale has started", async function () {
    const tx = contract.connect(buyer1).mint(1, { value: ethers.utils.parseEther("999") });

    await expect(tx).to.be.revertedWith("PublicMintNotStarted");
  });

  if(!process.env.PRIVATE_MINT) {
    it("Presale mint - Should not be able to mint before presale has started", async function () {
      const tx = contract
      .connect(buyer1)
      .privateMint(
        whitelistClaims[buyer1.address].index,
        ethers.utils.getAddress(buyer1.address),
        ethers.BigNumber.from("1"),
        whitelistClaims[buyer1.address].proof,
        3,
        { value: ethers.utils.parseEther('999') }
      );
      await expect(tx).to.be.revertedWith('PrivateMintNotStarted');
    });
  }
});

describe("ZeroHeroNFT - Private Mint", async function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress,
    buyer1: SignerWithAddress,
    buyer2: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1, buyer2] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;

    // Merkle
    const merkleDir = path.join(__dirname, '..', 'merkle', 'localhost');
    const merkleInput = require(path.join(merkleDir, 'zhero-input'));
    const merkleTree = useMerkleGenerator(merkleInput);
    await fs.writeFileSync(path.join(merkleDir, 'zhero-whitelist.json'), JSON.stringify(merkleTree, null, 2));
    await contract.setPresaleMerkleRoot(merkleTree.merkleRoot);
  });

  it("Should not be able to mint if not on whitelist", async function () {
    const amount = 3;
    await contract.startPrivateMint();
    const tx = contract
      .connect(buyer2)
      .privateMint(
        whitelistClaims[buyer1.address].index,
        buyer2.address,
        whitelistClaims[buyer1.address].amount,
        whitelistClaims[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    await expect(tx).to.be.revertedWith("NotInWhitelist");
  });

  it("Should not be able to mint if not sending enough ETH", async function () {
    const amount = 3;
    await contract.startPrivateMint();
    const tx = contract
      .connect(buyer1)
      .privateMint(
        whitelistClaims[buyer1.address].index,
        buyer1.address,
        whitelistClaims[buyer1.address].amount,
        whitelistClaims[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther((NFT_COST).toString()) }
      );

    await expect(tx).to.be.revertedWith("InsufficientPayment");
  });

  it("Should mint the correct amount of nfts", async function () {
    const amount = 3;
    await contract
      .connect(buyer1)
      .privateMint(
        whitelistClaims[buyer1.address].index,
        buyer1.address,
        whitelistClaims[buyer1.address].amount,
        whitelistClaims[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );

    expect(await contract.balanceOf(buyer1.address)).to.equal(3);
  });

  it("Should not allow for minting more than 5 NFT's per address", async function () {
    const amount = 6;
    const tx = contract
      .connect(buyer1)
      .privateMint(
        whitelistClaims[buyer1.address].index,
        buyer1.address,
        whitelistClaims[buyer1.address].amount,
        whitelistClaims[buyer1.address].proof,
        amount,
        { value: ethers.utils.parseEther("999") }
      );
    await expect(tx).to.be.revertedWith("ExceedMaxPerWallet");
  });
});

// describe("ZeroHeroNFT - Public mint", function () {
//   let contract: ZeroHeroNFT;
//   let owner: SignerWithAddress, buyer1: SignerWithAddress;

//   beforeEach(async () => {
//     contract = (await ethers.getContract("ZeroHeroNFT")) as ZeroHeroNFT;
//     await contract.startPublicMint();

//     [owner, buyer1] = await ethers.getSigners()
//   });

//   it("Should mint the correct amount of nfts", async function () {
//     await contract.connect(buyer1).mint(10,
//       {value: ethers.utils.parseEther("999")});

//     expect(await contract.balanceOf(buyer1.address)).to.equal(10);
//   });

//   it("Should not be able to mint if payment is insufficient", async function () {
//     await contract.setMintPrice(ethers.utils.parseEther("2"));

//     const tx = contract.connect(buyer1).mint(1,
//       {value: ethers.utils.parseEther("1")});

//     await expect(tx).to.be.revertedWith('InsufficientPayment');
//   });

//   it("Should not be able to mint more than the whole collection", async function () {
//     //Setting price to very low value so our account can mint a lot
//     await contract.setMintPrice(ethers.utils.parseEther("0.001"));

//     //Mint the first 980
//     for (let index = 0; index < 49; index++) {
//       await contract.mint(20,
//         {value: ethers.utils.parseEther("1")});
//     }

//     //Try to mint 100 more
//     //(total minted = 1050)
//     const tx = contract.connect(buyer1).mint(100,
//       {value: ethers.utils.parseEther("999")});

//     await expect(tx).to.be.revertedWith('ExceedSupply');
//   });
// });

describe("ZeroHeroNFT - Withdraw", function () {
  let contract: ZeroHeroNFT;
  let owner: SignerWithAddress, buyer1: SignerWithAddress;

  beforeEach(async () => {
    const nftcontract = await hre.deployments.get("ZeroHeroNFT");
    [owner, buyer1] = await ethers.getSigners();
    contract = new ethers.Contract(
      nftcontract.address,
      nftcontract.abi,
      owner
    ) as ZeroHeroNFT;
    await contract.startPublicMint();
  });

  it("Should be only callable by the owner", async function () {
    const tx = contract.connect(buyer1).withdraw();

    await expect(tx).to.be.reverted;
  });

  // it("Should transfer the contract balance to owner wallet", async function () {
  //   var weiSpent = ethers.utils.parseEther("10");
  //   var oldOwnerBalance = toRoundedEther(await owner.getBalance());

  //   await contract.connect(buyer1).mint(1, {value: weiSpent})
  //   await contract.connect(owner).withdraw();

  //   var newOwnerBalance = toRoundedEther(await owner.getBalance());

  //   expect(newOwnerBalance).to.equal(oldOwnerBalance + toRoundedEther(weiSpent));
  // });

  // function toRoundedEther(wei) {
  //   return Math.round(Number.parseFloat(ethers.utils.formatEther(wei)));
  // }
});
